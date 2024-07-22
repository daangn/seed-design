import { vars } from "./__generated__/help-bubble.vars";
import { defineRecipe } from "./helper";

const helpBubble = defineRecipe({
  name: "helpBubble",
  slots: ["positioner", "backdrop", "content", "arrow", "title", "description"],
  base: {
    backdrop: {
      position: "fixed",
      inset: 0,
      zIndex: 1000,

      width: "100vw",
      height: "100vh",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,
      borderRadius: vars.base.enabled.root.cornerRadius,
    },
    arrow: {
      width: "10px",
      height: "6px",
    },
    title: {
      fontSize: vars.base.enabled.title.fontSize,
      fontWeight: vars.base.enabled.title.fontWeight,
    },
    description: {
      fontSize: vars.base.enabled.description.fontSize,
      fontWeight: vars.base.enabled.description.fontWeight,
    },
  },
  variants: {
    variant: {
      nonModal: {
        content: {
          background: vars.variantNonModal.enabled.root.color,
        },
        arrow: {
          fill: vars.variantNonModal.enabled.arrow.color,
        },
        title: {
          color: vars.variantNonModal.enabled.title.color,
        },
        description: {
          color: vars.variantNonModal.enabled.description.color,
        },
      },
      modal: {
        backdrop: {
          background: vars.variantModal.enabled.backdrop.color,
        },
        content: {
          background: vars.variantModal.enabled.root.color,
        },
        arrow: {
          fill: vars.variantModal.enabled.arrow.color,
        },
        title: {
          color: vars.variantModal.enabled.title.color,
        },
        description: {
          color: vars.variantModal.enabled.description.color,
        },
      },
    },
  },
  defaultVariants: {
    variant: "nonModal",
  },
});

export default helpBubble;
