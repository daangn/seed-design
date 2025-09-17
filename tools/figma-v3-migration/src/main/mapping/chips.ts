import type { ComponentMapping, NewComponentProperties } from "./types";

export const chipButtonMapping: ComponentMapping<"✅ Chip Button v2", "🟢 Chip"> = {
  oldComponent: "✅ Chip Button v2",
  newComponent: "🟢 Chip",
  variantMap: {
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Small",
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "State:Pressed": "State:Pressed",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Chip"> = {
      "Label#7185:0": oldProperties["Label#52810:25"].value,
      Variant: "Outline Strong",
    };

    const prefixIcon = oldProperties["Prefix#28903:0"].value;
    const suffixIcon = oldProperties["Suffix#28903:65"].value;

    switch (`${prefixIcon} ${suffixIcon}`) {
      case "true true":
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#28915:57"].value;
        newProperties["Prefix Type"] = "Icon";

        newProperties["Has Suffix#32538:181"] = true;
        break;
      case "true false":
        newProperties["Prefix Type"] = "Icon";
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#28915:57"].value;
        break;
      case "false true":
        newProperties["Has Suffix#32538:181"] = true;
        break;
      case "false false":
        newProperties["Prefix Type"] = "None";
        newProperties["Has Suffix#32538:181"] = false;
        break;
    }

    return newProperties;
  },
};

export const chipFilterMapping: ComponentMapping<"✅ Chip Filter v2", "🟢 Chip"> = {
  oldComponent: "✅ Chip Filter v2",
  newComponent: "🟢 Chip",
  variantMap: {
    "Selected:False": "Selected:False",
    "Selected:True": "Selected:True",
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "State:Pressed": "State:Pressed",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Chip"> = {
      // 원래 없었음
      "Has Suffix#32538:181": false,

      "Label#7185:0": oldProperties["Label#28900:0"].value,
    };

    const prefixIcon = oldProperties["Prefix#28752:25"].value;
    const suffixIcon = oldProperties["Suffix#28752:0"].value;

    if (prefixIcon && suffixIcon) {
      newProperties["Prefix Type"] = "Icon";
      newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#52835:0"].value;

      newProperties["Has Suffix#32538:181"] = true;
    } else if (prefixIcon && !suffixIcon) {
      newProperties["Prefix Type"] = "Icon";
      newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#52835:0"].value;
    } else if (!prefixIcon && suffixIcon) {
      newProperties["Has Suffix#32538:181"] = true;
    } else {
      newProperties["Prefix Type"] = "None";
      newProperties["Has Suffix#32538:181"] = false;
    }

    return newProperties;
  },
};

export const chipRadioMapping: ComponentMapping<"✅ Chip Radio v2", "🟢 Chip"> = {
  oldComponent: "✅ Chip Radio v2",
  newComponent: "🟢 Chip",
  variantMap: {
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Small",
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "State:Pressed": "State:Pressed",
    "Selected:False": "Selected:False",
    "Selected:True": "Selected:True",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Chip"> = {
      // 원래 없었음
      "Has Suffix#32538:181": false,

      "Label#7185:0": oldProperties["Label#54090:52"].value,
    };

    const prefixIcon = oldProperties["Prefix#54090:0"].value;
    const suffixIcon = oldProperties["Suffix#54090:26"].value;

    switch (`${prefixIcon} ${suffixIcon}`) {
      case "true true":
        newProperties["Prefix Type"] = "Icon";
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#54090:13"].value;
        newProperties["Has Suffix#32538:181"] = true;

        break;
      case "true false":
        newProperties["Prefix Type"] = "Icon";
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#54090:13"].value;
        break;
      case "false true":
        newProperties["Has Suffix#32538:181"] = true;

        break;
      case "false false":
        newProperties["Prefix Type"] = "None";
        newProperties["Has Suffix#32538:181"] = false;
        break;
    }

    return newProperties;
  },
};

export const chipToggleButtonMapping: ComponentMapping<"✅ Chip Toggle Button v2", "🟢 Chip"> = {
  oldComponent: "✅ Chip Toggle Button v2",
  newComponent: "🟢 Chip",
  variantMap: {
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "State:Pressed": "State:Pressed",
    "Selected:True": "Selected:True",
    "Selected:False": "Selected:False",
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Small",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Chip"> = {
      "Has Suffix#32538:181": false,
      "Label#7185:0": oldProperties["Label#52810:0"].value,
    };

    const prefixIcon = oldProperties["Prefix#28903:0"].value;
    const suffixIcon = oldProperties["Suffix#28903:65"].value;

    switch (`${prefixIcon} ${suffixIcon}`) {
      case "true true":
        newProperties["Prefix Type"] = "Icon";
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#28915:57"].value;
        newProperties["Has Suffix#32538:181"] = true;

        break;
      case "true false":
        newProperties["Prefix Type"] = "Icon";
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#28915:57"].value;
        break;
      case "false true":
        newProperties["Has Suffix#32538:181"] = true;

        break;
      case "false false":
        newProperties["Prefix Type"] = "None";
        newProperties["Has Suffix#32538:181"] = false;
        break;
    }

    return newProperties;
  },
};

// NOTE: 대응되는 V3 컴포넌트가 없음
// export const chipRadioGroupMapping: ComponentMapping<"✅ Chip Radio Group v2", "🟢 Control Chip"> =
//   {
//     oldComponent: "✅ Chip Radio Group v2",
//     newComponent: "🟢 Control Chip",
//     variantMap: {},
//     calculateProperties(oldProperties) {
//       const newProperties: NewComponentProperties<"🟢 Control Chip"> = {};
//       return newProperties;
//     },
//     childrenMappings: [chipRadioMapping],
//   };
