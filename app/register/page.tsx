"use client";

import { useState, type FormEvent, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore } from "@/lib/firebaseClient";

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [referredBy, setReferredBy] = useState<string | null>(null);

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferredBy(refCode);
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!acceptedTerms) {
      setError("You must accept the terms and policies to create an account.");
      return;
    }
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      // Fetch geolocation data
      let locationData = {};
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          locationData = {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country_name,
            provider: data.org,
          };
        }
      } catch (geoError) {
        console.error("Geolocation fetch failed:", geoError);
      }

      const auth = getFirebaseAuth();
      const db = getFirebaseFirestore();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        email,
        investmentGoal: goal,
        createdAt: serverTimestamp(),
        referredBy: referredBy || null,
        activeDeposits: 0,
        totalInvested: 0,
        referralEarnings: 0,
        balance: 0,
        registrationLocation: locationData,
      });

      try {
        const token = await userCredential.user.getIdToken();
        await fetch("/api/notifications/welcome", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {}

      setSuccess("Account created successfully! Redirecting to login...");
      setPassword("");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (registrationError: unknown) {
      if (
        typeof registrationError === "object" &&
        registrationError &&
        "message" in registrationError
      ) {
        setError(String((registrationError as { message: unknown }).message));
      } else {
        setError("Something went wrong while creating your account.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white min-h-screen transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-16 md:py-24">
        <section className="grid w-full max-w-4xl gap-12 rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8 sm:p-12 md:grid-cols-[1.1fr_0.9fr] shadow-xl transition-colors duration-300">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
              Open Your Account
            </p>
            <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Get started with Digital-trend in minutes.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Create a secure account, tell us about your time horizon and risk
              tolerance, and we will recommend a portfolio tailored to your
              goals.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  Digital onboarding with secure verification
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  Seamless bank connectivity for funding
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  Flexible preference management
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors duration-300">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="register-first-name"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    First Name
                  </label>
                  <input
                    id="register-first-name"
                    type="text"
                    placeholder="Alex"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-last-name"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    Last Name
                  </label>
                  <input
                    id="register-last-name"
                    type="text"
                    placeholder="Morgan"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="register-email"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Email Address
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="register-password"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-goal"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    Investment Goal
                  </label>
                  <select
                    id="register-goal"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500/50 focus:bg-white appearance-none"
                    value={goal}
                    onChange={(event) => setGoal(event.target.value)}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="build-wealth">Build long-term wealth</option>
                    <option value="retirement">Plan for retirement</option>
                    <option value="income">Generate income</option>
                    <option value="preserve-capital">
                      Preserve capital with lower risk
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-200 bg-slate-50 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="terms">
                  I agree to the platform&apos;s terms and policies.
                </label>
              </div>
              {error && (
                <p className="text-xs font-bold text-red-600">{error}</p>
              )}
              {success && (
                <p className="text-xs font-bold text-emerald-600">{success}</p>
              )}
              {submitting ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                  <p className="text-xs font-bold text-emerald-600">
                    Creating your secure account...
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-emerald-600 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                >
                  Create Account
                </button>
              )}
            </form>
            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
