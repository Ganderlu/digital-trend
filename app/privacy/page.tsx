export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          Last updated: March 19, 2026
        </p>
        
        <div className="mt-12 space-y-10 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <p>
              At Digital-trend, we are committed to protecting your privacy and ensuring the security of your personal and financial information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you create an account, complete a transaction, or communicate with our advisory team. This includes:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Personal identification (Name, email, address, phone number)</li>
              <li>Financial information (Bank details, investment objectives, risk tolerance)</li>
              <li>Verification documents required by regulatory standards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Data</h2>
            <p>
              Your information is used solely to provide and improve our investment services, including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Managing your investment portfolio and account</li>
              <li>Processing deposits and withdrawals</li>
              <li>Communicating important account updates and market insights</li>
              <li>Complying with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
            <p>
              We implement industry-leading security measures, including end-to-end encryption, multi-factor authentication, and secure cold storage for digital assets, to protect your data from unauthorized access.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
