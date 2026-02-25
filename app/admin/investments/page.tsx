"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import AdminLayout from "@/components/admin-layout";
import {
  TrendingUp,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";

type Investment = {
  id: string;
  userId: string;
  planName: string;
  amount: number;
  status: "active" | "completed";
  roi: number;
  duration: number;
  startDate: Timestamp | any;
  endDate: Timestamp | any;
  userEmail?: string;
};

export default function AdminInvestmentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

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
        const investmentsQuery = query(
          collection(db, "investments"),
          orderBy("startDate", "desc"),
        );
        const snapshot = await getDocs(investmentsQuery);

        const investmentsData = await Promise.all(
          snapshot.docs.map(async (invDoc) => {
            const data = invDoc.data();
            let userEmail = "Unknown";

            if (data.userId) {
              try {
                const userDoc = await getDoc(doc(db, "users", data.userId));
                if (userDoc.exists()) {
                  userEmail = userDoc.data().email;
                }
              } catch (e) {
                console.error("Error fetching user email", e);
              }
            }

            return {
              id: invDoc.id,
              ...data,
              userEmail,
            } as Investment;
          }),
        );

        setInvestments(investmentsData);
      } catch (error) {
        console.error("Error fetching investments:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const filteredInvestments = investments.filter((inv) => {
    if (filterStatus === "all") return true;
    return inv.status === filterStatus;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">
            Loading investments...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Investments</h1>
            <p className="mt-2 text-slate-400">
              Track all active and completed user investments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Invested
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    ROI
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvestments.length > 0 ? (
                  filteredInvestments.map((investment) => (
                    <tr
                      key={investment.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">
                              {investment.userEmail}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {investment.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-200">
                        {investment.planName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-200">
                        {formatCurrency(investment.amount)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-emerald-400">
                        {investment.roi}%
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(investment.startDate)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(investment.endDate)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            investment.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-slate-700/50 text-slate-400"
                          }`}
                        >
                          {investment.status === "active" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {investment.status === "completed" && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {investment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No investments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
