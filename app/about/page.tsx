"use client";

import Image from "next/image";
import { Globe, Users, FolderKanban, UserCheck, ShieldCheck, TrendingUp, BarChart3, Briefcase } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
          alt="Modern Financial Building"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-500 mb-4">
            Discover Our Story
          </h1>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl">
            Driving Financial Innovation Since 2012
          </h2>
        </div>
      </div>

      {/* Main Narrative Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-6">
              Who We Are
            </p>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-8">
              A Global Leader in Wealth Management
            </h3>
            <div className="space-y-6 text-lg leading-relaxed text-slate-600">
              <p>
                Digital-trend is a premier independent wealth management firm dedicated to helping families, individuals, and institutions build resilient, future-proof portfolios. Our investment philosophy blends rigorous macro research with advanced risk modeling.
              </p>
              <p>
                Founded in 2012, we recognized that the traditional financial landscape was evolving. Our mission was clear: to provide institutional-grade investment strategies to a broader global audience, ensuring transparency, security, and consistent growth across all market cycles.
              </p>
              <p>
                Today, we manage over $750M in assets for clients in 47 countries, operating under a strict fiduciary standard that ensures your interests always come first.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[500px] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-100 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070"
                alt="Our Professional Team"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-10 -left-10 hidden rounded-3xl bg-emerald-600 p-8 text-white shadow-xl md:block">
              <div className="text-4xl font-black">12+</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-80">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Approach Section */}
      <div className="bg-slate-50 py-24 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
              Our Methodology
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Disciplined Strategies for Long-Term Growth
            </h2>
            <p className="mt-4 text-slate-600">
              We leverage proprietary algorithms and real-time market data to identify asymmetric risk-reward opportunities across global markets.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Data-Driven Research</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                Our team utilizes sophisticated software to analyze daily market noise, forecasts, and announcements, identifying high-conviction opportunities before they become mainstream.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Risk Management</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                Capital preservation is our first priority. We implement multi-layered risk controls and stress testing to protect portfolios against extreme market volatility.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Strategic Allocation</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                We build diversified portfolios across global equities, fixed income, and alternative assets, tailored precisely to each client's unique time horizon and goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Quote Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="rounded-[3rem] bg-slate-900 p-12 md:p-20 relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" fill="none" viewBox="0 0 100 100">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)"/>
            </svg>
          </div>
          
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_auto_1fr] items-center text-center lg:text-left">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6 italic leading-tight">
                "Our mission is to democratize institutional-grade investing, providing the transparency and security every investor deserves."
              </h3>
              <div className="h-1 w-20 bg-emerald-500 mx-auto lg:mx-0 mb-6" />
              <div className="text-white">
                <div className="text-xl font-bold">Michael Sterling</div>
                <div className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-1">Founder & CEO</div>
              </div>
            </div>
            <div className="hidden lg:block h-32 w-px bg-white/20" />
            <div className="grid grid-cols-2 gap-8 text-white">
              <div className="flex flex-col gap-2">
                <div className="text-4xl font-black text-emerald-500">47+</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-60">Countries Represented</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-4xl font-black text-emerald-500">$750M+</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-60">Assets Under Management</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-4xl font-black text-emerald-500">110k+</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-60">Global Clients</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-4xl font-black text-emerald-500">30+</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-60">Expert Team Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fiduciary Section */}
      <div className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative h-[400px] w-full overflow-hidden rounded-[2.5rem] border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070"
              alt="Commitment to Excellence"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
              Our Standard
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-6">
              A Fiduciary Commitment to Your Success
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              We operate under a strict fiduciary standard, which means we are legally and ethically bound to act in your best interests at all times. This commitment is the foundation of our long-term client relationships.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-800 font-bold">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                Absolute Fee Transparency
              </li>
              <li className="flex items-center gap-3 text-slate-800 font-bold">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                No Proprietary Product Conflicts
              </li>
              <li className="flex items-center gap-3 text-slate-800 font-bold">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                Aligned Performance Incentives
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
