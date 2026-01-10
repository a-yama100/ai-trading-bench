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
    'claude-haiku-3.5': {'provider': 'anthropic', 'model': 'claude-3-5-haiku-20241022'},
    'gemini-2.5-pro': {'provider': 'google', 'model': 'gemini-2.5-pro'},
    'gemini-2.5-flash': {'provider': 'google', 'model': 'gemini-2.5-flash'},
    'gemini-2.0-flash': {'provider': 'google', 'model': 'gemini-2.0-flash'},
    'grok-3': {'provider': 'xai', 'model': 'grok-3'},
    'grok-3-mini': {'provider': 'xai', 'model': 'grok-3-mini'},
    'grok-4-fast': {'provider': 'xai', 'model': 'grok-4-fast-non-reasoning'},
    'grok-4-1-fast': {'provider': 'xai', 'model': 'grok-4-1-fast-non-reasoning'},
}

CATEGORY_ASSETS = {
    'crypto': {'symbol': 'BTC-USD', 'name': 'Bitcoin'},
    'forex': {'symbol': 'EURUSD=X', 'name': 'EUR/USD'},
    'stock': {'symbol': '^GSPC', 'name': 'S&P 500'},
}

def get_price_data(symbol, days=30):
    import yfinance as yf
    end_date = datetime.now()
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

def call_ai(model_id, prompt):
    config = MODEL_CONFIGS.get(model_id)
    if not config:
        raise ValueError(f"Unknown model: {model_id}")
    provider = config['provider']
    model = config['model']
    
    if provider == 'openai':
        api_key = os.getenv('OPENAI_API_KEY')
        response = requests.post(
            AI_ENDPOINTS['openai'],
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'},
            json={'model': model, 'messages': [{'role': 'user', 'content': prompt}], 'temperature': 0.3, 'max_tokens': 500},
            timeout=60
        )
        data = response.json()
        return data.get('choices', [{}])[0].get('message', {}).get('content', '')
    
    elif provider == 'anthropic':
        api_key = os.getenv('ANTHROPIC_API_KEY')
        response = requests.post(
            AI_ENDPOINTS['anthropic'],
            headers={'Content-Type': 'application/json', 'x-api-key': api_key, 'anthropic-version': '2023-06-01'},
            json={'model': model, 'max_tokens': 500, 'messages': [{'role': 'user', 'content': prompt}]},
            timeout=60
        )
        data = response.json()
        return data.get('content', [{}])[0].get('text', '')
    
    elif provider == 'google':
        api_key = os.getenv('GOOGLE_API_KEY')
        url = AI_ENDPOINTS['google'].format(model=model) + f'?key={api_key}'
        response = requests.post(url, headers={'Content-Type': 'application/json'},
            json={'contents': [{'parts': [{'text': prompt}]}]}, timeout=60)
        data = response.json()
        return data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
    
    elif provider == 'xai':
        api_key = os.getenv('XAI_API_KEY')
        response = requests.post(
            AI_ENDPOINTS['xai'],
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'},
            json={'model': model, 'messages': [{'role': 'user', 'content': prompt}], 'temperature': 0.3, 'max_tokens': 500},
            timeout=60
        )
        data = response.json()
        return data.get('choices', [{}])[0].get('message', {}).get('content', '')
    return ''

def parse_decision(response):
    try:
        json_str = response
        if '`' in response:
            import re
            match = re.search(r'`(?:json)?\s*([\s\S]*?)`', response)
            if match:
                json_str = match.group(1)
        decision = json.loads(json_str.strip())
        action = decision.get('action', 'hold').lower()
        if action not in ['buy', 'sell', 'hold']:
            action = 'hold'
        quantity = float(decision.get('quantity', 0))
        if quantity < 0:
            quantity = 0
        return {'action': action, 'quantity': quantity, 'reasoning': decision.get('reasoning', '')}
    except:
        return {'action': 'hold', 'quantity': 0, 'reasoning': 'Failed to parse'}

def build_prompt(day, total_days, cash, position, current_price, price_history, asset_name):
    recent_prices = price_history[-5:] if len(price_history) >= 5 else price_history
    price_lines = []
    for p in recent_prices:
        price_lines.append("  {}: Open {:.2f}, Close {:.2f}".format(p['date'], p['open'], p['close']))
    price_str = '\n'.join(price_lines)
    position_value = position * current_price
    total_value = cash + position_value
    max_buy = cash / current_price if current_price > 0 else 0
    
    prompt = """You are a trading AI. Make a decision for {}.

DAY {}/{}
Current Price: {:.2f}
Cash: {:.2f}
Position: {:.6f} units ({:.2f} value)
Total Portfolio: {:.2f}

Recent Prices:
{}

RULES:
- buy/sell/hold
- When buying, max units: {:.6f}
- When selling, max units: {:.6f}
- Goal: Maximize portfolio by day {}

Respond ONLY with JSON:
{{"action": "buy"|"sell"|"hold", "quantity": number, "reasoning": "brief"}}""".format(
        asset_name, day, total_days, current_price, cash, position, position_value,
        total_value, price_str, max_buy, position, total_days
    )
    return prompt

def run_simulation(model_id, category, days=30, initial_balance=10000, seed=None):
    if seed is None:
        seed = random.randint(1, 100000)
    random.seed(seed)
    
    asset = CATEGORY_ASSETS.get(category)
    if not asset:
        raise ValueError(f"Unknown category: {category}")
    
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
    prices = get_price_data(asset['symbol'], days)
    if len(prices) < days:
        print("Warning: Only got {} days of data".format(len(prices)))
        days = len(prices)
    
    cash = initial_balance
    position = 0.0
    trades = []
    
    for day, price_data in enumerate(prices, 1):
        current_price = price_data['close']
        prompt = build_prompt(day, days, cash, position, current_price, prices[:day], asset['name'])
        
        try:
            response = call_ai(model_id, prompt)
            decision = parse_decision(response)
        except Exception as e:
            print("  Day {}: AI error - {}".format(day, e))
            decision = {'action': 'hold', 'quantity': 0}
        
        action = decision['action']
        quantity = decision['quantity']
        
        if action == 'buy' and quantity > 0:
            max_qty = cash / current_price
            qty = min(quantity, max_qty)
            if qty > 0.0001:
                cost = qty * current_price
                cash -= cost
                position += qty
                trades.append({'day': day, 'action': 'buy', 'qty': qty, 'price': current_price})
                print("  Day {}: BUY {:.6f} @ {:.2f} = {:.2f}".format(day, qty, current_price, cost))
        elif action == 'sell' and quantity > 0:
            qty = min(quantity, position)
            if qty > 0.0001:
                revenue = qty * current_price
                cash += revenue
                position -= qty
                trades.append({'day': day, 'action': 'sell', 'qty': qty, 'price': current_price})
                print("  Day {}: SELL {:.6f} @ {:.2f} = {:.2f}".format(day, qty, current_price, revenue))
        else:
            print("  Day {}: HOLD (Price: {:.2f})".format(day, current_price))
    
    final_price = prices[-1]['close']
    final_position_value = position * final_price
    final_balance = cash + final_position_value
    return_pct = ((final_balance - initial_balance) / initial_balance) * 100
    winning_trades = len([t for t in trades if t['action'] == 'sell'])
    
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
        'model_id': model_id, 'category': category, 'seed': seed,
        'initial_balance': initial_balance, 'final_balance': final_balance,
        'return_pct': return_pct, 'total_trades': len(trades), 'winning_trades': winning_trades,
    }

def save_to_supabase(result):
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Supabase credentials not found")
        return
    url = "{}/rest/v1/benchmark_runs".format(SUPABASE_URL)
    headers = {
        'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json', 'Prefer': 'return=representation',
    }
    data = {
        'model_id': result['model_id'], 'category_id': result['category'],
        'seed': result['seed'], 'initial_balance': result['initial_balance'],
        'final_balance': result['final_balance'], 'return_pct': result['return_pct'],
        'total_trades': result['total_trades'], 'winning_trades': result['winning_trades'],
        'status': 'completed', 'finished_at': datetime.now().isoformat(),
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 201:
        print("Result saved to Supabase!")
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
    parser.add_argument('--list-models', action='store_true')
    args = parser.parse_args()
    
    if args.list_models:
        print("Available models:")
        for mid, cfg in MODEL_CONFIGS.items():
            print("  {} ({})".format(mid, cfg['provider']))
        return
    
    if not args.model:
        parser.error("Required: -m/--model")
    
    result = run_simulation(args.model, args.category, args.days, args.balance, args.seed)
    if args.save:
        save_to_supabase(result)

if __name__ == '__main__':
    main()
