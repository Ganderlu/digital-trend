"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import AdminLayout from "@/components/admin-layout";
import {
  Users,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  Activity,
  DollarSign,
  Loader2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeInvestments: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
  });

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const db = getFirebaseFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      try {
        // Fetch Users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const totalUsers = usersSnapshot.size;

        // Fetch Deposits
        const depositsSnapshot = await getDocs(collection(db, "deposits"));
        let totalDeposits = 0;
        let pendingDeposits = 0;
        depositsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "approved" || data.status === "completed") {
            totalDeposits += data.amount || 0;
          } else if (data.status === "pending") {
            pendingDeposits++;
          }
        });

        // Fetch Withdrawals
        const withdrawalsSnapshot = await getDocs(
          collection(db, "withdrawals"),
        );
        let totalWithdrawals = 0;
        let pendingWithdrawals = 0;
        withdrawalsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "approved" || data.status === "completed") {
            totalWithdrawals += data.amount || 0;
          } else if (data.status === "pending") {
            pendingWithdrawals++;
          }
        });

        // Fetch Investments
        const investmentsSnapshot = await getDocs(
          collection(db, "investments"),
        );
        let activeInvestments = 0;
        investmentsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "active") {
            activeInvestments++;
          }
        });

        setStats({
          totalUsers,
          totalDeposits,
          totalWithdrawals,
          activeInvestments,
          pendingDeposits,
          pendingWithdrawals,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-50">Admin Overview</h1>
          <p className="mt-2 text-slate-400">
            System performance and key metrics at a glance.
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Users
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-50">
                  {stats.totalUsers}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Deposits
                </p>
                <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                  {formatCurrency(stats.totalDeposits)}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Withdrawals
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-50">
                  {formatCurrency(stats.totalWithdrawals)}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-700/50 text-slate-400">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Active Investments
                </p>
                <h3 className="mt-2 text-3xl font-bold text-violet-400">
                  {stats.activeInvestments}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Required Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-50">
                Pending Actions
              </h3>
              <Activity className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">
                      Pending Deposits
                    </p>
                    <p className="text-xs text-slate-500">Requires approval</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-slate-50">
                    {stats.pendingDeposits}
                  </span>
                  <button
                    onClick={() => router.push("/admin/deposits")}
                    className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">
                      Pending Withdrawals
                    </p>
                    <p className="text-xs text-slate-500">
                      Requires processing
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-slate-50">
                    {stats.pendingWithdrawals}
                  </span>
                  <button
                    onClick={() => router.push("/admin/withdrawals")}
                    className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-50">Quick Links</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/admin/users")}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-slate-950 p-6 transition hover:bg-slate-800"
              >
                <Users className="h-8 w-8 text-blue-500" />
                <span className="text-sm font-medium text-slate-300">
                  Manage Users
                </span>
              </button>
              <button
                onClick={() => router.push("/admin/investments")}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-slate-950 p-6 transition hover:bg-slate-800"
              >
                <TrendingUp className="h-8 w-8 text-violet-500" />
                <span className="text-sm font-medium text-slate-300">
                  Investments
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
