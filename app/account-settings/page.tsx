"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getFirebaseApp, getFirebaseFirestore } from "@/lib/firebaseClient";
import DashboardLayout from "@/components/dashboard-layout";
import ProfileAvatar from "@/components/profile-avatar";
import { useProfilePhotoURL } from "@/hooks/useProfilePhotoURL";
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
  photoPublicId?: string;
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
  const [photoMessage, setPhotoMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [photoCacheBuster, setPhotoCacheBuster] = useState<number>(() =>
    Date.now(),
  );
  const photoHook = useProfilePhotoURL(user?.uid);

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

  const effectivePhotoURL =
    photoHook.url && photoHook.url.length > 0
      ? photoHook.url
      : formData.photoURL && formData.photoURL.length > 0
        ? formData.photoURL
        : user?.photoURL && user.photoURL.length > 0
          ? user.photoURL
          : null;

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
          const photoURL = data.photoURL || currentUser.photoURL || "";
          const photoPublicId = data.photoPublicId || "";
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
            photoURL,
            photoPublicId,
          });
          if (photoURL) {
            try {
              photoHook.setPhoto(photoURL, photoPublicId || null);
            } catch {}
          }
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () =>
        reject(new Error(`Failed to read file: ${file.name}`));
      reader.onabort = () =>
        reject(new Error(`File read was aborted: ${file.name}`));
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoMessage({
        type: "error",
        text: "Image size should be less than 5MB.",
      });
      setTimeout(() => setPhotoMessage(null), 5000);
      setMessage({
        type: "error",
        text: "Image size should be less than 5MB.",
      });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhotoMessage({
        type: "error",
        text: "Please select a valid image file.",
      });
      setTimeout(() => setPhotoMessage(null), 5000);
      setMessage({
        type: "error",
        text: "Please select a valid image file.",
      });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    setUploadingImage(true);
    setMessage(null);
    setPhotoMessage(null);

    try {
      const localPreview = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, photoURL: localPreview }));
      try {
        photoHook.setPhoto(localPreview, null);
      } catch {}
      setPhotoCacheBuster(Date.now());
    } catch (readErr) {
      console.warn(
        "[AccountSettings] Could not generate local base64 preview — continuing with upload anyway.",
        readErr,
      );
    }

    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const db = getFirebaseFirestore();

      if (!auth.currentUser) {
        throw new Error("You must be signed in to upload a profile picture.");
      }

      console.log(
        "[AccountSettings] Starting upload via multipart/form-data, file:",
        file.name,
        file.size,
        file.type,
      );

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", auth.currentUser.uid);

      let response: Response;
      try {
        response = await fetch("/api/cloudinary/upload-profile", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
          cache: "no-store",
        });
      } catch (networkErr: any) {
        console.error(
          "[AccountSettings] NETWORK ERROR during fetch:",
          networkErr,
        );
        throw new Error(
          `Network error: ${networkErr?.message || "Could not reach server. Check your connection."}`,
        );
      }

      console.log("[AccountSettings] HTTP response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        contentType: response.headers.get("content-type"),
      });

      const rawBody = await response.text();

      const criticalDiag =
        "[AccountSettings] Response diag: HTTP " +
        response.status +
        " " +
        (response.statusText || "") +
        " | ok=" +
        response.ok +
        " | content-type=" +
        (response.headers.get("content-type") || "MISSING") +
        " | rawBodyLength=" +
        rawBody.length +
        " | rawBodyFirst300=" +
        JSON.stringify(rawBody.slice(0, 300));
      if (!response.ok) {
        console.error(criticalDiag);
      } else {
        console.log(criticalDiag);
      }

      let result: any;
      try {
        result = rawBody ? JSON.parse(rawBody) : {};
      } catch (parseErr: any) {
        console.error("[AccountSettings] Response is NOT valid JSON:", {
          parseError: parseErr?.message,
          htmlTitleMatch: rawBody.match(/<title[^>]*>([^<]*)</i)?.[1],
        });
        const titleMatch = rawBody.match(/<title[^>]*>([^<]*)</i);
        const msgFromHtml = titleMatch ? ` — ${titleMatch[1].trim()}` : "";
        const detailedErr =
          `Server sent non-JSON HTTP ${response.status}${msgFromHtml}. ` +
          `Body length: ${rawBody.length}${rawBody.length > 0 ? ` | First 120 chars: ${rawBody.slice(0, 120)}` : ""}`;
        throw new Error(detailedErr);
      }

      console.log("[AccountSettings] Parsed API result:", result);

      if (!response.ok || result.success !== true) {
        const httpStatus = response.status;
        const fallbackStatusMsg =
          httpStatus === 404
            ? `HTTP 404 — Upload route not found. Fully restart the dev server (Ctrl+C → npm run dev). Raw body length=${rawBody.length}`
            : httpStatus === 413
              ? `HTTP 413 — Image too large after encoding. Pick a smaller file (<1MB).`
              : httpStatus === 405
                ? `HTTP 405 — Method Not Allowed. Next.js route config issue.`
                : httpStatus === 500
                  ? `HTTP 500 — Server error (check terminal for [upload-profile] logs). Body preview: ${rawBody.slice(0, 200)}`
                  : rawBody.length === 0
                    ? `HTTP ${httpStatus} with EMPTY response body. Next.js route module failed to load → FULL dev server restart required.`
                    : `HTTP ${httpStatus} — ${response.statusText || ""}${rawBody.length > 0 && rawBody.length < 300 ? ` | Body: ${rawBody}` : ""}`;

        const parsedMsg =
          typeof result?.message === "string" && result.message.length > 0
            ? result.message
            : typeof result?.error === "string" && result.error.length > 0
              ? result.error
              : null;

        const failureAt =
          result?.failureAt ||
          (result?.debug && result.debug.failureAt) ||
          null;
        const debugInfo = result?.debug || null;

        console.error(
          "[AccountSettings] UPLOAD FAILED STRING DIAG: " +
            "http=" +
            httpStatus +
            " | success=" +
            result?.success +
            " | parsedMessage=" +
            (parsedMsg ? `"${parsedMsg}"` : "NONE") +
            " | failureAt=" +
            (failureAt ?? "none") +
            " | debug=" +
            (debugInfo ? JSON.stringify(debugInfo) : "none") +
            " | rawBodyFirst500=" +
            JSON.stringify(rawBody.slice(0, 500)),
        );

        const userFacing =
          (parsedMsg && parsedMsg.length < 240 ? parsedMsg + " " : "") +
          (parsedMsg && parsedMsg.length < 240 && failureAt
            ? `(step: ${failureAt}). `
            : "") +
          fallbackStatusMsg;

        throw new Error(userFacing);
      }

      if (!result.data || !result.data.url) {
        console.error("[AccountSettings] Result missing data.url:", result);
        throw new Error(
          "Upload succeeded but no URL returned — please try again.",
        );
      }

      const { url, publicId } = result.data;
      console.log("[AccountSettings] Upload SUCCESS! URL:", url);

      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          photoURL: url,
          photoPublicId: publicId,
        });
      } catch (firestoreErr: any) {
        console.warn(
          "[AccountSettings] Non-fatal: Firestore updateDoc failed after successful upload (permission rules?). " +
            "Image will still display via local state. Details:",
          {
            message: firestoreErr?.message,
            code: firestoreErr?.code,
            name: firestoreErr?.name,
          },
        );
      }

      try {
        await updateProfile(auth.currentUser, {
          photoURL: url,
        });
      } catch (authErr: any) {
        console.warn(
          "[AccountSettings] Non-fatal: Firebase Auth updateProfile failed after successful upload. " +
            "Image will still display via local state. Details:",
          {
            message: authErr?.message,
            code: authErr?.code,
            name: authErr?.name,
          },
        );
      }

      setFormData((prev) => ({
        ...prev,
        photoURL: url,
        photoPublicId: publicId,
      }));
      setPhotoCacheBuster(Date.now());
      try {
        photoHook.setPhoto(url, publicId);
      } catch {}
      setMessage({
        type: "success",
        text: "Profile picture updated successfully!",
      });
      setPhotoMessage({
        type: "success",
        text: "Profile picture updated successfully!",
      });
      setTimeout(() => setMessage(null), 5000);
      setTimeout(() => setPhotoMessage(null), 5000);
    } catch (error: any) {
      const errorInfo: Record<string, any> = {};
      if (error instanceof Error) {
        errorInfo.name = error.name;
        errorInfo.message = error.message;
        errorInfo.stack = error.stack?.split("\n").slice(0, 3).join("\n");
      } else if (typeof error === "object" && error !== null) {
        try {
          errorInfo.rawKeys = Object.keys(error);
          errorInfo.rawString = JSON.stringify(error).slice(0, 500);
        } catch {
          errorInfo.rawType = typeof error;
        }
        errorInfo.message =
          (error as any).message ?? (error as any).error ?? (error as any).msg;
        errorInfo.code = (error as any).code;
      } else {
        errorInfo.primitive = String(error);
      }
      console.error(
        "[AccountSettings] FINAL ERROR uploading image:",
        errorInfo,
        "\nRaw error:",
        error,
      );
      const errorText =
        errorInfo.message ||
        (typeof error === "string" ? error : null) ||
        "Failed to upload image. Please check your internet connection and try again.";
      setMessage({
        type: "error",
        text: errorText,
      });
      setPhotoMessage({
        type: "error",
        text: errorText,
      });
      setTimeout(() => setMessage(null), 10000);
      setTimeout(() => setPhotoMessage(null), 10000);
    } finally {
      setUploadingImage(false);
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
                {effectivePhotoURL ? (
                  <img
                    key={`guaranteed-${photoCacheBuster}-${effectivePhotoURL.length}`}
                    src={effectivePhotoURL}
                    alt="Profile"
                    className="absolute inset-0 h-24 w-24 rounded-full object-cover ring-4 ring-slate-900 z-10"
                    onError={(e) => {
                      console.error(
                        "[GuaranteedImg] Failed to load photo URL:",
                        effectivePhotoURL,
                      );
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : null}
                <ProfileAvatar
                  src={effectivePhotoURL}
                  alt="Profile"
                  fallbackInitials={`${formData.firstName || ""} ${formData.lastName || user?.email || ""}`}
                  size="h-24 w-24"
                  className="ring-4 ring-slate-900"
                  iconSize={36}
                  cacheBuster={photoCacheBuster}
                />
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

              {photoMessage && (
                <div
                  className={`mb-4 flex items-start gap-2 rounded-xl border p-3 text-left ${
                    photoMessage.type === "success"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/20 bg-red-500/10 text-red-400"
                  }`}
                >
                  {photoMessage.type === "success" ? (
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <p className="text-xs font-medium leading-snug">
                    {photoMessage.text}
                  </p>
                </div>
              )}

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
