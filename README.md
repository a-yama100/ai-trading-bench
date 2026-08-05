# AI Trading Bench

A benchmark that gives the same simulated market, the same starting balance and the same
random seed to a set of language models, then reports what each one did with it.

**Live:** [trading.phaiworks.com](https://trading.phaiworks.com/)

> **Not investment advice, and not a claim that any model can trade.** This measures how
> language models behave when asked to make repeated decisions under uncertainty with a
> running P&L. That is a benchmark of decision-making consistency, not a trading strategy,
> and results on simulated data say nothing about live markets.

---

## What it does

Each run gives one model a seeded market scenario in one category — stock, forex or
crypto — a $10,000 opening balance, and a sequence of days to trade through. Every
decision is recorded, and the run ends with a return, a trade count and a win count.

Because the seed is part of the run record, two models can be given a genuinely identical
market rather than a similar one. That is the point: without a shared seed, a comparison
between models is mostly a comparison between the scenarios they happened to draw.

Each result carries:

| field | meaning |
|---|---|
| `model_id`, `category_id` | which model, which market |
| `seed` | the scenario, so any run is reproducible |
| `initial_balance`, `final_balance`, `return_pct` | outcome |
| `total_trades`, `winning_trades` | activity and hit rate |
| `daily_data` | the full day-by-day decision trail |

Results are written to `results/` as JSON and to Supabase, which is what the site reads.

---

## Models

Fourteen hosted models across four providers, plus local models through Ollama:

- **OpenAI** — `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`, `gpt-4.1-mini`
- **Anthropic** — `claude-opus-4`, `claude-sonnet-4`, `claude-haiku-3.5`
- **Google** — `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash`
- **xAI** — `grok-3`, `grok-3-mini`, `grok-4-fast`, `grok-4-1-fast`
- **Ollama, local** — `phi3-mini`, `llama3.2-3b`, `gemma2-2b`

Adding a model is one entry in `MODEL_CONFIGS` in `run_benchmark.py`. Provider differences
— endpoint shape, auth header, response envelope — are handled in one place rather than
spread through the runner, so a new provider is a small, contained change.

Including small local models alongside frontier ones is deliberate. A benchmark where
every entrant is expensive tells you very little about whether the expensive ones are
earning their cost.

---

## Running it

```bash
pip install requests python-dotenv
cp .env.local.example .env.local        # provider keys + Supabase service role key

python run_benchmark.py --model gpt-4o --category stock
python batch_benchmark.py               # every hosted model, every category
python batch_ollama.py                  # the local models only, no API spend
```

```bash
npm install
npm run dev                             # the site, reading from Supabase
```

Batch runs write a `batch_log_<timestamp>.json` alongside the individual results, so a
partial or failed sweep can be told apart from one that simply produced poor returns.

---

## Repository map

| Path | Role |
|---|---|
| `run_benchmark.py` | Single run: model config, provider dispatch, scenario, scoring |
| `batch_benchmark.py` | Sweeps every hosted model across every category |
| `batch_ollama.py` | The same sweep against locally-hosted models |
| `results/` | Raw run output plus the Supabase-shaped `db_*.json` records |
| `src/app/` | Next.js site: leaderboards by model and by market |
| `src/components/` | Performance charts (Recharts) |
| `src/lib/` | Supabase client and provider helpers |

---

## Stack

Next.js 16 · Supabase · Recharts · Python for the runner · OpenAI, Anthropic, Google, xAI
and Ollama providers

Built by [PH AI Works](https://www.phaiworks.com/).
