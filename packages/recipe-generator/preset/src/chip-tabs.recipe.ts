import { chipTablist as vars } from "@seed-design/vars/component";
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
  variants: {
    variant: {
      neutralSolid: {
        triggerList: {
          gap: vars.variantNeutralSolid.enabled.triggerList.gap,
        },
      },
      brandWeak: {
        triggerList: {
          gap: vars.variantBrandWeak.enabled.triggerList.gap,
        },
      },
    },
  },
});

export default chipTabs;
