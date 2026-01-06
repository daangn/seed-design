// import type { ComponentMapping, NewComponentProperties } from "./types";

// export const navigationTopMapping: ComponentMapping<"navigation_top", "🔵 [Template] Top Navigation"> = {
//   oldComponent: "navigation_top",
//   newComponent: "🔵 [Template] Top Navigation",
//   variantMap: {
//     "Type:Large title": "Variants:Large Title",
//     "Type:Main tab": "Variants:Main Tab",
//     "Type:Sub page": "Variants:Standard",
//     "BG:Transparent": "Variants:Standard Transparent",
//   },
//   calculateProperties(oldProperties) {
//     const newProperties: NewComponentProperties<"🔵 [Template] Top Navigation"> = {};

//     const type = oldProperties["Type"].value;
//     const bg = oldProperties["BG"].value;

//     if (type === "Large title") {
//       newProperties.Variants = "Large Title";
//     } else if (type === "Main tab") {
//       newProperties.Variants = "Main Tab";
//     } else if (type === "Sub page") {
//       if (bg === "Transparent") {
//         newProperties.Variants = "Standard Transparent";
//       } else {
//         newProperties.Variants = "Standard";
//       }
//     }

//     return newProperties;
//   },
// };

// export const navigationBottomMapping: ComponentMapping<"navigation_bottom", "🟢 Bottom Navigation / KR"> = {
//   oldComponent: "navigation_bottom",
//   newComponent: "🟢 Bottom Navigation / KR",
//   variantMap: {
//     "OS:Android": "OS:Android",
//     "OS:iOS": "OS:iOS",
//     "Position:Bottom fixed": "Position:Bottom fixed",
//     "Position:On keyboard": "Position:On keyboard",
//     "Type:Vertical": "Action Type:Vertical",
//   },
// };

// export const navigationBottomGlobalMapping: ComponentMapping<"navigation_bottom_global", "🟢 Bottom Navigation / Global"> = {
//   oldComponent: "navigation_bottom_global",
//   newComponent: "🟢 Bottom Navigation / Global",
//   variantMap: {
//     "OS:Android": "OS:Android",
//     "OS:iOS": "OS:iOS",
//     "Position:Bottom fixed": "Position:Bottom fixed",
//     "Position:On keyboard": "Position:On keyboard",
//     "Type:Vertical": "Action Type:Vertical",
//   },
// };
