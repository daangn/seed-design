import { dialog as vars } from "@seed-design/vars/component";
import { defineRecipe } from "./helper";

const dialog = defineRecipe({
  name: "dialog",
  slots: ["backdrop", "container", "content", "header", "footer", "action", "title", "description"],
  base: {
    backdrop: {
      position: "fixed",
      inset: 0,
      background: vars.base.enabled.backdrop.background,
    },
    container: {
      position: "fixed",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      inset: 0,
      width: "100vw",
      height: "100vh",
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      boxSizing: "border-box",
      wordBreak: "break-all",

      background: vars.base.enabled.content.background,
      maxWidth: vars.base.enabled.content.maxWidth,
      margin: `auto ${vars.base.enabled.content.marginX}`,
      padding: `${vars.base.enabled.content.paddingY} ${vars.base.enabled.content.paddingX}`,
      borderRadius: vars.base.enabled.content.borderRadius,
    },
    header: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.enabled.header.gap,
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      fontWeight: vars.base.enabled.title.fontWeight,

      margin: 0,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      fontWeight: vars.base.enabled.description.fontWeight,

      margin: 0,
      whiteSpace: "pre-wrap",
    },
    footer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "stretch",

      paddingTop: vars.base.enabled.footer.paddingTop,
    },
    action: {
      width: "initial",
      minWidth: `calc(50% - ${vars.base.enabled.footer.gap} / 2)`,
    },
  },
  variants: {
    footerLayout: {
      horizontal: {
        footer: {
          flexDirection: "row-reverse",
        },
      },
      vertical: {
        footer: {
          flexDirection: "column",
        },
      },
    },
  },
});

export default dialog;
