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

export function createStoryWithParameters<T>(
  story: StoryObj<T> & {
    parameters?: Parameters & { theme?: "light" | "dark"; fontScale?: FontScales };
  },
): StoryObj<T> {
  return story;
}
