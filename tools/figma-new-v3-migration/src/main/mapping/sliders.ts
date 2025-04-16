import type { ComponentMapping, NewComponentProperties } from "./types";

const markerGroupMapping: ComponentMapping<".Marker Group", ".Item / Marker Group"> = {
  oldComponent: ".Marker Group",
  newComponent: ".Item / Marker Group",
  variantMap: {},
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<".Item / Marker Group"> = {
      Markers: oldProperties.Markers.value,
      "1#65932:0": oldProperties["1#65932:0"].value,
      "2#65932:6": oldProperties["2#65932:6"].value,
      "3#65932:12": oldProperties["3#65932:12"].value,
      "4#65932:18": oldProperties["4#65932:18"].value,
      "5#65932:24": oldProperties["5#65932:24"].value,
      "6#65932:30": oldProperties["6#65932:30"].value,
    };
    return newProperties;
  },
};

export const sliderMapping: ComponentMapping<"✅ Slider v2", "🟢 Slider"> = {
  oldComponent: "✅ Slider v2",
  newComponent: "🟢 Slider",
  variantMap: {
    "Marker:All": "Marker:All",
    "Marker:Min Max": "Marker:Min Max",
    "Marker:None": "Marker:None",
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "Steps:0": "Steps:0",
    "Steps:1": "Steps:1",
    "Steps:2": "Steps:2",
    "Steps:3": "Steps:3",
    "Steps:4": "Steps:4",
  },
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Slider"> = {};
    return newProperties;
  },
  childrenMappings: [markerGroupMapping],
};

export const rangeSliderMapping: ComponentMapping<"✅ Range Slider v2", "🟢 Range Slider"> = {
  oldComponent: "✅ Range Slider v2",
  newComponent: "🟢 Range Slider",
  variantMap: {
    "Marker:All": "Marker:All",
    "Marker:Min Max": "Marker:Min Max",
    "Marker:None": "Marker:None",
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "Steps:0": "Steps:0",
    "Steps:1": "Steps:1",
    "Steps:2": "Steps:2",
    "Steps:3": "Steps:3",
    "Steps:4": "Steps:4",
  },
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Range Slider"> = {};
    return newProperties;
  },
  childrenMappings: [markerGroupMapping],
};
