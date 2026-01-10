
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

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
            <li>Cookies for site functionality</li>
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
            We use essential cookies to ensure the proper functioning of the Service. You can configure your browser to refuse cookies, but this may affect your ability to use certain features.
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
            If you have questions about this Privacy Policy, please contact us through our website.
          </p>
        </section>

        <p className="text-gray-500 text-sm mt-8">
          Last updated: January 2026
        </p>
      </div>
    </div>
  )
}
