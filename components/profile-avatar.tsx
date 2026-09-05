"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";

type ProfileAvatarProps = {
  src?: string | null;
  alt?: string;
  fallbackInitials?: string;
  size?: number | string;
  className?: string;
  iconSize?: number;
  gradient?: string;
  cacheBuster?: string | number;
};

export default function ProfileAvatar({
  src,
  alt = "Profile",
  fallbackInitials,
  size = "h-10 w-10",
  className = "",
  iconSize = 24,
  gradient = "from-indigo-500 to-violet-600",
  cacheBuster,
}: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [renderToken, setRenderToken] = useState(0);

  useEffect(() => {
    setImgError(false);
    setRenderToken((t) => t + 1);
  }, [src, cacheBuster]);

  let finalSrc: string | null = null;
  const srcIsDataUrl = typeof src === "string" && src.startsWith("data:");
  if (src && src.trim().length > 0 && (srcIsDataUrl || !imgError)) {
    finalSrc = src;
    if (cacheBuster && !srcIsDataUrl) {
      try {
        const url = new URL(src);
        url.searchParams.set("v", String(cacheBuster));
        finalSrc = url.toString();
      } catch {
        finalSrc = `${src}${src.includes("?") ? "&" : "?"}v=${cacheBuster}`;
      }
    }
  }

  const initials = fallbackInitials
    ? fallbackInitials
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <div
      key={`${finalSrc ?? "initials"}-${renderToken}`}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${gradient} ${size} ${className}`}
    >
      {finalSrc ? (
        <img
          key={finalSrc}
          src={finalSrc}
          alt={alt}
          onError={() => {
            console.warn("[ProfileAvatar] Image failed to load:", src);
            setImgError(true);
          }}
          onLoad={() => {
            console.log("[ProfileAvatar] Image loaded successfully:", src);
          }}
          className="h-full w-full object-cover"
          loading="eager"
          crossOrigin="anonymous"
        />
      ) : initials ? (
        <span
          className="font-bold text-white select-none"
          style={{ fontSize: "calc(min(1em, 1rem))" }}
        >
          {initials}
        </span>
      ) : (
        <User
          className="text-white shrink-0"
          style={{ width: iconSize, height: iconSize }}
        />
      )}
    </div>
  );
}
