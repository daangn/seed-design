import { vars } from "./__generated__/chip-tablist.vars";
import { defineRecipe } from "./helper";

const chipTabs = defineRecipe({
  name: "chipTabs",
  slots: ["root", "triggerList", "contentList", "contentCamera", "content"],
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

      padding: `0px ${vars.base.enabled.root.paddingX}`,

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
  },
  variants: {},
});

export default chipTabs;