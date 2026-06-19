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
      "--seed-box-height--responsive": "initial",
      "--seed-box-max-height--responsive": "initial",
      maxWidth: "var(--seed-box-max-width)",

      [pseudo(focus)]: {
        outline: "none",
      },

      // Left/Right: full height, anchored to the corresponding edge.
      // Mobile-first: width fraction on sm-, token width on md+.
      // Safe-area: panel side gets safe-area-inset padding for landscape notch.
      [pseudo("[data-drawer-direction='left']")]: {
        top: 0,
        bottom: 0,
        left: 0,
        width: `var(--seed-box-width, calc(${vars.base.enabled.content.widthFraction} * 100vw))`,
        paddingLeft: "env(safe-area-inset-left, 0)",
        "&::after": {
          content: '""',
          position: "absolute",
          right: "100%",
          width: "100vw",
          top: 0,
          bottom: 0,
          background: "inherit",
          zIndex: -1,
        },
        [breakpoints.up("md")]: {
          width: "var(--seed-box-width, var(--side-panel-size-width))",
        },
      },
      [pseudo("[data-drawer-direction='right']")]: {
        top: 0,
        bottom: 0,
        right: 0,
        width: `var(--seed-box-width, calc(${vars.base.enabled.content.widthFraction} * 100vw))`,
        paddingRight: "env(safe-area-inset-right, 0)",
        "&::after": {
          content: '""',
          position: "absolute",
          left: "100%",
          width: "100vw",
          top: 0,
          bottom: 0,
          background: "inherit",
          zIndex: -1,
        },
        [breakpoints.up("md")]: {
          width: "var(--seed-box-width, var(--side-panel-size-width))",
        },
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
      // Respect device safe-area on top edge (e.g. iOS status bar / notch in portrait)
      paddingTop: `calc(${vars.base.enabled.header.paddingTop} + var(--seed-safe-area-top))`,
      paddingBottom: vars.base.enabled.header.paddingBottom,

      [pseudo("[data-show-close-button]")]: {
        paddingRight: `calc(${vars.base.enabled.header.paddingX} + ${closeButtonVars.base.enabled.root.targetSize})`,
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
      flex: 1,
      overflowY: "auto",

      "--seed-box-padding-x--responsive": vars.base.enabled.body.paddingX,
      "--seed-box-height--responsive": "initial",
      "--seed-box-min-height--responsive": "initial",
      "--seed-box-max-height--responsive": "initial",
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
      transition: `box-shadow ${vars.base.enabled.body.transitionDuration} ${vars.base.enabled.body.transitionTimingFunction}`,
      [pseudo("[data-scrolled]", not(":first-child"))]: {
        boxShadow: `inset 0 1px 0 0 ${vars.base.scrolled.body.stroke}`,
      },

      // bottom scroll fog: always fades the last bit of content into the panel surface; its height equals the body's paddingBottom
      maskImage: `linear-gradient(to top, transparent 0, black ${vars.base.enabled.body.paddingBottom})`,
      WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${vars.base.enabled.body.paddingBottom})`,
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",

      paddingLeft: vars.base.enabled.footer.paddingX,
      paddingRight: vars.base.enabled.footer.paddingX,
      paddingTop: vars.base.enabled.footer.paddingTop,
      // Respect device safe-area on bottom edge (e.g. iOS home indicator)
      paddingBottom: `calc(${vars.base.enabled.footer.paddingBottom} + var(--seed-safe-area-bottom))`,
    },
    closeButton: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "none",

      top: `calc(${vars.base.enabled.closeButton.fromTop} + var(--seed-safe-area-top))`,
      right: vars.base.enabled.closeButton.fromRight,
      borderRadius: closeButtonVars.base.enabled.root.cornerRadius,
      background: closeButtonVars.base.enabled.root.color,
      width: closeButtonVars.base.enabled.root.size,
      height: closeButtonVars.base.enabled.root.size,
      cursor: "pointer",

      ...onlyIcon({
        color: closeButtonVars.base.enabled.icon.color,
        size: closeButtonVars.base.enabled.icon.size,
      }),

      "& :where(.seed-icon)": {
        transition: `color ${closeButtonVars.base.enabled.icon.colorDuration} ${closeButtonVars.base.enabled.icon.colorTimingFunction}`,
      },

      [pseudo(engaged)]: {
        "--seed-icon-color": closeButtonVars.base.pressed.icon.color,
      },

      "&:after": {
        content: '""',

        position: "absolute",
        top: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.root.targetSize}) / 2)`,
        right: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.root.targetSize}) / 2)`,
        bottom: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.root.targetSize}) / 2)`,
        left: `calc((${closeButtonVars.base.enabled.root.size} - ${closeButtonVars.base.enabled.root.targetSize}) / 2)`,

        borderRadius: closeButtonVars.base.enabled.root.cornerRadius,

        ...createFocusRingRestStyles({ position: "inside" }),
        transition: FOCUS_RING_TRANSITION,
      },

      [pseudo(focus)]: {
        outline: "none",
      },

      [pseudo(focusVisible)]: {
        "&:after": {
          ...createFocusRingStyles({ position: "inside" }),
        },
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
