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
  updateDoc,
  doc,
} from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import AdminLayout from "@/components/admin-layout";
import {
  Users,
  Search,
  MoreVertical,
  Shield,
  Ban,
  CheckCircle,
  Mail,
  Calendar,
} from "lucide-react";

type UserData = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: Timestamp | any;
  balance?: number;
  status?: "active" | "banned";
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        const usersQuery = query(collection(db, "users"));
        const snapshot = await getDocs(usersQuery);

        const fetchedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserData[];

        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email?.toLowerCase().includes(lowerTerm) ||
            user.firstName?.toLowerCase().includes(lowerTerm) ||
            user.lastName?.toLowerCase().includes(lowerTerm),
        ),
      );
    }
  }, [searchTerm, users]);

  const toggleUserStatus = async (userId: string, currentStatus?: string) => {
    const newStatus = currentStatus === "banned" ? "active" : "banned";
    try {
      const db = getFirebaseFirestore();
      await updateDoc(doc(db, "users", userId), {
        status: newStatus,
      });

      // Update local state
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  const formatDate = (timestamp: any) => {
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
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading users...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">
              User Management
            </h1>
            <p className="mt-2 text-slate-400">
              View and manage all registered users.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 sm:w-64"
            />
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
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Balance
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 font-bold uppercase">
                            {user.firstName?.[0] || user.email?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">
                              {user.firstName
                                ? `${user.firstName} ${user.lastName || ""}`
                                : "No Name"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                            <Shield className="h-3 w-3" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
                            User
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-200">
                        {formatCurrency(user.balance)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            user.status === "banned"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {user.status || "active"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          className={`rounded-lg p-2 transition ${
                            user.status === "banned"
                              ? "text-emerald-400 hover:bg-emerald-500/10"
                              : "text-red-400 hover:bg-red-500/10"
                          }`}
                          title={
                            user.status === "banned" ? "Unban User" : "Ban User"
                          }
                        >
                          {user.status === "banned" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Ban className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No users found.
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
