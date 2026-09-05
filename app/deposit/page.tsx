"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Wallet,
  Copy,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Bitcoin,
  DollarSign,
  Coins,
  Upload,
  FileCheck2,
  ShieldCheck,
  Clock,
  ChevronLeft,
  Image as ImageIcon,
  X,
  Eye,
  Sparkles,
  Shield,
  BadgeCheck,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  balance?: number;
};

const STEP_DEFS = [
  { n: 1, label: "Amount", desc: "Select deposit amount" },
  { n: 2, label: "Method", desc: "Choose payment method" },
  { n: 3, label: "Payment", desc: "Complete the transfer" },
  { n: 4, label: "Proof", desc: "Upload payment proof" },
  { n: 5, label: "Done", desc: "Confirmation" },
];

const AMOUNT_PRESETS = [200, 250, 500, 1000, 2500, 5000];

const CURRENCIES: {
  id: "BTC" | "ETH" | "USDT" | "XRP";
  name: string;
  network: string;
  icon: any;
  color: string;
}[] = [
  {
    id: "XRP",
    name: "XRP",
    network: "XRP Ledger",
    icon: Coins,
    color: "#23292F",
  },
  {
    id: "BTC",
    name: "Bitcoin",
    network: "Bitcoin Network",
    icon: Bitcoin,
    color: "#F7931A",
  },
  {
    id: "ETH",
    name: "Ethereum",
    network: "ERC-20 Network",
    icon: Wallet,
    color: "#627EEA",
  },
  {
    id: "USDT",
    name: "Tether",
    network: "TRC-20 (Tron)",
    icon: DollarSign,
    color: "#26A17B",
  },
];

const MIN_DEPOSIT = 200;

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {STEP_DEFS.map((s, idx) => {
          const active = current === s.n;
          const done = current > s.n;
          const last = idx === STEP_DEFS.length - 1;
          return (
            <div key={s.n} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                      done
                        ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30"
                        : active
                          ? "border-emerald-500 bg-slate-900 text-emerald-400 ring-4 ring-emerald-500/20"
                          : "border-slate-700 bg-slate-900 text-slate-600"
                    }`}
                  >
                    {done ? <CheckCircle className="h-5 w-5" /> : s.n}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-bold ${done ? "text-emerald-400" : active ? "text-slate-200" : "text-slate-600"}`}
                    >
                      {s.label}
                    </p>
                    <p
                      className={`mt-0.5 text-[10px] font-medium max-w-[90px] ${active ? "text-slate-400" : "text-slate-700"}`}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
                {!last && (
                  <div
                    className={`mx-2 mb-6 h-0.5 flex-1 rounded-full transition-colors ${
                      done ? "bg-emerald-500" : "bg-slate-800"
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DepositPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<
    "BTC" | "ETH" | "USDT" | "XRP"
  >("XRP");
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [walletAddresses, setWalletAddresses] = useState({
    BTC: "",
    ETH: "",
    USDT: "",
    XRP: "",
  });

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribeSettings = onSnapshot(
      doc(db, "settings", "global"),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setWalletAddresses({
            BTC: data.walletBTC || "",
            ETH: data.walletETH || "",
            USDT: data.walletUSDT || "",
            XRP: data.walletXRP || "",
          });
        } else {
          setWalletAddresses({
            BTC: "bc1qs9zg58ghyqhdzrps26frxtna5axn6vp2sy7nsp",
            ETH: "0x04234ab108a7A96Fcb8FEfB9BF912Bb7BeF77288",
            USDT: "TDRMaEmUL65rkx2Ms9oC4SDaxD5pqbVo8v",
            XRP: "rfjh4WfCbEmvVUAEp4D9FxYaZEpmS3fy4",
          });
        }
      },
      (error) => {
        if (
          error?.code === "permission-denied" ||
          error?.code === "unauthenticated"
        ) {
          return;
        }
        console.error("Error fetching settings:", error);
      },
    );

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        unsubscribeSettings();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("Proof file must be under 10MB.");
      return;
    }
    if (!/image|pdf/i.test(f.type)) {
      setError("Please upload an image or PDF file as proof.");
      return;
    }
    setProofFile(f);
    setError("");
    if (/image/i.test(f.type)) {
      const reader = new FileReader();
      reader.onload = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setProofPreview(null);
    }
  };

  const removeProof = () => {
    setProofFile(null);
    setProofPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateStep = (toStep: number): boolean => {
    setError("");
    if (toStep >= 2) {
      const amt = parseFloat(amount);
      if (!amount || !amt || amt <= 0) {
        setError("Please enter a valid deposit amount.");
        return false;
      }
      if (amt < MIN_DEPOSIT) {
        setError(`Minimum deposit is ${formatCurrency(MIN_DEPOSIT)}.`);
        return false;
      }
    }
    if (toStep >= 5) {
      if (!txHash.trim()) {
        setError("Please provide the Transaction ID / Hash for your payment.");
        return false;
      }
      if (!proofFile) {
        setError("Please upload proof of payment (screenshot or receipt).");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (validateStep(step + 1)) {
      setStep((s) => (s + 1) as any);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const back = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1) as any);
  };

  const handleSubmitDeposit = async () => {
    if (!user) return;
    if (!validateStep(5)) return;
    setError("");
    setSubmitting(true);

    try {
      const token = await user.getIdToken();

      let proofBase64 = proofPreview || "";
      if (proofFile && /pdf/i.test(proofFile.type)) {
        const arr = new FileReader();
        arr.readAsDataURL(proofFile);
        await new Promise((resolve) => (arr.onloadend = resolve));
        proofBase64 = arr.result as string;
      }

      const response = await fetch("/api/deposits/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: selectedCurrency,
          transactionHash: txHash,
          proofFileName: proofFile?.name,
          proofFileData: proofBase64,
          proofFileType: proofFile?.type,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to submit deposit request");
      }

      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error creating deposit:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit deposit request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCurDef = CURRENCIES.find((c) => c.id === selectedCurrency)!;
  const amtNum = parseFloat(amount) || 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading deposit...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl p-4 lg:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-50">
              Make a Deposit
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Fund your account securely. All deposits are confirmed within 30
              minutes.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Secured Channel
              </p>
              <p className="text-xs font-semibold text-slate-200">
                Balance: {formatCurrency(profile?.balance || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
          <StepIndicator current={step} />
        </div>

        {/* Security Notice */}
        {step < 5 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/[0.04] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-sky-300">Security Notice:</span>{" "}
              Always confirm the wallet address matches exactly. Funds sent to a
              wrong address are irrecoverable. Minimum deposit:{" "}
              <strong>{formatCurrency(MIN_DEPOSIT)}</strong>.
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 shadow-xl overflow-hidden">
          {step === 1 && (
            <div className="p-5 lg:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">
                    Step 1: Select Amount
                  </h2>
                  <p className="text-xs text-slate-500">
                    Choose how much you would like to deposit into your account.
                  </p>
                </div>
              </div>

              {/* Amount Presets */}
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick Amount
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
                  {AMOUNT_PRESETS.map((p) => {
                    const active = amount === p.toString();
                    return (
                      <button
                        key={p}
                        onClick={() => setAmount(p.toString())}
                        className={`rounded-xl py-3 text-sm font-bold transition-all ${
                          active
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40"
                            : "border border-white/5 bg-slate-950/60 text-slate-300 hover:border-emerald-500/30 hover:bg-white/[0.03]"
                        }`}
                      >
                        ${p.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Custom Amount (USD)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-slate-500">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min. ${formatCurrency(MIN_DEPOSIT)}`}
                    className="block w-full rounded-2xl border border-white/10 bg-slate-950 py-4.5 pl-14 pr-5 text-xl font-bold text-slate-50 placeholder-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-[58px]"
                  />
                </div>
                {error && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </p>
                )}
                <div className="mt-3 grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-xl border border-white/5 bg-slate-950/40 p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Min
                    </p>
                    <p className="text-sm font-bold text-slate-300 mt-0.5">
                      {formatCurrency(MIN_DEPOSIT)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-slate-950/40 p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Current
                    </p>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">
                      {amtNum > 0 ? formatCurrency(amtNum) : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-slate-950/40 p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      In Wallet
                    </p>
                    <p className="text-sm font-bold text-slate-300 mt-0.5">
                      {formatCurrency(profile?.balance || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-2">
                <button
                  onClick={next}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-[0.99]"
                >
                  Continue to Payment Method
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-5 lg:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      Step 2: Payment Method
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select your preferred cryptocurrency for this deposit.
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/5 bg-slate-950/60 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Depositing
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    {formatCurrency(amtNum)}
                  </span>
                </div>
              </div>

              {/* Currency Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CURRENCIES.map((cur) => {
                  const active = selectedCurrency === cur.id;
                  return (
                    <button
                      key={cur.id}
                      onClick={() => setSelectedCurrency(cur.id)}
                      className={`group relative flex items-center gap-4 rounded-2xl border p-4 lg:p-5 text-left transition-all ${
                        active
                          ? "border-emerald-500/40 bg-emerald-500/[0.06] ring-2 ring-emerald-500/20"
                          : "border-white/5 bg-slate-950/60 hover:border-white/10 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-md"
                        style={{
                          backgroundColor: `${cur.color}22`,
                          color: cur.color,
                          border: `1px solid ${cur.color}33`,
                        }}
                      >
                        <cur.icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-slate-100">
                            {cur.name}
                          </p>
                          {active && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              <CheckCircle className="h-2.5 w-2.5" />
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {cur.network}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Fast confirmation • Zero processing fees
                        </p>
                      </div>
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          active
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-700 group-hover:border-slate-600"
                        }`}
                      >
                        {active && (
                          <CheckCircle className="h-3.5 w-3.5 text-slate-950" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {error && (
                <p className="mt-2 flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}

              {/* Navigation */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={back}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5 sm:w-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={next}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-[0.99]"
                >
                  Proceed to Payment
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-5 lg:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border"
                  style={{
                    backgroundColor: `${selectedCurDef.color}22`,
                    color: selectedCurDef.color,
                    borderColor: `${selectedCurDef.color}33`,
                  }}
                >
                  <selectedCurDef.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">
                    Step 3: Make Payment
                  </h2>
                  <p className="text-xs text-slate-500">
                    Send exactly the stated amount via {selectedCurDef.network}.
                  </p>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                    Deposit Amount
                  </p>
                  <p className="mt-1.5 text-2xl font-bold text-slate-50">
                    {formatCurrency(amtNum)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    USD Equivalent
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Payment Method
                  </p>
                  <p className="mt-1.5 text-xl font-bold text-slate-100">
                    {selectedCurDef.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedCurDef.network}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">
                    Estimated Confirmation
                  </p>
                  <p className="mt-1.5 text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-400" />
                    10-30 min
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    After blockchain confirmations
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                  <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    <strong>Important:</strong> Send only{" "}
                    <strong>
                      {selectedCurDef.name} ({selectedCurDef.id})
                    </strong>{" "}
                    via <strong>{selectedCurDef.network}</strong> to the address
                    below. Sending any other coin or via a different network may
                    result in permanent loss of funds.
                  </div>
                </div>
              </div>

              {/* Wallet Address + QR */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-2 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white p-6 text-center">
                  <div className="aspect-square w-full max-w-[220px] flex items-center justify-center">
                    <QRCodeSVG
                      value={walletAddresses[selectedCurrency] || "Loading..."}
                      size={200}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[11px] font-bold text-slate-200">
                      Scan with wallet app
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {selectedCurDef.name} Wallet Address
                      </label>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Shield className="h-3 w-3 text-sky-400" />
                        Verified Address
                      </div>
                    </div>
                    <div className="relative flex items-center rounded-2xl border border-white/10 bg-slate-950 p-1">
                      <code className="flex-1 overflow-x-auto px-4 py-4 text-xs sm:text-sm font-mono text-emerald-400 break-all">
                        {walletAddresses[selectedCurrency]}
                      </code>
                      <button
                        onClick={handleCopyAddress}
                        className={`ml-1 shrink-0 rounded-xl px-4 py-3 font-semibold transition flex items-center gap-2 text-xs ${
                          copied
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="text-xs text-violet-200/80 leading-relaxed">
                        <p className="font-bold text-violet-200 mb-1">
                          After Sending:
                        </p>
                        <p>
                          1. Wait for at least 1 network confirmation.
                          <br />
                          2. Copy the transaction ID / hash from your wallet.
                          <br />
                          3. Take a clear screenshot of the successful
                          transaction.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={back}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5 sm:w-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={next}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.99]"
                >
                  I Have Sent the Payment
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-5 lg:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">
                    Step 4: Provide Proof of Payment
                  </h2>
                  <p className="text-xs text-slate-500">
                    This helps us verify your deposit faster. All information is
                    encrypted.
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                {[
                  {
                    l: "Amount",
                    v: formatCurrency(amtNum),
                    c: "text-emerald-400",
                  },
                  {
                    l: "Currency",
                    v: selectedCurDef.name,
                    c: "text-slate-200",
                  },
                  { l: "Network", v: selectedCurDef.id, c: "text-sky-400" },
                  { l: "Status", v: "Awaiting Proof", c: "text-amber-400" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {s.l}
                    </p>
                    <p className={`mt-1 text-sm font-bold ${s.c}`}>{s.v}</p>
                  </div>
                ))}
              </div>

              {/* Transaction Hash */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Transaction ID / Hash <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="e.g. 0x8a9d2e... or transaction ID from your wallet"
                  className="block w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-sm font-mono text-slate-50 placeholder-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <p className="mt-2 text-[11px] text-slate-500 flex items-start gap-1.5">
                  <Eye className="h-3 w-3 mt-0.5 shrink-0" />
                  This can be found in your wallet&apos;s transaction history.
                  It helps us locate your payment on the blockchain instantly.
                </p>
              </div>

              {/* Proof Upload */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Proof of Payment (Screenshot / Receipt){" "}
                  <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  {!proofFile ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-8 lg:p-10 text-center transition hover:border-emerald-500/50 hover:bg-emerald-500/[0.03] group"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 group-hover:bg-emerald-500/15 group-hover:text-emerald-400 transition">
                          <Upload className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200 group-hover:text-emerald-300">
                            Click to upload proof of payment
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            PNG, JPG, WEBP or PDF • Max 10MB • Clear screenshot
                            of successful transfer
                          </p>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                      <div className="flex items-start gap-4">
                        {proofPreview ? (
                          <div className="relative shrink-0">
                            <img
                              src={proofPreview}
                              alt="Proof preview"
                              className="h-28 w-28 rounded-xl border border-white/10 object-cover bg-slate-800"
                            />
                          </div>
                        ) : (
                          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-500">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                            <p className="text-sm font-bold text-slate-100 truncate">
                              {proofFile.name}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {(proofFile.size / 1024).toFixed(1)} KB •{" "}
                            {proofFile.type || "Unknown type"}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-white/5 flex items-center gap-1.5"
                            >
                              <Upload className="h-3 w-3" />
                              Replace
                            </button>
                            <button
                              onClick={removeProof}
                              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 flex items-center gap-1.5"
                            >
                              <X className="h-3 w-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {error && (
                <p className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}

              {/* Checklist */}
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Before submitting, confirm you have:
                </p>
                {[
                  `Sent exactly ${formatCurrency(amtNum)} via ${selectedCurDef.name} on ${selectedCurDef.network}`,
                  "Copied and pasted the transaction hash correctly above",
                  "Uploaded a clear screenshot showing amount, address, and TX ID",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-400">{t}</p>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={back}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5 sm:w-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={handleSubmitDeposit}
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting Deposit...
                    </>
                  ) : (
                    <>
                      <FileCheck2 className="h-5 w-5" />
                      Submit & Verify Deposit
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="p-6 lg:p-12">
              <div className="flex flex-col items-center text-center max-w-xl mx-auto">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                    <CheckCircle className="h-14 w-14" />
                  </div>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-50">
                  Deposit Submitted Successfully!
                </h2>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  Your deposit request for{" "}
                  <strong className="text-emerald-400">
                    {formatCurrency(amtNum)}
                  </strong>{" "}
                  via{" "}
                  <strong className="text-slate-200">
                    {selectedCurDef.name}
                  </strong>{" "}
                  has been received. Our team is verifying your transaction on
                  the blockchain and the proof you uploaded.
                </p>

                {/* Confirmation Card */}
                <div className="mt-8 w-full rounded-2xl border border-white/5 bg-slate-950/60 p-5 text-left">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-violet-400" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Deposit Reference
                      </span>
                    </div>
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                      <Clock className="h-2.5 w-2.5" />
                      Pending Confirmation
                    </span>
                  </div>
                  <div className="pt-4 space-y-3">
                    {[
                      { l: "Amount", v: formatCurrency(amtNum) },
                      {
                        l: "Payment Method",
                        v: `${selectedCurDef.name} (${selectedCurDef.id})`,
                      },
                      { l: "Transaction Hash", v: txHash, mono: true },
                      {
                        l: "Proof Received",
                        v: proofFile?.name || "Yes",
                        mono: true,
                      },
                      { l: "Submitted", v: new Date().toLocaleString() },
                    ].map((row) => (
                      <div
                        key={row.l}
                        className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
                      >
                        <span className="text-xs text-slate-500 sm:w-40 shrink-0">
                          {row.l}
                        </span>
                        <span
                          className={`text-xs font-semibold text-slate-200 ${row.mono ? "font-mono break-all sm:break-normal" : ""}`}
                        >
                          {row.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-6 rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-4 text-xs text-sky-200/90 leading-relaxed text-left">
                  <strong className="text-sky-300">What&apos;s next?</strong>{" "}
                  You will receive an email confirmation shortly. Your balance
                  will be credited automatically once the blockchain transaction
                  has reached the required number of confirmations — typically
                  within 10-30 minutes.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row w-full gap-3">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => router.push("/account-history")}
                    className="flex-1 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
                  >
                    View Deposit History
                  </button>
                  <button
                    onClick={() => {
                      setStep(1);
                      setAmount("");
                      setTxHash("");
                      removeProof();
                    }}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
                  >
                    Make Another Deposit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        {step < 5 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { i: Shield, t: "SSL Encrypted", d: "All data secured" },
              { i: Clock, t: "Fast Processing", d: "Avg. 15 min confirm" },
              { i: BadgeCheck, t: "Verified Systems", d: "Audited wallets" },
              { i: FileCheck2, t: "Proof Verified", d: "Manual + auto check" },
            ].map((b) => (
              <div
                key={b.t}
                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/40 p-3.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-emerald-400">
                  <b.i className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">
                    {b.t}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
