import type { ComponentMapping, NewComponentProperties } from "./types";

export const chipButtonMapping: ComponentMapping<"✅ Chip Button v2", "🟢 Action Chip"> = {
  oldComponent: "✅ Chip Button v2",
  newComponent: "🟢 Action Chip",
  variantMap: {
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Small",
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "State:Pressed": "State:Pressed",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Action Chip"> = {
      "Show Count#7185:42": oldProperties["Count#53703:0"].value,
      "Count#7185:21": oldProperties["↳Number#53703:26"].value,
      "Label#7185:0": oldProperties["Label#52810:25"].value,
    };

    const prefixIcon = oldProperties["Prefix#28903:0"].value;
    const suffixIcon = oldProperties["Suffix#28903:65"].value;

    switch (`${prefixIcon} ${suffixIcon}`) {
      case "true true":
        newProperties.Layout = "Icon Both";
        newProperties["Prefix Icon#8711:0"] = oldProperties["↳Icon#28915:57"].value;
        newProperties["Suffix Icon#8711:3"] = oldProperties["↳Icon #28915:0"].value;
        break;
      case "true false":
        newProperties.Layout = "Icon First";
        newProperties["Prefix Icon#8711:0"] = oldProperties["↳Icon#28915:57"].value;
        break;
      case "false true":
        newProperties.Layout = "Icon Last";
        newProperties["Suffix Icon#8711:3"] = oldProperties["↳Icon #28915:0"].value;
        break;
      case "false false":
        newProperties.Layout = "Text Only";
        break;
    }

    return newProperties;
  },
};

export const chipFilterMapping: ComponentMapping<"✅ Chip Filter v2", "🟢 Control Chip"> = {
  oldComponent: "✅ Chip Filter v2",
  newComponent: "🟢 Control Chip",
  variantMap: {},
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Control Chip"> = {
      // 원래 없었음
      "Show Count#7185:42": false,

      "Label#7185:0": oldProperties["Label#28900:0"].value,
    };

    const prefixIcon = oldProperties["Prefix#28752:25"].value;
    const suffixIcon = oldProperties["Suffix#28752:0"].value;

    if (prefixIcon && suffixIcon) {
      newProperties.Layout = "Icon Both";
      newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#52835:0"].value;
      newProperties["Suffix Icon#8722:82"] = oldProperties["↳Icon #52835:5"].value;
    } else if (prefixIcon && !suffixIcon) {
      newProperties.Layout = "Icon First";
      newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#52835:0"].value;
    } else if (!prefixIcon && suffixIcon) {
      newProperties.Layout = "Icon Last";
      newProperties["Suffix Icon#8722:82"] = oldProperties["↳Icon #52835:5"].value;
    } else {
      newProperties.Layout = "Text Only";
    }

    const isSelected = oldProperties.Selected.value === "True";
    const isDisabled = oldProperties.State.value === "Disabled";
    const isPressed = oldProperties.State.value === "Pressed";

    if (isSelected) {
      if (isDisabled) {
        newProperties.State = "Selected-Disabled";
      } else if (isPressed) {
        newProperties.State = "Selected-Pressed";
      } else {
        newProperties.State = "Selected";
      }
    } else if (isDisabled) {
      newProperties.State = "Disabled";
    } else if (isPressed) {
      newProperties.State = "Pressed";
    } else {
      newProperties.State = "Enabled";
    }

    return newProperties;
  },
};

export const chipRadioMapping: ComponentMapping<"✅ Chip Radio v2", "🟢 Control Chip"> = {
  oldComponent: "✅ Chip Radio v2",
  newComponent: "🟢 Control Chip",
  variantMap: {
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Small",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Control Chip"> = {
      // 원래 없었음
      "Show Count#7185:42": false,

      "Label#7185:0": oldProperties["Label#54090:52"].value,
    };

    const prefixIcon = oldProperties["Prefix#54090:0"].value;
    const suffixIcon = oldProperties["Suffix#54090:26"].value;

    switch (`${prefixIcon} ${suffixIcon}`) {
      case "true true":
        newProperties.Layout = "Icon Both";
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#54090:13"].value;
        newProperties["Suffix Icon#8722:82"] = oldProperties["↳Icon #54090:39"].value;
        break;
      case "true false":
        newProperties.Layout = "Icon First";
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#54090:13"].value;
        break;
      case "false true":
        newProperties.Layout = "Icon Last";
        newProperties["Suffix Icon#8722:82"] = oldProperties["↳Icon #54090:39"].value;
        break;
      case "false false":
        newProperties.Layout = "Text Only";
        break;
    }

    const isSelected = oldProperties.Selected.value === "True";
    const isDisabled = oldProperties.State.value === "Disabled";
    const isPressed = oldProperties.State.value === "Pressed";

    if (isSelected) {
      if (isDisabled) {
        newProperties.State = "Selected-Disabled";
      } else if (isPressed) {
        newProperties.State = "Selected-Pressed";
      } else {
        newProperties.State = "Selected";
      }
    } else if (isDisabled) {
      newProperties.State = "Disabled";
    } else if (isPressed) {
      newProperties.State = "Pressed";
    } else {
      newProperties.State = "Enabled";
    }

    return newProperties;
  },
};

export const chipToggleButtonMapping: ComponentMapping<
  "✅ Chip Toggle Button v2",
  "🟢 Control Chip"
> = {
  oldComponent: "✅ Chip Toggle Button v2",
  newComponent: "🟢 Control Chip",
  variantMap: {
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "State:Pressed": "State:Pressed",
    "Selected:True": "State:Selected",
    "Selected:False": "State:Enabled",
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Small",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Control Chip"> = {
      "Show Count#7185:42": oldProperties["Count#79653:0"].value,
      "Count#7185:21": oldProperties["↳Number#79653:13"].value,
      "Label#7185:0": oldProperties["Label#52810:0"].value,
    };

    const prefixIcon = oldProperties["Prefix#28903:0"].value;
    const suffixIcon = oldProperties["Suffix#28903:65"].value;

    switch (`${prefixIcon} ${suffixIcon}`) {
      case "true true":
        newProperties.Layout = "Icon Both";
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#28915:57"].value;
        newProperties["Suffix Icon#8722:82"] = oldProperties["↳Icon #28915:0"].value;
        break;
      case "true false":
        newProperties.Layout = "Icon First";
        newProperties["Prefix Icon#8722:0"] = oldProperties["↳Icon#28915:57"].value;
        break;
      case "false true":
        newProperties.Layout = "Icon Last";
        newProperties["Suffix Icon#8722:82"] = oldProperties["↳Icon #28915:0"].value;
        break;
      case "false false":
        newProperties.Layout = "Text Only";
        break;
    }

    const isSelected = oldProperties.Selected.value === "True";
    const isDisabled = oldProperties.State.value === "Disabled";
    const isPressed = oldProperties.State.value === "Pressed";

    if (isSelected) {
      if (isDisabled) {
        newProperties.State = "Selected-Disabled";
      } else if (isPressed) {
        newProperties.State = "Selected-Pressed";
      } else {
        newProperties.State = "Selected";
      }
    } else if (isDisabled) {
      newProperties.State = "Disabled";
    } else if (isPressed) {
      newProperties.State = "Pressed";
    } else {
      newProperties.State = "Enabled";
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
