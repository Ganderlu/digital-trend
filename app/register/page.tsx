"use client";

import { useState, type FormEvent, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";

function RegisterForm() {
  const searchParams = useSearchParams();
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
      const app = getFirebaseApp();
      const auth = getAuth(app);
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
      });

      setSuccess("Account created successfully. You can now log in.");
      setPassword("");
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
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-16 md:py-24">
        <section className="grid w-full max-w-3xl gap-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-slate-950/80 p-6 sm:p-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
              Open Your Account
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Get started with FutureInvest in minutes.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
              Create a secure account, tell us about your time horizon and risk
              tolerance, and we will recommend a portfolio tailored to your
              goals.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-100">
              <li>Digital onboarding with secure identity verification.</li>
              <li>Connect your bank for seamless funding and withdrawals.</li>
              <li>Update preferences anytime from your dashboard.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-500/40 bg-slate-950/70 p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="register-first-name"
                    className="text-xs font-medium text-slate-200"
                  >
                    First Name
                  </label>
                  <input
                    id="register-first-name"
                    type="text"
                    placeholder="Alex"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="register-last-name"
                    className="text-xs font-medium text-slate-200"
                  >
                    Last Name
                  </label>
                  <input
                    id="register-last-name"
                    type="text"
                    placeholder="Morgan"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="register-email"
                  className="text-xs font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="register-password"
                    className="text-xs font-medium text-slate-200"
                  >
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="register-goal"
                    className="text-xs font-medium text-slate-200"
                  >
                    Investment Goal
                  </label>
                  <select
                    id="register-goal"
                    className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 focus:border-emerald-400 focus:ring-2"
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
              <div className="flex items-start gap-2 text-[11px] text-slate-300">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border border-slate-600 bg-slate-900 text-emerald-400 focus:ring-0"
                />
                <label htmlFor="terms">
                  I confirm that I have read and agree to the platform&apos;s
                  terms, disclosures, and privacy policy.
                </label>
              </div>
              {error ? (
                <p className="text-xs font-medium text-red-400">{error}</p>
              ) : null}
              {success ? (
                <p className="text-xs font-medium text-emerald-300">
                  {success}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>
            <p className="mt-3 text-[11px] text-slate-400">
              This page is a visual prototype. In a production environment, this
              form would submit through a secure onboarding workflow and
              identity verification process.
            </p>
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
