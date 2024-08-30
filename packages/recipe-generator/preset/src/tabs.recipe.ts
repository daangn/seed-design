import { vars } from "./__generated__/tablist.vars";
import { defineRecipe } from "./helper";

const tabs = defineRecipe({
  name: "tabs",
  slots: ["root", "triggerList", "contentList", "contentCamera", "content", "indicator"],
  base: {
    root: {
      overflowX: "hidden",
    },
    triggerList: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      alignItems: "stretch",
      alignContent: "stretch",

      overflowX: "auto",
      msOverflowStyle: "none",
      scrollbarWidth: "none",

      background: vars.base.enabled.root.color,
      borderBottom: `${vars.base.enabled.root.strokeBottomWidth} solid ${vars.base.enabled.root.strokeColor}`,

      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    contentList: {},
    contentCamera: {
      display: "flex",
      width: "100%",
      height: "100%",
    },
    content: {
      width: "100%",
      height: "100%",
      flexShrink: 0,
      overflow: "auto",
    },
    indicator: {
      color: vars.base.enabled.indicator.color,
      borderBottom: `${vars.base.enabled.indicator.height} solid ${vars.base.enabled.indicator.color}`,
      bottom: 0,
    },
  },
  variants: {
    layout: {
      fill: {
        triggerList: {
          padding: `0px ${vars.layoutFill.enabled.root.paddingX}`,
          justifyContent: "space-around",
        },
      },
      hug: {
        triggerList: {
          padding: `0px ${vars.layoutHug.enabled.root.paddingX}`,
          justifyContent: "flex-start",
        },
      },
    },
  },
  defaultVariants: {
    layout: "hug",
  },
});

export default tabs;
