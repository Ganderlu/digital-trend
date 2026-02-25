"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Wallet,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Bitcoin,
  DollarSign,
  Landmark,
} from "lucide-react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  balance?: number;
};

export default function WithdrawPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form State
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<
    "BTC" | "ETH" | "USDT" | "BANK"
  >("BTC");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
  });
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Amount & Method, 2: Destination, 3: Success
  const [error, setError] = useState("");

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

  const handleNextStep = () => {
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (
      profile?.balance !== undefined &&
      parseFloat(amount) > profile.balance
    ) {
      setError(
        "Insufficient funds. Please enter an amount within your available balance.",
      );
      return;
    }

    setStep(2);
  };

  const handleSubmitWithdrawal = async () => {
    if (!user) return;
    setError("");

    // Validation
    if (selectedMethod === "BANK") {
      if (
        !bankDetails.bankName ||
        !bankDetails.accountNumber ||
        !bankDetails.accountName
      ) {
        setError("Please fill in all required bank details.");
        return;
      }
    } else {
      if (!destinationAddress || destinationAddress.length < 10) {
        setError("Please enter a valid wallet address.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const db = getFirebaseFirestore();

      const withdrawalData = {
        userId: user.uid,
        userEmail: user.email,
        amount: parseFloat(amount),
        method: selectedMethod,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        details:
          selectedMethod === "BANK"
            ? bankDetails
            : { walletAddress: destinationAddress },
      };

      // Create withdrawal record
      await addDoc(collection(db, "withdrawals"), withdrawalData);

      // In a real app, you might deduct the balance immediately or mark it as "frozen"
      // via a Cloud Function or backend API to prevent double-spending.
      // For this frontend-only demo, we just record the request.

      setStep(3);
    } catch (err) {
      console.error("Error creating withdrawal:", err);
      setError("Failed to submit withdrawal request. Please try again.");
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
      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-50">
            Request Withdrawal
          </h1>
          <p className="mt-2 text-slate-400">
            Withdraw your funds securely to your wallet or bank account.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex w-full max-w-lg items-center justify-between">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                  step >= 1
                    ? "border-emerald-500 bg-emerald-500 text-slate-950"
                    : "border-slate-700 bg-slate-800 text-slate-500"
                }`}
              >
                1
              </div>
              <span
                className={`text-xs ${step >= 1 ? "text-emerald-400" : "text-slate-600"}`}
              >
                Amount
              </span>
            </div>
            <div
              className={`h-0.5 flex-1 transition-colors ${step >= 2 ? "bg-emerald-500" : "bg-slate-800"}`}
            />

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                  step >= 2
                    ? "border-emerald-500 bg-emerald-500 text-slate-950"
                    : "border-slate-700 bg-slate-800 text-slate-500"
                }`}
              >
                2
              </div>
              <span
                className={`text-xs ${step >= 2 ? "text-emerald-400" : "text-slate-600"}`}
              >
                Details
              </span>
            </div>
            <div
              className={`h-0.5 flex-1 transition-colors ${step >= 3 ? "bg-emerald-500" : "bg-slate-800"}`}
            />

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                  step >= 3
                    ? "border-emerald-500 bg-emerald-500 text-slate-950"
                    : "border-slate-700 bg-slate-800 text-slate-500"
                }`}
              >
                3
              </div>
              <span
                className={`text-xs ${step >= 3 ? "text-emerald-400" : "text-slate-600"}`}
              >
                Confirm
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-xl lg:p-10">
          {/* STEP 1: Select Amount & Method */}
          {step === 1 && (
            <div className="space-y-8">
              {/* Available Balance Display */}
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Available Balance
                  </p>
                  <p className="text-2xl font-bold text-slate-50">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(profile?.balance || 0)}
                  </p>
                </div>
                <button
                  onClick={() => setAmount((profile?.balance || 0).toString())}
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Max Amount
                </button>
              </div>

              <div>
                <label className="mb-4 block text-sm font-medium text-slate-300">
                  Select Withdrawal Method
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { id: "BTC", name: "Bitcoin", icon: Bitcoin },
                    { id: "ETH", name: "Ethereum", icon: Wallet },
                    { id: "USDT", name: "Tether", icon: DollarSign },
                    { id: "BANK", name: "Bank Transfer", icon: Landmark },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all ${
                        selectedMethod === method.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50"
                          : "border-white/5 bg-slate-950/50 text-slate-400 hover:border-emerald-500/30 hover:bg-white/5"
                      }`}
                    >
                      <method.icon className="h-6 w-6" />
                      <span className="font-semibold">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Withdrawal Amount (USD)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="block w-full rounded-xl border border-white/10 bg-slate-950 py-4 pl-12 pr-4 text-lg text-slate-50 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {error && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleNextStep}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-base font-bold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* STEP 2: Destination Details */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-200">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    Please ensure your details are correct. Withdrawals to
                    incorrect addresses cannot be reversed.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-50">
                  {selectedMethod === "BANK"
                    ? "Bank Account Details"
                    : "Wallet Address"}
                </h3>

                {selectedMethod === "BANK" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankDetails.bankName}
                        onChange={(e) =>
                          setBankDetails({
                            ...bankDetails,
                            bankName: e.target.value,
                          })
                        }
                        className="block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={bankDetails.accountName}
                        onChange={(e) =>
                          setBankDetails({
                            ...bankDetails,
                            accountName: e.target.value,
                          })
                        }
                        className="block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Account Number / IBAN
                      </label>
                      <input
                        type="text"
                        value={bankDetails.accountNumber}
                        onChange={(e) =>
                          setBankDetails({
                            ...bankDetails,
                            accountNumber: e.target.value,
                          })
                        }
                        className="block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Routing / Swift Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={bankDetails.routingNumber}
                        onChange={(e) =>
                          setBankDetails({
                            ...bankDetails,
                            routingNumber: e.target.value,
                          })
                        }
                        className="block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-400">
                      Your {selectedMethod} Wallet Address
                    </label>
                    <input
                      type="text"
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      placeholder={`Enter your ${selectedMethod} address`}
                      className="block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-50 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {error && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 rounded-xl border border-white/10 bg-transparent py-4 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitWithdrawal}
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-base font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Submit Request"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Withdrawal Requested!
              </h2>
              <p className="mt-4 max-w-md text-slate-400">
                Your withdrawal request for{" "}
                <strong>${parseFloat(amount).toFixed(2)}</strong> via{" "}
                <strong>{selectedMethod}</strong> has been submitted.
                <br className="my-2" />
                Our team will process your request shortly. You can track the
                status in your dashboard.
              </p>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="rounded-xl border border-white/10 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setAmount("");
                    setDestinationAddress("");
                    setBankDetails({
                      bankName: "",
                      accountName: "",
                      accountNumber: "",
                      routingNumber: "",
                    });
                  }}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  New Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
