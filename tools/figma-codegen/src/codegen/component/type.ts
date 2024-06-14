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

export type ChipProperties = InferFromDefinition<{
  "↳Icon#52835:0": {
    type: "INSTANCE_SWAP";
    defaultValue: "764:7528";
    preferredValues: [];
  };
  "↳Icon #52835:5": {
    type: "INSTANCE_SWAP";
    defaultValue: "102:6196";
    preferredValues: [];
  };
  "Label#28900:0": {
    type: "TEXT";
    defaultValue: "라벨";
  };
  "Prefix#28752:25": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  "Suffix#28752:0": {
    type: "BOOLEAN";
    defaultValue: false;
  };
  동작: {
    type: "VARIANT";
    defaultValue: "Button";
    variantOptions: ["Button", "Radio", "Toggle"];
  };
  Size: {
    type: "VARIANT";
    defaultValue: "Medium";
    variantOptions: ["Small", "Medium"];
  };
  Inverted: {
    type: "VARIANT";
    defaultValue: "False";
    variantOptions: ["True", "False"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Enabled", "Pressed", "Disabled"];
  };
}>;

export type CalloutProperties = InferFromDefinition<{
  "Icon#70258:5": {
    type: "BOOLEAN";
    defaultValue: true;
  };
  Variant: {
    type: "VARIANT";
    defaultValue: "Outline";
    variantOptions: ["Outline", "Neutral", "Info", "Warning", "Danger"];
  };
  Layout: {
    type: "VARIANT";
    defaultValue: "Description Only";
    variantOptions: ["Description Only", "Title + Description", "Title + Description + Link"];
  };
  Interaction: {
    type: "VARIANT";
    defaultValue: "Default";
    variantOptions: ["Default", "Dismissable", "Actionable"];
  };
  State: {
    type: "VARIANT";
    defaultValue: "Enabled";
    variantOptions: ["Enabled", "Pressed"];
  };
}>;
