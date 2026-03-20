"use client";

import { useState, type FormEvent } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebaseClient";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const db = getFirebaseFirestore();
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        goal: goal || "Not specified",
        message,
        createdAt: serverTimestamp(),
        status: "new",
      });

      setSuccess(true);
      setName("");
      setEmail("");
      setGoal("");
      setMessage("");
    } catch (err: unknown) {
      console.error("Error submitting contact form:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white min-h-screen transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section className="grid gap-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] shadow-sm transition-colors duration-300">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Contact Us
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Speak with a Digital-trend advisor.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Whether you are just starting to invest or looking to refine an
              existing strategy, our team is available to discuss your
              objectives, constraints, and questions. Share a few details and we
              will connect you with the right advisor.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <p>
                Email:{" "}
                <a
                  href="mailto:advisors@Digital-trend.com"
                  className="text-emerald-600 underline underline-offset-4 hover:text-emerald-500"
                >
                  advisors@Digital-trend.com
                </a>
              </p>
              <p>Phone: +1 (555) 012-9876</p>
              <p>Office: 21st Floor, Financial District, New York, NY</p>
              <p className="text-xs text-slate-500">
                Calls may be recorded for training, monitoring, and regulatory
                purposes.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Quick Contact
            </p>
            {success ? (
              <div className="mt-8 flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Message Sent!
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Thank you for reaching out. An advisor will review your
                  request and get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-full bg-slate-800 px-6 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700 transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="text-xs font-medium text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-400/40 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-slate-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-400/40 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="goal"
                    className="text-xs font-medium text-slate-700"
                  >
                    Primary Goal
                  </label>
                  <select
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-400/40 focus:border-emerald-400 focus:ring-2"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="build-wealth">Build long-term wealth</option>
                    <option value="retirement">Plan for retirement</option>
                    <option value="preserve-capital">
                      Preserve capital with lower risk
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="text-xs font-medium text-slate-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Share a bit about your current situation and questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-400/40 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-xs font-medium text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Request a Call"
                  )}
                </button>
              </form>
            )}
            <p className="mt-3 text-[11px] text-slate-500">
              This form is for informational purposes only and does not
              constitute investment advice or an offer to buy or sell
              securities.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
