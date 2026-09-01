import type { MainThread } from "@lynx-js/types";
import { feedbackScaleTimingFunction } from "@seed-design/lynx-css/scale-feedback" with {
  runtime: "shared",
};

export interface ScaleFeedbackElement extends MainThread.Element {
  getComputedStyleProperty(styleName: string): string;
}

export function createScaleFeedbackAnimation(
  currentTransform: string,
  scale: number,
  duration: number,
) {
  return {
    keyframes: [{ transform: currentTransform || "scale(1)" }, { transform: `scale(${scale})` }],
    options: {
      duration,
      easing: feedbackScaleTimingFunction,
      fill: "forwards" as const,
    },
  };
}

export function animateScaleFeedback(
  target: ScaleFeedbackElement | null,
  currentAnimation: MainThread.Animation | null,
  scale: number,
  duration: number,
): MainThread.Animation | null {
  "main thread";

  if (!target) return null;

  let currentTransform = "scale(1)";
  try {
    currentTransform = target.getComputedStyleProperty("transform") || currentTransform;
  } catch {
    // Some non-native runtimes expose the method but cannot evaluate it.
  }

  const { keyframes, options } = createScaleFeedbackAnimation(
    currentTransform,
    scale,
    duration,
  );
  currentAnimation?.cancel();

  return target.animate(keyframes, options);
}
