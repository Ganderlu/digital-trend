"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Loader2, AlertCircle } from "lucide-react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  aspect?: "16:9" | "4:3" | "1:1" | "21:9";
};

const aspectMap: Record<string, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "21:9": "aspect-[21/9]",
};

export default function HlsVideoPlayer({
  src,
  poster,
  className = "",
  aspect = "16:9",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setHasError(false);

    let hls: Hls | null = null;

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("HLS network error, trying to recover...");
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("HLS media error, trying to recover...");
              hls?.recoverMediaError();
              break;
            default:
              console.error("HLS fatal error:", data);
              setHasError(true);
              setIsLoading(false);
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      setHasError(true);
      setIsLoading(false);
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  const aspectClass = aspectMap[aspect] || "aspect-video";

  return (
    <div
      className={`relative w-full ${aspectClass} bg-slate-950 overflow-hidden ${className}`}
    >
      {!poster && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none" />
      )}

      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
        crossOrigin="anonymous"
      >
        Your browser does not support the video tag.
      </video>

      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-4 border-sky-500/20" />
              <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Loading Video…
            </p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90">
          <div className="flex flex-col items-center gap-4 text-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="h-7 w-7 text-rose-400" />
            </div>
            <div>
              <p className="text-base font-bold text-white mb-1">
                Video Unavailable
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                The video could not be loaded. Please check your connection or
                try again later.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !hasError && (
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)]" />
      )}
    </div>
  );
}
