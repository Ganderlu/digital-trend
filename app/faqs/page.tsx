"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Is my money safe with Digital-trend?",
    answer: "Client assets are held with regulated third-party custodians in segregated accounts in your name. Digital-trend does not commingle assets and does not use your holdings for proprietary trading. We implement multi-factor authentication, encryption, and other controls to protect your online access."
  },
  {
    question: "What fees do you charge?",
    answer: "Our pricing is a transparent, all-in advisory fee based on assets under management. There are no trading commissions or hidden platform charges. You see the impact of fees on every performance report, and your advisor will review the structure with you before you fund your account."
  },
  {
    question: "Can I withdraw my money at any time?",
    answer: "Yes. You can request withdrawals at any time, subject to standard settlement periods for the underlying securities. Your advisor will help you plan liquidity so that withdrawal requests align with your portfolio strategy and tax considerations."
  },
  {
    question: "Do you offer socially responsible or ESG investing options?",
    answer: "Yes. We can incorporate environmental, social, and governance preferences directly into your portfolio design, including exclusions, tilts, and thematic allocations. We work with you to balance those preferences with diversification and risk management."
  },
  {
    question: "What is the minimum to get started?",
    answer: "Our standard minimum is $5,000, though institutional or bespoke mandates may require higher balances. Regardless of starting size, every client receives the same disciplined process and transparent reporting."
  },
  {
    question: "How often will I hear from my advisor?",
    answer: "At minimum, we conduct a formal review at least annually, with additional check-ins during market changes or major life events. You can also schedule time with your advisor or send secure messages through the portal whenever questions arise."
  },
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. We'll send a secure reset link to your registered email address."
  },
  {
    question: "How can I contact support?",
    answer: "Our support team is available 24/7. You can reach us via live chat on our website, email at support@digital-trend.com, or by calling our dedicated support line."
  }
];

export default function FaqsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-20 text-center">
          <h1 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-4">
            Support Center
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Find answers to common questions about how Digital-trend works. If you don't find what you're looking for, our team is here to help.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 -mt-8">
        {/* Search/Category Bar (Placeholder for visual completeness) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xl shadow-slate-200/50 mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-2">
            {["General", "Account", "Security", "Investments", "Withdrawals"].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors text-slate-600 hover:text-emerald-600"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 md:p-12">
            <Accordion className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-slate-100 last:border-0">
                  <AccordionTrigger className="text-lg font-semibold text-slate-900 py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center hover:border-emerald-200 transition-colors group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Live Chat</h3>
            <p className="text-sm text-slate-500 mb-4">Chat with our team for immediate assistance.</p>
            <button className="text-emerald-600 text-sm font-bold hover:underline">Start Chat</button>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center hover:border-emerald-200 transition-colors group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Email Support</h3>
            <p className="text-sm text-slate-500 mb-4">Get a response within 24 hours.</p>
            <Link href="mailto:support@digital-trend.com" className="text-emerald-600 text-sm font-bold hover:underline">Send Email</Link>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center hover:border-emerald-200 transition-colors group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Call Center</h3>
            <p className="text-sm text-slate-500 mb-4">Available Mon-Fri, 9am - 5pm EST.</p>
            <Link href="tel:+1234567890" className="text-emerald-600 text-sm font-bold hover:underline">Call Us</Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-emerald-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
            <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
              Join thousands of investors who trust Digital-trend to manage their wealth and secure their financial future.
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-emerald-800 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 bg-emerald-800 rounded-full opacity-50 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
