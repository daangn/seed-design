// known issue: box button 아이콘들 색상이 그대로 맵핑이 안됨
// known issue: 아이콘 버튼에서 XXSmall 버튼 맵핑이 없음

import type { ComponentMapping, NewComponentProperties } from "./types";

export const boxButtonMapping: ComponentMapping<"✅ Box Button v2", "🟢 Action Button"> = {
  oldComponent: "✅ Box Button v2",
  newComponent: "🟢 Action Button",
  variantMap: {
    "Size:XSmall": "Size:Small",
    "Size:Small": "Size:Small",
    "Size:Medium": "Size:Medium",
    "Size:Large": "Size:Large",
    "Size:XLarge": "Size:Large",
    "State:Enabled": "State:Enabled",
    "State:Disabled": "State:Disabled",
    "State:Loading": "State:Loading",
    "State:Pressed": "State:Pressed",
    "Variant:Primary": "Variant:Neutral Solid",
    "Variant:Primary low": "Variant:Neutral Weak",
    "Variant:Secondary": "Variant:Neutral Weak",
    "Variant:Danger": "Variant:Critical Solid",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Action Button"> = {
      "Label#5987:61": oldProperties["Label#28272:77"].value,
    };
    const prefixIcon = oldProperties["Prefix icon#28272:78"].value;
    const suffixIcon = oldProperties["Suffix icon#28272:76"].value;

    // prefixIcon이 true일때만 ↳Icons#28292:0의 value를 적용해야함
    // 현재 버튼의 문제점은 prefix 아이콘만 instance swap 되고 suffix 아이콘은 없음
    if (prefixIcon && suffixIcon) {
      newProperties.Layout = "Icon Last";
      newProperties["Prefix Icon#5987:305"] = oldProperties["↳Icons#28292:0"].value;
    } else if (prefixIcon) {
      newProperties.Layout = "Icon First";
      newProperties["Prefix Icon#5987:305"] = oldProperties["↳Icons#28292:0"].value;
    } else if (suffixIcon) {
      newProperties.Layout = "Icon Last";
    } else {
      newProperties.Layout = "Text Only";
    }
    return newProperties;
  },
  // swappableVariants: [
  //   {
  //     oldVariant: "Variant:Accent",
  //     newVariants: ["Tone:Neutral Subtle", "Tone:Neutral", "Tone:Brand", "Tone:Danger"],
  //     description: "Accent는 네 가지 종류가 있습니다.",
  //   },
  // ],
};

export const boxToggleButtonMapping: ComponentMapping<
  "✅ Box Toggle Button v2",
  "🟢 Toggle Button"
> = {
  oldComponent: "✅ Box Toggle Button v2",
  newComponent: "🟢 Toggle Button",
  variantMap: {
    "Size:XSmall": "Size:Small",
    "Size:Small": "Size:Small",
    "Size:Medium": "Size:Small",
    "Size:Large": "Size:Small",
    "Variant:Primary low": "Variant:Neutral Weak",
    "Variant:Secondary": "Variant:Neutral Weak",
    "Variant:Primary": "Variant:Brand Solid",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Toggle Button"> = {
      "Label#6122:49": oldProperties["Label#28272:77"].value,
    };

    const prefixIcon = oldProperties["Prefix icon#28272:78"].value;
    const suffixIcon = oldProperties["Suffix icon#28272:76"].value;

    // prefixIcon이 true일때만 ↳Icons#28292:0의 value를 적용해야함
    // 현재 버튼의 문제점은 prefix 아이콘만 instance swap 되고 suffix 아이콘은 없음
    if (prefixIcon && suffixIcon) {
      newProperties["Show Prefix Icon#6122:392"] = true;
      newProperties["Show Suffix Icon#6122:147"] = true;
      newProperties["Prefix Icon#6122:98"] = oldProperties["↳Icons#28292:0"].value;
      newProperties["Suffix Icon#6122:343"] = oldProperties["↳Icons#28292:0"].value;
    } else if (prefixIcon) {
      newProperties["Show Prefix Icon#6122:392"] = true;
      newProperties["Prefix Icon#6122:98"] = oldProperties["↳Icons#28292:0"].value;
    } else if (suffixIcon) {
      newProperties["Show Suffix Icon#6122:147"] = true;
      newProperties["Suffix Icon#6122:343"] = oldProperties["↳Icons#28292:0"].value;
    } else {
      newProperties["Show Prefix Icon#6122:392"] = false;
      newProperties["Show Suffix Icon#6122:147"] = false;
    }

    const isSelected = oldProperties.Selected.value;
    const oldState = oldProperties.State.value;
    if (isSelected === "True") {
      switch (oldState) {
        case "Disabled":
          newProperties.State = "Disabled-Selected";
          break;
        case "Enabled":
          newProperties.State = "Selected";
          break;
        case "Pressed":
          newProperties.State = "Selected-Pressed";
          break;
        case "Loading":
          newProperties.State = "Selected-Loading";
          break;
      }
    } else {
      switch (oldState) {
        case "Disabled":
          newProperties.State = "Disabled";
          break;
        case "Enabled":
          newProperties.State = "Enabled";
          break;
        case "Pressed":
          newProperties.State = "Pressed";
          break;
        case "Loading":
          newProperties.State = "Loading";
          break;
      }
    }
    return newProperties;
  },
};

// Capsule Toggle Button v2 -> Toggle Button 매핑
export const capsuleToggleButtonMapping: ComponentMapping<
  "✅ Capsule Toggle Button v2",
  "🟢 Reaction Button"
> = {
  oldComponent: "✅ Capsule Toggle Button v2",
  newComponent: "🟢 Reaction Button",
  variantMap: {
    "Size:Small": "Size:Small",
    "Size:XSmall": "Size:XSmall",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Reaction Button"> = {
      "Label#6397:0": oldProperties["Label#31072:0"].value,
      "Count#15816:0": "",
    };

    const isSelected = oldProperties.Selected.value;
    const oldState = oldProperties.State.value;
    if (isSelected === "True") {
      switch (oldState) {
        case "Disabled":
          newProperties.State = "Disabled-Selected";
          break;
        case "Enabled":
          newProperties.State = "Selected";
          break;
        case "Pressed":
          newProperties.State = "Selected-Pressed";
          break;
        case "Loading":
          newProperties.State = "Selected-Loading";
          break;
      }
    } else {
      switch (oldState) {
        case "Disabled":
          newProperties.State = "Disabled";
          break;
        case "Enabled":
          newProperties.State = "Enabled";
          break;
        case "Pressed":
          newProperties.State = "Pressed";
          break;
        case "Loading":
          newProperties.State = "Loading";
          break;
      }
    }

    return newProperties;
  },
};

export const iconButtonMapping: ComponentMapping<"icon_button", "🟢 Action Button"> = {
  oldComponent: "icon_button",
  newComponent: "🟢 Action Button",
  variantMap: {
    "Size:Large": "Size:Large",
    "Size:Medium": "Size:Medium",
    "Size:XSmall": "Size:XSmall",
    "Size:Small": "Size:Small",
    "Size:XXSmall": "Size:XSmall",
    "Size:xLarge": "Size:Large",
    "State:Enabled": "State:Enabled",
    "State:Pressed": "State:Pressed",
    "State:Disabled": "State:Disabled",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Action Button"> = {};
    newProperties.Layout = "Icon Only";
    newProperties["Icon#7574:0"] = oldProperties["Icon#28768:6"].value;
    newProperties.Variant = "Neutral Outline";
    return newProperties;
  },
};

// export const textButtonMapping: ComponentMapping<"✅ Text Button v2", "🟢 Text Button"> = {
//   oldComponent: "✅ Text Button v2",
//   newComponent: "🟢 Text Button",
//   variantMap: {},
//   calculateProperties(oldProperties) {
//     const newProperties: NewComponentProperties<"🟢 Text Button"> = {
//       "Label#19789:0": oldProperties["Label#28702:109"].value,
//       State: "Enabled",
//     };

//     return newProperties;
//   },
// swappableVariants: [
//   {
//     oldVariant: "Variant:Accent",
//     newVariants: ["Tone:Neutral Subtle", "Tone:Neutral", "Tone:Brand", "Tone:Danger"],
//     description: "Accent는 네 가지 종류가 있습니다.",
//   },
// ],
// };
