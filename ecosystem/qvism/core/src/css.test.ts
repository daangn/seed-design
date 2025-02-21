import { outdent } from "outdent";
import { expect, test } from "vitest";

import { generateKeyframeRules, transpileRulesToCss } from "./css";

test("generateKeyframeRules: only one keyframe", async () => {
  // given
  const keyframes = {
    fadeIn: {
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    },
  };

  // when
  const keyframeRules = generateKeyframeRules(keyframes);
  const css = await transpileRulesToCss([...keyframeRules]);

  // then
  expect(css).toMatchInlineSnapshot(outdent`
  "@keyframes fadeIn {
      0% {
          opacity: 0
      }
      100% {
          opacity: 1
      }
  }"
`);
});

test("generateKeyframeRules: multiple keyframes", async () => {
  // given
  const keyframes = {
    fadeIn: {
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    },
    fadeOut: {
      "0%": {
        opacity: 1,
      },
      "100%": {
        opacity: 0,
      },
    },
    fadeInOut: {
      "0%": {
        opacity: 0,
      },
      "50%": {
        opacity: 1,
      },
      "100%": {
        opacity: 0,
      },
    },
  };

  // when
  const keyframeRules = generateKeyframeRules(keyframes);
  const css = await transpileRulesToCss([...keyframeRules]);

  // then
  expect(css).toMatchInlineSnapshot(outdent`
  "@keyframes fadeIn {
      0% {
          opacity: 0
      }
      100% {
          opacity: 1
      }
  }
  @keyframes fadeOut {
      0% {
          opacity: 1
      }
      100% {
          opacity: 0
      }
  }
  @keyframes fadeInOut {
      0% {
          opacity: 0
      }
      50% {
          opacity: 1
      }
      100% {
          opacity: 0
      }
  }"
`);
});

test("generateKeyframeRules: from to", async () => {
  // given
  const keyframes = {
    fadeIn: {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    },
    fadeOut: {
      from: {
        opacity: 1,
      },
      to: {
        opacity: 0,
      },
    },
  };

  // when
  const keyframeRules = generateKeyframeRules(keyframes);
  const css = await transpileRulesToCss([...keyframeRules]);

  // then
  expect(css).toMatchInlineSnapshot(outdent`
  "@keyframes fadeIn {
      from {
          opacity: 0
      }
      to {
          opacity: 1
      }
  }
  @keyframes fadeOut {
      from {
          opacity: 1
      }
      to {
          opacity: 0
      }
  }"
`);
});
