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
  "https://mail.google.com/mail/?view=cm&fs=1&to=helpdigitaltrend%40gmail.com&su=Contact%20Inquiry%20-%20TeveXtra";

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
    color: "emerald",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Speak directly with a qualified advisor — no automated phone trees.",
    color: "sky",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Our advisors average 12+ years of experience in wealth management.",
    color: "indigo",
  },
  {
    icon: MessageSquare,
    title: "Fast Response",
    description:
      "Emails reviewed 24/7 with a guaranteed response within 24 business hours.",
    color: "amber",
  },
];

const faqs = [
  {
    q: "How quickly will I receive a response?",
    a: "Our team monitors email 24/7. Inquiries submitted during business hours typically receive a response within a few hours, and all messages are answered within 24 business hours.",
  },
  {
    q: "Do I need an existing account to contact an advisor?",
    a: "No. Anyone may reach out for a complimentary consultation, whether you're a current client or exploring TeveXtra for the first time.",
  },
  {
    q: "Is the initial consultation free?",
    a: "Yes. Your first conversation with a TeveXtra advisor is complimentary, with no obligation or pressure to commit.",
  },
  {
    q: "Can I schedule a call at a specific time?",
    a: "Absolutely. In your email, mention a few preferred times (including your timezone) and our team will confirm a slot that works for you.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden transition-colors duration-300">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(56,189,248,0.1),_transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-5">
                Customer Support
              </p>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                We&apos;re here
                <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                  when you need us.
                </span>
              </h1>
              <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg max-w-xl">
                From account questions to investment strategy sessions, the
                TeveXtra team is a quick call or email away. Reach out anytime —
                we&apos;re happy to help.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 hover:-translate-y-0.5"
                >
                  <Mail className="h-4 w-4" />
                  Email Us
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="tel:+15550129876"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur px-7 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
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
                  className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur p-6 transition hover:bg-slate-900/80"
                >
                  <p className="text-3xl font-black text-white tabular-nums">
                    {s.value}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <div className="mx-auto max-w-7xl px-6 -mt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 transition-all duration-300 hover:bg-slate-900 hover:border-emerald-500/30 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {item.label}
              </h3>
              <p className="mt-2 text-base font-bold text-white leading-snug">
                {item.value}
              </p>
              {item.cta && (
                <a
                  href={item.href || "#"}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
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
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-sky-400 mb-4">
            Why TeveXtra
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Experience client support
            <span className="block text-sky-400">done right.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Every interaction is handled with care, expertise, and respect —
            because your financial goals deserve nothing less.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {supportHighlights.map((h) => {
            const map: Record<
              string,
              { bg: string; border: string; text: string }
            > = {
              emerald: {
                bg: "bg-emerald-500",
                border: "shadow-emerald-500/30",
                text: "text-emerald-400",
              },
              sky: {
                bg: "bg-sky-500",
                border: "shadow-sky-500/30",
                text: "text-sky-400",
              },
              indigo: {
                bg: "bg-indigo-500",
                border: "shadow-indigo-500/30",
                text: "text-indigo-400",
              },
              amber: {
                bg: "bg-amber-500",
                border: "shadow-amber-500/30",
                text: "text-amber-400",
              },
            };
            const c = map[h.color];
            return (
              <div
                key={h.title}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-7 transition-all duration-300 hover:bg-slate-900 hover:border-white/15 hover:shadow-lg"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} text-white shadow-lg ${c.border}`}
                >
                  <h.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-white">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {h.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-y border-white/5 bg-slate-900/30">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-emerald-400 mb-4">
              FAQ
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              Can&apos;t find what you&apos;re looking for? Reach out directly
              via email or phone.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-900/40 p-6 open:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.15)] transition-all"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="text-base font-bold text-white">{f.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-400 group-open:bg-gradient-to-br group-open:from-emerald-500 group-open:to-teal-500 group-open:text-white transition-all">
                    <span className="text-lg leading-none group-open:hidden font-bold">
                      +
                    </span>
                    <span className="text-lg leading-none hidden group-open:inline font-bold">
                      −
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-slate-400 border-t border-white/5 pt-4">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-10 sm:p-14 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.55)] relative group/cta">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(56,189,248,0.12),_transparent_50%)]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between z-10">
            <div className="max-w-xl">
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Ready to speak with an advisor?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-400">
                Send us an email and we&apos;ll match you with the right expert
                for your needs.
              </p>
            </div>
            <a
              href={GMAIL_COMPOSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition-all hover:brightness-110 hover:-translate-y-0.5"
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
