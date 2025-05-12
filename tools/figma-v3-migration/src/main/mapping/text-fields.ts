import type { ComponentMapping, NewComponentProperties } from "./types";

export const outlineTextFieldMapping: ComponentMapping<
  "✅ Text field_outlined v2",
  "🟢 Text Field"
> = {
  oldComponent: "✅ Text field_outlined v2",
  newComponent: "🟢 Text Field",
  variantMap: {
    "Size:Large": "Size:Large(Default)",
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Medium",
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "State:Error(Focused)": "State:Invalid-Focused",
    "State:Error": "State:Invalid",
    "State:Focused": "State:Focused",
    "State:Read-only": "State:Read Only",
    "State:Typing": "State:Enabled",
  },
  calculateProperties(oldProperties, oldComponentStructure) {
    const newProperties: NewComponentProperties<"🟢 Text Field"> = {};

    const isLabel = oldProperties["Label#27940:0"].value;
    const isIndicator = oldProperties["Indicator#27940:13"].value;

    const state = oldProperties.State.value;
    if (
      state === "Error" ||
      state === "Error(Focused)" ||
      state === "Typing" ||
      state === "Filled" ||
      state === "Read-only" ||
      state === "Focused"
    ) {
      newProperties.Filled = "True";
      newProperties["Filled Text#1304:0"] = oldProperties["Placeholder#28371:121"].value;
    } else {
      newProperties.Filled = "False";
      newProperties["Placeholder#958:0"] = oldProperties["Placeholder#28371:121"].value;
    }

    if (isLabel) {
      newProperties["Show Header#870:0"] = true;

      if (isIndicator) {
        newProperties["Show Indicator#1259:0"] = oldProperties["Indicator#27940:13"].value;
        newProperties["Indicator#15327:249"] = oldComponentStructure?.children.label.children?.[
          "(선택)"
        ].value as string;
      }
    } else {
      newProperties["Show Header#870:0"] = false;
    }

    const isPrefixed = oldProperties["Prefix#52556:0"].value;
    if (isPrefixed) {
      newProperties["Show Prefix#958:125"] = true;

      const hasPrefixIcon = oldProperties["↳Prefix Icon#52556:29"].value;
      const hasPrefixText = oldProperties["↳Prefix Text#52556:58"].value;
      if (hasPrefixIcon) {
        newProperties["Show Prefix Icon#1267:50"] = true;
        newProperties["Prefix Icon#1267:25"] = oldProperties["　↳icon  #52556:116"].value;
      } else if (hasPrefixText) {
        newProperties["Show Prefix Icon#1267:50"] = false;
        newProperties["Prefix Text#15327:101"] = (oldComponentStructure?.children[
          "field+description"
        ]?.children?.text_field?.children?.Prefix?.children?.text?.children?.단위?.value ||
          "단위") as string;
      } else {
        newProperties["Show Prefix Icon#1267:50"] = false;
      }
      newProperties["Show Prefix Text#1267:0"] = oldProperties["↳Prefix Text#52556:58"].value;
    } else {
      newProperties["Show Prefix Icon#1267:50"] = false;
    }

    const isSuffixed = oldProperties["Suffix#43042:0"].value;
    if (isSuffixed) {
      newProperties["Show Suffix#958:100"] = true;
      const hasSuffixIcon = oldProperties["↳Suffix Icon#28371:92"].value;
      const hasSuffixText = oldProperties["↳Suffix Text#28371:63"].value;
      if (hasSuffixIcon) {
        newProperties["Show Suffix Icon#1267:75"] = true;
        newProperties["Suffix Icon #1267:100"] = oldProperties["　↳icon #28371:34"].value;
      } else if (hasSuffixText) {
        newProperties["Show Suffix Icon#1267:75"] = false;
        newProperties["Suffix Text#15327:138"] = (oldComponentStructure?.children[
          "field+description"
        ]?.children?.text_field?.children?.suffix?.children?.text?.children?.단위?.value ||
          "단위") as string;
      } else {
        newProperties["Show Suffix Icon#1267:75"] = false;
      }
      newProperties["Show Suffix Text#1267:125"] = oldProperties["↳Suffix Text#28371:63"].value;
    } else {
      newProperties["Show Suffix Icon#1267:75"] = false;
    }

    const hasBottomArea = oldProperties["Bottom area#48886:0"].value;
    if (hasBottomArea) {
      newProperties["Show Footer#958:25"] = true;
      newProperties["Show Description#958:50"] = oldProperties["↳Description#27940:26"].value;
      newProperties["Show Character Count#958:75"] =
        oldProperties["↳Character count#49277:0"].value;
      newProperties["Description#12626:5"] = (oldComponentStructure?.children?.["field+description"]
        ?.children?.["description+count"]?.children?.["Item / Text Field_description"]?.children
        ?.label?.value || "description") as string;

      const characterCount =
        oldComponentStructure?.children?.["field+description"]?.children?.["description+count"]
          ?.children?.["character count"]?.children?.[0]?.value || "0";
      newProperties["Character Count#15327:64"] = characterCount as string;

      const maxCharacterCount =
        (
          oldComponentStructure?.children?.["field+description"]?.children?.["description+count"]
            ?.children?.["character count"]?.children?.["/000"]?.value as string
        )?.replace(/\//g, "") || "100";
      newProperties["Max Character Count#15327:27"] = maxCharacterCount as string;
    } else {
      newProperties["Show Footer#958:25"] = false;
    }

    return newProperties;
  },
};

export const underlinedTextFieldMapping: ComponentMapping<
  "✅ Text field_underlined v2",
  "🟢 Text Field"
> = {
  oldComponent: "✅ Text field_underlined v2",
  newComponent: "🟢 Text Field",
  variantMap: {
    "Size:Large": "Size:Large(Default)",
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Medium",
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "State:Error(Focused)": "State:Invalid-Focused",
    "State:Error": "State:Invalid",
    "State:Focused": "State:Focused",
    "State:Read-only": "State:Read Only",
    "State:Typing": "State:Enabled",
  },
  calculateProperties(oldProperties, oldComponentStructure) {
    const newProperties: NewComponentProperties<"🟢 Text Field"> = {};

    const isLabel = oldProperties["Label#28377:60"].value;
    const isIndicator = oldProperties["Indicator#28377:55"].value;

    if (isLabel) {
      newProperties["Show Header#870:0"] = true;

      if (isIndicator) {
        newProperties["Show Indicator#1259:0"] = oldProperties["Indicator#28377:55"].value;

        newProperties["Indicator#15327:249"] = (oldComponentStructure?.children.text_field_top
          .children?.["label+text_field"].children?.label.children?.["(선택)"].value ||
          "(선택)") as string;
      }
    } else {
      newProperties["Show Header#870:0"] = false;
    }

    const state = oldProperties.State.value;
    if (
      state === "Error" ||
      state === "Error(Focused)" ||
      state === "Typing" ||
      state === "Filled" ||
      state === "Read-only" ||
      state === "Focused"
    ) {
      newProperties.Filled = "True";
      newProperties["Filled Text#1304:0"] = oldProperties["Placeholder#28377:58"].value;
    } else {
      newProperties.Filled = "False";
      newProperties["Placeholder#958:0"] = oldProperties["Placeholder#28377:58"].value;
    }

    const isPrefixed = oldProperties["Prefix#28377:61"].value;
    if (isPrefixed) {
      newProperties["Show Prefix#958:125"] = true;

      const hasPrefixIcon = oldProperties["↳Prefix Icon#52560:0"].value;
      const hasPrefixText = oldProperties["↳Prefix Text#52560:29"].value;
      if (hasPrefixIcon) {
        newProperties["Show Prefix Icon#1267:50"] = true;
        newProperties["Prefix Icon#1267:25"] = oldProperties["　↳Icon #52560:58"].value;
      } else if (hasPrefixText) {
        newProperties["Show Prefix Icon#1267:50"] = false;
        newProperties["Prefix Text#15327:101"] = (oldComponentStructure?.children.text_field_top
          .children?.["label+text_field"].children?.text_field?.children?.prefix.children?.단위
          ?.value || "단위") as string;
      } else {
        newProperties["Show Prefix Icon#1267:50"] = false;
      }
      newProperties["Show Prefix Text#1267:0"] = oldProperties["↳Prefix Text#52560:29"].value;
    } else {
      newProperties["Show Prefix Icon#1267:50"] = false;
    }

    const isSuffixed = oldProperties["Suffix#28377:62"].value;
    if (isSuffixed) {
      newProperties["Show Suffix#958:100"] = true;
      const hasSuffixIcon = oldProperties["↳Suffix Icon#28377:54"].value;
      const hasSuffixText = oldProperties["↳Suffix Text#28377:64"].value;
      if (hasSuffixIcon) {
        newProperties["Show Suffix Icon#1267:75"] = true;
        newProperties["Suffix Icon #1267:100"] = oldProperties["　↳Icon#28377:63"].value;
      } else if (hasSuffixText) {
        newProperties["Show Suffix Icon#1267:75"] = false;
        newProperties["Suffix Text#15327:138"] = (oldComponentStructure?.children.text_field_top
          .children?.["label+text_field"].children?.text_field?.children?.suffix?.children?.action
          .value || "action") as string;
      } else {
        newProperties["Show Suffix Icon#1267:75"] = false;
      }
      newProperties["Show Suffix Text#1267:125"] = oldProperties["↳Suffix Text#28377:64"].value;
    } else {
      newProperties["Show Suffix Icon#1267:75"] = false;
    }

    const hasBottomArea = oldProperties["Bottom area#28377:53"].value;
    if (hasBottomArea) {
      newProperties["Show Footer#958:25"] = true;
      newProperties["Show Description#958:50"] = oldProperties["↳Description#28377:56"].value;
      newProperties["Show Character Count#958:75"] =
        oldProperties["↳Character count#28377:57"].value;
      const characterCount =
        oldComponentStructure?.children?.text_field_bottom?.children?.["character count"]
          ?.children?.["character count"]?.children?.[0]?.value || "0";
      newProperties["Character Count#15327:64"] = characterCount as string;

      const maxCharacterCount =
        (
          oldComponentStructure?.children?.text_field_bottom?.children?.["character count"]
            ?.children?.["character count"]?.children?.["/000"]?.value as string
        )?.replace(/\//g, "") || "100";
      newProperties["Max Character Count#15327:27"] = maxCharacterCount as string;
    } else {
      newProperties["Show Footer#958:25"] = false;
    }

    return newProperties;
  },
};

export const multilineTextFieldMapping: ComponentMapping<
  "✅ Multiline Text Field v2",
  "🟢 Multiline Text Field"
> = {
  oldComponent: "✅ Multiline Text Field v2",
  newComponent: "🟢 Multiline Text Field",
  variantMap: {
    "State:Disabled": "State:Disabled",
    "State:Enabled": "State:Enabled",
    "State:Error(Focused)": "State:Invalid-Focused",
    "State:Error": "State:Invalid",
    "State:Focused": "State:Focused",
    "State:Read-only": "State:Read Only",
  },
  calculateProperties(oldProperties, oldComponentStructure) {
    const newProperties: NewComponentProperties<"🟢 Multiline Text Field"> = {};

    const isLabel = oldProperties["Label#28364:3"].value;
    const isIndicator = oldProperties["Indicator#28364:18"].value;

    newProperties.Size = "Medium";

    const state = oldProperties.State.value;
    if (
      state === "Error" ||
      state === "Error(Focused)" ||
      state === "Filled" ||
      state === "Read-only" ||
      state === "Focused"
    ) {
      newProperties.Filled = "True";
      newProperties["Filled Text#1304:0"] = oldProperties["Placeholder#48445:15"].value;
    } else {
      newProperties.Filled = "False";
      newProperties["Placeholder#958:0"] = oldProperties["Placeholder#48445:15"].value;
    }

    if (isLabel) {
      newProperties["Show Header#870:0"] = true;

      if (isIndicator) {
        newProperties["Show Indicator#1259:0"] = true;

        newProperties["Indicator#15327:286"] = (oldComponentStructure?.children.label.children?.[
          "(선택)"
        ].value || "(선택)") as string;
      }
    } else {
      newProperties["Show Header#870:0"] = false;
    }

    const hasBottomArea = oldProperties["Bottom area#48445:0"].value;
    if (hasBottomArea) {
      newProperties["Show Footer#958:25"] = true;
      newProperties["Show Description#958:50"] = oldProperties["↳Description#28364:33"].value;
      newProperties["Show Character count#958:75"] =
        oldProperties["↳Character count#46693:0"].value;
      newProperties["Description#15327:212"] = (oldComponentStructure?.children?.[
        "field+description"
      ]?.children?.["description+count"]?.children?.["Item / Text Field_description"]?.children
        ?.label?.value || "description") as string;

      const characterCount =
        oldComponentStructure?.children?.["field+description"]?.children?.["description+count"]
          ?.children?.["character count"]?.children?.["0"]?.value || "0";
      newProperties["Character Count#15327:360"] = characterCount as string;

      const maxCharacterCount =
        (
          oldComponentStructure?.children?.["field+description"]?.children?.["description+count"]
            ?.children?.["character count"]?.children?.["/000"]?.value as string
        )?.replace(/\//g, "") || "0";
      newProperties["Max Character Count#15327:175"] = maxCharacterCount as string;
    }

    return newProperties;
  },
};
