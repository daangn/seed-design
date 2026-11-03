import type { StyleObject } from "@seed-design/qvism-core";
import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { active, disabled, focusVisible, not, pseudo } from "../utils/pseudo";
import { createScaleFeedbackStyles, FEEDBACK_SCALE_TRANSITION } from "../utils/scale-feedback";
import { vars as tokens } from "../vars/";
import {
  topNavigation as vars,
  topNavigationIconButton as iconButtonVars,
  topNavigationTextButton as textButtonVars,
} from "../vars/component";

export const nextAppBarMain = defineSlotRecipe({
  name: "next-app-bar-main",
  slots: ["root", "title", "subtitle"],
  base: {
    root: {
      flex: 1,
    },
    title: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    subtitle: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  variants: {
    layout: {
      // NOTE: nested clamp — outer component bounds narrow the inner global clamp baked into
      // the token (intersection; requires component range ⊆ global range). see packages/qvism-preset/src/global.ts
      titleOnly: {
        title: {
          fontSize: `clamp(calc(${tokens.$fontSize.t6Static} * ${vars.titleLayoutTitleOnly.enabled.title.minFontSizeScale}), ${vars.titleLayoutTitleOnly.enabled.title.fontSize}, calc(${tokens.$fontSize.t6Static} * ${vars.titleLayoutTitleOnly.enabled.title.maxFontSizeScale}))`,
          fontWeight: vars.titleLayoutTitleOnly.enabled.title.fontWeight,
          lineHeight: `clamp(calc(${tokens.$lineHeight.t6Static} * ${vars.titleLayoutTitleOnly.enabled.title.minLineHeightScale}), ${vars.titleLayoutTitleOnly.enabled.title.lineHeight}, calc(${tokens.$lineHeight.t6Static} * ${vars.titleLayoutTitleOnly.enabled.title.maxLineHeightScale}))`,
        },
      },
      withSubtitle: {
        title: {
          fontSize: `clamp(calc(${tokens.$fontSize.t5Static} * ${vars.titleLayoutWithSubtitle.enabled.title.minFontSizeScale}), ${vars.titleLayoutWithSubtitle.enabled.title.fontSize}, calc(${tokens.$fontSize.t5Static} * ${vars.titleLayoutWithSubtitle.enabled.title.maxFontSizeScale}))`,
          fontWeight: vars.titleLayoutWithSubtitle.enabled.title.fontWeight,
          lineHeight: `clamp(calc(${tokens.$lineHeight.t5Static} * ${vars.titleLayoutWithSubtitle.enabled.title.minLineHeightScale}), ${vars.titleLayoutWithSubtitle.enabled.title.lineHeight}, calc(${tokens.$lineHeight.t5Static} * ${vars.titleLayoutWithSubtitle.enabled.title.maxLineHeightScale}))`,
        },
        subtitle: {
          fontSize: `clamp(calc(${tokens.$fontSize.t2Static} * ${vars.titleLayoutWithSubtitle.enabled.subtitle.minFontSizeScale}), ${vars.titleLayoutWithSubtitle.enabled.subtitle.fontSize}, calc(${tokens.$fontSize.t2Static} * ${vars.titleLayoutWithSubtitle.enabled.subtitle.maxFontSizeScale}))`,
          fontWeight: vars.titleLayoutWithSubtitle.enabled.subtitle.fontWeight,
          lineHeight: `clamp(calc(${tokens.$lineHeight.t2Static} * ${vars.titleLayoutWithSubtitle.enabled.subtitle.minLineHeightScale}), ${vars.titleLayoutWithSubtitle.enabled.subtitle.lineHeight}, calc(${tokens.$lineHeight.t2Static} * ${vars.titleLayoutWithSubtitle.enabled.subtitle.maxLineHeightScale}))`,
        },
      },
    },
    theme: {
      cupertino: {
        root: {
          position: "absolute",
          // Three tracks — spacer / content / spacer — reproduce the native iOS rule: the title
          // holds the bar's centre while it fits, then gives the centre up and grows into
          // whichever side still has room, and truncates only once both edges are reached.
          // Equal `1fr` spacers keep it centred; their `minmax` floors are the left/right areas
          // measured by `useNextAppBar`, so the narrower side stops shrinking first and the
          // title keeps expanding on the other.
          display: "grid",
          gridTemplateColumns: `minmax(calc(var(--centered-title-left, 0px) + ${vars.base.enabled.root.paddingX}), 1fr) minmax(0, auto) minmax(calc(var(--centered-title-right, 0px) + ${vars.base.enabled.root.paddingX}), 1fr)`,
          columnGap: vars.themeIos.enabled.root.titleMinGap,
          alignItems: "center",
          // Title and subtitle stack as two rows, so the block needs centring as well.
          alignContent: "center",
          textAlign: "center",
          top: "var(--seed-safe-area-top)",
          bottom: 0,
          left: "var(--seed-safe-area-left)",
          right: "var(--seed-safe-area-right)",
          pointerEvents: "none",

          // Track indices are strings: the generator appends `px` to bare numbers, which would
          // turn `grid-column: 1` into the invalid `grid-column: 1px`.
          "&::before": {
            content: "''",
            gridColumn: "1",
            gridRow: "1",
          },
          "&::after": {
            content: "''",
            gridColumn: "3",
            gridRow: "1",
          },
        },
        // Pinned to the content track: auto-placement would put Subtitle, the second child, in
        // the trailing spacer, overlapping the right-hand buttons.
        title: {
          gridColumn: "2",
          minWidth: 0,
        },
        subtitle: {
          gridColumn: "2",
          minWidth: 0,
        },
      },
      android: {
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          // `stretch` caps Title and Subtitle at the root's width; a shrink-to-fit item would
          // size to its unwrapped text and never reach its ellipsis.
          alignItems: "stretch",

          width: "100%",
          minWidth: 0, // ensures that the text-overflow works correctly

          height: "100%",
        },
      },
    },
    tone: {
      layer: {
        root: {
          color: vars.toneLayer.enabled.title.color,
        },
        title: {
          color: vars.toneLayer.enabled.title.color,
        },
        subtitle: {
          color: vars.toneLayer.enabled.subtitle.color,
        },
      },
      gradient: {
        root: {
          color: vars.toneTransparent.enabled.title.color,
        },
        title: {
          color: vars.toneTransparent.enabled.title.color,
        },
        subtitle: {
          color: vars.toneTransparent.enabled.subtitle.color,
        },
      },
    },
  },
  defaultVariants: {
    layout: "titleOnly",
    theme: "cupertino",
    tone: "layer",
  },
});

export const nextAppBar = defineSlotRecipe({
  name: "next-app-bar",
  slots: [
    "root",
    "background",
    "row",
    "accessory",
    "left",
    "right",
    "iconButton",
    "textButton",
    "textButtonLabel",
  ],
  base: {
    // Row and accessory stack in normal flow, so the root — and the background
    // filling it — grows with the accessory without being measured.
    root: {
      // The bar lives inside the screen layer (the transition unit), so it has
      // no stack z-index tier — it only needs to sit above the content.
      zIndex: 1,
      top: 0,

      position: "absolute",
      boxSizing: "border-box",
      width: "100%",
    },
    row: {
      // Containing block for the cupertino Main, which spans the row.
      position: "relative",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "flex-end",

      // `--app-bar-height` comes from NextAppScreen, which drops it to 0 when a
      // host draws the bar natively and the safe area already covers it.
      height: `calc(var(--app-bar-height, ${vars.base.enabled.root.height}) + var(--seed-safe-area-top))`,
      paddingLeft: `calc(${vars.base.enabled.root.paddingX} + var(--seed-safe-area-left))`,
      paddingRight: `calc(${vars.base.enabled.root.paddingX} + var(--seed-safe-area-right))`,
      paddingTop: "var(--seed-safe-area-top)",
    },
    // Edge to edge without the side insets: content such as `TabsList` keeps
    // clear of them itself.
    accessory: {
      position: "relative",
    },
    background: {
      position: "absolute",
      pointerEvents: "none",
      inset: 0,
      zIndex: -1,
    },
    left: {
      display: "flex",
      alignItems: "center",
      height: "100%",
    },
    right: {
      display: "flex",
      alignItems: "center",
      height: "100%",
      marginLeft: "auto",
    },
    iconButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      width: iconButtonVars.base.enabled.root.size,
      height: iconButtonVars.base.enabled.root.size,
      ...onlyIcon({ size: iconButtonVars.base.enabled.icon.size }),

      border: "none",
      fontFamily: "inherit",
      padding: 0,

      backgroundColor: iconButtonVars.base.enabled.root.color,
      borderRadius: iconButtonVars.base.enabled.root.cornerRadius,

      transition: `background-color ${iconButtonVars.base.enabled.root.colorDuration} ${iconButtonVars.base.enabled.root.colorTimingFunction}, ${FEEDBACK_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      // `scaleScope: self` in the spec: the button shrinks, not the glyph inside it.
      [pseudo(not(disabled), active)]: {
        backgroundColor: iconButtonVars.base.pressed.root.color,
        ...createScaleFeedbackStyles(),
      },
    },
    textButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // `asChild` can render a link, which defaults to `content-box`; keep `maxWidth` including padding.
      boxSizing: "border-box",
      minWidth: 0,
      height: textButtonVars.base.enabled.root.height,

      border: "none",
      fontFamily: "inherit",
      // `asChild` can render a link; drop its default underline so it matches the button.
      textDecoration: "none",
      paddingBlock: 0,
      paddingInline: textButtonVars.base.enabled.root.paddingX,

      backgroundColor: textButtonVars.base.enabled.root.color,
      borderRadius: textButtonVars.base.enabled.root.cornerRadius,

      transition: `background-color ${textButtonVars.base.enabled.root.colorDuration} ${textButtonVars.base.enabled.root.colorTimingFunction}, ${FEEDBACK_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      [pseudo(not(disabled), active)]: {
        backgroundColor: textButtonVars.base.pressed.root.color,
        ...createScaleFeedbackStyles(),
      },
    },
    // The label inherits the tone color from `textButton`, which also owns the disabled state.
    textButtonLabel: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: `clamp(calc(${tokens.$fontSize.t5Static} * ${textButtonVars.base.enabled.label.minFontSizeScale}), ${textButtonVars.base.enabled.label.fontSize}, calc(${tokens.$fontSize.t5Static} * ${textButtonVars.base.enabled.label.maxFontSizeScale}))`,
      fontWeight: textButtonVars.base.enabled.label.fontWeight,
      lineHeight: `clamp(calc(${tokens.$lineHeight.t5Static} * ${textButtonVars.base.enabled.label.minLineHeightScale}), ${textButtonVars.base.enabled.label.lineHeight}, calc(${tokens.$lineHeight.t5Static} * ${textButtonVars.base.enabled.label.maxLineHeightScale}))`,
    },
  },
  variants: {
    theme: {
      cupertino: {
        textButton: {
          maxWidth: textButtonVars.themeIos.enabled.root.maxWidth,
        },
      },
      android: {
        left: {
          paddingRight: vars.themeAndroid.enabled.main.paddingLeft,
        },
      },
    },
    tone: {
      layer: {
        background: {
          background: `var(--seed-box-background, ${vars.toneLayer.enabled.root.color})`,
        },
        iconButton: {
          ...onlyIcon({ color: iconButtonVars.toneLayer.enabled.icon.color }),
          [pseudo(disabled)]: {
            ...onlyIcon({ color: iconButtonVars.toneLayer.disabled.icon.color }),
          },
        },
        textButton: {
          color: textButtonVars.toneLayer.enabled.label.color,
          [pseudo(disabled)]: {
            color: textButtonVars.toneLayer.disabled.label.color,
          },
        },
      },
      gradient: {
        background: {
          background: `linear-gradient(180deg, ${vars.toneTransparentGradientTrue.enabled.root.gradient.serialized})`,
          height: `calc(100% + ${vars.toneTransparentGradientTrue.enabled.root.bleedBottom})`,
        },
        iconButton: {
          ...onlyIcon({ color: iconButtonVars.toneTransparent.enabled.icon.color }),
          [pseudo(disabled)]: {
            ...onlyIcon({ color: iconButtonVars.toneTransparent.disabled.icon.color }),
          },
        },
        textButton: {
          color: textButtonVars.toneTransparent.enabled.label.color,
          [pseudo(disabled)]: {
            color: textButtonVars.toneTransparent.disabled.label.color,
          },
        },
      },
    },
  },
  defaultVariants: {
    theme: "cupertino",
    tone: "layer",
  },
});

const BACKGROUND_BLUR = 20;
const BACKGROUND_TINT_OPACITY = 0.72;
const BACKGROUND_TRANSITION = "opacity 200ms";

// `NextAppBarBackground` renders the same number of blur layers.
const NEXT_APP_BAR_BACKGROUND_BLUR_LAYERS = 8;

/**
 * Each layer doubles the blur radius of the one below and keeps only its own band, overlapping
 * its neighbours by half so no step edge shows; the top layer runs to the top edge.
 */
const progressiveBlurLayers: Record<`&:nth-child(${number})`, StyleObject> = Object.fromEntries(
  Array.from({ length: NEXT_APP_BAR_BACKGROUND_BLUR_LAYERS }, (_, index) => {
    const step = 100 / (NEXT_APP_BAR_BACKGROUND_BLUR_LAYERS + 1);
    const stops = [
      `transparent ${index * step}%`,
      `black ${(index + 1) * step}%`,
      ...(index < NEXT_APP_BAR_BACKGROUND_BLUR_LAYERS - 1
        ? [`black ${(index + 2) * step}%`, `transparent ${(index + 3) * step}%`]
        : []),
    ];
    const mask = `linear-gradient(to top, ${stops.join(", ")})`;
    const backdropFilter = `blur(${BACKGROUND_BLUR / 2 ** (NEXT_APP_BAR_BACKGROUND_BLUR_LAYERS - 1 - index)}px)`;

    return [
      `&:nth-child(${index + 1})`,
      {
        WebkitBackdropFilter: backdropFilter,
        backdropFilter,
        WebkitMaskImage: mask,
        maskImage: mask,
      },
    ];
  }),
);

/**
 * What a host-drawn bar sits on. The host draws the title and buttons, so unlike `tone` this
 * carries no foreground colour.
 *
 * Every visual effect sits on the layers, never on the root: an ancestor with opacity, a mask or
 * a clip becomes the backdrop root, and `backdrop-filter` below it stops reading the content
 * behind. The tint fades with opacity instead of `color-mix()`, which Safari 15 and Chrome 88
 * lack.
 */
export const nextAppBarBackground = defineSlotRecipe({
  name: "next-app-bar-background",
  slots: ["root", "blur", "tint"],
  base: {
    root: {
      position: "absolute",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
    },
    blur: {
      position: "absolute",
      inset: 0,
      clipPath: "var(--seed-next-app-bar-background-clip-path, none)",
      transition: BACKGROUND_TRANSITION,
    },
    tint: {
      position: "absolute",
      inset: 0,
      clipPath: "var(--seed-next-app-bar-background-clip-path, none)",
      background: `var(--seed-box-background, ${vars.toneLayer.enabled.root.color})`,
      transition: BACKGROUND_TRANSITION,
    },
  },
  variants: {
    material: {
      progressiveBlur: {
        blur: progressiveBlurLayers,
        tint: {
          opacity: BACKGROUND_TINT_OPACITY,
          WebkitMaskImage: "linear-gradient(black, transparent)",
          maskImage: "linear-gradient(black, transparent)",
        },
      },
      // `progressiveBlur` faded out, so switching between the two fades instead of cutting.
      transparent: {
        blur: { ...progressiveBlurLayers, opacity: 0 },
        tint: {
          opacity: 0,
          WebkitMaskImage: "linear-gradient(black, transparent)",
          maskImage: "linear-gradient(black, transparent)",
        },
      },
      translucent: {
        blur: {
          WebkitBackdropFilter: `blur(${BACKGROUND_BLUR}px) saturate(180%)`,
          backdropFilter: `blur(${BACKGROUND_BLUR}px) saturate(180%)`,
        },
        tint: {
          opacity: BACKGROUND_TINT_OPACITY,
        },
      },
    },
  },
  defaultVariants: {
    material: "progressiveBlur",
  },
});
