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
