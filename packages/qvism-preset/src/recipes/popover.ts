import { popoverCloseButton as closeButtonVars, popover as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { enterAnimation, exitAnimation } from "../utils/animation";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { engaged, focus, focusVisible, hidden, not, open, pseudo } from "../utils/pseudo";

const popover = defineSlotRecipe({
  name: "popover",
  slots: [
    "positioner",
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
      "--popover-z-index": "99",
      zIndex: "calc(var(--popover-z-index) + var(--z-index-offset, 0))",
      outline: "none",

      // Cap the floating box to the width floating-ui leaves before the viewport edge.
      maxWidth: "var(--seed-popover-available-width, none)",
    },
    content: {
      // positioned so the absolutely-placed closeButton anchors to the content box
      position: "relative",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",

      background: vars.base.enabled.content.color,
      borderRadius: vars.base.enabled.content.cornerRadius,
      boxShadow: vars.base.enabled.content.shadow,

      // The width family goes through the box responsive vars so StyleProps can override it
      // (height is not exposed — the content grows with the body, capped below).
      // maxWidth/maxHeight fall back to the design cap, but shrink to the space floating-ui's
      // size() middleware leaves once the viewport (minus overflowPadding + safe-area) is smaller.
      "--seed-box-width--responsive": "auto", // real value, not `initial` — see https://webkit.org/b/241433
      "--seed-box-min-width--responsive": vars.base.enabled.content.minWidth,
      "--seed-box-max-width--responsive": `min(${vars.base.enabled.content.maxWidth}, var(--seed-popover-available-width, ${vars.base.enabled.content.maxWidth}))`,
      "--seed-box-max-height--responsive": `min(${vars.base.enabled.content.maxHeight}, var(--seed-popover-available-height, ${vars.base.enabled.content.maxHeight}))`,
      width: "var(--seed-box-width)",
      minWidth: "var(--seed-box-min-width)",
      maxWidth: "var(--seed-box-max-width)",
      maxHeight: "var(--seed-box-max-height)",

      // Scale from the edge nearest the trigger. data-side/-alignment come from usePopover's
      // stateProps; alignment rules run before side rules so the side axis wins on left/right.
      "--seed-popover-origin-x": "center",
      "--seed-popover-origin-y": "center",
      transformOrigin: "var(--seed-popover-origin-x) var(--seed-popover-origin-y)",
      [pseudo("[data-alignment='start']")]: { "--seed-popover-origin-x": "left" },
      [pseudo("[data-alignment='end']")]: { "--seed-popover-origin-x": "right" },
      [pseudo("[data-side='top']")]: { "--seed-popover-origin-y": "bottom" },
      [pseudo("[data-side='bottom']")]: { "--seed-popover-origin-y": "top" },
      [pseudo("[data-side='left']")]: { "--seed-popover-origin-x": "right" },
      [pseudo("[data-side='right']")]: { "--seed-popover-origin-x": "left" },

      [pseudo(open)]: enterAnimation({
        scale: vars.base.enabled.content.enterScale,
        opacity: vars.base.enabled.content.enterOpacity,
        duration: vars.base.enabled.content.enterDuration,
        timingFunction: vars.base.enabled.content.enterTimingFunction,
      }),
      [pseudo(not(open))]: exitAnimation({
        scale: vars.base.enabled.content.exitScale,
        opacity: vars.base.enabled.content.exitOpacity,
        duration: vars.base.enabled.content.exitDuration,
        timingFunction: vars.base.enabled.content.exitTimingFunction,
      }),

      [pseudo(hidden)]: {
        display: "none !important",
      },

      [pseudo(focus)]: {
        outline: "none",
      },
    },
    header: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      boxSizing: "border-box",

      gap: vars.base.enabled.header.gap,
      paddingInline: vars.base.enabled.header.paddingX,
      paddingTop: vars.base.enabled.header.paddingTop,
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
      // min-height 0 lets the scroll container shrink inside the content's max-height so it can
      // actually scroll; header/footer keep their intrinsic height via flex-shrink: 0.
      "--seed-box-min-height--responsive": "0",
      "--seed-box-max-height--responsive": "none",
      "--seed-box-justify-content": "initial",
      "--seed-box-align-items": "initial",
      paddingInline: "var(--seed-box-padding-x)",
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

      // bottom scroll fog: always fades the last bit of content into the surface; its height equals the body's paddingBottom
      maskImage: `linear-gradient(to top, transparent 0, black ${vars.base.enabled.body.paddingBottom})`,
      WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${vars.base.enabled.body.paddingBottom})`,

      // body can have focus when it overflows
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: {
        ...createFocusRingStyles({ position: "inside" }),
      },
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,

      paddingInline: vars.base.enabled.footer.paddingX,
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

      // No safe-area folding here: the whole popover is already placed inside the safe area
      // by floating-ui's collision padding, unlike the edge-anchored Side Panel.
      top: vars.base.enabled.closeButton.fromTop,
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
        ...onlyIcon({
          color: closeButtonVars.base.pressed.icon.color,
        }),
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default popover;
