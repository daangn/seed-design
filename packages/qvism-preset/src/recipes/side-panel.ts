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
      inset: 0,
      overscrollBehaviorY: "none",

      "--side-panel-z-index": "2",
      zIndex: "calc(var(--side-panel-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      inset: 0,
      background: vars.base.rest.backdrop.color,
      zIndex: "calc(var(--side-panel-z-index) + var(--layer-index, 0))",

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
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--side-panel-z-index) + var(--layer-index, 0))",

      background: vars.base.rest.content.color,
      touchAction: "none",
      willChange: "transform",

      // Default width routed through a real-valued custom property so the responsive var
      // chain never links `--foo: var(<guaranteed-invalid>)`. On WebKit before the
      // guaranteed-invalid fix (Safari <16.4, incl. iOS 16.0.x) such a link leaks the
      // inherited ancestor value instead of staying guaranteed-invalid — see
      // https://webkit.org/b/241433. Mobile-first: viewport fraction on sm-, size token on
      // md+ (overridden below). A consumer `width` StyleProp still wins via the chain.
      "--side-panel-default-width": `calc(${vars.base.rest.content.widthFraction} * 100vw)`,
      "--seed-box-width--responsive": "var(--side-panel-default-width)",
      "--seed-box-max-width--responsive": `calc(${vars.base.rest.content.widthFraction} * 100%)`,

      // Full height, anchored top/bottom; the left/right edge is set per direction.
      insetBlock: 0,
      width: "var(--seed-box-width)",
      maxWidth: "var(--seed-box-max-width)",

      // Respect device safe-area on bottom edge (e.g. iOS home indicator);
      // applied on content so it holds even when the footer is not rendered.
      paddingBottom: "var(--seed-safe-area-bottom)",

      [breakpoints.up("md")]: {
        "--side-panel-default-width": "var(--side-panel-size-width)",
      },

      // Bleed the panel background past the anchored edge (direction sets the side).
      "&::after": {
        content: '""',
        position: "absolute",
        insetBlock: 0,
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
        timingFunction: vars.base.rest.content.enterTimingFunction,
        duration: vars.base.rest.content.enterDuration,
        translateX: "100%",
      }),
      [pseudo(not(open), "[data-drawer-direction='right']")]: exitAnimation({
        timingFunction: vars.base.rest.content.exitTimingFunction,
        duration: vars.base.rest.content.exitDuration,
        translateX: "100%",
      }),
      [pseudo(open, "[data-drawer-direction='left']")]: enterAnimation({
        timingFunction: vars.base.rest.content.enterTimingFunction,
        duration: vars.base.rest.content.enterDuration,
        translateX: "-100%",
      }),
      [pseudo(not(open), "[data-drawer-direction='left']")]: exitAnimation({
        timingFunction: vars.base.rest.content.exitTimingFunction,
        duration: vars.base.rest.content.exitDuration,
        translateX: "-100%",
      }),
    },
    header: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",

      gap: vars.base.rest.header.gap,
      minHeight: `calc(${vars.base.rest.header.minHeight} + var(--seed-safe-area-top))`,
      paddingInline: vars.base.rest.header.paddingX,

      paddingTop: `calc(${vars.base.rest.header.paddingTop} + var(--seed-safe-area-top))`,
      paddingBottom: vars.base.rest.header.paddingBottom,

      [pseudo("[data-show-close-button]")]: {
        paddingRight: `calc(${vars.base.rest.closeButton.fromRight} + ${closeButtonVars.base.rest.icon.size} + ${vars.base.rest.header.closeButtonGap})`,
      },
    },
    title: {
      color: vars.base.rest.title.color,
      fontSize: vars.base.rest.title.fontSize,
      lineHeight: vars.base.rest.title.lineHeight,
      fontWeight: vars.base.rest.title.fontWeight,
      wordBreak: "keep-all",

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
    body: {
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      flex: 1,
      overflowY: "auto",

      "--seed-box-padding-x--responsive": vars.base.rest.body.paddingX,
      // real values, not `initial` — see https://webkit.org/b/241433
      "--seed-box-height--responsive": "auto",
      "--seed-box-min-height--responsive": "auto",
      "--seed-box-max-height--responsive": "none",
      "--seed-box-justify-content": "initial",
      "--seed-box-align-items": "initial",
      paddingInline: "var(--seed-box-padding-x)",
      paddingBottom: vars.base.rest.body.paddingBottom, // reserve room for the bottom scroll fog
      height: "var(--seed-box-height)",
      minHeight: "var(--seed-box-min-height)",
      maxHeight: "var(--seed-box-max-height)",
      justifyContent: "var(--seed-box-justify-content)",
      alignItems: "var(--seed-box-align-items)",

      // top divider: appears when the body is scrolled away from top, but only when a header sits
      // above it — i.e. the body is not the content's first child (toggled via JS data-scrolled attribute)
      transition: `box-shadow ${vars.base.rest.body.strokeDuration} ${vars.base.rest.body.strokeTimingFunction}`,
      [pseudo("[data-scrolled]", not(":first-child"))]: {
        boxShadow: `inset 0 ${vars.base.scrolled.body.strokeWidth} 0 0 ${vars.base.scrolled.body.strokeColor}`,
      },

      // bottom scroll fog: always fades the last bit of content into the panel surface; its height equals the body's paddingBottom
      maskImage: `linear-gradient(to top, transparent 0, black ${vars.base.rest.body.paddingBottom})`,
      WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${vars.base.rest.body.paddingBottom})`,

      // body can have focus when it overflows
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: {
        ...createFocusRingStyles({ position: "inside" }),
      },
    },
    footer: {
      display: "flex",
      flexDirection: "column",

      paddingInline: vars.base.rest.footer.paddingX,
      paddingTop: vars.base.rest.footer.paddingTop,
      paddingBottom: vars.base.rest.footer.paddingBottom,
    },
    closeButton: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "none",
      background: closeButtonVars.base.rest.root.color,

      top: `calc(${vars.base.rest.closeButton.fromTop} + var(--seed-safe-area-top))`,
      right: vars.base.rest.closeButton.fromRight,
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
      small: {
        content: {
          "--side-panel-size-width": vars.sizeSmall.rest.content.width,
        },
      },
      medium: {
        content: {
          "--side-panel-size-width": vars.sizeMedium.rest.content.width,
        },
      },
      large: {
        content: {
          "--side-panel-size-width": vars.sizeLarge.rest.content.width,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export default sidePanel;
