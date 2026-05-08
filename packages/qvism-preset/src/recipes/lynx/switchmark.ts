import { switchmark as vars } from "../../vars/component";
import { defineLynxSlotRecipe } from "../../utils/define-lynx";

function subtractPx(left: string, right: string) {
  return `${Number.parseFloat(left) - Number.parseFloat(right)}px`;
}

const switchmarkRecipe = defineLynxSlotRecipe({
  name: "switchmark",
  slots: ["root", "thumb"],
  base: {
    root: {
      display: "flex",
      position: "relative",

      borderRadius: vars.base.enabled.root.cornerRadius,
      backgroundColor: vars.base.enabled.root.color,

      margin: "var(--switchmark-margin-top, 0) 0",

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction} ${vars.base.enabled.root.colorDelay}, opacity ${vars.base.disabled.root.opacityDuration} ${vars.base.disabled.root.opacityTimingFunction}`,
    },
    thumb: {
      borderRadius: vars.base.enabled.thumb.cornerRadius,

      transition: `transform ${vars.base.enabled.thumb.scaleDuration} ${vars.base.enabled.thumb.scaleTimingFunction}, background-color ${vars.base.enabled.thumb.colorDuration} ${vars.base.enabled.thumb.colorTimingFunction} ${vars.base.enabled.thumb.colorDelay}`,

      transform: `scale(${vars.base.enabled.thumb.scale})`,
    },
  },
  variants: {
    tone: {
      neutral: {
        thumb: {
          backgroundColor: vars.toneNeutral.enabled.thumb.color,
        },
      },
      brand: {
        thumb: {
          backgroundColor: vars.toneBrand.enabled.thumb.color,
        },
      },
    },
    size: {
      32: {
        root: {
          minWidth: vars.size32.enabled.root.width,
          minHeight: vars.size32.enabled.root.height,
          padding: `${vars.size32.enabled.root.paddingY} ${vars.size32.enabled.root.paddingX}`,
        },
        thumb: {
          width: vars.size32.enabled.thumb.width,
          height: vars.size32.enabled.thumb.height,
        },
      },
      24: {
        root: {
          minWidth: vars.size24.enabled.root.width,
          minHeight: vars.size24.enabled.root.height,
          padding: `${vars.size24.enabled.root.paddingY} ${vars.size24.enabled.root.paddingX}`,
        },
        thumb: {
          width: vars.size24.enabled.thumb.width,
          height: vars.size24.enabled.thumb.height,
        },
      },
      16: {
        root: {
          minWidth: vars.size16.enabled.root.width,
          minHeight: vars.size16.enabled.root.height,
          padding: `${vars.size16.enabled.root.paddingY} ${vars.size16.enabled.root.paddingX}`,
        },
        thumb: {
          width: vars.size16.enabled.thumb.width,
          height: vars.size16.enabled.thumb.height,
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
        root: { backgroundColor: vars.toneBrand.enabledSelected.root.color },
      },
    },
    {
      tone: "neutral",
      checked: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.toneNeutral.enabledSelected.root.color },
      },
    },
    {
      tone: "neutral",
      checked: true,
      disabled: true,
      css: {
        root: { backgroundColor: vars.toneNeutral.disabledSelected.root.color },
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
          transform: `scale(${vars.base.selected.thumb.scale}) translateX(${subtractPx(vars.size32.enabled.root.width, vars.size32.enabled.root.height)})`,
        },
      },
    },
    {
      size: "24",
      checked: true,
      css: {
        thumb: {
          transform: `scale(${vars.base.selected.thumb.scale}) translateX(${subtractPx(vars.size24.enabled.root.width, vars.size24.enabled.root.height)})`,
        },
      },
    },
    {
      size: "16",
      checked: true,
      css: {
        thumb: {
          transform: `scale(${vars.base.selected.thumb.scale}) translateX(${subtractPx(vars.size16.enabled.root.width, vars.size16.enabled.root.height)})`,
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
