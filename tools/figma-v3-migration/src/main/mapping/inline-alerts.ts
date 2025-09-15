import type { ComponentMapping, NewComponentProperties } from "./types";

export const inlineAlertMapping: ComponentMapping<"✅ Inline alert v2", "🟢 Page Banner"> = {
  oldComponent: "✅ Inline alert v2",
  newComponent: "🟢 Page Banner",
  variantMap: {
    "Variant:Danger": "Tone:Critical",
    "Variant:Info": "Tone:Informative",
    "Variant:Normal": "Tone:Neutral",
    "Variant:Success": "Tone:Positive",
    "Weight:Standard": "Variant:Weak",
    "Weight:Strong": "Variant:Solid",
  },
  calculateProperties(oldProperties, oldComponentStructure) {
    const newProperties: NewComponentProperties<"🟢 Page Banner"> = {
      "Show Title": "False",
    };

    const hasLink = oldProperties.Link.value === "True";
    if (hasLink) {
      newProperties.Interaction = "With Action";
    } else {
      newProperties.Interaction = "Display";
    }

    const hasPrefixIcon = oldProperties["Prefix Icon"].value === "True";
    if (hasPrefixIcon) {
      newProperties["Show Prefix Icon#11840:27"] = true;
    } else {
      newProperties["Show Prefix Icon#11840:27"] = false;
    }

    return newProperties;
  },
};

export const actionableInlineAlertMapping: ComponentMapping<
  "✅ Actionable Inline alert v2",
  "🟢 Page Banner"
> = {
  oldComponent: "✅ Actionable Inline alert v2",
  newComponent: "🟢 Page Banner",
  variantMap: {
    "Variant:Danger": "Tone:Critical",
    "Variant:Info": "Tone:Informative",
    "Variant:Normal": "Tone:Neutral",
    "Variant:Success": "Tone:Positive",
    "Weight:Standard": "Variant:Weak",
    "Weight:Strong": "Variant:Solid",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Page Banner"> = {
      Interaction: "Actionable",
      "Show Title": "False",
    };

    const hasPrefixIcon = oldProperties["Prefix Icon"].value === "True";
    if (hasPrefixIcon) {
      newProperties["Show Prefix Icon#11840:27"] = true;
    } else {
      newProperties["Show Prefix Icon#11840:27"] = false;
    }

    return newProperties;
  },
};

export const dismissableInlineAlertMapping: ComponentMapping<
  "✅ Dismissable Inline alert v2",
  "🟢 Page Banner"
> = {
  oldComponent: "✅ Dismissable Inline alert v2",
  newComponent: "🟢 Page Banner",
  variantMap: {
    "Variant:Danger": "Tone:Critical",
    "Variant:Info": "Tone:Informative",
    "Variant:Normal": "Tone:Neutral",
    "Variant:Success": "Tone:Positive",
    "Weight:Standard": "Variant:Weak",
    "Weight:Strong": "Variant:Solid",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Page Banner"> = {
      Interaction: "Dismissible",
      "Show Title": "False",
    };

    const hasPrefixIcon = oldProperties["Prefix Icon"].value === "True";
    if (hasPrefixIcon) {
      newProperties["Show Prefix Icon#11840:27"] = true;
    } else {
      newProperties["Show Prefix Icon#11840:27"] = false;
    }

    return newProperties;
  },
  // TODO
  // oldVariant도 여러 variant 조합이 되어야함 (and나 or 연산자가 가능하도록?)
  // newVariant도 여러 variant가 다 적용가능하도록 선택적으로
  // swappableVariants: [
  //   {
  //     oldVariant: "Variant:Danger",
  //     newVariants: ["Interaction:Actionable"],
  //     description: "Danger variant can't be Dismissible",
  //   },
  // ],
};
