"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Users,
  Copy,
  CheckCircle,
  Share2,
  DollarSign,
  UserPlus,
  TrendingUp,
  Search,
} from "lucide-react";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  referralCode?: string;
  referralEarnings?: number;
};

type ReferredUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt: Timestamp;
  status: "active" | "inactive";
  totalInvested?: number;
};

export default function ReferralsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [referrals, setReferrals] = useState<ReferredUser[]>([]);
  const [copied, setCopied] = useState(false);

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

      try {
        // Fetch User Profile
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }

        // Fetch Referrals
        // Assuming users have a 'referredBy' field containing the referrer's UID
        const referralsQuery = query(
          collection(db, "users"),
          where("referredBy", "==", currentUser.uid),
        );
        const referralsSnapshot = await getDocs(referralsQuery);

        const referralList = referralsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: (doc.data().activeDeposits || 0) > 0 ? "active" : "inactive",
        })) as ReferredUser[];

        setReferrals(referralList);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const referralLink =
    typeof window !== "undefined" && user
      ? `${window.location.origin}/register?ref=${user.uid}`
      : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (timestamp: Timestamp | any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">
            Loading referrals...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate Stats
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter((r) => r.status === "active").length;
  const totalEarnings = profile?.referralEarnings || 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-50">Referral Program</h1>
          <p className="mt-2 text-slate-400">
            Invite friends and earn rewards when they start investing.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Earnings
                </p>
                <h3 className="text-2xl font-bold text-slate-50">
                  {formatCurrency(totalEarnings)}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Referrals
                </p>
                <h3 className="text-2xl font-bold text-slate-50">
                  {totalReferrals}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Active Referrals
                </p>
                <h3 className="text-2xl font-bold text-slate-50">
                  {activeReferrals}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="mb-8 rounded-3xl border border-white/5 bg-gradient-to-r from-slate-900 to-slate-900/50 p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-50">
                Your Unique Referral Link
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Share this link with your friends. You'll earn a percentage of
                their initial deposit.
              </p>
            </div>

            <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-white/10 bg-slate-950 p-2">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-slate-400">
                <Share2 className="h-5 w-5" />
              </div>
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 bg-transparent text-sm font-medium text-slate-300 outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Copied
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
        </div>

        {/* Referrals List */}
        <div className="rounded-3xl border border-white/5 bg-slate-900 shadow-xl overflow-hidden">
          <div className="border-b border-white/5 px-6 py-4">
            <h3 className="text-lg font-bold text-slate-50">Referred Users</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Joined Date
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Total Invested
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {referrals.length > 0 ? (
                  referrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                            <UserPlus className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">
                              {referral.firstName || referral.lastName
                                ? `${referral.firstName || ""} ${referral.lastName || ""}`
                                : "User"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {referral.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(referral.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                            referral.status === "active"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {referral.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-200">
                        {formatCurrency(referral.totalInvested)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Search className="mb-4 h-10 w-10 opacity-20" />
                        <p>No referrals found yet.</p>
                        <p className="mt-1 text-xs">
                          Share your link to start earning!
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
