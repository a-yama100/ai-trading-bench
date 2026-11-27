import { H1, UI, type Lang } from '@/lib/content'

// 利用規約（/terms と /en/terms）。英語の文は以前のまま

export function TermsPage({ lang }: { lang: Lang }) {
  return lang === 'ja' ? <TermsJa /> : <TermsEn />
}

function TermsEn() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{H1.en.terms}</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing and using AI Trading Benchmark ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Description of Service</h2>
          <p className="text-gray-600">
            AI Trading Benchmark is an educational and research platform that compares the performance of various AI models in simulated trading scenarios. The Service provides benchmark results, rankings, and analysis across cryptocurrency, forex, and stock markets.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. No Financial Advice</h2>
          <p className="text-gray-600">
            The information provided by this Service is for educational and research purposes only. It does not constitute financial advice, investment advice, trading advice, or any other sort of advice. You should not treat any of the Service's content as such.
          </p>
          <p className="text-gray-600 mt-2">
            Past performance of AI models in simulated trading does not guarantee future results. Trading cryptocurrencies, forex, and stocks involves substantial risk of loss and is not suitable for every investor.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Disclaimer of Warranties</h2>
          <p className="text-gray-600">
            The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Limitation of Liability</h2>
          <p className="text-gray-600">
            In no event shall AI Trading Benchmark, its operators, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Use of AI Models</h2>
          <p className="text-gray-600">
            The benchmark results are generated using third-party AI models from various providers including OpenAI, Anthropic, Google, and xAI. The performance and availability of these models are subject to the terms and conditions of their respective providers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Data Accuracy</h2>
          <p className="text-gray-600">
            While we strive to provide accurate benchmark data, we make no representations or warranties about the accuracy, completeness, or reliability of any information on the Service. Price data is sourced from third-party providers and may be delayed or inaccurate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page. Your continued use of the Service after any changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms of Service, please use our <a href="https://www.phaiworks.com/contact" className="text-blue-600 hover:underline">contact form</a>.
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          Last updated: November 2026
        </p>
      </div>
    </div>
  )
}

const H2 = 'text-xl font-semibold text-gray-800 mb-3'

function TermsJa() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{H1.ja.terms}</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className={H2}>1. 規約への同意</h2>
          <p className="text-gray-600">
            AIトレーディング・ベンチマーク（以下「本サービス」といいます）を利用した時点で、本利用規約に同意したものとみなします。本利用規約に同意いただけない場合は、本サービスの利用をお控えください。
          </p>
        </section>

        <section>
          <h2 className={H2}>2. 本サービスの内容</h2>
          <p className="text-gray-600">
            本サービスは、AIモデルによる模擬売買の成績を比べる、学習および研究を目的としたサイトです。暗号資産、為替、株価指数を対象とするベンチマークの測定結果、ランキングおよび分析を掲載しています。
          </p>
        </section>

        <section>
          <h2 className={H2}>3. 投資の助言ではありません</h2>
          <p className="text-gray-600">
            本サービスが提供する情報は、学習および研究を目的としたものです。金融商品や暗号資産の取引、投資などに関する助言を提供するものではありません。
          </p>
          <p className="text-gray-600 mt-2">
            AIモデルの過去の模擬売買の成績は、将来の運用成績を保証するものではありません。暗号資産、為替、株式などへの投資には、多額の損失が生じるリスクがあります。これらの投資がすべての投資家に適しているとは限りません。
          </p>
        </section>

        <section>
          <h2 className={H2}>4. 保証の否認</h2>
          <p className="text-gray-600">
            本サービスは、現状有姿かつ提供可能な範囲で提供するものであり、明示または黙示を問わず、いかなる保証も行いません。本サービスが中断なく利用できること、誤りがないこと、ウイルスなどの有害な要素を含まないことについても保証しません。
          </p>
        </section>

        <section>
          <h2 className={H2}>5. 責任の制限</h2>
          <p className="text-gray-600">
            本サービスの運営者および関係者は、間接損害、付随的損害、特別損害、結果的損害または懲罰的損害について責任を負いません。これらの損害には、利益、データ、利用機会、信用その他の無形の資産の喪失による損害を含みます。
          </p>
        </section>

        <section>
          <h2 className={H2}>6. AIモデルの利用</h2>
          <p className="text-gray-600">
            ベンチマークでは、OpenAI、Anthropic、Google、xAIなどが提供するAIモデルと、パソコン上で動かす公開モデルを使用しています。外部サービスを通じて利用するAIモデルには、各提供元の利用規約が適用されます。モデルの性能や提供状況は、提供元の都合により変わる場合があります。
          </p>
        </section>

        <section>
          <h2 className={H2}>7. データの正確さ</h2>
          <p className="text-gray-600">
            本サービスは、ベンチマークのデータの正確性の確保に努めていますが、掲載情報の正確性、完全性および信頼性を保証するものではありません。外部サービスから取得する価格データには、遅延や誤りが含まれる場合があります。
          </p>
        </section>

        <section>
          <h2 className={H2}>8. 規約の変更</h2>
          <p className="text-gray-600">
            本利用規約は、必要に応じて変更する場合があります。重要な変更を行う場合は、本ページに改定後の利用規約を掲載してお知らせします。変更後に本サービスを利用した場合は、改定後の利用規約に同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className={H2}>9. お問い合わせ</h2>
          <p className="text-gray-600">
            この利用規約についてのご質問は、<a href="https://www.phaiworks.com/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</a>からお送りください。
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          {UI.ja.updated}
        </p>
      </div>
    </div>
  )
}
