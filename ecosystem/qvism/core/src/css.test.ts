import { expect, test } from "bun:test";

import {
  generateAllBundle,
  generateEachRecipe,
  generateKeyframeRules,
  transpileRulesToCss,
} from "./css";

const expandInsetPlugin = {
  postcssPlugin: "test-expand-inset",
  Declaration(decl: {
    prop: string;
    value: string;
    clone(overrides: { prop: string; value: string }): unknown;
    replaceWith(...nodes: unknown[]): void;
  }) {
    if (decl.prop !== "inset") {
      return;
    }

    decl.replaceWith(
      ...["top", "right", "bottom", "left"].map((prop) =>
        decl.clone({ prop, value: decl.value }),
      ),
    );
  },
};

function createSingleRecipeConfig() {
  return {
    theme: {
      tokens: {
        _raw: "",
      },
      recipes: {
        actionButton: {
          name: "action-button",
          base: {
            color: "red",
          },
          variants: {},
          defaultVariants: {},
        },
      },
      keyframes: {},
    },
  };
}

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
  expect(css).toMatchInlineSnapshot(`
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
  expect(css).toMatchInlineSnapshot(`
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
  expect(css).toMatchInlineSnapshot(`
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

test("generateAllBundle applies postTransformPlugins before returning CSS", async () => {
  // given
  const config = {
    postTransformPlugins: [expandInsetPlugin],
    theme: {
      tokens: {
        _raw: "",
      },
      recipes: {
        overlay: {
          name: "overlay",
          base: {
            position: "fixed",
            inset: 0,
          },
          variants: {},
          defaultVariants: {},
        },
      },
      keyframes: {},
    },
  };

  // when
  const css = await generateAllBundle(config);

  // then
  expect(css).toContain("top: 0;");
  expect(css).toContain("right: 0;");
  expect(css).toContain("bottom: 0;");
  expect(css).toContain("left: 0;");
  expect(css).not.toContain("inset:");
});

test("generateEachRecipe omits layered CSS when layered generation is disabled", async () => {
  // given
  const config = createSingleRecipeConfig();

  // when
  const recipes = await generateEachRecipe(config, { generateLayeredCss: false });

  // then
  expect(recipes).toHaveLength(1);
  expect(recipes[0].name).toBe("action-button");
  expect(recipes[0].css).toContain(".action-button");
  expect(recipes[0].css).toContain("color: red");
  expect(recipes[0]).not.toHaveProperty("layeredCss");
});

test("generateEachRecipe includes layered CSS by default", async () => {
  // given
  const config = createSingleRecipeConfig();

  // when
  const recipes = await generateEachRecipe(config);

  // then
  expect(recipes).toHaveLength(1);
  expect(recipes[0].name).toBe("action-button");
  expect(recipes[0].css).toContain(".action-button");
  expect(recipes[0].layeredCss).toBeDefined();
  expect(recipes[0].layeredCss ?? "").toContain("@layer seed-components");
  expect(recipes[0].layeredCss ?? "").toContain(".action-button");
});
