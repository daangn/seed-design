import type { ComponentMapping, NewComponentProperties } from "./types";

export const selectBoxMapping: ComponentMapping<"✅ Select box v2", "🟢 Select Box"> = {
  oldComponent: "✅ Select box v2",
  newComponent: "🟢 Select Box",
  variantMap: {},
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Select Box"> = {
      "Label#3635:0": oldProperties["label#3635:0"].value,
      "Show Description#3033:0": oldProperties["Description#3033:0"].value,
      "Description #3033:5": oldProperties["Description #3033:5"].value,
      Control: oldProperties.Control.value,
    };

    const isSelected = oldProperties.Selected.value === "True";
    const isPressed = oldProperties.State.value === "Pressed";

    if (isSelected) {
      if (isPressed) {
        newProperties.State = "Pressed";
      } else {
        newProperties.State = "Enabled";
      }
    } else if (isPressed) {
      newProperties.State = "Pressed";
    } else {
      newProperties.State = "Enabled";
    }

    return newProperties;
  },
};
