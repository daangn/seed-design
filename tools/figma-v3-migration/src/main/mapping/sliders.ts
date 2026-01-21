import type { ComponentMapping, NewComponentProperties } from "./types";

// V2 Slider v2 → V3 Slider (Single)
export const sliderMapping: ComponentMapping<"✅ Slider v2", "🟢 Slider"> = {
  oldComponent: "✅ Slider v2",
  newComponent: "🟢 Slider",
  variantMap: {
    "State:Enabled": "State:Enabled",
    "State:Disabled": "State:Disabled",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Slider"> = {
      Value: "Single",
      "Has Tick Mark#47921:0": oldProperties.Steps.value !== "0",
      "Show Markers#49596:0": oldProperties.Marker.value !== "None",
      "Show Active Track#48156:0": true,
    };
    return newProperties;
  },
};

// V2 Range Slider v2 → V3 Slider (Range)
export const rangeSliderMapping: ComponentMapping<"✅ Range Slider v2", "🟢 Slider"> = {
  oldComponent: "✅ Range Slider v2",
  newComponent: "🟢 Slider",
  variantMap: {
    "State:Enabled": "State:Enabled",
    "State:Disabled": "State:Disabled",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Slider"> = {
      Value: "Range",
      "Has Tick Mark#47921:0": oldProperties.Steps.value !== "0",
      "Show Markers#49596:0": oldProperties.Marker.value !== "None",
      "Show Active Track#48156:0": true,
    };
    return newProperties;
  },
};
