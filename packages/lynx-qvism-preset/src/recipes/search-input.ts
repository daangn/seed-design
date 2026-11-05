import { searchInput as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";

const searchInput = defineSlotRecipe({
  name: "search-input",
  slots: ["root", "value", "clearButton", "clearButtonIcon"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      height: vars.base.enabled.root.height,
      paddingLeft: vars.base.enabled.root.paddingLeft,
      paddingRight: vars.base.enabled.root.paddingRight,
      borderRadius: vars.base.enabled.root.cornerRadius,
      backgroundColor: vars.base.enabled.root.color,
    },
    value: {
      flexGrow: 1,
      minWidth: 0,
      alignSelf: "stretch",
      padding: 0,
      borderWidth: 0,
      backgroundColor: "transparent",
      color: vars.base.enabled.value.color,
      fontSize: vars.base.enabled.value.fontSize,
      lineHeight: vars.base.enabled.value.lineHeight,
      fontWeight: vars.base.enabled.value.fontWeight,
      [pseudo("::placeholder")]: {
        color: vars.base.enabled.placeholder.color,
        fontSize: vars.base.enabled.placeholder.fontSize,
        lineHeight: vars.base.enabled.placeholder.lineHeight,
        fontWeight: vars.base.enabled.placeholder.fontWeight,
      },
    },
    clearButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      paddingLeft: vars.base.enabled.clearButton.paddingX,
      paddingRight: vars.base.enabled.clearButton.paddingX,
      paddingTop: vars.base.enabled.clearButton.paddingY,
      paddingBottom: vars.base.enabled.clearButton.paddingY,
    },
    clearButtonIcon: {
      flexShrink: 0,
      width: vars.base.enabled.clearButtonIcon.size,
      height: vars.base.enabled.clearButtonIcon.size,
      color: vars.base.enabled.clearButtonIcon.color,
    },
  },
  variants: {},
  defaultVariants: {},
});

export default searchInput;
