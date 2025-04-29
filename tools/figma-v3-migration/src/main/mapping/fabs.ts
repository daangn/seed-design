import type { ComponentMapping, NewComponentProperties } from "./types";

// const menuFabMenuItemMapping: ComponentMapping<"Item / Menu Item", ".Item / Menu Item"> = {
//   oldComponent: "Item / Menu Item",
//   newComponent: ".Item / Menu Item",
//   variantMap: {},
//   calculateProperties: (oldProperties) => {
//     console.log("Item / Menu Item", oldProperties);

//     const newProperties: NewComponentProperties<".Item / Menu Item"> = {
//       "Label#52689:4": oldProperties["Label#52689:4"].value,
//     };
//     return newProperties;
//   },
// };

// const menuFabMenuItemGroupMapping: ComponentMapping<
//   "Item / Menu Item Group",
//   ".Item / Menu Item Group"
// > = {
//   oldComponent: "Item / Menu Item Group",
//   newComponent: ".Item / Menu Item Group",
//   variantMap: {},
//   calculateProperties: (oldProperties) => {
//     console.log("Item / Menu Item Group", oldProperties);

//     const newProperties: NewComponentProperties<".Item / Menu Item Group"> = {
//       "Item Count": oldProperties["Item Count"].value,
//     };
//     return newProperties;
//   },
// };

// const menuFabPrimaryItemMapping: ComponentMapping<
//   "Item / Primary Menu Item",
//   ".Item / Primary Menu Item"
// > = {
//   oldComponent: "Item / Primary Menu Item",
//   newComponent: ".Item / Primary Menu Item",
//   variantMap: {
//     "Status:Enabled": "Status:Enabled",
//     "Status:Hovered": "Status:Enabled-Pressed",
//     "Status:Pressed": "Status:Enabled-Pressed",
//   },
//   calculateProperties: (oldProperties) => {
//     console.log("Item / Primary Menu Item", oldProperties);

//     const newProperties: NewComponentProperties<".Item / Primary Menu Item"> = {};
//     return newProperties;
//   },
// };

export const menuFabMapping: ComponentMapping<
  "✅ Menu Floating Action Button v2",
  "🟢 Primary Floating Action Button"
> = {
  oldComponent: "✅ Menu Floating Action Button v2",
  newComponent: "🟢 Primary Floating Action Button",
  variantMap: {
    "State:Pressed": "State:Pressed",
    "State:Enabled": "State:Enabled",
    "Open:True": "Open:True",
    "Open:False": "Open:False",
    "Extended:True": "Extended:True",
    "Extended:False": "Extended:False",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Primary Floating Action Button"> = {
      "Label#28936:0": oldProperties["Label#28936:0"].value,
      Type: "Menu",
    };
    return newProperties;
  },
  childrenMappings: [
    // menuFabMenuItemMapping,
    // menuFabMenuItemGroupMapping,
    // menuFabPrimaryItemMapping,
  ],
};

export const fabMapping: ComponentMapping<
  "✅ Floating Action Button v2",
  "🟢 Floating Action Button"
> = {
  oldComponent: "✅ Floating Action Button v2",
  newComponent: "🟢 Floating Action Button",
  variantMap: {
    "State:Enabled": "State:Enabled",
    "State:Pressed": "State:Pressed",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Floating Action Button"> = {
      "Icon#28796:0": oldProperties["Icon#28796:0"].value,
    };
    return newProperties;
  },
};

export const extendedFabMapping: ComponentMapping<
  "✅ Extended Floating Action Button v2",
  "🟢 Extended Floating Action Button"
> = {
  oldComponent: "✅ Extended Floating Action Button v2",
  newComponent: "🟢 Extended Floating Action Button",
  variantMap: {
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Small",
    "Variant:Over Image": "Variant:Layer Floating",
    "Variant:Over Paper": "Variant:Neutral Solid",
    "State:Enabled": "State:Enabled",
    "State:Pressed": "State:Pressed",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Extended Floating Action Button"> = {
      "Label#28936:0": oldProperties["Label#28936:0"].value,
    };

    // Small일 때는 Regular을 사용하고 있고, Medium 일때는 Regular을 사용하고 있음
    switch (oldProperties.Size.value) {
      case "Small":
        newProperties["Icon#28796:0"] = oldProperties["Icon regular#28987:17"].value;
        break;
      case "Medium":
        newProperties["Icon#28796:0"] = oldProperties["Icon#28796:0"].value;
        break;
    }

    return newProperties;
  },
};
