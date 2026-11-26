import { Metadata } from 'next'
import { jsonLd as toJsonLd } from '@/lib/security/escapeHtml'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about AI Trading Benchmark: how it works, which AI models and markets are tested, and how the results are calculated.',
}

const faqs = [
  {
    question: 'What is AI Trading Benchmark?',
    answer: 'AI Trading Benchmark compares how different AI models make trading decisions. Models from OpenAI (GPT), Anthropic (Claude), Google (Gemini) and xAI (Grok), plus a few small models run locally with Ollama, all trade the same markets in a simulation.',
  },
  {
    question: 'How does the benchmark work?',
    answer: 'Each model starts with a virtual $10,000. Every trading day, it sees the current price, its cash and position, and the last five days of prices, then chooses to buy, sell or hold. A run lasts up to 30 trading days. At the end, we record the return, the number of trades and the number of profitable sells.',
  },
  {
    question: 'Which AI models are compared?',
    answer: 'The list includes GPT models from OpenAI, Claude models from Anthropic, Gemini models from Google, Grok models from xAI, and small open models such as Llama, Phi and Gemma run locally. Every model gets the same prompt and the same price data. The full list is on the Models page.',
  },
  {
    question: 'Is real money used in the benchmarks?',
    answer: 'No. All trades are simulated with a virtual balance. No real money is used and no real orders are placed. The goal is only to compare how AI models make decisions.',
  },
  {
    question: 'Where does the price data come from?',
    answer: 'We use real historical daily prices from Yahoo Finance. Where possible, new models are tested on the same dates as earlier runs, so the results can be compared fairly. Results on this site are updated when new runs finish.',
  },
  {
    question: 'What markets are covered?',
    answer: 'Three markets: cryptocurrency (Bitcoin against the US dollar, BTC/USD), forex (the euro against the US dollar, EUR/USD), and stocks (the S&P 500 index).',
  },
  {
    question: 'Can I use these results for actual trading?',
    answer: 'No. The results are for information and education only. A good result in a short simulation does not mean a model will make money in real markets. Always do your own research before you invest.',
  },
  {
    question: 'How is win rate calculated?',
    answer: 'Win rate is the number of profitable sell trades divided by the total number of trades, including buys. A sell counts as profitable when the selling price is higher than the average buying price.',
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
        dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
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
