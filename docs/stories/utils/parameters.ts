import type { Parameters, StoryObj } from "@storybook/nextjs";

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

export const CHROMATIC_PARAMETERS = {
  chromatic: {
    diffThreshold: 0.2, // 20% 미만의 픽셀 차이는 무시
    delay: 300, // 렌더링 안정화를 위한 딜레이 (ms)
    pauseAnimationAtEnd: true, // 애니메이션 종료 시점에서 스냅샷
  },
};

export function createStoryWithParameters<T>(
  story: StoryObj<T> & {
    parameters?: Parameters & { theme?: "light" | "dark"; fontScale?: FontScales };
  },
): StoryObj<T> {
  return {
    ...story,
    parameters: {
      ...CHROMATIC_PARAMETERS,
      ...story.parameters,
    },
  };
}
