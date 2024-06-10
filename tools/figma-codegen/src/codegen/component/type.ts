import type { InferFromDefinition } from "./type-helper";

export type BoxButtonProperties = InferFromDefinition<{
  "↳Icons#449:9": {
    type: "INSTANCE_SWAP";
    defaultValue: "102:6198";
  };
  "Suffix Icon#445:1": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Label#369:5": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  "Prefix Icon#366:0": {
    type: "BOOLEAN";
    defaultValue: true;
  };
  Size: {
    type: "VARIANT";
    defaultValue: "Xsmall";
    variantOptions: ["Xsmall", "Medium", "Small", "Large", "XLarge"];
  };
  Variant: {
    type: "VARIANT";
    defaultValue: "Brand";
    variantOptions: ["Neutral", "Brand", "Brand Soft", "Danger"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Enabled", "Pressed", "Disabled", "Loading"];
  };
}>;
