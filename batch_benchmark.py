#!/usr/bin/env python3
"""
AI Trading Benchmark - Batch Runner
Run benchmarks for multiple models and categories
"""

import argparse
import subprocess
import sys
import time
from datetime import datetime

MODELS = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4.1',
    'gpt-4.1-mini',
    'claude-opus-4',
    'claude-sonnet-4',
    'claude-haiku-3.5',
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'grok-3',
    'grok-3-mini',
    'grok-4-fast',
    'grok-4-1-fast',
]

CATEGORIES = ['crypto', 'forex', 'stock']

# Cost-effective models for quick testing
QUICK_MODELS = [
    'gpt-4o-mini',
    'claude-haiku-3.5',
    'gemini-2.5-flash',
    'grok-3-mini',
]

def run_benchmark(model, category, days, save=True):
    """Run a single benchmark"""
    cmd = [
        sys.executable, 'run_benchmark.py',
        '-m', model,
        '-c', category,
        '-d', str(days),
    ]
    if save:
        cmd.append('--save')
    
    print("Running: {} on {}...".format(model, category))
    start = time.time()
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        elapsed = time.time() - start
        
        # Extract return from output
        output = result.stdout
        return_line = [l for l in output.split('\n') if 'Return:' in l]
        return_pct = return_line[0].split(':')[1].strip() if return_line else 'N/A'
        
        print("  Completed in {:.1f}s - Return: {}".format(elapsed, return_pct))
        return {'model': model, 'category': category, 'return': return_pct, 'time': elapsed, 'success': True}
    
    except subprocess.TimeoutExpired:
        print("  TIMEOUT after 300s")
        return {'model': model, 'category': category, 'return': 'TIMEOUT', 'time': 300, 'success': False}
    
    except Exception as e:
        print("  ERROR: {}".format(e))
        return {'model': model, 'category': category, 'return': 'ERROR', 'time': 0, 'success': False}


def main():
    parser = argparse.ArgumentParser(description='Batch Benchmark Runner')
    parser.add_argument('-c', '--category', choices=['crypto', 'forex', 'stock', 'all'], default='all',
                        help='Category to benchmark (default: all)')
    parser.add_argument('-m', '--models', choices=['all', 'quick'], default='quick',
                        help='Models to run: all or quick (cost-effective)')
    parser.add_argument('-d', '--days', type=int, default=10, help='Simulation days (default: 10)')
    parser.add_argument('--no-save', action='store_true', help='Do not save results to Supabase')
    parser.add_argument('--delay', type=int, default=2, help='Delay between runs in seconds (default: 2)')
    
    args = parser.parse_args()
    
    # Select models
    if args.models == 'quick':
        models = QUICK_MODELS
    else:
        models = MODELS
    
    # Select categories
    if args.category == 'all':
        categories = CATEGORIES
    else:
        categories = [args.category]
    
    total_runs = len(models) * len(categories)
    save = not args.no_save
    
    print("")
    print("=" * 60)
    print("AI Trading Benchmark - Batch Runner")
    print("=" * 60)
    print("Models:     {} ({})".format(len(models), args.models))
    print("Categories: {}".format(', '.join(categories)))
    print("Days:       {}".format(args.days))
    print("Total runs: {}".format(total_runs))
    print("Save to DB: {}".format(save))
    print("=" * 60)
    print("")
    
    results = []
    completed = 0
    
    start_time = datetime.now()
    
    for category in categories:
        print("")
        print("-" * 40)
        print("Category: {}".format(category.upper()))
        print("-" * 40)
        
        for model in models:
            completed += 1
            print("[{}/{}] ".format(completed, total_runs), end='')
            
            result = run_benchmark(model, category, args.days, save)
            results.append(result)
            
            if args.delay > 0 and completed < total_runs:
                time.sleep(args.delay)
    
    # Summary
    end_time = datetime.now()
    total_time = (end_time - start_time).total_seconds()
    successful = sum(1 for r in results if r['success'])
    
    print("")
    print("=" * 60)
    print("BATCH COMPLETE")
    print("=" * 60)
    print("Total time:  {:.1f} seconds ({:.1f} minutes)".format(total_time, total_time / 60))
    print("Successful:  {}/{}".format(successful, total_runs))
    print("")
    
    # Results table
    print("Results Summary:")
    print("-" * 50)
    
    for category in categories:
        print("")
        print("{}:".format(category.upper()))
        cat_results = [r for r in results if r['category'] == category]
        cat_results.sort(key=lambda x: float(x['return'].replace('%', '').replace('+', '').replace('N/A', '-999').replace('TIMEOUT', '-999').replace('ERROR', '-999')), reverse=True)
        
        for i, r in enumerate(cat_results, 1):
            status = r['return'] if r['success'] else 'FAILED'
            print("  {}. {}: {}".format(i, r['model'], status))
    
    print("")
    print("=" * 60)


if __name__ == '__main__':
    main()
