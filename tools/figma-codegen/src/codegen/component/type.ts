import type { InferFromDefinition } from "./type-helper";

export type BoxButtonProperties = InferFromDefinition<{
  "Label#369:5": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  "Show Prefix#366:0": {
    type: "BOOLEAN";
    defaultValue: true;
  };
  Size: {
    type: "VARIANT";
    defaultValue: "Xsmall";
    variantOptions: ["Xsmall", "Medium"];
  };
  Variant: {
    type: "VARIANT";
    defaultValue: "Brand";
    variantOptions: ["Neutral", "Brand"];
  };
}>;
