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
import { engaged, focusVisible, not, open, pseudo } from "../utils/pseudo";

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
      background: vars.base.rest.backdrop.color,
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",

      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.rest.backdrop.enterTimingFunction,
        duration: vars.base.rest.backdrop.enterDuration,
        opacity: vars.base.rest.backdrop.enterOpacity,
      }),
      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.rest.backdrop.exitTimingFunction,
        duration: vars.base.rest.backdrop.exitDuration,
        opacity: vars.base.rest.backdrop.exitOpacity,
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

      background: vars.base.rest.content.color,
      borderRadius: vars.base.rest.content.cornerRadius,

      // Default width routed through real-valued custom properties so the responsive var
      // chain never links `--foo: var(<guaranteed-invalid>)` — see https://webkit.org/b/241433
      // and the same pattern in side-panel. Mobile-first: viewport fraction below md,
      // size-capped token width at md+ (the cap is the only value that differs by size —
      // see variants). A consumer `width`/`maxWidth` StyleProp still wins via the chain.
      "--content-dialog-default-width": `calc(${vars.base.rest.content.widthFraction} * 100vw)`,
      "--content-dialog-default-max-width": `calc(${vars.base.rest.content.widthFraction} * 100%)`,
      "--seed-box-width--responsive": "var(--content-dialog-default-width)",
      "--seed-box-max-width--responsive": "var(--content-dialog-default-max-width)",
      width: "var(--seed-box-width)",
      maxWidth: "var(--seed-box-max-width)",
      // Cap the height so a tall body scrolls within the dialog instead of overflowing the viewport.
      // dvh tracks the mobile browser UI collapse; vh is listed first as the fallback for engines
      // without dynamic-viewport-unit support. The array emits both declarations, so the cascade
      // keeps dvh where parsed and falls back to vh where it isn't.
      maxHeight: [
        `calc(${vars.base.rest.content.maxHeightFraction} * 100vh)`,
        `calc(${vars.base.rest.content.maxHeightFraction} * 100dvh)`,
      ],
      [breakpoints.up("md")]: {
        "--content-dialog-default-width": "var(--content-dialog-size-width)",
        "--content-dialog-default-max-width": `calc(100vw - 2 * ${vars.base.rest.content.marginX})`,
      },

      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.rest.content.enterTimingFunction,
        duration: vars.base.rest.content.enterDuration,
        opacity: vars.base.rest.content.enterOpacity,
        scale: vars.base.rest.content.enterScale,
      }),
      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.rest.content.exitTimingFunction,
        duration: vars.base.rest.content.exitDuration,
        opacity: vars.base.rest.content.exitOpacity,
      }),
    },
    header: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,

      gap: vars.base.rest.header.gap,
      paddingInline: vars.base.rest.header.paddingX,
      paddingTop: vars.base.rest.header.paddingTop,
      paddingBottom: vars.base.rest.header.paddingBottom,

      // Reserve room on the right so the title/description never run under the close button.
      [pseudo("[data-show-close-button]")]: {
        paddingRight: `calc(${vars.base.rest.closeButton.fromRight} + ${closeButtonVars.base.rest.icon.size} + ${vars.base.rest.header.closeButtonGap})`,
      },
    },
    body: {
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      flex: 1,
      overflowY: "auto",

      "--seed-box-padding-x--responsive": vars.base.rest.body.paddingX,
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

      transition: `box-shadow ${vars.base.rest.body.strokeDuration} ${vars.base.rest.body.strokeTimingFunction}`,
      [pseudo("[data-scrolled]", not(":first-child"))]: {
        boxShadow: `inset 0 ${vars.base.scrolled.body.strokeWidth} 0 0 ${vars.base.scrolled.body.strokeColor}`,
      },

      // Bottom padding + fade apply only while the body overflows (is scrollable),
      // toggled by data-overflow from the styled layer. Applying them unconditionally
      // fades near-fitting content that can never be scrolled clear of the fade band.
      [pseudo("[data-overflow]")]: {
        paddingBottom: vars.base.rest.body.paddingBottom,
        maskImage: `linear-gradient(to top, transparent 0, black ${vars.base.rest.body.paddingBottom})`,
        WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${vars.base.rest.body.paddingBottom})`,
      },

      // body can have focus when it overflows
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: {
        ...createFocusRingStyles({ position: "inside" }),
      },
    },
    title: {
      color: vars.base.rest.title.color,
      fontSize: vars.base.rest.title.fontSize,
      lineHeight: vars.base.rest.title.lineHeight,
      fontWeight: vars.base.rest.title.fontWeight,

      margin: 0,
    },
    description: {
      color: vars.base.rest.description.color,
      fontSize: vars.base.rest.description.fontSize,
      lineHeight: vars.base.rest.description.lineHeight,
      fontWeight: vars.base.rest.description.fontWeight,

      margin: 0,
      whiteSpace: "pre-wrap",
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      flexShrink: 0,

      paddingInline: vars.base.rest.footer.paddingX,
      paddingTop: vars.base.rest.footer.paddingTop,
      paddingBottom: vars.base.rest.footer.paddingBottom,
    },
    closeButton: {
      position: "absolute",
      top: vars.base.rest.closeButton.fromTop,
      right: vars.base.rest.closeButton.fromRight,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "none",
      background: closeButtonVars.base.rest.root.color,
      borderRadius: closeButtonVars.base.rest.root.cornerRadius,

      padding: `calc((${closeButtonVars.base.rest.root.size} - ${closeButtonVars.base.rest.icon.size}) / 2)`,
      margin: `calc((${closeButtonVars.base.rest.icon.size} - ${closeButtonVars.base.rest.root.size}) / 2)`,

      cursor: "pointer",

      transition: `background ${closeButtonVars.base.rest.root.colorDuration} ${closeButtonVars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      ...onlyIcon({
        color: closeButtonVars.base.rest.icon.color,
        size: closeButtonVars.base.rest.icon.size,
      }),

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

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
          "--content-dialog-size-width": vars.sizeMedium.rest.content.maxWidth,
        },
      },
      large: {
        content: {
          "--content-dialog-size-width": vars.sizeLarge.rest.content.maxWidth,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default contentDialog;
