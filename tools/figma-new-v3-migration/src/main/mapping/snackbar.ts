import type { ComponentMapping, NewComponentProperties } from "./types";

export const snackbarMapping: ComponentMapping<"✅ Snackbar v2", "🟢 Snackbar"> = {
  oldComponent: "✅ Snackbar v2",
  newComponent: "🟢 Snackbar",
  variantMap: {
    "Variant:Default": "Variant:Default",
    "Variant:Success": "Variant:Positive",
    "Variant:Warning": "Variant:Critical",
  },
  calculateProperties(oldProperties, oldComponentStructure) {
    const newProperties: NewComponentProperties<"🟢 Snackbar"> = {
      "Action Label#1528:8":
        (oldComponentStructure?.children["Action Button"]?.value as string) || "",
      "Message#1528:4": (oldComponentStructure?.children?.text?.value as string) || "",
      "Show Action#1528:0": oldProperties["Action Button#254:32"].value,
    };

    return newProperties;
  },
};
