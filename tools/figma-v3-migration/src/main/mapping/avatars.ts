import type { ComponentMapping, NewComponentProperties } from "./types";

export const avatarMapping: ComponentMapping<"✅ Avatar v2", "🟢 Avatar"> = {
  oldComponent: "✅ Avatar v2",
  newComponent: "🟢 Avatar",
  variantMap: {
    "Size:xxSmall": "Size:20",
    "Size:xSmall": "Size:24",
    "Size:Small": "Size:36",
    "Size:Medium": "Size:48",
    "Size:Large": "Size:64",
    "Size:xLarge": "Size:80",
    "Size:xxLarge": "Size:96",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Avatar"> = {};
    const hasBadge = oldProperties["Element Area"].value === "true";

    if (hasBadge) {
      newProperties["Badge"] = "Circle";
    }

    return newProperties;
  },
  childrenMappings: [],
};

export const avatarGroupMapping: ComponentMapping<"✅ Avatar Group v2", "🟢 Avatar Stack"> = {
  oldComponent: "✅ Avatar Group v2",
  newComponent: "🟢 Avatar Stack",
  variantMap: {
    "Size:xxSmall": "Size:20",
    "Size:xSmall": "Size:24",
    "Size:Small": "Size:36",
    "Size:Medium": "Size:48",
    "Size:Large": "Size:64",
  },
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Avatar Stack"> = {};
    return newProperties;
  },
  childrenMappings: [avatarMapping],
};
