"use client";

import { useCallback, useState } from "react";

interface UseLandingMp4PlaybackOptions {
  prefersReducedMotion: boolean;
  resolved: boolean;
}

export function useLandingMp4Playback({
  prefersReducedMotion,
  resolved,
}: UseLandingMp4PlaybackOptions) {
  const [manualChoice, setManualChoice] = useState<boolean | null>(null);
  const playbackEnabled = resolved && (manualChoice ?? !prefersReducedMotion);
  const setPlaybackEnabled = useCallback((enabled: boolean) => setManualChoice(enabled), []);

  return { playbackEnabled, setPlaybackEnabled };
}
