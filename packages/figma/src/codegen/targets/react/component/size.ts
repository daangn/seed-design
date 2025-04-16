// TODO: move this file to relevant directory

import { camelCase } from "change-case";

type SizeProp = "XSmall" | "Small" | "Medium" | "Large" | "XLarge" | ({} & string);

export function handleSizeProp(size: SizeProp) {
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
