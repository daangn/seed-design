// NOTE: dialog naming is mid-rename; rootage/vars already use the new names, recipes and react components still use the old ones.
// Semantically (= snippet naming), this recipe is the Dialog:
//   snippet AlertDialog → react Dialog        → recipe "dialog"         → vars alertDialog
//   snippet Dialog      → react ContentDialog → recipe "content-dialog" → vars dialog

import { dialog as vars, dialogCloseButton as closeButtonVars } from "../vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { breakpoints } from "../utils/breakpoint";
import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { createPressScaleStyles, PRESS_SCALE_TRANSITION } from "../utils/press-scale";
import { active, engaged, focusVisible, not, open, pseudo } from "../utils/pseudo";

const contentDialog = defineSlotRecipe({
  name: "content-dialog",
  slots: [
    "positioner",
    "backdrop",
    "content",
    "header",
    "body",
    "footer",
    "title",
    "description",
    "closeButton",
  ],
  base: {
    positioner: {
      position: "fixed",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      inset: 0,
      overscrollBehaviorY: "none",

      "--dialog-z-index": "2",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      inset: 0,
      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",

      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.enabled.backdrop.enterTimingFunction,
        duration: vars.base.enabled.backdrop.enterDuration,
        opacity: vars.base.enabled.backdrop.enterOpacity,
      }),
      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.enabled.backdrop.exitTimingFunction,
        duration: vars.base.enabled.backdrop.exitDuration,
        opacity: vars.base.enabled.backdrop.exitOpacity,
      }),
    },
    content: {
      position: "relative",
      // The role="dialog" container receives focus on open (a programmatic focus
      // target, not interactive), so it must never render a focus ring.
      outline: "none",
      display: "flex",
      flex: "0 0 auto",
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      borderRadius: vars.base.enabled.content.cornerRadius,

      // Default width routed through real-valued custom properties so the responsive var
      // chain never links `--foo: var(<guaranteed-invalid>)` — see https://webkit.org/b/241433
      // and the same pattern in side-panel. Mobile-first: viewport fraction below md,
      // size-capped token width at md+ (the cap is the only value that differs by size —
      // see variants). A consumer `width`/`maxWidth` StyleProp still wins via the chain.
      "--content-dialog-default-width": `calc(${vars.base.enabled.content.widthFraction} * 100vw)`,
      "--content-dialog-default-max-width": `calc(${vars.base.enabled.content.widthFraction} * 100%)`,
      "--seed-box-width--responsive": "var(--content-dialog-default-width)",
      "--seed-box-max-width--responsive": "var(--content-dialog-default-max-width)",
      width: "var(--seed-box-width)",
      maxWidth: "var(--seed-box-max-width)",
      // Cap the height so a tall body scrolls within the dialog instead of overflowing the viewport.
      // dvh tracks the mobile browser UI collapse; vh is listed first as the fallback for engines
      // without dynamic-viewport-unit support. The array emits both declarations, so the cascade
      // keeps dvh where parsed and falls back to vh where it isn't.
      maxHeight: [
        `calc(${vars.base.enabled.content.maxHeightFraction} * 100vh)`,
        `calc(${vars.base.enabled.content.maxHeightFraction} * 100dvh)`,
      ],
      [breakpoints.up("md")]: {
        "--content-dialog-default-width": "var(--content-dialog-size-width)",
        "--content-dialog-default-max-width": `calc(100vw - 2 * ${vars.base.enabled.content.marginX})`,
      },

      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.enabled.content.enterTimingFunction,
        duration: vars.base.enabled.content.enterDuration,
        opacity: vars.base.enabled.content.enterOpacity,
        scale: vars.base.enabled.content.enterScale,
      }),
      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.enabled.content.exitTimingFunction,
        duration: vars.base.enabled.content.exitDuration,
        opacity: vars.base.enabled.content.exitOpacity,
      }),
    },
    header: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,

      gap: vars.base.enabled.header.gap,
      paddingInline: vars.base.enabled.header.paddingX,
      paddingTop: vars.base.enabled.header.paddingTop,
      paddingBottom: vars.base.enabled.header.paddingBottom,

      // Reserve room on the right so the title/description never run under the close button.
      [pseudo("[data-show-close-button]")]: {
        paddingRight: `calc(${vars.base.enabled.closeButton.fromRight} + ${closeButtonVars.base.enabled.icon.size} + ${vars.base.enabled.header.closeButtonGap})`,
      },
    },
    body: {
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      flex: 1,
      overflowY: "auto",

      "--seed-box-padding-x--responsive": vars.base.enabled.body.paddingX,
      // real values, not `initial` — see https://webkit.org/b/241433
      // min-height 0, not auto: lets the flexed body shrink below its content size
      // so it scrolls within the content's maxHeight cap instead of stretching it.
      "--seed-box-min-height--responsive": "0",
      "--seed-box-max-height--responsive": "none",
      "--seed-box-justify-content": "initial",
      "--seed-box-align-items": "initial",
      paddingInline: "var(--seed-box-padding-x)",
      minHeight: "var(--seed-box-min-height)",
      maxHeight: "var(--seed-box-max-height)",
      justifyContent: "var(--seed-box-justify-content)",
      alignItems: "var(--seed-box-align-items)",

      transition: `box-shadow ${vars.base.enabled.body.strokeDuration} ${vars.base.enabled.body.strokeTimingFunction}`,
      [pseudo("[data-scrolled]", not(":first-child"))]: {
        boxShadow: `inset 0 ${vars.base.scrolled.body.strokeWidth} 0 0 ${vars.base.scrolled.body.strokeColor}`,
      },

      // Bottom padding + fade apply only while the body overflows (is scrollable),
      // toggled by data-overflow from the styled layer. Applying them unconditionally
      // fades near-fitting content that can never be scrolled clear of the fade band.
      [pseudo("[data-overflow]")]: {
        paddingBottom: vars.base.enabled.body.paddingBottom,
        maskImage: `linear-gradient(to top, transparent 0, black ${vars.base.enabled.body.paddingBottom})`,
        WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${vars.base.enabled.body.paddingBottom})`,
      },

      // body can have focus when it overflows
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: {
        ...createFocusRingStyles({ position: "inside" }),
      },
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,

      margin: 0,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,

      margin: 0,
      whiteSpace: "pre-wrap",
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      flexShrink: 0,

      paddingInline: vars.base.enabled.footer.paddingX,
      paddingTop: vars.base.enabled.footer.paddingTop,
      paddingBottom: vars.base.enabled.footer.paddingBottom,
    },
    closeButton: {
      position: "absolute",
      top: vars.base.enabled.closeButton.fromTop,
      right: vars.base.enabled.closeButton.fromRight,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "none",
      background: closeButtonVars.base.enabled.root.color,
      borderRadius: closeButtonVars.base.enabled.root.cornerRadius,

      padding: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.icon.size}) / 2)`,
      margin: `calc((${closeButtonVars.base.enabled.icon.size} - ${closeButtonVars.base.enabled.root.size}) / 2)`,

      cursor: "pointer",

      transition: `background ${closeButtonVars.base.enabled.root.colorDuration} ${closeButtonVars.base.enabled.root.colorTimingFunction}, ${PRESS_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,

      ...onlyIcon({
        color: closeButtonVars.base.enabled.icon.color,
        size: closeButtonVars.base.enabled.icon.size,
      }),

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(active)]: { ...createPressScaleStyles() },
      [pseudo(engaged)]: {
        background: closeButtonVars.base.pressed.root.color,
      },
    },
  },
  variants: {
    size: {
      // medium and large differ only in the md+ capped width,
      // consumed by the base `--content-dialog-default-width` switch at md+.
      medium: {
        content: {
          "--content-dialog-size-width": vars.sizeMedium.enabled.content.maxWidth,
        },
      },
      large: {
        content: {
          "--content-dialog-size-width": vars.sizeLarge.enabled.content.maxWidth,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default contentDialog;
