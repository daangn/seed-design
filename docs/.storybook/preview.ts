// import Seed Design
import "@seed-design/css/all.css";

import type { Preview } from "@storybook/nextjs";
import { breakpoints } from "@seed-design/css/breakpoints";
import { ViewportMap } from "storybook/viewport";

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

const preview: Preview = {
  parameters: {
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
};

export default preview;
