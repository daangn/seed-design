import { helpBubble as vars } from "../vars/component";
import * as duration from "../vars/duration";
import * as scale from "../vars/scale";
import * as timingFunction from "../vars/timing-function";
import { defineSlotRecipe } from "../utils/define";

const helpBubble = defineSlotRecipe({
  name: "help-bubble",
  slots: [
    "positioner",
    "motion",
    "content",
    "arrow",
    "arrowTip",
    "body",
    "title",
    "description",
    "closeButton",
  ],
  base: {
    // The Platform implementation supplies the measured left/top/width and
    // `99 + zIndexOffset` inline. Keeping this wrapper small preserves
    // non-modal interaction with siblings when outside dismissal is disabled.
    positioner: {
      position: "fixed",
    },
    motion: {
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch",
      padding: "8px",
      margin: "-8px",
      overflow: "visible",
      opacity: vars.base.enabled.root.exitOpacity,
      transform: `scale(${vars.base.enabled.root.exitScale})`,
      transitionProperty: "opacity, transform",
      transitionDuration: vars.base.enabled.root.exitDuration,
      transitionTimingFunction: vars.base.enabled.root.exitTimingFunction,
    },
    content: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      overflow: "visible",
      backgroundColor: vars.base.enabled.root.color,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingBottom: vars.base.enabled.root.paddingY,
      paddingLeft: vars.base.enabled.root.paddingX,
      borderRadius: vars.base.enabled.root.cornerRadius,
      maxWidth: vars.base.enabled.root.maxWidth,
    },
    arrow: {
      position: "absolute",
      width: vars.base.enabled.arrow.width,
      height: vars.base.enabled.arrow.width,
      overflow: "visible",
      transform: "rotate(0deg)",
    },
    arrowTip: {
      width: vars.base.enabled.arrow.width,
      height: `calc(${vars.base.enabled.arrow.height} + 1px)`,
      backgroundColor: vars.base.enabled.arrow.color,
      // React's 12×8 SVG with tipRadius=2, plus a 1px overlap inside the body.
      clipPath: 'path("M0 0 H12 V1 L8 7 Q6 9 4 7 L0 1 Z")',
      transform: "translateY(-1px)",
    },
    body: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      flexShrink: 1,
      minWidth: "0",
      overflow: "visible",
      gap: vars.base.enabled.body.gap,
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      fontWeight: vars.base.enabled.title.fontWeight,
      lineHeight: vars.base.enabled.title.lineHeight,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      fontWeight: vars.base.enabled.description.fontWeight,
      lineHeight: vars.base.enabled.description.lineHeight,
    },
    closeButton: {
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: `calc((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2)`,
      paddingRight: `calc((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2)`,
      paddingBottom: `calc((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2)`,
      paddingLeft: `calc((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2)`,
      marginLeft: `calc(${vars.base.enabled.root.gap} - ((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2))`,
      marginRight: `calc(-1 * ((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2))`,
      marginTop: `calc(-1 * ((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2) + ${vars.base.enabled.closeButton.marginTop})`,
      marginBottom: `calc(-1 * ((${vars.base.enabled.closeButton.targetSize} - ${vars.base.enabled.closeButton.size}) / 2) + ${vars.base.enabled.closeButton.marginTop})`,
      borderRadius: vars.base.enabled.root.cornerRadius,
      color: vars.base.enabled.closeButton.color,
      transform: "scale(1)",
      transition: `transform ${duration.pressedScale} ${timingFunction.pressedScale}`,
    },
  },
  variants: {
    open: {
      true: {},
      false: {},
    },
    positioned: {
      true: {},
      false: {},
    },
    side: {
      top: { arrow: { transform: "rotate(0deg)" } },
      right: { arrow: { transform: "rotate(90deg)" } },
      bottom: { arrow: { transform: "rotate(180deg)" } },
      left: { arrow: { transform: "rotate(270deg)" } },
    },
    pressed: {
      true: { closeButton: { transform: `scale(${scale.s97})` } },
      false: {},
    },
  },
  compoundVariants: [
    {
      positioned: false,
      css: {
        motion: {
          opacity: vars.base.enabled.root.enterOpacity,
          transform: `scale(${vars.base.enabled.root.enterScale})`,
          transitionDuration: "0s",
        },
      },
    },
    {
      open: true,
      positioned: true,
      css: {
        motion: {
          opacity: 1,
          transform: "scale(1)",
          transitionDuration: vars.base.enabled.root.enterDuration,
          transitionTimingFunction: vars.base.enabled.root.enterTimingFunction,
        },
      },
    },
  ],
  defaultVariants: {
    open: false,
    positioned: false,
    side: "top",
    pressed: false,
  },
});

export default helpBubble;
