import type { ComponentMapping, NewComponentProperties } from "./types";

const itemMenuGroupMapping: ComponentMapping<"Action button group", ".Item / Menu Group"> = {
  oldComponent: "Action button group",
  newComponent: ".Item / Menu Group",
  variantMap: {},
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<".Item / Menu Group"> = {
      "Action Count":
        oldProperties["Action count"].value === "8 (Max)"
          ? "8"
          : oldProperties["Action count"].value,
    };

    return newProperties;
  },
};

const itemMenuItemMapping: ComponentMapping<"Action button", ".Item / Menu Item"> = {
  oldComponent: "Action button",
  newComponent: ".Item / Menu Item",
  variantMap: {
    "State:Default": "State:Enabled",
    "State:Pressed": "State:Pressed",
    "Type:Destructive": "Tone:Critical",
    "Type:Enabled": "Tone:Neutral",
    "Prefix icon:True": "Layout:Text with Icon",
    "Prefix icon:False": "Layout:\bText Only",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<".Item / Menu Item"> = {
      "Label#55905:8": oldProperties["🅃 Action label#55905:8"].value,
    };

    const hasPrefixIcon = oldProperties["Prefix icon"].value === "True";
    if (hasPrefixIcon) {
      newProperties["Show Prefix Icon#17043:5"] = true;
      newProperties["Prefix Icon#55948:0"] = oldProperties["Icon#55948:0"].value;
    }

    return newProperties;
  },
};

export const actionSheetMapping: ComponentMapping<"✅ Action Sheet v2", "🟢 Menu Sheet"> = {
  oldComponent: "✅ Action Sheet v2",
  newComponent: "🟢 Menu Sheet",
  variantMap: {},
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Menu Sheet"> = {
      Layout: "Text Only",
      "Show Safe Area#25531:15": true,
      "Menu Group Count": "1",
    };

    const hasTitle = oldProperties.Title.value === "True";

    if (hasTitle) {
      newProperties["Show Header#17043:12"] = true;
    }

    return newProperties;
  },
  childrenMappings: [itemMenuGroupMapping, itemMenuItemMapping],
};

export const actionSheetV2BetaMapping: ComponentMapping<"Action Sheet v2 beta", "🟢 Menu Sheet"> = {
  oldComponent: "Action Sheet v2 beta",
  newComponent: "🟢 Menu Sheet",
  variantMap: {},
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Menu Sheet"> = {
      Layout: "Text Only",
      "Show Safe Area#25531:15": false,
      "Menu Group Count": oldProperties["Action Group"].value,
    };

    return newProperties;
  },
};
