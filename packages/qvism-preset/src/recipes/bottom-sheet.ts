import { bottomSheet as vars } from "@seed-design/css/vars/component";
import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineRecipe } from "../utils/define";
import { not, open, pseudo } from "../utils/pseudo";
import { onlyIcon } from "../utils/icon";

const bottomSheet = defineRecipe({
  name: "bottom-sheet",
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
      alignItems: "flex-end",
      inset: 0,
      overscrollBehaviorY: "none",

      "--sheet-z-index": "2",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      inset: 0,
      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.enabled.backdrop.exitTimingFunction,
        duration: vars.base.enabled.backdrop.exitDuration,
        opacity: vars.base.enabled.backdrop.exitOpacity,
      }),
      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.enabled.backdrop.enterTimingFunction,
        duration: vars.base.enabled.backdrop.enterDuration,
        opacity: vars.base.enabled.backdrop.enterOpacity,
      }),
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      borderTopLeftRadius: vars.base.enabled.content.cornerTopRadius,
      borderTopRightRadius: vars.base.enabled.content.cornerTopRadius,

      [pseudo(not(open))]: exitAnimation({
        timingFunction: vars.base.enabled.content.exitTimingFunction,
        duration: vars.base.enabled.content.exitDuration,
        translateY: "100%",
      }),
      [pseudo(open)]: enterAnimation({
        timingFunction: vars.base.enabled.content.enterTimingFunction,
        duration: vars.base.enabled.content.enterDuration,
        translateY: "100%",
      }),
    },
    header: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.enabled.header.gap,
      paddingInline: vars.base.enabled.header.paddingX,
      paddingTop: vars.base.enabled.header.paddingTop,
      paddingBottom: vars.base.enabled.header.paddingBottom,
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
    body: {
      display: "flex",
      flexDirection: "column",

      "--seed-box-padding-x": vars.base.enabled.body.paddingX,
      "--seed-box-height": "initial",
      "--seed-box-min-height": "initial",
      "--seed-box-max-height": "initial",
      "--seed-box-justify-content": "initial",
      "--seed-box-align-items": "initial",
      paddingInline: "var(--seed-box-padding-x)",
      height: "var(--seed-box-height)",
      minHeight: "var(--seed-box-min-height)",
      maxHeight: "var(--seed-box-max-height)",
      justifyContent: "var(--seed-box-justify-content)",
      alignItems: "var(--seed-box-align-items)",
    },
    footer: {
      display: "flex",
      flexDirection: "column",

      paddingInline: vars.base.enabled.footer.paddingX,
      paddingTop: vars.base.enabled.footer.paddingTop,
      paddingBottom: vars.base.enabled.footer.paddingBottom,
    },
    closeButton: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      top: vars.base.enabled.closeButton.fromTop,
      right: vars.base.enabled.closeButton.fromRight,
      borderRadius: vars.base.enabled.closeButton.cornerRadius,
      background: vars.base.enabled.closeButton.color,
      width: vars.base.enabled.closeButton.size,
      height: vars.base.enabled.closeButton.size,

      ...onlyIcon({
        color: vars.base.enabled.closeIcon.color,
        size: vars.base.enabled.closeIcon.size,
      }),

      "&:after": {
        content: '""',
        position: "absolute",
        inset: `calc((${vars.base.enabled.closeButton.size} - ${vars.base.enabled.closeButton.targetSize}) / 2)`,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default bottomSheet;
