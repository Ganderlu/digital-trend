"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirebaseApp,
  getFirebaseStorage,
  getFirebaseFirestore,
} from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  Globe,
} from "lucide-react";

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
  zipCode: string;
  bio: string;
  photoURL?: string;
};

export default function AccountSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    bio: "",
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
      setUser(currentUser);

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: currentUser.email || "",
            phoneNumber: data.phoneNumber || "",
            country: data.country || "",
            city: data.city || "",
            address: data.address || "",
            zipCode: data.zipCode || "",
            bio: data.bio || "",
            photoURL: currentUser.photoURL || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size should be less than 5MB.",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setUploadingImage(true);
    setMessage(null);

    try {
      const app = getFirebaseApp();
      const storage = getFirebaseStorage();
      const auth = getAuth(app);
      const db = getFirebaseFirestore();

      if (!auth.currentUser) return;

      const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        photoURL: downloadURL,
      });

      // Update Auth Profile
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL,
      });

      // Update Local State
      setFormData((prev) => ({ ...prev, photoURL: downloadURL }));
      setMessage({
        type: "success",
        text: "Profile picture updated successfully!",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({
        type: "error",
        text: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploadingImage(false);
      // Reset input value to allow same file selection again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const app = getFirebaseApp();
      const db = getFirebaseFirestore();
      const auth = getAuth(app);

      if (auth.currentUser) {
        // Update Firestore
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          zipCode: formData.zipCode,
          bio: formData.bio,
          updatedAt: new Date(),
        });

        // Update Auth Profile (DisplayName)
        if (formData.firstName || formData.lastName) {
          await updateProfile(auth.currentUser, {
            displayName: `${formData.firstName} ${formData.lastName}`.trim(),
          });
        }

        setMessage({ type: "success", text: "Profile updated successfully!" });

        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-50">Account Settings</h1>
          <p className="mt-2 text-slate-400">
            Manage your personal information and profile details.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar / Quick Stats or Photo */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-white/5 bg-slate-900 p-6 text-center shadow-sm">
              <div className="relative mx-auto mb-4 h-24 w-24">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800 text-3xl font-bold text-slate-500 ring-4 ring-slate-900">
                  {formData.photoURL ? (
                    <img
                      src={formData.photoURL}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {formData.firstName?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 rounded-full bg-emerald-500 p-2 text-white shadow-lg transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              </div>
              <h2 className="text-lg font-bold text-slate-50">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-sm text-slate-400">{formData.email}</p>

              <div className="mt-6 flex flex-col gap-2">
                <div className="rounded-xl bg-slate-950 p-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Member Since
                  </p>
                  <p className="text-sm font-medium text-slate-300">
                    {user?.metadata?.creationTime
                      ? new Date(
                          user.metadata.creationTime,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium text-slate-200 flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-500" />
                    Bio
                  </h3>
                  <div>
                    <label
                      htmlFor="bio"
                      className="mb-2 block text-sm font-medium text-slate-400"
                    >
                      About Me
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none"
                      placeholder="Tell us a little about yourself..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/5 bg-slate-900 p-6 shadow-sm lg:p-8"
            >
              {message && (
                <div
                  className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${
                    message.type === "success"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/20 bg-red-500/10 text-red-400"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="border-b border-white/5 pb-6">
                  <h3 className="mb-4 text-lg font-medium text-slate-200 flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-500" />
                    Personal Information
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-2 block text-sm font-medium text-slate-400"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-2 block text-sm font-medium text-slate-400"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-slate-400"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          disabled
                          className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-slate-950/50 pl-10 pr-4 py-2.5 text-slate-400 outline-none"
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Email address cannot be changed.
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phoneNumber"
                        className="mb-2 block text-sm font-medium text-slate-400"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-white/5 pb-6">
                  <h3 className="mb-4 text-lg font-medium text-slate-200 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    Address Details
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="address"
                        className="mb-2 block text-sm font-medium text-slate-400"
                      >
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                        placeholder="123 Main St"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-medium text-slate-400"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="mb-2 block text-sm font-medium text-slate-400"
                      >
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                        placeholder="10001"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="country"
                        className="mb-2 block text-sm font-medium text-slate-400"
                      >
                        Country
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
