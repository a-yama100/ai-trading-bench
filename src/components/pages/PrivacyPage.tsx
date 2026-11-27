import { H1, UI, type Lang } from '@/lib/content'

// プライバシーポリシー（/privacy と /en/privacy）。英語の文は以前のまま

export function PrivacyPage({ lang }: { lang: Lang }) {
  return lang === 'ja' ? <PrivacyJa /> : <PrivacyEn />
}

function PrivacyEn() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{H1.en.privacy}</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
          <p className="text-gray-600">
            AI Trading Benchmark ("we", "our", or "the Service") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
          <p className="text-gray-600">
            We collect minimal information to operate the Service:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Usage data (pages visited, time spent, browser type)</li>
            <li>Technical data (IP address, device information)</li>
            <li>Cookies set by Google Analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
          <p className="text-gray-600">
            We use the collected information to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Operate and maintain the Service</li>
            <li>Improve user experience</li>
            <li>Analyze usage patterns</li>
            <li>Ensure security and prevent abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Storage</h2>
          <p className="text-gray-600">
            Benchmark data and results are stored in secure cloud databases. We use industry-standard security measures to protect this data. We do not store personal financial information or trading credentials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Third-Party Services</h2>
          <p className="text-gray-600">
            We use third-party services that may collect information:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Vercel (hosting)</li>
            <li>Google Analytics (visitor statistics)</li>
            <li>Supabase (database)</li>
            <li>AI providers (OpenAI, Anthropic, Google, xAI) for benchmark execution</li>
          </ul>
          <p className="text-gray-600 mt-2">
            These services have their own privacy policies governing their use of data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Cookies</h2>
          <p className="text-gray-600">
            We use Google Analytics, which sets cookies to measure how visitors use the site. We do not use advertising cookies. You can block or delete cookies in your browser settings; the site still works without them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Data Retention</h2>
          <p className="text-gray-600">
            Benchmark results and analytics data are retained indefinitely to maintain historical records. Usage logs may be deleted after 90 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Your Rights</h2>
          <p className="text-gray-600">
            Depending on your location, you may have rights regarding your personal data, including:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Right to access your data</li>
            <li>Right to request deletion</li>
            <li>Right to opt-out of data collection</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Children's Privacy</h2>
          <p className="text-gray-600">
            The Service is not intended for children under 18. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Changes to This Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Contact Us</h2>
          <p className="text-gray-600">
            If you have questions about this Privacy Policy, please use our <a href="https://www.phaiworks.com/contact" className="text-blue-600 hover:underline">contact form</a>.
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

function PrivacyJa() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{H1.ja.privacy}</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className={H2}>1. はじめに</h2>
          <p className="text-gray-600">
            AIトレーディング・ベンチマーク（以下「本サービス」といいます）は、利用者のプライバシーの保護に努めています。本プライバシーポリシーでは、利用者の情報の収集、利用および管理について説明します。
          </p>
        </section>

        <section>
          <h2 className={H2}>2. 集める情報</h2>
          <p className="text-gray-600">
            本サービスでは、運営に必要な最小限の情報を収集します。
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>利用状況に関する情報（閲覧ページ、滞在時間、ブラウザの種類）</li>
            <li>技術情報（IPアドレス、端末情報）</li>
            <li>Google アナリティクスが設定する Cookie</li>
          </ul>
        </section>

        <section>
          <h2 className={H2}>3. 情報の使い道</h2>
          <p className="text-gray-600">
            集めた情報は、次の目的に使います。
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>本サービスの運営と保守</li>
            <li>使いやすさの改善</li>
            <li>利用の傾向の分析</li>
            <li>安全の確保と不正な利用の防止</li>
          </ul>
        </section>

        <section>
          <h2 className={H2}>4. データの保管</h2>
          <p className="text-gray-600">
            ベンチマークのデータと測定結果は、クラウド上のデータベースに保存し、適切なセキュリティ対策を講じています。個人の金融情報や取引口座のログイン情報は保存しません。
          </p>
        </section>

        <section>
          <h2 className={H2}>5. 外部のサービス</h2>
          <p className="text-gray-600">
            本サービスでは、次の外部サービスを利用しています。これらのサービスでは、利用者に関する情報が収集される場合があります。
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Vercel（サイトの公開）</li>
            <li>Google アナリティクス（訪問者の統計）</li>
            <li>Supabase（データベース）</li>
            <li>ベンチマークの実行に使う AI の提供元（OpenAI、Anthropic、Google、xAI）</li>
          </ul>
          <p className="text-gray-600 mt-2">
            各外部サービスでの情報の取り扱いについては、提供元のプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section>
          <h2 className={H2}>6. Cookie</h2>
          <p className="text-gray-600">
            本サービスでは、利用状況の把握を目的として Google アナリティクスを利用しています。Google アナリティクスは、アクセス解析のために Cookie を使用します。広告目的の Cookie は使用していません。Cookie はブラウザの設定で無効化または削除でき、無効にした場合でも本サービスは引き続き利用できます。
          </p>
        </section>

        <section>
          <h2 className={H2}>7. 保存期間</h2>
          <p className="text-gray-600">
            ベンチマークの測定結果とアクセス解析データは、過去の記録として保存期間を定めずに保存します。アクセスログは、保存から90日経過後に削除する場合があります。
          </p>
        </section>

        <section>
          <h2 className={H2}>8. 利用者の権利</h2>
          <p className="text-gray-600">
            適用される法令によっては、利用者は自身の個人情報に関して、次の権利を有する場合があります。
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>自分のデータを確認する権利</li>
            <li>削除を求める権利</li>
            <li>データの収集を断る権利</li>
          </ul>
        </section>

        <section>
          <h2 className={H2}>9. 18歳未満の方の情報</h2>
          <p className="text-gray-600">
            本サービスは、18歳未満の方を対象としていません。18歳未満であることを認識したうえで、個人情報を収集することはありません。
          </p>
        </section>

        <section>
          <h2 className={H2}>10. このポリシーの変更</h2>
          <p className="text-gray-600">
            本プライバシーポリシーは、必要に応じて改定する場合があります。改定後の内容は、本ページに掲載します。
          </p>
        </section>

        <section>
          <h2 className={H2}>11. お問い合わせ</h2>
          <p className="text-gray-600">
            このプライバシーポリシーについてのご質問は、<a href="https://www.phaiworks.com/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</a>からお送りください。
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          {UI.ja.updated}
        </p>
      </div>
    </div>
  )
}
