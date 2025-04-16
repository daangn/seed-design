import type { ComponentMapping, NewComponentProperties } from "./types";

export const switchMapping: ComponentMapping<"✅ Switch v2", "🟢 Switch"> = {
  oldComponent: "✅ Switch v2",
  newComponent: "🟢 Switch",
  variantMap: {
    "Selected:False": "State:Enabled",
    "Selected:True": "State:Selected",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Switch"> = {
      Size: "Medium",
      "Label#15191:2": "",
    };

    const isDisabled = oldProperties.Disabled.value === "True";
    const isSelected = oldProperties.Selected.value === "True";

    if (isDisabled) {
      newProperties.State = "Disabled";
      if (isSelected) {
        newProperties.State = "Selected-Disabled";
      }
    } else if (isSelected) {
      newProperties.State = "Selected";
    } else {
      newProperties.State = "Enabled";
    }

    return newProperties;
  },
};
