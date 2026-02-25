"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);

      await signInWithEmailAndPassword(auth, email, password);

      router.push("/dashboard");
    } catch (loginError: unknown) {
      if (
        typeof loginError === "object" &&
        loginError &&
        "message" in loginError
      ) {
        setError(String((loginError as { message: unknown }).message));
      } else {
        setError("Something went wrong while signing in.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-16 md:py-24">
        <section className="grid w-full max-w-3xl gap-8 rounded-3xl border border-white/5 bg-slate-950/80 p-6 sm:p-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
              Account Login
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Access your investment dashboard.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              Sign in to monitor performance, review statements, manage funding,
              and update your preferences. For your security, please avoid
              logging in from shared or public devices.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>Multi-factor authentication available for all accounts.</li>
              <li>Real-time portfolio values and performance attribution.</li>
              <li>Secure messaging with your advisory team.</li>
            </ul>
            <p className="mt-4 text-[11px] text-slate-400">
              If you suspect unauthorized access, contact our support team
              immediately so we can secure your account.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-600 bg-slate-900/80 p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="login-email"
                  className="text-xs font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="text-xs font-medium text-slate-200"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(event) =>
                      setRememberDevice(event.target.checked)
                    }
                    className="h-3.5 w-3.5 rounded border border-slate-600 bg-slate-900 text-emerald-400 focus:ring-0"
                  />
                  <span>Remember this device</span>
                </label>
                <button
                  type="button"
                  className="font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Forgot password?
                </button>
              </div>
              {error ? (
                <p className="text-xs font-medium text-red-400">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <p className="mt-3 text-[11px] text-slate-400">
              For demonstration purposes, this page uses Firebase Authentication
              with email and password.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
