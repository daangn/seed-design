import type { ComponentMapping, NewComponentProperties } from "./types";

// Outlined → Template Text Field (Variant: Outline)
export const outlineTextFieldMapping: ComponentMapping<
  "✅ Text field_outlined v2",
  "🔵 [Template] Text Field"
> = {
  oldComponent: "✅ Text field_outlined v2",
  newComponent: "🔵 [Template] Text Field",
  variantMap: {
    "State:Enabled": "State:Enabled",
    "State:Focused": "State:Focused",
    "State:Error": "State:Error",
    "State:Error(Focused)": "State:Error Focused",
    "State:Disabled": "State:Disabled",
    "State:Read-only": "State:Read Only",
    "State:Filled": "State:Enabled",
    "State:Typing": "State:Focused",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🔵 [Template] Text Field"> = {
      Variant: "Outline",
      "Show Header#40606:8": oldProperties["Label#27940:0"].value,
      "Show Footer#40606:9": oldProperties["Bottom area#48886:0"].value,
    };
    return newProperties;
  },
};

// Underlined → Template Text Field (Variant: Underline)
export const underlinedTextFieldMapping: ComponentMapping<
  "✅ Text field_underlined v2",
  "🔵 [Template] Text Field"
> = {
  oldComponent: "✅ Text field_underlined v2",
  newComponent: "🔵 [Template] Text Field",
  variantMap: {
    "State:Enabled": "State:Enabled",
    "State:Focused": "State:Focused",
    "State:Error": "State:Error",
    "State:Error(Focused)": "State:Error Focused",
    "State:Disabled": "State:Disabled",
    "State:Read-only": "State:Read Only",
    "State:Filled": "State:Enabled",
    "State:Typing": "State:Focused",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🔵 [Template] Text Field"> = {
      Variant: "Underline",
      "Show Header#40606:8": oldProperties["Label#28377:60"].value,
      "Show Footer#40606:9": oldProperties["Bottom area#28377:53"].value,
    };
    return newProperties;
  },
};

// Multiline → Template Textarea Field
export const multilineTextFieldMapping: ComponentMapping<
  "✅ Multiline Text Field v2",
  "🔵 [Template] Textarea Field"
> = {
  oldComponent: "✅ Multiline Text Field v2",
  newComponent: "🔵 [Template] Textarea Field",
  variantMap: {
    "State:Enabled": "State:Enabled",
    "State:Focused": "State:Focused",
    "State:Error": "State:Error",
    "State:Error(Focused)": "State:Error Focused",
    "State:Disabled": "State:Disabled",
    "State:Read-only": "State:Read Only",
    "State:Filled": "State:Enabled",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🔵 [Template] Textarea Field"> = {
      "Show Header#40606:8": oldProperties["Label#28364:3"].value,
      "Show Footer#40606:9": oldProperties["Bottom area#48445:0"].value,
    };
    return newProperties;
  },
};
