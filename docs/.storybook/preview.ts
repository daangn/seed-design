// import Seed Design
import { definePreview } from "@storybook/nextjs-vite";
import kapture from "@kaptures/storybook";

import "@seed-design/css/all.css";

import { breakpoints } from "@seed-design/css/breakpoints";
import { ViewportMap } from "storybook/viewport";
import type { StoryParameters } from "../stories/utils/parameters";

const breakpointValues = Object.values(breakpoints);

const viewportMap: ViewportMap = Object.fromEntries(
  Object.entries(breakpoints).map(([key, value], i) => {
    const nextValue = breakpointValues[i + 1];
    const w = nextValue != null ? nextValue - 10 : value + 150;

    return [
      key,
      {
        name: `${w}px (>= ${key} (${value}px))`,
        styles: {
          width: `${w}px`,
          height: `${Math.round(w > 768 ? (w * 9) / 16 : (w * 18.5) / 9)}px`,
        },
      },
    ];
  }),
);

export default definePreview({
  parameters: {
    kapture: {
      waitForFonts: true,
      diff: {
        maxChangedPixelPercentage: 0.1,
      },
    },
    viewport: {
      options: viewportMap,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  addons: [kapture()],
}).type<{ parameters: StoryParameters }>();
