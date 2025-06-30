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
  "🟢 Floating Action Button"
> = {
  oldComponent: "✅ Menu Floating Action Button v2",
  newComponent: "🟢 Floating Action Button",
  variantMap: {
    "Open:True": "Type:Menu",
    "Open:False": "Type:Button",
  },
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Floating Action Button"> = {};
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
  variantMap: {},
  calculateProperties() {
    const newProperties: NewComponentProperties<"🟢 Floating Action Button"> = {
      Type: "Button",
    };
    return newProperties;
  },
};

export const extendedFabMapping: ComponentMapping<
  "✅ Extended Floating Action Button v2",
  "🟢 Contextual Floating Button"
> = {
  oldComponent: "✅ Extended Floating Action Button v2",
  newComponent: "🟢 Contextual Floating Button",
  variantMap: {
    "Variant:Over Paper": "Variant:Solid",
    "Variant:Over Image": "Variant:Layer",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Contextual Floating Button"> = {
      Layout: "Icon First",
      "Icon#28796:0": oldProperties["Icon#28796:0"].value,
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
