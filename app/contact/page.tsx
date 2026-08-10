"use client";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Headphones,
  Users,
  MessageSquare,
} from "lucide-react";

const GMAIL_COMPOSE_URL =
  "https://mail.google.com/mail/?view=cm&fs=1&to=helpdigitaltrend%40gmail.com&su=Contact%20Inquiry%20-%20Digital-trend";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "helpdigitaltrend@gmail.com",
      href: GMAIL_COMPOSE_URL,
      external: true,
      cta: "Send Email",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 012-9876",
      href: "tel:+15550129876",
      cta: "Call Now",
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: "21st Floor, Financial District, New York, NY",
      cta: "Get Directions",
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "Mon – Fri · 9:00 AM – 6:00 PM EST",
    },
  ];

  const supportHighlights = [
    {
      icon: ShieldCheck,
      title: "Secure & Confidential",
      description:
        "All inquiries are handled with the utmost confidentiality and data protection.",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description:
        "Speak directly with a qualified advisor — no automated phone trees.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "Our advisors average 12+ years of experience in wealth management.",
    },
    {
      icon: MessageSquare,
      title: "Fast Response",
      description:
        "Emails reviewed 24/7 with a guaranteed response within 24 business hours.",
    },
  ];

  const faqs = [
    {
      q: "How quickly will I receive a response?",
      a: "Our team monitors email 24/7. Inquiries submitted during business hours typically receive a response within a few hours, and all messages are answered within 24 business hours.",
    },
    {
      q: "Do I need an existing account to contact an advisor?",
      a: "No. Anyone may reach out for a complimentary consultation, whether you're a current client or exploring Digital-trend for the first time.",
    },
    {
      q: "Is the initial consultation free?",
      a: "Yes. Your first conversation with a Digital-trend advisor is complimentary, with no obligation or pressure to commit.",
    },
    {
      q: "Can I schedule a call at a specific time?",
      a: "Absolutely. In your email, mention a few preferred times (including your timezone) and our team will confirm a slot that works for you.",
    },
  ];

  return (
    <div
      className="bg-white min-h-screen transition-colors duration-300"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Page Breadcrumb / Header Bar */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-4 text-sm text-slate-500">
          <nav className="flex items-center gap-2">
            <a href="/" className="hover:text-slate-900 transition-colors">
              Home
            </a>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
                Customer Support
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                We're here when you need us.
              </h1>
              <p className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg max-w-xl">
                From account questions to investment strategy sessions, the
                Digital-trend team is a quick call or email away. Reach out
                anytime — we're happy to help.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-600/30"
                >
                  <Mail className="h-4 w-4" />
                  Email Us
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="tel:+15550129876"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-600 bg-slate-800/40 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-slate-800 hover:border-slate-500"
                >
                  <Phone className="h-4 w-4" />
                  Call +1 (555) 012-9876
                </a>
              </div>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { label: "Clients Worldwide", value: "10K+" },
                { label: "Avg. Response Time", value: "< 4 hrs" },
                { label: "Advisors On Staff", value: "45+" },
                { label: "Client Satisfaction", value: "98%" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur"
                >
                  <p className="text-3xl font-semibold text-white">{s.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="mx-auto max-w-7xl px-6 -mt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {item.label}
              </h3>
              <p className="mt-2 text-base font-semibold text-slate-900 leading-snug">
                {item.value}
              </p>
              {item.cta && (
                <a
                  href={item.href || "#"}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                  {item.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support Highlights */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Why Digital-trend
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Experience client support done right.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Every interaction is handled with care, expertise, and respect —
            because your financial goals deserve nothing less.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {supportHighlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7 hover:bg-white hover:shadow-md transition-all"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <h.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-900">
                {h.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {h.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Can't find what you're looking for? Reach out directly via email
              or phone.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-slate-200 bg-white p-6 open:shadow-sm transition-shadow"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="text-base font-semibold text-slate-900">
                    {f.q}
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 group-open:bg-emerald-600 group-open:text-white transition-colors">
                    <span className="text-lg leading-none group-open:hidden">
                      +
                    </span>
                    <span className="text-lg leading-none hidden group-open:inline">
                      −
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-4">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-10 sm:p-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Ready to speak with an advisor?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-300">
                Send us an email and we'll match you with the right expert for
                your needs.
              </p>
            </div>
            <a
              href={GMAIL_COMPOSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-slate-900 shadow-xl transition-all hover:bg-emerald-400 hover:-translate-y-0.5"
            >
              <Mail className="h-5 w-5" />
              Compose Email
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
