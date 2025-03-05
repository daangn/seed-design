import type { UlottieComposition } from "./types";

export function parseUlottie(raw: any): UlottieComposition {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid Lottie JSON: not an object.");
  }
  if (!Array.isArray(raw.layers)) {
    throw new Error("No layers array found in Lottie JSON.");
  }
  return raw as UlottieComposition;
}
