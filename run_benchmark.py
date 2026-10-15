#!/usr/bin/env python3
"""
AI Trading Benchmark Runner
"""

import argparse
import json
import os
import random
from datetime import datetime, timedelta
from typing import Optional
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

AI_ENDPOINTS = {
    'openai': 'https://api.openai.com/v1/chat/completions',
    'anthropic': 'https://api.anthropic.com/v1/messages',
    'google': 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    'xai': 'https://api.x.ai/v1/chat/completions',
}

MODEL_CONFIGS = {
    'gpt-4o': {'provider': 'openai', 'model': 'gpt-4o'},
    'gpt-4o-mini': {'provider': 'openai', 'model': 'gpt-4o-mini'},
    'gpt-4.1': {'provider': 'openai', 'model': 'gpt-4.1'},
    'gpt-4.1-mini': {'provider': 'openai', 'model': 'gpt-4.1-mini'},
    'claude-opus-4': {'provider': 'anthropic', 'model': 'claude-opus-4-20250514'},
    'claude-sonnet-4': {'provider': 'anthropic', 'model': 'claude-sonnet-4-20250514'},
    # The 2026-02 runs labelled 'claude-haiku-3.5' actually called Claude 3 Haiku; they are relabelled 'claude-haiku-3'.
    'claude-haiku-3.5': {'provider': 'anthropic', 'model': 'claude-3-5-haiku-20241022'},
    'claude-haiku-3': {'provider': 'anthropic', 'model': 'claude-3-haiku-20240307'},
    # Claude 5 family (2026-10). Haiku/Sonnet can turn thinking off; Opus 5.5 and Fable 5.1 cannot, so they run at the lowest effort.
    'claude-haiku-5.5': {'provider': 'anthropic', 'model': 'claude-haiku-5-5', 'extra': {'thinking': {'type': 'disabled'}}},
    'claude-sonnet-5.5': {'provider': 'anthropic', 'model': 'claude-sonnet-5-5', 'extra': {'thinking': {'type': 'between_tools'}}},
    'claude-opus-5.5': {'provider': 'anthropic', 'model': 'claude-opus-5-5', 'max_tokens': 2000, 'extra': {'output_config': {'effort': 'low'}}},
    'claude-fable-5.1': {'provider': 'anthropic', 'model': 'claude-fable-5-1', 'max_tokens': 2000, 'extra': {'output_config': {'effort': 'low'}}},
    'gemini-2.5-pro': {'provider': 'google', 'model': 'gemini-2.5-pro'},
    'gemini-2.5-flash': {'provider': 'google', 'model': 'gemini-2.5-flash'},
    'gemini-2.0-flash': {'provider': 'google', 'model': 'gemini-2.0-flash'},
    # Gemini 3.x (2026-10). 3.8 Flash can turn thinking off; 3.1 Pro only runs in thinking mode, so it uses the lowest level.
    'gemini-3.8-flash': {'provider': 'google', 'model': 'gemini-3.8-flash', 'extra': {'thinkingConfig': {'thinkingBudget': 0}}},
    'gemini-3.1-pro': {'provider': 'google', 'model': 'gemini-3.1-pro-preview', 'max_tokens': 4000, 'extra': {'thinkingConfig': {'thinkingLevel': 'low'}}},
    'grok-3': {'provider': 'xai', 'model': 'grok-3'},
    'grok-3-mini': {'provider': 'xai', 'model': 'grok-3-mini'},
    'grok-4-fast': {'provider': 'xai', 'model': 'grok-4-fast-non-reasoning'},
    'grok-4-1-fast': {'provider': 'xai', 'model': 'grok-4-1-fast-non-reasoning'},
    # Grok 4.x (2026-10). 4.3 can turn reasoning off; 4.7 always reasons (no reasoning_effort setting).
    'grok-4.3': {'provider': 'xai', 'model': 'grok-4.3', 'extra': {'reasoning_effort': 'none'}},
    'grok-4.7': {'provider': 'xai', 'model': 'grok-4.7', 'max_tokens': 2000},
    # Ollama models
    'phi3-mini': {'provider': 'ollama', 'model': 'phi3:mini'},
    'llama3.2-3b': {'provider': 'ollama', 'model': 'llama3.2:3b'},
    'gemma2-2b': {'provider': 'ollama', 'model': 'gemma2:2b'},
    'codellama-7b': {'provider': 'ollama', 'model': 'codellama:7b'},
    'deepseek-r1-7b': {'provider': 'ollama', 'model': 'deepseek-r1:7b'},
    'deepseek-r1-8b': {'provider': 'ollama', 'model': 'deepseek-r1:8b'},
    'qwen2.5-coder-7b': {'provider': 'ollama', 'model': 'qwen2.5-coder:7b'},
    'lfm2.5-thinking': {'provider': 'ollama', 'model': 'lfm2.5-thinking:latest'},
}

CATEGORY_ASSETS = {
    'crypto': {'symbol': 'BTC-USD', 'name': 'Bitcoin', 'asset_id': 'BTCUSD'},
    'forex': {'symbol': 'EURUSD=X', 'name': 'EUR/USD', 'asset_id': 'EURUSD'},
    'stock': {'symbol': '^GSPC', 'name': 'S&P 500', 'asset_id': 'SPX'},
}

def get_price_data(symbol, days=30, end_date=None):
    import yfinance as yf
    # end_date pins the market window so new models trade the same days as earlier runs.
    end_date = end_date or datetime.now()
    start_date = end_date - timedelta(days=days + 10)
    ticker = yf.Ticker(symbol)
    df = ticker.history(start=start_date.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'))
    prices = []
    for date, row in df.iterrows():
        prices.append({
            'date': date.strftime('%Y-%m-%d'),
            'open': float(row['Open']),
            'high': float(row['High']),
            'low': float(row['Low']),
            'close': float(row['Close']),
            'volume': float(row['Volume']),
        })
    return prices[-days:] if len(prices) > days else prices

class AIProviderError(Exception):
    """The API itself failed (HTTP error, no credits, empty reply). The run is aborted."""


def _json_or_raise(response, provider):
    try:
        data = response.json()
    except ValueError:
        data = {}
    if not response.ok:
        err = data.get('error') if isinstance(data, dict) else None
        message = err.get('message') if isinstance(err, dict) else (err or str(data)[:300])
        raise AIProviderError("{} HTTP {}: {}".format(provider, response.status_code, message))
    return data


def call_ai(model_id, prompt):
    config = MODEL_CONFIGS.get(model_id)
    if not config:
        raise ValueError("Unknown model: {}".format(model_id))
    provider = config['provider']
    model = config['model']
    max_tokens = config.get('max_tokens', 500)
    extra = config.get('extra', {})

    if provider == 'openai':
        api_key = os.getenv('OPENAI_API_KEY')
        response = requests.post(
            AI_ENDPOINTS['openai'],
            headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {}'.format(api_key)},
            json={'model': model, 'messages': [{'role': 'user', 'content': prompt}], 'temperature': 0.3, 'max_tokens': max_tokens, **extra},
            timeout=120
        )
        data = _json_or_raise(response, 'OpenAI')
        text = data.get('choices', [{}])[0].get('message', {}).get('content', '')

    elif provider == 'anthropic':
        api_key = os.getenv('ANTHROPIC_API_KEY')
        response = requests.post(
            AI_ENDPOINTS['anthropic'],
            headers={'Content-Type': 'application/json', 'x-api-key': api_key, 'anthropic-version': '2023-06-01'},
            json={'model': model, 'max_tokens': max_tokens, 'messages': [{'role': 'user', 'content': prompt}], **extra},
            timeout=120
        )
        data = _json_or_raise(response, 'Anthropic')
        # Models that think return a thinking block before the text block.
        text = next((b.get('text', '') for b in data.get('content', []) if b.get('type') == 'text'), '')

    elif provider == 'google':
        api_key = os.getenv('GOOGLE_API_KEY')
        url = AI_ENDPOINTS['google'].format(model=model) + '?key={}'.format(api_key)
        # Without a cap, Gemini's thinking tokens are unbounded (and billed).
        response = requests.post(url, headers={'Content-Type': 'application/json'},
            json={'contents': [{'parts': [{'text': prompt}]}],
                  'generationConfig': {'maxOutputTokens': max_tokens, **extra}},
            timeout=240)
        data = _json_or_raise(response, 'Google')
        parts = (data.get('candidates') or [{}])[0].get('content', {}).get('parts', [])
        text = ''.join(p.get('text', '') for p in parts if not p.get('thought'))

    elif provider == 'xai':
        api_key = os.getenv('XAI_API_KEY')
        response = requests.post(
            AI_ENDPOINTS['xai'],
            headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {}'.format(api_key)},
            json={'model': model, 'messages': [{'role': 'user', 'content': prompt}], 'temperature': 0.3, 'max_tokens': max_tokens, **extra},
            timeout=120
        )
        data = _json_or_raise(response, 'xAI')
        text = data.get('choices', [{}])[0].get('message', {}).get('content', '')

    elif provider == 'ollama':
        try:
            response = requests.post(
                'http://localhost:11434/api/chat',
                json={'model': model, 'messages': [{'role': 'user', 'content': prompt}], 'stream': False, 'options': {'temperature': 0.3}},
                timeout=300
            )
            data = response.json()
            return data.get('message', {}).get('content', '')
        except Exception as e:
            print("    Ollama error: {}".format(e))
            return ''
    else:
        return ''

    if not (text or '').strip():
        raise AIProviderError("{}: empty response".format(model_id))
    return text

def parse_decision(response):
    try:
        json_str = response.strip()
        # Remove markdown code blocks (```json ... ```)
        if '```' in json_str:
            import re
            match = re.search(r'```(?:json)?\s*([\s\S]*?)```', json_str)
            if match:
                json_str = match.group(1).strip()
        # Try to find JSON object in response
        if not json_str.startswith('{'):
            import re
            match = re.search(r'\{[^{}]*\}', json_str)
            if match:
                json_str = match.group(0)
        decision = json.loads(json_str)
        action = decision.get('action', 'hold').lower()
        if action not in ['buy', 'sell', 'hold']:
            action = 'hold'
        quantity = float(decision.get('quantity', 0))
        if quantity < 0:
            quantity = 0
        return {'action': action, 'quantity': quantity, 'reasoning': decision.get('reasoning', '')}
    except Exception as e:
        print("    Parse error: {} | Response: {}".format(e, response[:100]))
        return {'action': 'hold', 'quantity': 0, 'reasoning': 'Failed to parse: ' + str(e)}

def build_prompt(day, total_days, cash, position, current_price, price_history, asset_name):
    recent_prices = price_history[-5:] if len(price_history) >= 5 else price_history
    price_lines = []
    for p in recent_prices:
        price_lines.append("  {}: Open {:.2f}, Close {:.2f}".format(p['date'], p['open'], p['close']))
    price_str = '\n'.join(price_lines)
    position_value = position * current_price
    total_value = cash + position_value
    max_buy = cash / current_price if current_price > 0 else 0
    
    prompt = """You are an AGGRESSIVE trading AI. Make a decision for {}.

DAY {}/{}
Current Price: {:.2f}
Cash: {:.2f}
Position: {:.6f} units ({:.2f} value)
Total Portfolio: {:.2f}

Recent Prices:
{}

STRATEGY - BE AGGRESSIVE:
- Trade actively! Don't just hold - look for opportunities
- Buy when you see potential upside (price dips, momentum building)
- Sell to take profits or cut losses - don't wait too long
- Use 30-70% of available cash/position per trade
- Goal: Maximize returns through active trading by day {}

RULES:
- buy/sell/hold (prefer buy or sell over hold!)
- When buying, suggested range: {:.6f} to {:.6f} units
- When selling, suggested range: {:.6f} to {:.6f} units
- Make decisive moves based on price action

Respond ONLY with JSON:
{{"action": "buy"|"sell"|"hold", "quantity": number, "reasoning": "brief"}}""".format(
        asset_name, day, total_days, current_price, cash, position, position_value,
        total_value, price_str, total_days, max_buy * 0.3, max_buy * 0.7, position * 0.3, position * 0.7
    )
    return prompt

def run_simulation(model_id, category, days=30, initial_balance=10000, seed=None, end_date=None):
    if seed is None:
        seed = random.randint(1, 100000)
    random.seed(seed)
    
    asset = CATEGORY_ASSETS.get(category)
    if not asset:
        raise ValueError("Unknown category: {}".format(category))
    
    print("")
    print("=" * 60)
    print("AI Trading Benchmark")
    print("Model: {}".format(model_id))
    print("Category: {} ({})".format(category, asset['name']))
    print("Days: {}".format(days))
    print("Initial Balance: {:.2f} USD".format(initial_balance))
    print("Seed: {}".format(seed))
    print("=" * 60)
    print("")
    
    print("Fetching price data...")
    prices = get_price_data(asset['symbol'], days, end_date)
    if prices:
        print("Market window: {} to {}".format(prices[0]['date'], prices[-1]['date']))
    if len(prices) < days:
        print("Warning: Only got {} days of data".format(len(prices)))
        days = len(prices)
    
    cash = initial_balance
    position = 0.0
    trades = []
    daily_data = []
    
    for day, price_data in enumerate(prices, 1):
        current_price = price_data['close']
        day_start_value = cash + position * current_price
        
        prompt = build_prompt(day, days, cash, position, current_price, prices[:day], asset['name'])
        
        # An API failure aborts the run (it is not saved); recording it as "hold" made broken runs look valid.
        response = call_ai(model_id, prompt)
        decision = parse_decision(response)
        
        action = decision['action']
        quantity = decision['quantity']
        trade_pnl = 0
        
        if action == 'buy' and quantity > 0:
            max_qty = cash / current_price
            qty = min(quantity, max_qty)
            if qty > 0.0001:
                cost = qty * current_price
                cash -= cost
                position += qty
                trades.append({
                    'day': day,
                    'date': price_data['date'],
                    'action': 'buy',
                    'quantity': qty,
                    'price': current_price,
                    'cost': cost,
                    'balance_after': cash + position * current_price,
                    'reasoning': decision.get('reasoning', '')
                })
                print("  Day {}: BUY {:.6f} @ {:.2f} = {:.2f}".format(day, qty, current_price, cost))
        
        elif action == 'sell' and quantity > 0:
            qty = min(quantity, position)
            if qty > 0.0001:
                revenue = qty * current_price
                # Calculate P&L for this sell
                avg_buy_price = 0
                if len([t for t in trades if t['action'] == 'buy']) > 0:
                    total_bought = sum(t['cost'] for t in trades if t['action'] == 'buy')
                    total_qty = sum(t['quantity'] for t in trades if t['action'] == 'buy')
                    if total_qty > 0:
                        avg_buy_price = total_bought / total_qty
                trade_pnl = (current_price - avg_buy_price) * qty if avg_buy_price > 0 else 0
                
                cash += revenue
                position -= qty
                trades.append({
                    'day': day,
                    'date': price_data['date'],
                    'action': 'sell',
                    'quantity': qty,
                    'price': current_price,
                    'revenue': revenue,
                    'pnl': trade_pnl,
                    'balance_after': cash + position * current_price,
                    'reasoning': decision.get('reasoning', '')
                })
                print("  Day {}: SELL {:.6f} @ {:.2f} = {:.2f} (PnL: {:.2f})".format(day, qty, current_price, revenue, trade_pnl))
        
        else:
            print("  Day {}: HOLD (Price: {:.2f})".format(day, current_price))
        
        day_end_value = cash + position * current_price
        daily_pnl = day_end_value - day_start_value
        
        daily_data.append({
            'day': day,
            'date': price_data['date'],
            'price': current_price,
            'cash': cash,
            'position': position,
            'portfolio_value': day_end_value,
            'daily_pnl': daily_pnl,
            'action': action if action != 'hold' else None,
            'trade_pnl': trade_pnl if action == 'sell' else None,
        })
    
    final_price = prices[-1]['close']
    final_position_value = position * final_price
    final_balance = cash + final_position_value
    return_pct = ((final_balance - initial_balance) / initial_balance) * 100
    winning_trades = len([t for t in trades if t['action'] == 'sell' and t.get('pnl', 0) > 0])
    
    print("")
    print("=" * 60)
    print("RESULTS")
    print("=" * 60)
    print("Initial Balance: {:.2f} USD".format(initial_balance))
    print("Final Balance:   {:.2f} USD".format(final_balance))
    print("Return:          {:+.2f}%".format(return_pct))
    print("Total Trades:    {}".format(len(trades)))
    print("=" * 60)
    print("")
    
    return {
        'model_id': model_id,
        'category': category,
        'asset_id': asset['asset_id'],
        'seed': seed,
        'initial_balance': initial_balance,
        'final_balance': final_balance,
        'return_pct': return_pct,
        'total_trades': len(trades),
        'winning_trades': winning_trades,
        'trades': trades,
        'daily_data': daily_data,
    }

def save_to_supabase(result):
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Supabase credentials not found")
        return
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
    }
    
    # Save benchmark run
    run_data = {
        'model_id': result['model_id'],
        'category_id': result['category'],
        'seed': result['seed'],
        'initial_balance': result['initial_balance'],
        'final_balance': result['final_balance'],
        'return_pct': result['return_pct'],
        'total_trades': result['total_trades'],
        'winning_trades': result['winning_trades'],
        'status': 'completed',
        'finished_at': datetime.now().isoformat(),
    }
    
    url = "{}/rest/v1/tb_benchmark_runs".format(SUPABASE_URL)
    response = requests.post(url, headers=headers, json=run_data)
    
    if response.status_code == 201:
        run_id = response.json()[0]['id']
        print("Benchmark run saved! ID: {}".format(run_id))
        
        # Save daily data as JSON in a new column or separate table
        # For now, save trades to trades table
        if result['trades']:
            for trade in result['trades']:
                trade_data = {
                    'run_id': run_id,
                    'asset_id': result['asset_id'],
                    'timestamp': trade['date'] + 'T00:00:00Z',
                    'action': trade['action'],
                    'quantity': trade['quantity'],
                    'price': trade['price'],
                    'balance_after': trade['balance_after'],
                    'reasoning': trade.get('reasoning', ''),
                }
                trade_url = "{}/rest/v1/tb_trades".format(SUPABASE_URL)
                requests.post(trade_url, headers=headers, json=trade_data)
        
        # Save daily_data to benchmark_runs as JSON
        daily_url = "{}/rest/v1/tb_benchmark_runs?id=eq.{}".format(SUPABASE_URL, run_id)
        requests.patch(daily_url, headers=headers, json={'daily_data': json.dumps(result['daily_data'])})
        
        print("Trades and daily data saved!")
    else:
        print("Failed to save: {} - {}".format(response.status_code, response.text))

def main():
    parser = argparse.ArgumentParser(description='AI Trading Benchmark')
    parser.add_argument('-m', '--model', help='Model ID')
    parser.add_argument('-c', '--category', default='crypto', choices=['crypto', 'forex', 'stock'])
    parser.add_argument('-d', '--days', type=int, default=30)
    parser.add_argument('-b', '--balance', type=float, default=10000)
    parser.add_argument('-s', '--seed', type=int)
    parser.add_argument('--save', action='store_true')
    parser.add_argument('--end-date', help='Pin the market window: the last trading day is the day before this date '
                        '(YYYY-MM-DD). The 2026-02 runs used 2026-02-24.')
    parser.add_argument('--list-models', action='store_true')
    args = parser.parse_args()
    
    if args.list_models:
        print("Available models:")
        for mid, cfg in MODEL_CONFIGS.items():
            print("  {} ({})".format(mid, cfg['provider']))
        return
    
    if not args.model:
        parser.error("Required: -m/--model")
    
    try:
        end_date = datetime.strptime(args.end_date, '%Y-%m-%d') if args.end_date else None
        result = run_simulation(args.model, args.category, args.days, args.balance, args.seed, end_date)
        result['status'] = 'completed'
    except Exception as e:
        print("")
        print("!" * 60)
        print("BENCHMARK FAILED: {}".format(e))
        print("!" * 60)
        import traceback
        tb = traceback.format_exc()
        print(tb)
        result = {
            'model_id': args.model,
            'category': args.category,
            'status': 'failed',
            'error': str(e),
            'traceback': tb,
            'seed': args.seed,
            'initial_balance': args.balance,
            'final_balance': 0,
            'return_pct': 0,
            'total_trades': 0,
            'winning_trades': 0,
            'trades': [],
            'daily_data': [],
        }
    # Always save locally
    results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'results')
    os.makedirs(results_dir, exist_ok=True)
    from datetime import datetime as dt
    fname = "{}_{}_{}.json".format(args.model, args.category, dt.now().strftime('%Y%m%d_%H%M%S'))
    local_path = os.path.join(results_dir, fname)
    with open(local_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False, default=str)
    print("Result saved locally: {}".format(local_path))

    if args.save and result.get('status') == 'completed':
        save_to_supabase(result)
    elif args.save and result.get('status') == 'failed':
        print("Skipping Supabase save due to failure. Error saved locally.")

if __name__ == '__main__':
    main()


