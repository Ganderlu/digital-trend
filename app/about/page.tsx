"use client";

import Image from "next/image";
import { Globe, Users, FolderKanban, UserCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Header Section */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-sm font-bold uppercase tracking-wider text-emerald-500">
            Our Core Values
          </h1>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-emerald-500">/</span>
            <span className="text-slate-100">About Us</span>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text Content */}
          <div className="grid gap-8 text-sm leading-7 text-slate-400 md:grid-cols-2 md:gap-12 lg:grid-cols-1 xl:grid-cols-2">
            <p className="text-justify">
              FutureInvest is a leading financial institution and asset management
              firm dedicated to continuous portfolio growth by offering our
              clients maximum returns on their investments. We are committed to
              providing a secure and prosperous financial future for all our
              partners through disciplined strategies and innovative solutions.
            </p>
            <p className="text-justify">
              We are financial managers and experts constantly ready to assist you
              in making positive investment decisions, earning as much return as
              possible from selected investment instruments and markets. We aim
              for perfection in digital assets and traditional markets,
              guaranteeing a safe space to invest your finances and receive solid
              growth progress on your portfolio. We utilize the most developed and
              innovative investment strategies designed to produce and promote
              long-term financial profits.
            </p>
          </div>

          {/* Image Content */}
          <div className="relative h-[300px] w-full overflow-hidden rounded-2xl bg-slate-900 md:h-[400px]">
            {/* Using a high-quality professional placeholder image */}
            <Image
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3"
              alt="Professional Financial Advisor"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-emerald-500">
              What We Do
            </p>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Our mission and values
            </h2>
            <p className="text-sm leading-7 text-slate-400 text-justify">
              We are internally managed and invest in a diversified portfolio of
              companies listed on global exchanges. FutureInvest uses
              sophisticated software to help collate and analyze vast amounts of
              information and daily market noise, including forecasts and
              recommendations by brokers, company earnings guidance, and other
              announcements and news events. This enables consensus estimates to
              be generated for comparison with our own forecasts and valuations,
              ensuring we identify the best opportunities for our clients.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 border-l border-emerald-500/20 pl-8 lg:pl-12">
            <div className="font-serif text-4xl italic text-slate-200">
              Michael Sterling
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100">
                Michael Sterling
              </div>
              <div className="text-xs font-medium uppercase tracking-wider text-emerald-500">
                Founder & CEO
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-white/5 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {/* Stat 1 */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Countries
                </p>
                <p className="text-2xl font-bold text-slate-100">47+</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Clients
                </p>
                <p className="text-2xl font-bold text-slate-100">110+</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <FolderKanban className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Projects
                </p>
                <p className="text-2xl font-bold text-slate-100">250+</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Team Members
                </p>
                <p className="text-2xl font-bold text-slate-100">30+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
