import type { ComponentMapping, NewComponentProperties } from "./types";

export const calloutMapping: ComponentMapping<"✅ Callout v2", "🟢 Callout"> = {
  oldComponent: "✅ Callout v2",
  newComponent: "🟢 Callout",
  variantMap: {
    "Variant:Danger": "Tone:Critical",
    "Variant:Info": "Tone:Informative",
    "Variant:Normal": "Tone:Neutral",
    "Variant:Outline": "Tone:Neutral",
    "Variant:Warning": "Tone:Warning",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Callout"> = {
      Interaction: "Display",
      "Show Prefix Icon#35087:1": oldProperties["Icon#70258:5"].value,
    };

    switch (oldProperties.Type.value) {
      case "Default":
        newProperties["Show Title"] = "False";
        newProperties["Show Link Text"] = "False";
        break;
      case "Title":
        newProperties["Show Title"] = "True";
        newProperties["Show Link Text"] = "False";
        break;
      case "Title + Link text":
        newProperties["Show Title"] = "True";
        newProperties["Show Link Text"] = "True";
        break;
    }

    return newProperties;
  },
};

export const actionableCalloutMapping: ComponentMapping<"✅ Actionable Callout v2", "🟢 Callout"> =
  {
    oldComponent: "✅ Actionable Callout v2",
    newComponent: "🟢 Callout",
    variantMap: {
      "Variant:Danger": "Tone:Critical",
      "Variant:Info": "Tone:Informative",
      "Variant:Normal": "Tone:Neutral",
      "Variant:Outline": "Tone:Neutral",
      "Variant:Warning": "Tone:Warning",
    },
    calculateProperties(oldProperties) {
      const newProperties: NewComponentProperties<"🟢 Callout"> = {
        Interaction: "Actionable",
        "Show Title": oldProperties.Title.value,
        "Show Link Text": "False",
      };

      return newProperties;
    },
  };

export const dismissableCalloutMapping: ComponentMapping<
  "✅ Dismissable Callout v2",
  "🟢 Callout"
> = {
  oldComponent: "✅ Dismissable Callout v2",
  newComponent: "🟢 Callout",
  variantMap: {
    "Variant:Danger": "Tone:Critical",
    "Variant:Info": "Tone:Informative",
    "Variant:Normal": "Tone:Neutral",
    "Variant:Outline": "Tone:Neutral",
    "Variant:Warning": "Tone:Warning",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Callout"> = {
      Interaction: "Dismissible",
      "Show Title": oldProperties.Title.value,
      "Show Link Text": "False",
    };

    return newProperties;
  },
};
