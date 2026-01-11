import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about AI Trading Benchmark - How it works, supported AI models, and benchmark methodology.',
}

const faqs = [
  {
    question: 'What is AI Trading Benchmark?',
    answer: 'AI Trading Benchmark is a platform that compares the trading decision-making capabilities of different AI models (GPT-4, Claude, Gemini, Grok) across crypto, forex, and stock markets using simulated trading scenarios.',
  },
  {
    question: 'How does the benchmark work?',
    answer: 'Each AI model is given the same market data and asked to make trading decisions (buy, sell, or hold). The benchmark tracks portfolio performance over a 30-day period, measuring returns, win rates, and risk-adjusted performance.',
  },
  {
    question: 'Which AI models are compared?',
    answer: 'We currently benchmark GPT-4 (OpenAI), Claude (Anthropic), Gemini (Google), and Grok (xAI). Each model uses its default configuration for fair comparison.',
  },
  {
    question: 'Is real money used in the benchmarks?',
    answer: 'No. All benchmarks use simulated trading with a virtual starting balance. No real money or actual trades are involved. This is purely for comparing AI decision-making capabilities.',
  },
  {
    question: 'How often are benchmarks run?',
    answer: 'Benchmarks are run regularly using real historical market data. Results are updated as new benchmark runs are completed.',
  },
  {
    question: 'What markets are covered?',
    answer: 'We cover three major market categories: Cryptocurrency (BTC, ETH, SOL), Forex (EUR/USD, GBP/USD, USD/JPY), and Stocks (major indices and popular stocks).',
  },
  {
    question: 'Can I use these results for actual trading?',
    answer: 'The benchmark results are for informational and educational purposes only. Past simulated performance does not guarantee future results. Always do your own research before making investment decisions.',
  },
  {
    question: 'How is win rate calculated?',
    answer: 'Win rate is the percentage of profitable trades out of total trades executed. A trade is considered a win if it results in a positive return after closing the position.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h2>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
