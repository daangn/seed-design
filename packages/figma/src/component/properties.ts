import { camelCase } from "change-case";

type Size = "XSmall" | "Small" | "Medium" | "Large" | "XLarge" | ({} & string);

export function handleSize(size: Size) {
  switch (size) {
    case "XSmall":
      return "xsmall";
    case "Small":
      return "small";
    case "Medium":
      return "medium";
    case "Large":
      return "large";
    case "XLarge":
      return "xlarge";
    default:
      return camelCase(size);
  }
}
