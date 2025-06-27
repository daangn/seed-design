import type { ComponentMapping, NewComponentProperties } from "./types";

export const squareBadgeMapping: ComponentMapping<"Badge_square", "🟢 Badge"> = {
  oldComponent: "Badge_square",
  newComponent: "🟢 Badge",
  variantMap: {
    "Size:Large": "Size:Large",
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Medium",
    "Outlined:False": "Variant:Solid",
    "Outlined:True": "Variant:Outline",
    "Type:Success": "Tone:Positive",
    "Type:Accent": "Tone:Neutral",
    "Type:Error": "Tone:Critical",
    "Type:Primary": "Tone:Brand",
    "Type:Basic": "Tone:Neutral",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Badge"> = {};

    const isBold = oldProperties["Bold"].value === "True";
    const isOutlined = oldProperties["Outlined"].value === "True";

    if (isBold && isOutlined) {
      newProperties.Variant = "Outline";
    } else if (isBold) {
      newProperties.Variant = "Solid";
    } else if (isOutlined) {
      newProperties.Variant = "Outline";
    } else {
      newProperties.Variant = "Weak";
    }

    return newProperties;
  },
};

export const pillBadgeMapping: ComponentMapping<"Badge_pill", "🟢 Badge"> = {
  oldComponent: "Badge_pill",
  newComponent: "🟢 Badge",
  variantMap: {
    "Size:Large": "Size:Large",
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Medium",
    "Outlined:False": "Variant:Solid",
    "Outlined:True": "Variant:Outline",
    "Type:Success": "Tone:Positive",
    "Type:Accent": "Tone:Neutral",
    "Type:Error": "Tone:Critical",
    "Type:Primary": "Tone:Brand",
    "Type:Basic": "Tone:Neutral",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Badge"> = {};

    const isBold = oldProperties["Bold"].value === "True";
    const isOutlined = oldProperties["Outlined"].value === "True";

    const isBrandWeak =
      oldProperties.Bold.value === "False" && oldProperties.Type.value === "Primary";

    if (isBold && isOutlined) {
      newProperties.Variant = "Outline";
    } else if (isBold) {
      newProperties.Variant = "Solid";
    } else if (isOutlined) {
      newProperties.Variant = "Outline";
    } else {
      newProperties.Variant = "Weak";
    }

    if (isBrandWeak) {
      newProperties.Variant = "Solid";
    }

    return newProperties;
  },
};

/** TODO: WIP - Notification Badge */
// export const numberBadgeMapping: ComponentMapping<"Badge_number", "🟢 Badge"> = {
//   oldComponent: "Badge_number",
//   newComponent: "🟢 Badge",
//   variantMap: {},
//   calculateProperties(oldProperties) {
//     const newProperties: NewComponentProperties<"🟢 Badge"> = {};
//   },
// };

/** TODO: WIP - Notification Badge */
// export const newBadgeMapping: ComponentMapping<"Badge", "🟢 Badge"> = {
//   oldComponent: "Badge",
//   newComponent: "🟢 Badge",
//   variantMap: {},
//   calculateProperties(oldProperties) {
//     const newProperties: NewComponentProperties<"🟢 Badge"> = {};
//   },
// };
