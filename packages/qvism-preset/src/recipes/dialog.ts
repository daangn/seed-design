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
import { engaged, focus, focusVisible, not, open, pseudo } from "../utils/pseudo";

const dialog = defineSlotRecipe({
  name: "dialog",
  slots: [
    "positioner",
    "backdrop",
    "content",
    "header",
    "body",
    "footer",
    "action",
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
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overscrollBehaviorY: "none",

      "--dialog-z-index": "2",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
    },
    content: {
      position: "relative",
      // The role="dialog" container receives focus on open (a programmatic focus
      // target, not interactive), so it must never render a focus ring.
      outline: "none",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      borderRadius: vars.base.enabled.content.cornerRadius,

      [pseudo(focus)]: {
        outline: "none",
      },
    },
    header: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,

      gap: vars.base.enabled.header.gap,
    },
    body: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
    },
    title: {
      color: vars.base.enabled.title.color,
      fontWeight: vars.base.enabled.title.fontWeight,

      margin: 0,
    },
    description: {
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
    },
    closeButton: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "none",
      background: closeButtonVars.base.enabled.root.color,
      borderRadius: closeButtonVars.base.enabled.root.cornerRadius,

      // Expand the hit area to root.size while keeping the icon visually at icon.size:
      // pad out to the tap target, then pull back with a negative margin of the same delta.
      padding: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.icon.size}) / 2)`,
      margin: `calc((${closeButtonVars.base.enabled.icon.size} - ${closeButtonVars.base.enabled.root.size}) / 2)`,

      cursor: "pointer",

      transition: `background ${closeButtonVars.base.enabled.root.colorDuration} ${closeButtonVars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      ...onlyIcon({
        color: closeButtonVars.base.enabled.icon.color,
        size: closeButtonVars.base.enabled.icon.size,
      }),

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(engaged)]: {
        background: closeButtonVars.base.pressed.root.color,
      },
    },
  },
  variants: {
    skipAnimation: {
      false: {
        backdrop: {
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
      },
    },
    size: {
      alert: {
        content: {
          maxWidth: vars.sizeAlert.enabled.content.maxWidth,
          margin: `auto ${vars.sizeAlert.enabled.content.marginX}`,
        },
        header: {
          paddingLeft: vars.sizeAlert.enabled.header.paddingX,
          paddingRight: vars.sizeAlert.enabled.header.paddingX,
          paddingTop: vars.sizeAlert.enabled.header.paddingTop,
        },
        title: {
          fontSize: vars.sizeAlert.enabled.title.fontSize,
          lineHeight: vars.sizeAlert.enabled.title.lineHeight,
        },
        description: {
          color: vars.sizeAlert.enabled.description.color,
        },
        footer: {
          paddingLeft: vars.sizeAlert.enabled.footer.paddingX,
          paddingRight: vars.sizeAlert.enabled.footer.paddingX,
          paddingTop: vars.sizeAlert.enabled.footer.paddingTop,
          paddingBottom: vars.sizeAlert.enabled.footer.paddingBottom,
        },
      },
      medium: {
        content: {
          // Mobile-first: fixed viewport fraction below md, capped token width at md+.
          flex: "0 0 auto",
          width: `calc(${vars.sizeMedium.enabled.content.widthFraction} * 100vw)`,
          // Cap the height so a tall body scrolls within the dialog instead of overflowing the viewport.
          maxHeight: `calc(${vars.sizeMedium.enabled.content.maxHeightFraction} * 100vh)`,
          [breakpoints.up("md")]: {
            width: vars.sizeMedium.enabled.content.maxWidth,
            maxWidth: `calc(100vw - 2 * ${vars.sizeMedium.enabled.content.marginX})`,
          },
        },
        header: {
          paddingLeft: vars.sizeMedium.enabled.header.paddingX,
          paddingRight: vars.sizeMedium.enabled.header.paddingX,
          paddingTop: vars.sizeMedium.enabled.header.paddingTop,
          paddingBottom: vars.sizeMedium.enabled.header.paddingBottom,

          // Reserve room on the right so the title/description never run under the close button.
          [pseudo("[data-show-close-button]")]: {
            paddingRight: `calc(${vars.sizeMedium.enabled.closeButton.fromRight} + ${closeButtonVars.base.enabled.icon.size} + ${vars.base.enabled.header.closeButtonGap})`,
          },
        },
        body: {
          paddingLeft: vars.sizeMedium.enabled.body.paddingX,
          paddingRight: vars.sizeMedium.enabled.body.paddingX,
          paddingBottom: vars.sizeMedium.enabled.body.paddingBottom,

          // Top divider: shows when the body is scrolled and it isn't the first child (a header sits above it).
          transition: `box-shadow ${vars.sizeMedium.enabled.body.strokeDuration} ${vars.sizeMedium.enabled.body.strokeTimingFunction}`,
          [pseudo("[data-scrolled]", not(":first-child"))]: {
            boxShadow: `inset 0 ${vars.sizeMedium.scrolled.body.strokeWidth} 0 0 ${vars.sizeMedium.scrolled.body.strokeColor}`,
          },

          // Bottom scroll fog: fade the last bit of content into the surface; its height equals the body's paddingBottom.
          maskImage: `linear-gradient(to top, transparent 0, black ${vars.sizeMedium.enabled.body.paddingBottom})`,
          WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${vars.sizeMedium.enabled.body.paddingBottom})`,
        },
        footer: {
          paddingLeft: vars.sizeMedium.enabled.footer.paddingX,
          paddingRight: vars.sizeMedium.enabled.footer.paddingX,
          paddingTop: vars.sizeMedium.enabled.footer.paddingTop,
          paddingBottom: vars.sizeMedium.enabled.footer.paddingBottom,
        },
        title: {
          fontSize: vars.sizeMedium.enabled.title.fontSize,
          lineHeight: vars.sizeMedium.enabled.title.lineHeight,
        },
        description: {
          color: vars.sizeMedium.enabled.description.color,
        },
        closeButton: {
          top: vars.sizeMedium.enabled.closeButton.fromTop,
          right: vars.sizeMedium.enabled.closeButton.fromRight,
        },
      },
      large: {
        content: {
          flex: "0 0 auto",
          width: `calc(${vars.sizeLarge.enabled.content.widthFraction} * 100vw)`,
          // Cap the height so a tall body scrolls within the dialog instead of overflowing the viewport.
          maxHeight: `calc(${vars.sizeLarge.enabled.content.maxHeightFraction} * 100vh)`,
          [breakpoints.up("md")]: {
            width: vars.sizeLarge.enabled.content.maxWidth,
            maxWidth: `calc(100vw - 2 * ${vars.sizeLarge.enabled.content.marginX})`,
          },
        },
        header: {
          paddingLeft: vars.sizeLarge.enabled.header.paddingX,
          paddingRight: vars.sizeLarge.enabled.header.paddingX,
          paddingTop: vars.sizeLarge.enabled.header.paddingTop,
          paddingBottom: vars.sizeLarge.enabled.header.paddingBottom,

          [pseudo("[data-show-close-button]")]: {
            paddingRight: `calc(${vars.sizeLarge.enabled.closeButton.fromRight} + ${closeButtonVars.base.enabled.icon.size} + ${vars.base.enabled.header.closeButtonGap})`,
          },
        },
        body: {
          paddingLeft: vars.sizeLarge.enabled.body.paddingX,
          paddingRight: vars.sizeLarge.enabled.body.paddingX,
          paddingBottom: vars.sizeLarge.enabled.body.paddingBottom,

          transition: `box-shadow ${vars.sizeLarge.enabled.body.strokeDuration} ${vars.sizeLarge.enabled.body.strokeTimingFunction}`,
          [pseudo("[data-scrolled]", not(":first-child"))]: {
            boxShadow: `inset 0 ${vars.sizeLarge.scrolled.body.strokeWidth} 0 0 ${vars.sizeLarge.scrolled.body.strokeColor}`,
          },

          maskImage: `linear-gradient(to top, transparent 0, black ${vars.sizeLarge.enabled.body.paddingBottom})`,
          WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${vars.sizeLarge.enabled.body.paddingBottom})`,
        },
        footer: {
          paddingLeft: vars.sizeLarge.enabled.footer.paddingX,
          paddingRight: vars.sizeLarge.enabled.footer.paddingX,
          paddingTop: vars.sizeLarge.enabled.footer.paddingTop,
          paddingBottom: vars.sizeLarge.enabled.footer.paddingBottom,
        },
        title: {
          fontSize: vars.sizeLarge.enabled.title.fontSize,
          lineHeight: vars.sizeLarge.enabled.title.lineHeight,
        },
        description: {
          color: vars.sizeLarge.enabled.description.color,
        },
        closeButton: {
          top: vars.sizeLarge.enabled.closeButton.fromTop,
          right: vars.sizeLarge.enabled.closeButton.fromRight,
        },
      },
    },
  },
  defaultVariants: {
    skipAnimation: false,
    size: "alert",
  },
});

export default dialog;
