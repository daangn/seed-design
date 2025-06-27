import type { ComponentMapping, NewComponentProperties } from "./types";

export const helpBubbleMapping: ComponentMapping<"✅ Help Bubble v2", "🟢 Help Bubble"> = {
  oldComponent: "✅ Help Bubble v2",
  newComponent: "🟢 Help Bubble",
  variantMap: {
    "Placement (side-align):Bottom-Center": "Placement:Bottom-Center",
    "Placement (side-align):Bottom-Left": "Placement:Bottom-Left",
    "Placement (side-align):Bottom-Right": "Placement:Bottom-Right",
    "Placement (side-align):Top-Center": "Placement:Top-Center",
    "Placement (side-align):Top-Left": "Placement:Top-Left",
    "Placement (side-align):Top-Right": "Placement:Top-Right",
    "Placement (side-align):Left-Bottom": "Placement:Left-Bottom",
    "Placement (side-align):Left-Center": "Placement:Left-Center",
    "Placement (side-align):Left-Top": "Placement:Left-Top",
    "Placement (side-align):Right-Bottom": "Placement:Right-Bottom",
    "Placement (side-align):Right-Center": "Placement:Right-Center",
    "Placement (side-align):Right-Top": "Placement:Right-Top",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Help Bubble"> = {
      "Show Description#62499:0": oldProperties["Description#62499:0"].value,
      "Description#62535:98": oldProperties["↳ Description Text#62535:98"].value,
      "Title#62535:0": oldProperties["Title Text#62535:0"].value,
    };
    return newProperties;
  },
};
