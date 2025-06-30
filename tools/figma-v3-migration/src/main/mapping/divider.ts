import type { ComponentMapping, NewComponentProperties } from "./types";

export const dividerMapping: ComponentMapping<"✅ Divider v2", "🟢 Divider"> = {
  oldComponent: "✅ Divider v2",
  newComponent: "🟢 Divider",
  variantMap: {},
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Divider"> = {
      Tone: "Neutral Muted",
    };

    return newProperties;
  },
};

export const dividerNavMapping: ComponentMapping<"✅ Divider_nav v2", "🟢 Divider"> = {
  oldComponent: "✅ Divider_nav v2",
  newComponent: "🟢 Divider",
  variantMap: {},
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Divider"> = {
      Tone: "Neutral",
    };

    return newProperties;
  },
};
