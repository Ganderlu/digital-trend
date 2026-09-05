"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const LS_KEY = "user:profile-photo-url:";
const LS_PUBLIC_ID_KEY = "user:profile-photo-public-id:";
const BUS_EVENT = "profile-photo-updated";

function readLS(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLS(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function buildUserKeys(userId: string) {
  return {
    urlKey: LS_KEY + userId,
    publicIdKey: LS_PUBLIC_ID_KEY + userId,
  };
}

export type ProfilePhotoState = {
  url: string | null;
  publicId: string | null;
  source: "localStorage" | "override" | "none";
  setPhoto: (url: string, publicId?: string | null) => void;
  clear: () => void;
  resolvedUrl: (candidate: string | null | undefined) => string | null;
};

export function useProfilePhotoURL(
  userId: string | null | undefined,
): ProfilePhotoState {
  const [url, setUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(userId ?? null);

  const reloadFromStorage = useCallback((uid?: string | null) => {
    const effectiveUid = uid ?? userIdRef.current;
    if (!effectiveUid) {
      setUrl(null);
      setPublicId(null);
      return;
    }
    const { urlKey, publicIdKey } = buildUserKeys(effectiveUid);
    const storedUrl = readLS(urlKey);
    const storedPublicId = readLS(publicIdKey);
    setUrl(storedUrl);
    setPublicId(storedPublicId);
  }, []);

  useEffect(() => {
    userIdRef.current = userId ?? null;
    reloadFromStorage(userId);
  }, [userId, reloadFromStorage]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (!e.key) {
        reloadFromStorage();
        return;
      }
      const currentUid = userIdRef.current;
      if (!currentUid) return;
      if (
        e.key.startsWith(LS_KEY) ||
        e.key.startsWith(LS_PUBLIC_ID_KEY) ||
        e.key.includes(currentUid)
      ) {
        reloadFromStorage();
      }
    };
    const onBus = (e: Event) => {
      const custom = e as CustomEvent<{ userId?: string }>;
      if (!custom.detail?.userId || custom.detail.userId === userIdRef.current) {
        reloadFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(BUS_EVENT, onBus as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(BUS_EVENT, onBus as EventListener);
    };
  }, [reloadFromStorage]);

  const setPhoto = useCallback((newUrl: string, newPublicId?: string | null) => {
    const currentUid = userIdRef.current;
    if (!currentUid) return;
    const { urlKey, publicIdKey } = buildUserKeys(currentUid);
    if (newUrl) {
      writeLS(urlKey, newUrl);
      setUrl(newUrl);
    } else {
      try {
        window.localStorage.removeItem(urlKey);
      } catch {}
      setUrl(null);
    }
    if (typeof newPublicId === "string" && newPublicId.length > 0) {
      writeLS(publicIdKey, newPublicId);
      setPublicId(newPublicId);
    } else if (newPublicId === null) {
      try {
        window.localStorage.removeItem(publicIdKey);
      } catch {}
      setPublicId(null);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(BUS_EVENT, {
          detail: { userId: currentUid },
        }),
      );
    }
  }, []);

  const clear = useCallback(() => {
    const currentUid = userIdRef.current;
    if (!currentUid) return;
    const { urlKey, publicIdKey } = buildUserKeys(currentUid);
    try {
      window.localStorage.removeItem(urlKey);
      window.localStorage.removeItem(publicIdKey);
    } catch {}
    setUrl(null);
    setPublicId(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(BUS_EVENT, { detail: { userId: currentUid } }),
      );
    }
  }, []);

  const resolvedUrl = useCallback(
    (candidate: string | null | undefined): string | null => {
      if (url && url.length > 0) return url;
      if (typeof candidate === "string" && candidate.length > 0)
        return candidate;
      return null;
    },
    [url],
  );

  return {
    url,
    publicId,
    source: url ? "localStorage" : "none",
    setPhoto,
    clear,
    resolvedUrl,
  };
}
