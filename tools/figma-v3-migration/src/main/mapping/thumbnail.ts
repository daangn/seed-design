import type { ComponentMapping, NewComponentProperties } from "./types";

export const thumbnailMapping: ComponentMapping<"Thumbnail", "🟢 Image Frame"> = {
  oldComponent: "Thumbnail",
  newComponent: "🟢 Image Frame",
  variantMap: {
    "Size:40": "Size:42",
    "Size:48": "Size:48",
    "Size:64": "Size:64",
    "Size:72": "Size:80",
    "Size:92": "Size:96",
    "Size:108": "Size:120",
    "Size:120": "Size:120",
    "Size:140": "Size:120",
    "Size:Full Width": "Size:\bFree",
  },
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Image Frame"> = {
      "Has Image Contents#29729:0": false,
    };
    return newProperties;
  },
};

export const thumbnailRatioMapping: ComponentMapping<"Thumbnail Ratio", "🟢 Image Frame"> = {
  oldComponent: "Thumbnail Ratio",
  newComponent: "🟢 Image Frame",
  variantMap: {
    "Aspect Ratio:1:1": "Ratio:1:1",
    "Aspect Ratio:4:3": "Ratio:4:3",
    "Aspect Ratio:16:9": "Ratio:16:9",
    "Aspect Ratio:2:1": "Ratio:2:1",
    "Aspect Ratio:2:3": "Ratio:2:3",
  },
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Image Frame"> = {};
    return newProperties;
  },
};
