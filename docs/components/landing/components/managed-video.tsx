"use client";

import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { didWrap } from "./video-loop";

export interface ManagedVideoSource {
  media?: string;
  src: string;
  type?: string;
}

interface ManagedVideoProps
  extends Omit<
    ComponentPropsWithoutRef<"video">,
    "autoPlay" | "children" | "poster" | "preload" | "src"
  > {
  onFirstLoop?: () => void;
  playbackEnabled: boolean;
  poster: string;
  sources?: ManagedVideoSource[];
  src?: string;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
}

const ROOT_MARGIN = "200px 0px";

function resolveResumeTime(time: number, duration: number) {
  return Number.isFinite(time) && Number.isFinite(duration) && time >= 0 && time < duration
    ? time
    : 0;
}

export function ManagedVideo({
  onFirstLoop,
  playbackEnabled,
  poster,
  sources,
  src,
  wrapperClassName,
  wrapperStyle,
  className,
  onLoadedData,
  onLoadedMetadata,
  onTimeUpdate,
  style: videoStyle,
  ...videoProps
}: ManagedVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const savedTimeRef = useRef(0);
  const loopedRef = useRef(false);
  const lastTimeRef = useRef(0);
  const [hasLoadedFrame, setHasLoadedFrame] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(false);

  const handleVideoRef = useCallback((video: HTMLVideoElement | null) => {
    const previousVideo = videoRef.current;
    if (!video && previousVideo) {
      savedTimeRef.current = Number.isFinite(previousVideo.currentTime)
        ? Math.max(0, previousVideo.currentTime)
        : 0;
      previousVideo.pause();
    }
    videoRef.current = video;
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry?.isIntersecting ?? false),
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(wrapper);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsDocumentVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const resourceEligible = isNearViewport && isDocumentVisible;
  const shouldMountVideo = resourceEligible && (playbackEnabled || hasLoadedFrame);
  const shouldPlay = resourceEligible && playbackEnabled;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!shouldPlay) {
      video.pause();
      return;
    }

    const playResult = video.play();
    if (playResult) void playResult.catch(() => undefined);
  }, [shouldPlay]);

  const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    video.currentTime = resolveResumeTime(savedTimeRef.current, video.duration);
    lastTimeRef.current = video.currentTime;

    if (playbackEnabled) {
      const playResult = video.play();
      if (playResult) void playResult.catch(() => undefined);
    } else {
      video.pause();
    }
    onLoadedMetadata?.(event);
  };

  const handleLoadedData = (event: SyntheticEvent<HTMLVideoElement>) => {
    setHasLoadedFrame(true);
    onLoadedData?.(event);
  };

  const handleTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    const time = event.currentTarget.currentTime;
    if (!loopedRef.current && didWrap(lastTimeRef.current, time)) {
      loopedRef.current = true;
      onFirstLoop?.();
    }
    lastTimeRef.current = time;
    onTimeUpdate?.(event);
  };

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{
        // A composited <video> clipped only by a rounded ANCESTOR leaves a ~1px
        // anti-aliased seam at the corners that reveals the layer behind it (this
        // poster background, or the tile), showing as a colored rim — the orange
        // band. Promoting THIS wrapper to its own raster layer (translateZ) and
        // giving it the rounded overflow clip makes the <video> clip as part of
        // that layer, so the seam disappears regardless of the backdrop color.
        borderRadius: "inherit",
        overflow: "hidden",
        lineHeight: 0,
        transform: "translateZ(0)",
        backgroundImage: `url(${JSON.stringify(poster)})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        ...wrapperStyle,
      }}
    >
      {shouldMountVideo && (
        <video
          {...videoProps}
          ref={handleVideoRef}
          src={src}
          poster={poster}
          preload="metadata"
          className={className}
          style={{ ...videoStyle, display: "block" }}
          onLoadedData={handleLoadedData}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
        >
          {sources?.map((source) => (
            <source key={`${source.media ?? "default"}:${source.src}`} {...source} />
          ))}
        </video>
      )}
    </div>
  );
}
