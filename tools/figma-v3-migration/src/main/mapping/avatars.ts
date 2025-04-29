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
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Avatar"> = {};
    return newProperties;
  },
  childrenMappings: [],
};

// export const avatarGroupMapping: ComponentMapping<"✅ Avatar Group v2", "Avar"> = {
//   oldComponent: "✅ Avatar Group v2",
//   newComponent: "🟢 Avatar Stack",
//   variantMap: {
//     "Size:xxSmall": "Size:20",
//     "Size:xSmall": "Size:24",
//     "Size:Small": "Size:36",
//     "Size:Medium": "Size:48",
//     "Size:Large": "Size:64",
//     "Top Item:First Item": "Top Item:First Item",
//     "Top Item:Last Item": "Top Item:Last Item",
//     "Count:2": "Item Count:2",
//     "Count:3": "Item Count:3",
//     "Count:4": "Item Count:4",
//     "Count:5": "Item Count:5",
//   },
//   calculateProperties(oldProperties) {
//     const newProperties: NewComponentProperties<"🟢 Avatar Stack"> = {};
//     return newProperties;
//   },
//   childrenMappings: [avatarMapping],
// };
