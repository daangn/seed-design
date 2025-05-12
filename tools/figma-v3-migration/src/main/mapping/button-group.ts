import { boxButtonMapping } from "./buttons";
import type { ComponentMapping, NewComponentProperties } from "./types";

export const buttonGroupMapping: ComponentMapping<"button_group", "🔵 [Template] Button Group"> = {
  oldComponent: "button_group",
  newComponent: "🔵 [Template] Button Group",
  variantMap: {
    "Size:Large": "Size:Medium",
    "Size:Medium": "Size:Small",
  },
  calculateProperties() {
    const newProperties: NewComponentProperties<"🔵 [Template] Button Group"> = {
      "Item Count": "2",
      Type: "horizontal Equal",
    };

    return newProperties;
  },
  childrenMappings: [boxButtonMapping],
};

export const buttonGroupFixedMapping: ComponentMapping<
  "button_group_fixed",
  "🔵 [Template] Bottom Tool Bar"
> = {
  oldComponent: "button_group_fixed",
  newComponent: "🔵 [Template] Bottom Tool Bar",
  variantMap: {
    "OS:Andorid": "OS:Andorid",
    "OS:iOS": "OS:iOS",
    "Position:Bottom fixed": "Position:Bottom fixed",
    "Position:On keyboard": "Position:On keyboard",
    "Type:Vertical": "Action Type:Vertical",
    "Type:Horizontal": "Action Type:Horizontal",
    "Type:Single": "Action Type:Single",
    "Type:Horizontal ratio": "Action Type:Horizontal ratio",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🔵 [Template] Bottom Tool Bar"> = {
      "Show Divider#19566:0": oldProperties["Divider#30731:5"].value,
      "Show Favorite Button#29056:0": oldProperties["Favorite#29056:0"].value,
      "Show Indicator#28768:0": oldProperties["Indicator#28768:0"].value,
      "Show Secondary Button#29056:29": oldProperties["Secondary btn#29056:29"].value,
      "Show Step Indicator#25896:0": oldProperties["Step Indicator#25896:0"].value,
      "Show Pay Logo#18180:0": false,
    };

    return newProperties;
  },
  childrenMappings: [boxButtonMapping],
};
