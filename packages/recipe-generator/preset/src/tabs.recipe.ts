import { vars } from "./__generated__/tabs.vars";
import { defineRecipe } from "./helper";
import { selected, pseudo, disabled } from "./pseudo";

/**
 * TODO: component-spec 옮길 것들 옮기고, 피그마 컴포넌트 만들어지면 수정하기
 */
export const tabs = defineRecipe({
  name: "tabs",
  slots: ["root", "triggerList", "trigger", "contentList", "contentCamera", "content", "indicator"],
  base: {
    root: {
      overflowX: "hidden",
    },
    triggerList: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "flex-start",
      alignItems: "stretch",
      alignContent: "stretch",

      margin: 0,
      padding: 0,

      overflowX: "auto",
      msOverflowStyle: "none",
      scrollbarWidth: "none",

      background: vars.base.enabled.tabTriggerList.color,
      borderBottom: `0.5px solid ${vars.base.enabled.tabTriggerList.borderColor}`,

      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    trigger: {
      display: "flex",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      boxSizing: "border-box",
      whiteSpace: "nowrap",

      color: vars.base.enabled.tabTrigger.color,
      padding: "10px 12px",

      flex: 1,

      [pseudo(selected)]: {
        color: vars.base.selected.tabTrigger.color,
      },

      [pseudo(disabled)]: {
        color: vars.base.disabled.tabTrigger.color,
        cursor: "not-allowed",
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
      borderBottom: `2px solid ${vars.base.enabled.indicator.borderColor}`,
      bottom: 0,
    },
  },
  variants: {},
  defaultVariants: {},
});

export default tabs;
