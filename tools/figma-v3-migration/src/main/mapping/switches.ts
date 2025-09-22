import type { ComponentMapping, NewComponentProperties } from "./types";

export const switchMapping: ComponentMapping<"✅ Switch v2", "🟢 Switch"> = {
  oldComponent: "✅ Switch v2",
  newComponent: "🟢 Switch",
  variantMap: {
    "Selected:False": "Selected:False",
    "Selected:True": "Selected:True",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Switch"> = {
      Size: "24",
    };

    const isDisabled = oldProperties.Disabled.value === "True";
    const isSelected = oldProperties.Selected.value === "True";

    if (isDisabled) {
      newProperties.State = "Disabled";
      if (isSelected) {
        newProperties.State = "Disabled";
      }
    } else if (isSelected) {
      newProperties.State = "Enabled";
    } else {
      newProperties.State = "Enabled";
    }

    return newProperties;
  },
};
