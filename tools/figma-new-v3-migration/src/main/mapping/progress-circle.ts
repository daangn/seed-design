import type { ComponentMapping, NewComponentProperties } from "./types";

export const spinnerMapping: ComponentMapping<"✅ Spinner v2", "🟢 Progress Circle"> = {
  oldComponent: "✅ Spinner v2",
  newComponent: "🟢 Progress Circle",
  variantMap: {
    "Size:Small": "Size:24",
    "Size:Medium": "Size:40",
    "Color:Gray": "Tone:Neutral",
    "Color:Primary": "Tone:Brand",
    "Color:White (on overlay)": "Tone:Static White",
  },
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Progress Circle"> = {
      Value: "Indeterminate",
    };
    return newProperties;
  },
};
