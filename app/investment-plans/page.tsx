"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  balance?: number;
};

type InvestmentPlan = {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roi: string;
  duration: string;
  features: string[];
  color: string;
  icon: any;
  popular?: boolean;
};

const PLANS: InvestmentPlan[] = [
  {
    id: "starter",
    name: "Starter Plan",
    minAmount: 50,
    maxAmount: 999,
    roi: "5% Daily",
    duration: "7 Days",
    features: ["24/7 Support", "Secure Investment", "Instant Withdrawal"],
    color: "emerald",
    icon: Zap,
  },
  {
    id: "premium",
    name: "Premium Plan",
    minAmount: 1000,
    maxAmount: 4999,
    roi: "10% Daily",
    duration: "14 Days",
    features: [
      "Priority Support",
      "Advanced Analytics",
      "Compounding Available",
    ],
    color: "amber",
    icon: TrendingUp,
    popular: true,
  },
  {
    id: "business",
    name: "Business Plan",
    minAmount: 5000,
    maxAmount: 50000,
    roi: "20% Daily",
    duration: "30 Days",
    features: ["Dedicated Manager", "VIP Access", "Capital Protection"],
    color: "violet",
    icon: ShieldCheck,
  },
];

export default function InvestmentPlansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Modal / Form State
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSelectPlan = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setAmount(plan.minAmount.toString());
    setError("");
    setSuccess(false);
  };

  const handleInvest = async () => {
    if (!user || !selectedPlan || !profile) return;
    setError("");

    const investAmount = parseFloat(amount);

    if (isNaN(investAmount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (investAmount < selectedPlan.minAmount) {
      setError(
        `Minimum investment for this plan is $${selectedPlan.minAmount}`,
      );
      return;
    }

    if (investAmount > selectedPlan.maxAmount) {
      setError(
        `Maximum investment for this plan is $${selectedPlan.maxAmount}`,
      );
      return;
    }

    if ((profile.balance || 0) < investAmount) {
      setError("Insufficient balance. Please deposit funds first.");
      return;
    }

    setSubmitting(true);

    try {
      const db = getFirebaseFirestore();

      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await transaction.get(userRef);

        if (!userSnapshot.exists()) {
          throw "User does not exist!";
        }

        const currentBalance = userSnapshot.data().balance || 0;
        if (currentBalance < investAmount) {
          throw "Insufficient balance!";
        }

        // Deduct balance
        transaction.update(userRef, {
          balance: currentBalance - investAmount,
          activeDeposits:
            (userSnapshot.data().activeDeposits || 0) + investAmount,
        });

        // Create investment record
        const investmentRef = doc(collection(db, "investments"));
        transaction.set(investmentRef, {
          userId: user.uid,
          userEmail: user.email,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          amount: investAmount,
          roi: selectedPlan.roi,
          startDate: serverTimestamp(),
          status: "active",
          createdAt: serverTimestamp(),
        });
      });

      // Update local state to reflect new balance immediately
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              balance: (prev.balance || 0) - investAmount,
            }
          : null,
      );

      setSuccess(true);
    } catch (err: any) {
      console.error("Investment error:", err);
      setError(
        err === "Insufficient balance!"
          ? err
          : "Investment failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">
              Investment Plans
            </h1>
            <p className="mt-2 text-slate-400">
              Choose a plan that suits your financial goals.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-400">Your Balance</p>
            <p className="text-2xl font-bold text-emerald-400">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(profile?.balance || 0)}
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:scale-105 ${
                plan.popular
                  ? "border-amber-500/50 bg-slate-900 shadow-2xl shadow-amber-900/20"
                  : "border-white/5 bg-slate-900 shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-slate-950">
                  Most Popular
                </div>
              )}

              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${
                  plan.color === "emerald"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : plan.color === "amber"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-violet-500/10 text-violet-400"
                }`}
              >
                <plan.icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-bold text-slate-50">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-bold ${
                    plan.color === "emerald"
                      ? "text-emerald-400"
                      : plan.color === "amber"
                        ? "text-amber-400"
                        : "text-violet-400"
                  }`}
                >
                  {plan.roi}
                </span>
              </div>
              <p className="text-sm text-slate-400">For {plan.duration}</p>

              <div className="my-8 h-px bg-white/5" />

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <CheckCircle
                      className={`h-5 w-5 ${
                        plan.color === "emerald"
                          ? "text-emerald-500"
                          : plan.color === "amber"
                            ? "text-amber-500"
                            : "text-violet-500"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle
                    className={`h-5 w-5 ${
                      plan.color === "emerald"
                        ? "text-emerald-500"
                        : plan.color === "amber"
                          ? "text-amber-500"
                          : "text-violet-500"
                    }`}
                  />
                  Min: ${plan.minAmount}
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle
                    className={`h-5 w-5 ${
                      plan.color === "emerald"
                        ? "text-emerald-500"
                        : plan.color === "amber"
                          ? "text-amber-500"
                          : "text-violet-500"
                    }`}
                  />
                  Max: ${plan.maxAmount}
                </li>
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full rounded-xl py-3 text-sm font-bold text-white transition-colors ${
                  plan.color === "emerald"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : plan.color === "amber"
                      ? "bg-amber-600 hover:bg-amber-500"
                      : "bg-violet-600 hover:bg-violet-500"
                }`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        {/* Investment Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              {!success ? (
                <>
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-50">
                        Invest in {selectedPlan.name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Daily ROI:{" "}
                        <span className="text-emerald-400">
                          {selectedPlan.roi}
                        </span>{" "}
                        • Duration: {selectedPlan.duration}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Investment Amount ($)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-lg text-slate-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder={`Min: $${selectedPlan.minAmount}`}
                      />
                      <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span>Min: ${selectedPlan.minAmount}</span>
                        <span>Max: ${selectedPlan.maxAmount}</span>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 flex gap-2 items-center">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}

                    <div className="rounded-xl bg-slate-950 p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total Return</span>
                        <span className="font-semibold text-emerald-400">
                          {amount && !isNaN(parseFloat(amount))
                            ? `${parseFloat(selectedPlan.roi) * parseInt(selectedPlan.duration.split(" ")[0])}%`
                            : "0%"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 rounded-xl border border-white/10 bg-transparent py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleInvest}
                      disabled={submitting}
                      className="flex-[2] rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {submitting ? "Processing..." : "Confirm Investment"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-emerald-500/20 p-4 ring-4 ring-emerald-500/10">
                      <CheckCircle className="h-12 w-12 text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-slate-50">
                    Investment Active!
                  </h3>
                  <p className="mb-6 text-slate-400">
                    You have successfully invested{" "}
                    <strong>${parseFloat(amount).toFixed(2)}</strong> in the{" "}
                    {selectedPlan.name}.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedPlan(null);
                      setSuccess(false);
                      router.push("/dashboard");
                    }}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
