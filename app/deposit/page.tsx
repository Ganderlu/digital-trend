"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Wallet,
  Copy,
  CheckCircle,
  AlertCircle,
  QrCode as QrCodeIcon,
  ArrowRight,
  Bitcoin,
  DollarSign,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// Mock wallet addresses removed - fetching from Firestore

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  balance?: number;
};

export default function DepositPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Form State
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<
    "BTC" | "ETH" | "USDT"
  >("BTC");
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Amount, 2: Payment, 3: Success
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Wallet addresses state
  const [walletAddresses, setWalletAddresses] = useState({
    BTC: "",
    ETH: "",
    USDT: "",
  });

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const fetchSettings = () => {
      try {
        const unsubscribeSettings = onSnapshot(
          doc(db, "settings", "global"),
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              setWalletAddresses({
                BTC: data.walletBTC || "",
                ETH: data.walletETH || "",
                USDT: data.walletUSDT || "",
              });
            } else {
              // Fallback if settings not initialized
              console.warn("Global settings not found, using defaults");
              setWalletAddresses({
                BTC: "1J1RpsaG7BoQu6pmxQ2j2WC5H6zni6eUKh",
                ETH: "0x031d48c14d06470edd37b8c23df4d179a855f48c",
                USDT: "TAGehSxJe15bB81JmP7gnuHLJTwZGaWZ2K",
              });
            }
          },
          (error) => {
            console.error("Error fetching settings:", error);
          },
        );
        return unsubscribeSettings;
      } catch (error) {
        console.error("Error setting up settings listener:", error);
        return () => {};
      }
    };

    const unsubscribeSettings = fetchSettings();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
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

    return () => {
      unsubscribeSettings();
      unsubscribeAuth();
    };
  }, [router]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddresses[selectedCurrency]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextStep = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid deposit amount.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmitDeposit = async () => {
    if (!user) return;
    setError("");
    setSubmitting(true);

    try {
      const db = getFirebaseFirestore();

      // Create deposit record
      await addDoc(collection(db, "deposits"), {
        userId: user.uid,
        userEmail: user.email,
        amount: parseFloat(amount),
        currency: selectedCurrency,
        status: "pending",
        walletAddress: walletAddresses[selectedCurrency],
        transactionHash: txHash || "Not provided",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update user stats (optional - usually done by backend/admin upon approval)
      // For now we just record the request

      setStep(3);
    } catch (err) {
      console.error("Error creating deposit:", err);
      setError("Failed to submit deposit request. Please try again.");
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
          <h1 className="text-2xl font-bold text-slate-50">Make a Deposit!</h1>
          <p className="mt-2 text-slate-400">
            Fund your account securely using cryptocurrency.
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
                Payment
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
          {/* STEP 1: Select Amount & Currency */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <label className="mb-4 block text-sm font-medium text-slate-300">
                  Select Currency
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { id: "BTC", name: "Bitcoin", icon: Bitcoin },
                    { id: "ETH", name: "Ethereum", icon: Wallet }, // Using generic wallet icon for ETH if no specific one
                    { id: "USDT", name: "Tether (TRC20)", icon: DollarSign },
                  ].map((currency) => (
                    <button
                      key={currency.id}
                      onClick={() => setSelectedCurrency(currency.id as any)}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-6 transition-all ${
                        selectedCurrency === currency.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50"
                          : "border-white/5 bg-slate-950/50 text-slate-400 hover:border-emerald-500/30 hover:bg-white/5"
                      }`}
                    >
                      <currency.icon className="h-8 w-8" />
                      <span className="font-semibold">{currency.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Enter Amount (USD)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Min. $50.00"
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

          {/* STEP 2: Payment Details */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-200">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    Please send exactly{" "}
                    <strong>${parseFloat(amount).toFixed(2)}</strong> worth of{" "}
                    <strong>{selectedCurrency}</strong> to the address below.
                    Ensure you are using the correct network to avoid loss of
                    funds.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-slate-950 p-8 text-center">
                <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-white p-2">
                  <QRCodeSVG
                    value={walletAddresses[selectedCurrency] || "Loading..."}
                    size={170}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="w-full max-w-md">
                  <p className="mb-2 text-sm font-medium text-slate-400">
                    {selectedCurrency} Wallet Address
                  </p>
                  <div className="relative flex items-center rounded-xl border border-white/10 bg-slate-900 p-1 pr-1">
                    <code className="flex-1 overflow-x-auto px-4 py-3 text-sm font-mono text-emerald-400">
                      {walletAddresses[selectedCurrency]}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                      title="Copy Address"
                    >
                      {copied ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Transaction Hash / ID (Optional)
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste your transaction ID here for faster verification"
                  className="block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-50 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 rounded-xl border border-white/10 bg-transparent py-4 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitDeposit}
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-base font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "I Have Made Payment"}
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
                Deposit Submitted!
              </h2>
              <p className="mt-4 max-w-md text-slate-400">
                Your deposit request for{" "}
                <strong>${parseFloat(amount).toFixed(2)}</strong> via{" "}
                <strong>{selectedCurrency}</strong> has been received. Your
                balance will be updated once the transaction is confirmed on the
                blockchain.
              </p>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="rounded-xl border border-white/10 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setAmount("");
                    setTxHash("");
                  }}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  Make Another Deposit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
