import { switch as switchVars } from "../vars/component";
import { switchmark as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

function subtractPx(left: string, right: string) {
  return `${Number.parseFloat(left) - Number.parseFloat(right)}px`;
}

const switchmarkRecipe = defineSlotRecipe({
  name: "switchmark",
  slots: ["root", "thumb"],
  base: {
    root: {
      display: "flex",
      position: "relative",

      borderRadius: vars.base.rest.root.cornerRadius,
      backgroundColor: vars.base.rest.root.color,

      transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction} ${vars.base.rest.root.colorDelay}, opacity ${vars.base.disabled.root.opacityDuration} ${vars.base.disabled.root.opacityTimingFunction}`,
    },
    thumb: {
      borderRadius: vars.base.rest.thumb.cornerRadius,

      transition: `transform ${vars.base.rest.thumb.scaleDuration} ${vars.base.rest.thumb.scaleTimingFunction}, background-color ${vars.base.rest.thumb.colorDuration} ${vars.base.rest.thumb.colorTimingFunction} ${vars.base.rest.thumb.colorDelay}`,

      transform: `scale(${vars.base.rest.thumb.scale})`,
    },
  },
  variants: {
    tone: {
      neutral: {
        thumb: {
          backgroundColor: vars.toneNeutral.rest.thumb.color,
        },
      },
      brand: {
        thumb: {
          backgroundColor: vars.toneBrand.rest.thumb.color,
        },
      },
    },
    size: {
      32: {
        root: {
          minWidth: vars.size32.rest.root.width,
          minHeight: vars.size32.rest.root.height,
          marginTop: `calc((${switchVars.size32.rest.root.height} - ${vars.size32.rest.root.height}) / 2)`,
          marginBottom: `calc((${switchVars.size32.rest.root.height} - ${vars.size32.rest.root.height}) / 2)`,
          padding: `${vars.size32.rest.root.paddingY} ${vars.size32.rest.root.paddingX}`,
        },
        thumb: {
          width: vars.size32.rest.thumb.width,
          height: vars.size32.rest.thumb.height,
        },
      },
      24: {
        root: {
          minWidth: vars.size24.rest.root.width,
          minHeight: vars.size24.rest.root.height,
          marginTop: `calc((${switchVars.size24.rest.root.height} - ${vars.size24.rest.root.height}) / 2)`,
          marginBottom: `calc((${switchVars.size24.rest.root.height} - ${vars.size24.rest.root.height}) / 2)`,
          padding: `${vars.size24.rest.root.paddingY} ${vars.size24.rest.root.paddingX}`,
        },
        thumb: {
          width: vars.size24.rest.thumb.width,
          height: vars.size24.rest.thumb.height,
        },
      },
      16: {
        root: {
          minWidth: vars.size16.rest.root.width,
          minHeight: vars.size16.rest.root.height,
          marginTop: `calc((${switchVars.size16.rest.root.height} - ${vars.size16.rest.root.height}) / 2)`,
          marginBottom: `calc((${switchVars.size16.rest.root.height} - ${vars.size16.rest.root.height}) / 2)`,
          padding: `${vars.size16.rest.root.paddingY} ${vars.size16.rest.root.paddingX}`,
        },
        thumb: {
          width: vars.size16.rest.thumb.width,
          height: vars.size16.rest.thumb.height,
        },
      },
    },
    checked: {
      true: {},
      false: {},
    },
    disabled: {
      true: {
        root: {
          opacity: vars.base.disabled.root.opacity,
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    // ── tone × checked: selected root color ──────────────────────────────────
    {
      tone: "brand",
      checked: true,
      css: {
        root: { backgroundColor: vars.toneBrand.selected.root.color },
      },
    },
    {
      tone: "neutral",
      checked: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.toneNeutral.selected.root.color },
      },
    },
    {
      tone: "neutral",
      checked: true,
      disabled: true,
      css: {
        root: { backgroundColor: vars.toneNeutral.selectedDisabled.root.color },
      },
    },

    // ── tone × disabled: neutral thumb override (brand keeps enabled color) ──
    {
      tone: "neutral",
      disabled: true,
      css: {
        thumb: { backgroundColor: vars.toneNeutral.disabled.thumb.color },
      },
    },

    // ── size × checked: thumb transform ──────────────────────────────────────
    {
      size: "32",
      checked: true,
      css: {
        thumb: {
          transform: `scale(${vars.base.selected.thumb.scale}) translateX(${subtractPx(vars.size32.rest.root.width, vars.size32.rest.root.height)})`,
        },
      },
    },
    {
      size: "24",
      checked: true,
      css: {
        thumb: {
          transform: `scale(${vars.base.selected.thumb.scale}) translateX(${subtractPx(vars.size24.rest.root.width, vars.size24.rest.root.height)})`,
        },
      },
    },
    {
      size: "16",
      checked: true,
      css: {
        thumb: {
          transform: `scale(${vars.base.selected.thumb.scale}) translateX(${subtractPx(vars.size16.rest.root.width, vars.size16.rest.root.height)})`,
        },
      },
    },
  ],
  defaultVariants: {
    tone: "brand",
    size: "32",
    checked: false,
    disabled: false,
  },
});

export default switchmarkRecipe;
