import { breakpointNames } from "@seed-design/css/breakpoints";
import type { KaptureStoryParameters } from "@kaptures/storybook";

export const FONT_SCALE_MAP = {
  "Extra Small": "14px",
  Small: "15px",
  Medium: "16px",
  Large: "17px",
  "Extra Large": "19px",
  "Extra Extra Large": "21px",
  "Extra Extra Extra Large": "23px",
} as const;

export type FontScales = keyof typeof FONT_SCALE_MAP;

export type StoryParameters = {
  theme?: "light" | "dark";
  fontScale?: FontScales;
  kapture?: KaptureStoryParameters;
};

export const VISUAL_VIEWPORT_PARAMETERS = {
  chromatic: {
    modes: Object.fromEntries(breakpointNames.map((name) => [name, { viewport: name }])),
  },
  kapture: {
    captureViewports: breakpointNames,
  },
} satisfies { kapture: KaptureStoryParameters; chromatic: { modes: object } };

const VISUAL_TEST_PARAMETERS = {
  chromatic: {
    diffThreshold: 0.2, // 20% 미만의 픽셀 차이는 무시
    delay: 300, // 렌더링 안정화를 위한 딜레이 (ms)
    pauseAnimationAtEnd: true, // 애니메이션 종료 시점에서 스냅샷
  },
  kapture: {
    diff: { pixelColorThreshold: 0.2 },
    captureDelayMs: 300,
    animationState: "end",
  },
} satisfies { kapture: KaptureStoryParameters; chromatic: object };

export function withVisualTestParameters<R>(parameters: R): R & typeof VISUAL_TEST_PARAMETERS {
  return {
    ...VISUAL_TEST_PARAMETERS,
    ...parameters,
  };
}
