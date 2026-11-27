import type { Lang } from '@/lib/content'
import { H1 } from '@/lib/content'
import { jsonLd as toJsonLd } from '@/lib/security/escapeHtml'

// よくある質問（/faq と /en/faq）

const FAQS_EN = [
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

const FAQS_JA = [
  {
    question: 'AIトレーディング・ベンチマークとは何ですか？',
    answer: 'AIモデルごとの売買判断と模擬売買の成績を比べるサイトです。OpenAIのGPT、AnthropicのClaude、GoogleのGemini、xAIのGrokを対象としています。Ollamaを使ってパソコン上で動かす小型のAIモデルも比較の対象です。すべてのモデルが同じ市場で模擬売買を行います。',
  },
  {
    question: 'ベンチマークはどのような仕組みですか？',
    answer: '各AIモデルは、$10,000 の仮想資金を元手に模擬売買を行います。取引日ごとに、その日の終値、現金残高、保有量、直近5日間の価格を受け取り、買うか、売るか、何もしないかを判断します。売買する場合は、数量も決めます。取引手数料はなく、空売りもしません。1回の測定期間は約30取引日です。終了時に、最終資産額、収益率、取引回数、利益確定回数を記録し、ランキングは収益率の高い順に表示します。',
  },
  {
    question: 'どのAIモデルを比べていますか？',
    answer: 'OpenAIのGPT、AnthropicのClaude、GoogleのGemini、xAIのGrokを比べています。Llama、Phi、Gemmaなど、パソコン上で動かす小型の公開モデルも比較の対象です。すべてのモデルに、同じ指示文（プロンプト）と価格データを与えます。対象のモデルの一覧は「AIモデル」のページで確認できます。',
  },
  {
    question: '実際のお金を使っていますか？',
    answer: 'いいえ。すべて仮想資金を使った模擬売買です。実際の資金を使うことも、市場に注文を出すこともありません。AIモデルごとの売買判断と成績の違いを比べることが目的です。',
  },
  {
    question: '価格データはどこから取得していますか？',
    answer: 'Yahoo Financeから取得した過去の終値を使っています。新しく追加するAIモデルも、以前に測定したモデルと同じ期間の価格データで比べます。新しい測定が終わるたびに、サイトの結果を更新しています。',
  },
  {
    question: 'どの市場を対象にしていますか？',
    answer: '暗号資産、為替、株価指数の3つです。暗号資産はビットコイン/米ドル（BTC/USD）、為替はユーロ/米ドル（EUR/USD）、株価指数はS&P 500を対象にしています。',
  },
  {
    question: 'この結果を実際の投資に使えますか？',
    answer: 'このサイトの結果は、情報提供と学習を目的としたもので、投資の助言ではありません。短い期間の模擬売買で成績がよかったAIモデルでも、実際の市場で利益を得られるとは限りません。投資の判断は、ご自身の責任で行ってください。',
  },
  {
    question: '利益確定取引率はどのように計算していますか？',
    answer: '利益確定回数を、買いと売りを合わせたすべての取引回数で割った値です。売った価格が平均の買値を上回ったとき、その売りを利益確定の取引として数えます。一般的な売買の勝率とは、計算方法が異なります。',
  },
]

export function FaqPage({ lang }: { lang: Lang }) {
  const faqs = lang === 'ja' ? FAQS_JA : FAQS_EN
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{H1[lang].faq}</h1>
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
