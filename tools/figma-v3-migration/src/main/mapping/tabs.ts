import type { ComponentMapping, NewComponentProperties } from "./types";

const tabFillMapping: ComponentMapping<"✅ Tab v2", ".Item / Tab (Fill)"> = {
  oldComponent: "✅ Tab v2",
  newComponent: ".Item / Tab (Fill)",
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<".Item / Tab (Fill)"> = {
      "Label#4478:2": oldProperties["Label#55170:0"].value,
      Notification: oldProperties.Dot.value,
      Size: "Medium",
    };

    const isDisabled = oldProperties.State.value === "Disabled";
    const isSelected = oldProperties.State.value === "Selected";

    if (isDisabled) {
      newProperties.State = "Disabled";
    } else if (isSelected) {
      newProperties.State = "Selected";
    } else {
      newProperties.State = "Enabled";
    }

    return newProperties;
  },
};

const tabHugMapping: ComponentMapping<"✅ Tab v2", ".Item / Tab (Hug)"> = {
  oldComponent: "✅ Tab v2",
  newComponent: ".Item / Tab (Hug)",
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<".Item / Tab (Hug)"> = {
      "Label#4478:2": oldProperties["Label#55170:0"].value,
      Notification: oldProperties.Dot.value,
      Size: "Medium",
    };

    const isDisabled = oldProperties.State.value === "Disabled";
    const isSelected = oldProperties.State.value === "Selected";

    if (isDisabled) {
      newProperties.State = "Disabled";
    } else if (isSelected) {
      newProperties.State = "Selected";
    } else {
      newProperties.State = "Enabled";
    }

    return newProperties;
  },
};

export const tabsMapping: ComponentMapping<"✅ Tabs v2", "🟢 Tabs"> = {
  oldComponent: "✅ Tabs v2",
  newComponent: "🟢 Tabs",
  variantMap: {
    "Layout:Fill": "Variant:Line",
    "Layout:Hug": "Variant:Line",
  },
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Tabs"> = {
      Variant: "Line",
    };

    return newProperties;
  },
  childrenMappings: [tabHugMapping, tabFillMapping],
};
