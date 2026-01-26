export const SETTINGS_KEY = "v3-migration-settings" as const;

export const SEED_V3_LIBRARY_NAME = "SEED Foundations" as const;
export const SEED_V3_LIBRARY_VARIABLE_COLLECTION_NAMES = {
  COLOR: "Color",
  UNIT: "Global",
  PREVIEW: "Preview",
} as const;

export const SEED_V3_LIBRARY_VARIABLE_PREFIXES = {
  UNIT: {
    DIMENSION: "dimension/",
    RADIUS: "radius/",
    STROKE_WIDTH: "stroke-width/",
  },
  COLOR: {
    FG: "fg/",
    BG: "bg/",
    PALETTE: "palette/",
    STROKE: "stroke/",
    MANNER_TEMP: "manner-temp/",
  },
} as const;

export const SIZING_VARIABLE_BINDABLE_NODE_FIELDS = [
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
] as const;

export const LAYOUT_VARIABLE_BINDABLE_NODE_FIELDS = [
  "itemSpacing",
  "counterAxisSpacing",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingBottom",
] as const;

export const CORNER_RADIUS_VARIABLE_BINDABLE_NODE_FIELDS = [
  "topLeftRadius",
  "topRightRadius",
  "bottomLeftRadius",
  "bottomRightRadius",
] as const;

export const STROKE_WEIGHT_VARIABLE_BINDABLE_NODE_FIELDS = [
  "strokeTopWeight",
  "strokeRightWeight",
  "strokeBottomWeight",
  "strokeLeftWeight",
] as const;

export const DEFAULT_PREFERENCES = {
  "inspect-v2-components-on-color-migration": false,
  "inspect-v2-components-on-text-style-migration": false,
};
