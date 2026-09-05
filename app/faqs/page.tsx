"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Is my money safe with TeveXtra?",
    answer:
      "Client assets are held with regulated third-party custodians in segregated accounts in your name. TeveXtra does not commingle assets and does not use your holdings for proprietary trading. We implement multi-factor authentication, encryption, and other controls to protect your online access.",
  },
  {
    question: "What fees do you charge?",
    answer:
      "Our pricing is a transparent, all-in advisory fee based on assets under management. There are no trading commissions or hidden platform charges. You see the impact of fees on every performance report, and your advisor will review the structure with you before you fund your account.",
  },
  {
    question: "Can I withdraw my money at any time?",
    answer:
      "Yes. You can request withdrawals at any time, subject to standard settlement periods for the underlying securities. Your advisor will help you plan liquidity so that withdrawal requests align with your portfolio strategy and tax considerations.",
  },
  {
    question: "Do you offer socially responsible or ESG investing options?",
    answer:
      "Yes. We can incorporate environmental, social, and governance preferences directly into your portfolio design, including exclusions, tilts, and thematic allocations. We work with you to balance those preferences with diversification and risk management.",
  },
  {
    question: "What is the minimum to get started?",
    answer:
      "Our standard minimum is $5,000, though institutional or bespoke mandates may require higher balances. Regardless of starting size, every client receives the same disciplined process and transparent reporting.",
  },
  {
    question: "How often will I hear from my advisor?",
    answer:
      "At minimum, we conduct a formal review at least annually, with additional check-ins during market changes or major life events. You can also schedule time with your advisor or send secure messages through the portal whenever questions arise.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "You can reset your password by clicking the 'Forgot Password' link on the login page. We'll send a secure reset link to your registered email address.",
  },
  {
    question: "How can I contact support?",
    answer:
      "Our support team is available 24/7. You can reach us via live chat on our website, email at helpdigitaltrend@gmail.com, or by calling our dedicated support line.",
  },
];

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative border-b border-white/5 bg-slate-900/40">
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.12),_transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 text-center">
          <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">
            Support Center
          </h1>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
            Find answers to common questions about how TeveXtra works. If you
            don&apos;t find what you&apos;re looking for, our team is here to
            help.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 -mt-8 pb-24">
        {/* Search/Category Bar */}
        <div className="bg-slate-900/70 backdrop-blur rounded-2xl border border-white/10 p-2 shadow-xl shadow-black/30 mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-2">
            {[
              "General",
              "Account",
              "Security",
              "Investments",
              "Withdrawals",
            ].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 text-xs font-semibold rounded-xl transition-colors text-slate-400 hover:text-emerald-400 hover:bg-white/5"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-slate-900/60 backdrop-blur rounded-3xl border border-white/10 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <HelpCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Everything you need to know
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Click any question to expand the answer
                </p>
              </div>
            </div>

            <Accordion className="space-y-1">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="py-2"
                >
                  <AccordionTrigger className="text-[15px] font-bold text-white py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 leading-relaxed text-[14px]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "Live Chat",
              p: "Chat with our team for immediate assistance.",
              cta: "Start Chat",
            },
            {
              icon: Mail,
              title: "Email Support",
              p: "Get a response within 24 hours.",
              cta: "Send Email",
              href: "mailto:helpdigitaltrend@gmail.com",
            },
            {
              icon: Phone,
              title: "Call Center",
              p: "Available Mon-Fri, 9am - 5pm EST.",
              cta: "Call Us",
              href: "tel:+1234567890",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href || "#"}
              className="group bg-slate-900/60 backdrop-blur p-8 rounded-3xl border border-white/10 text-center transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-900 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                {card.p}
              </p>
              <span className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] hover:underline">
                {card.cta}
              </span>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-8 md:p-12 text-center text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.2),_transparent_55%)]" />
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl opacity-60" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of investors who trust TeveXtra to manage their
              wealth and secure their financial future.
            </p>
            <Link
              href="/register"
              className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full font-bold text-sm hover:brightness-110 transition-all shadow-xl shadow-emerald-500/30"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
