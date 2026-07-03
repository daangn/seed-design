import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { breakpoints } from "../utils/breakpoint";
import { engaged, focus, focusVisible, not, open, pseudo } from "../utils/pseudo";
import { sidePanelCloseButton as closeButtonVars, sidePanel as vars } from "../vars/component";

const sidePanel = defineSlotRecipe({
  name: "side-panel",
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
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overscrollBehaviorY: "none",

      "--side-panel-z-index": "2",
      zIndex: "calc(var(--side-panel-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--side-panel-z-index) + var(--layer-index, 0))",

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
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--side-panel-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      touchAction: "none",
      willChange: "transform",

      "--seed-box-width--responsive": "initial",
      "--seed-box-max-width--responsive": `calc(${vars.base.enabled.content.widthFraction} * 100%)`,

      // Full height, anchored top/bottom; the left/right edge is set per direction.
      // Mobile-first: width fraction on sm-, token width on md+.
      top: 0,
      bottom: 0,
      width: `var(--seed-box-width, calc(${vars.base.enabled.content.widthFraction} * 100vw))`,
      maxWidth: "var(--seed-box-max-width)",

      // Respect device safe-area on bottom edge (e.g. iOS home indicator);
      // applied on content so it holds even when the footer is not rendered.
      paddingBottom: "var(--seed-safe-area-bottom)",

      [breakpoints.up("md")]: {
        width: "var(--seed-box-width, var(--side-panel-size-width))",
      },

      // Bleed the panel background past the anchored edge (direction sets the side).
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        width: "100vw",
        background: "inherit",
        zIndex: -1,
      },

      [pseudo(focus)]: {
        outline: "none",
      },

      // Per-direction: anchored edge, landscape-notch safe-area, and background-bleed side.
      [pseudo("[data-drawer-direction='left']")]: {
        left: 0,
        paddingLeft: "env(safe-area-inset-left, 0)",
        "&::after": { right: "100%" },
      },
      [pseudo("[data-drawer-direction='right']")]: {
        right: 0,
        paddingRight: "env(safe-area-inset-right, 0)",
        "&::after": { left: "100%" },
      },

      // Direction-based slide animations
      [pseudo(open, "[data-drawer-direction='right']")]: enterAnimation({
        timingFunction: vars.base.enabled.content.enterTimingFunction,
        duration: vars.base.enabled.content.enterDuration,
        translateX: "100%",
      }),
      [pseudo(not(open), "[data-drawer-direction='right']")]: exitAnimation({
        timingFunction: vars.base.enabled.content.exitTimingFunction,
        duration: vars.base.enabled.content.exitDuration,
        translateX: "100%",
      }),
      [pseudo(open, "[data-drawer-direction='left']")]: enterAnimation({
        timingFunction: vars.base.enabled.content.enterTimingFunction,
        duration: vars.base.enabled.content.enterDuration,
        translateX: "-100%",
      }),
      [pseudo(not(open), "[data-drawer-direction='left']")]: exitAnimation({
        timingFunction: vars.base.enabled.content.exitTimingFunction,
        duration: vars.base.enabled.content.exitDuration,
        translateX: "-100%",
      }),
    },
    header: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",

      gap: vars.base.enabled.header.gap,
      minHeight: `calc(${vars.base.enabled.header.minHeight} + var(--seed-safe-area-top))`,
      paddingLeft: vars.base.enabled.header.paddingX,
      paddingRight: vars.base.enabled.header.paddingX,

      paddingTop: `calc(${vars.base.enabled.header.paddingTop} + var(--seed-safe-area-top))`,
      paddingBottom: vars.base.enabled.header.paddingBottom,

      [pseudo("[data-show-close-button]")]: {
        paddingRight: `calc(${vars.base.enabled.closeButton.fromRight} + ${closeButtonVars.base.enabled.icon.size} + ${vars.base.enabled.header.closeButtonGap})`,
      },
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,
      wordBreak: "keep-all",

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
    body: {
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      flex: 1,
      overflowY: "auto",

      "--seed-box-padding-x--responsive": vars.base.enabled.body.paddingX,
      // real values, not `initial` — see https://webkit.org/b/241433
      "--seed-box-height--responsive": "auto",
      "--seed-box-min-height--responsive": "auto",
      "--seed-box-max-height--responsive": "none",
      "--seed-box-justify-content": "initial",
      "--seed-box-align-items": "initial",
      paddingLeft: "var(--seed-box-padding-x)",
      paddingRight: "var(--seed-box-padding-x)",
      paddingBottom: vars.base.enabled.body.paddingBottom, // reserve room for the bottom scroll fog
      height: "var(--seed-box-height)",
      minHeight: "var(--seed-box-min-height)",
      maxHeight: "var(--seed-box-max-height)",
      justifyContent: "var(--seed-box-justify-content)",
      alignItems: "var(--seed-box-align-items)",

      // top divider: appears when the body is scrolled away from top, but only when a header sits
      // above it — i.e. the body is not the content's first child (toggled via JS data-scrolled attribute)
      transition: `box-shadow ${vars.base.enabled.body.strokeDuration} ${vars.base.enabled.body.strokeTimingFunction}`,
      [pseudo("[data-scrolled]", not(":first-child"))]: {
        boxShadow: `inset 0 ${vars.base.scrolled.body.strokeWidth} 0 0 ${vars.base.scrolled.body.strokeColor}`,
      },

      // bottom scroll fog: always fades the last bit of content into the panel surface; its height equals the body's paddingBottom
      maskImage: `linear-gradient(to top, transparent 0, black ${vars.base.enabled.body.paddingBottom})`,
      WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${vars.base.enabled.body.paddingBottom})`,
    },
    footer: {
      display: "flex",
      flexDirection: "column",

      paddingLeft: vars.base.enabled.footer.paddingX,
      paddingRight: vars.base.enabled.footer.paddingX,
      paddingTop: vars.base.enabled.footer.paddingTop,
      paddingBottom: vars.base.enabled.footer.paddingBottom,
    },
    closeButton: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "none",
      background: closeButtonVars.base.enabled.root.color,

      top: `calc(${vars.base.enabled.closeButton.fromTop} + var(--seed-safe-area-top))`,
      right: vars.base.enabled.closeButton.fromRight,
      borderRadius: closeButtonVars.base.enabled.root.cornerRadius,

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
    size: {
      small: {
        content: {
          "--side-panel-size-width": vars.sizeSmall.enabled.content.width,
        },
      },
      medium: {
        content: {
          "--side-panel-size-width": vars.sizeMedium.enabled.content.width,
        },
      },
      large: {
        content: {
          "--side-panel-size-width": vars.sizeLarge.enabled.content.width,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default sidePanel;
