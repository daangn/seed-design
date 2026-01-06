import type { ComponentMapping, NewComponentProperties } from "./types";

export const radioMapping: ComponentMapping<"✅ Radio v2", "🟢 Radio"> = {
  oldComponent: "✅ Radio v2",
  newComponent: "🟢 Radio",
  variantMap: {},
  calculateProperties: (oldProperties) => {
    const newProperties: NewComponentProperties<"🟢 Radio"> = {
      "Label#49990:171": oldProperties["Label#49990:171"].value,
    };

    const isSelected = oldProperties.Selected.value === "True";
    const isHovered = oldProperties.Hovered.value === "True";
    const isPressed = oldProperties.Pressed.value === "True";
    const isDisabled = oldProperties.Disabled.value === "True";

    if (isSelected) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else if (isPressed || isHovered) {
        newProperties.State = "Pressed";
      } else {
        newProperties.State = "Enabled";
      }
    } else if (isDisabled) {
      newProperties.State = "Disabled";
    } else if (isPressed || isHovered) {
      newProperties.State = "Pressed";
    } else {
      newProperties.State = "Enabled";
    }

    return newProperties;
  },
};
