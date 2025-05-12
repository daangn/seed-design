// known issue: Alert Dialog Secondary button 처리가 잘 안됨

import { boxButtonMapping } from "./buttons";
import type { ComponentMapping, NewComponentProperties } from "./types";

// const neutralActionMapping: ComponentMapping<"Neutral", ".Item / Neutral"> = {
//   oldComponent: "Neutral",
//   newComponent: ".Item / Neutral",
//   variantMap: {},
//   calculateProperties(oldProperties) {
//     const newProperties: NewComponentProperties<".Item / Neutral"> = {};
//     return newProperties;
//   },
// };

// const nonPreferredActionMapping: ComponentMapping<"Nonpreferred", ".Item / Nonpreferred"> = {
//   oldComponent: "Nonpreferred",
//   newComponent: ".Item / Nonpreferred",
//   variantMap: {},
//   calculateProperties(oldProperties) {
//     const newProperties: NewComponentProperties<".Item / Nonpreferred"> = {};
//     return newProperties;
//   },
// };

export const alertDialogMapping: ComponentMapping<"✅ Alert Dialog v2", "🟢 Alert Dialog"> = {
  oldComponent: "✅ Alert Dialog v2",
  newComponent: "🟢 Alert Dialog",
  variantMap: {},
  calculateProperties(oldProperties) {
    const hasSecondaryAction = oldProperties["Secondary Action"].value === "True";

    const newProperties: NewComponentProperties<"🟢 Alert Dialog"> = {
      "Description Text#20361:7": oldProperties["🅃 Description text#626:0"].value,
      "Title Text#20361:0": oldProperties["🅃 Title text#626:13"].value,
      "Show Title#20361:14": oldProperties["Title"].value === "True",
    };

    if (!hasSecondaryAction) {
      newProperties.Actions = "Single";
    } else {
      newProperties.Actions = "Neutral";
    }

    return newProperties;
  },
  childrenMappings: [boxButtonMapping],
};
