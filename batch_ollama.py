import subprocess, sys, time, json, os
from datetime import datetime

models = [
    'gemma2-2b', 'phi3-mini', 'llama3.2-3b', 'codellama-7b',
    'deepseek-r1-7b', 'deepseek-r1-8b', 'qwen2.5-coder-7b', 'lfm2.5-thinking',
]
categories = ['crypto', 'forex', 'stock']

# Skip already done
done = {('gemma2-2b', 'crypto')}  # just tested

log = []
total = sum(1 for m in models for c in categories if (m,c) not in done)
count = 0

for model in models:
    for cat in categories:
        if (model, cat) in done:
            continue
        count += 1
        print("\n" + "=" * 60)
        print("[{}/{}] {} - {}".format(count, total, model, cat))
        print("=" * 60)
        start = time.time()
        try:
            result = subprocess.run(
                [sys.executable, 'run_benchmark.py', '-m', model, '-c', cat, '-d', '30', '--save'],
                timeout=600, capture_output=False
            )
            elapsed = time.time() - start
            status = 'completed' if result.returncode == 0 else 'failed (exit {})'.format(result.returncode)
        except subprocess.TimeoutExpired:
            elapsed = time.time() - start
            status = 'timeout'
        except Exception as e:
            elapsed = time.time() - start
            status = 'error: {}'.format(e)

        log.append({'model': model, 'category': cat, 'status': status, 'elapsed': round(elapsed, 1)})
        print("  Status: {} | Time: {:.1f}s".format(status, elapsed))

print("\n" + "=" * 60)
print("BATCH COMPLETE")
print("=" * 60)
for entry in log:
    icon = 'OK' if 'completed' in entry['status'] else 'NG'
    print("  [{}] {} / {} - {} ({:.0f}s)".format(icon, entry['model'], entry['category'], entry['status'], entry['elapsed']))

# Save log
log_path = os.path.join('results', 'batch_log_{}.json'.format(datetime.now().strftime('%Y%m%d_%H%M%S')))
with open(log_path, 'w') as f:
    json.dump(log, f, indent=2)
print("\nLog saved: {}".format(log_path))
