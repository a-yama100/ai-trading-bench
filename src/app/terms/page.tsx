import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:text-blue-700 text-sm">
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

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
            If you have any questions about these Terms of Service, please contact us through our website.
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          Last updated: January 2026
        </p>
      </div>
    </div>
  )
}
