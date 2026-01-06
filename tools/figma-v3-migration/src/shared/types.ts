import type {
  CORNER_RADIUS_VARIABLE_BINDABLE_NODE_FIELDS,
  LAYOUT_VARIABLE_BINDABLE_NODE_FIELDS,
  SIZING_VARIABLE_BINDABLE_NODE_FIELDS,
  STROKE_WEIGHT_VARIABLE_BINDABLE_NODE_FIELDS,
} from "../shared/constants";

export type VariableWithResolvedColor = { variable: Variable; hex: string; opacity: number };

export type PaletteProperty = "bg" | "fg" | "stroke" | null;

export interface SerializedBaseNode {
  id: BaseNode["id"];
  name: BaseNode["name"];
  type: BaseNode["type"];
  characters?: TextNode["characters"];
}

export interface SerializedTextNode {
  id: TextNode["id"];
  name: TextNode["name"];
  characters: TextNode["characters"];
  fontSize: Exclude<TextNode["fontSize"], PluginAPI["mixed"]> | null;
  fontWeight: Exclude<TextNode["fontWeight"], PluginAPI["mixed"]> | null;
  lineHeight: Exclude<TextNode["lineHeight"], PluginAPI["mixed"]> | null;
}

export interface SerializedInstanceNode {
  id: InstanceNode["id"];
  name: InstanceNode["name"];
}

export interface SerializedTextStyle {
  id: TextStyle["id"];
  name: TextStyle["name"];
  fontSize: TextStyle["fontSize"];
  fontNameStyle: TextStyle["fontName"]["style"];
  lineHeight: TextStyle["lineHeight"];
}

export interface SerializedPaintStyle {
  id: PaintStyle["id"];
  name: PaintStyle["name"];
}

export interface SerializedVariable {
  id: Variable["id"];
  key: Variable["key"];
  name: Variable["name"];
}

export type TextStylesSuggestionsResults = {
  textNode: TextNode;
  suggestions: {
    textStyle: TextStyle;
    distance: number;
    differences: {
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
    };
  }[];
}[];

export type SerializedTextStyleSuggestionsResults = {
  textNode: SerializedTextNode;
  closestInstanceNode: SerializedInstanceNode | null;
  selectedNewTextStyleId: SerializedTextStyle["id"] | null;
  suggestions: {
    textStyle: SerializedTextStyle;
    distance: number;
    differences: {
      fontSize: number | null;
      fontWeight: number | null;
      lineHeight: number | null;
    };
  }[];
}[];

export type GroupedSerializedTextStyleSuggestionsResults = {
  groupId: string;
  items: SerializedTextStyleSuggestionsResults;
}[];

export type ColorVariablesSuggestionsResults = {
  oldValue:
    | {
        type: "style";
        style: PaintStyle;
        hex: string;
        opacity: number;
        paletteProperty: PaletteProperty;
      }
    | { type: "detached"; hex: string; opacity: number }
    | { type: "variable"; variable: Variable; hex: string; opacity: number }
    | { type: "uncheckable" };
  suggestions: { variable: Variable; hex: string; opacity: number }[];
  consumers: {
    node: SceneNode;
    properties: ("Fill" | "Stroke" | "Effect")[];
  }[];
}[];

export type SerializedColorVariablesSuggestionsResults = {
  oldValue:
    | {
        type: "style";
        style: SerializedPaintStyle;
        hex: string;
        opacity: number;
        paletteProperty: PaletteProperty;
      }
    | { type: "detached"; hex: string; opacity: number }
    | { type: "variable"; variable: SerializedVariable; hex: string; opacity: number }
    | { type: "uncheckable" };
  suggestions: {
    variable: SerializedVariable;
    hex: string;
    opacity: number;
    lightMode: { hex: string; opacity: number };
    darkMode: { hex: string; opacity: number };
  }[];
  consumers: {
    node: SerializedBaseNode;
    closestInstanceNode: SerializedInstanceNode | null;
    properties: ("Fill" | "Stroke" | "Effect")[];
    selectedNewVariableId: SerializedVariable["id"] | null;
  }[];
}[];

export type SizingVariablesSuggestionsResults = {
  oldValue: number;
  suggestions: { variable: Variable; value: number }[];
  consumers: {
    node: SceneNode;
    properties: (typeof SIZING_VARIABLE_BINDABLE_NODE_FIELDS)[number][];
  }[];
}[];

export type SerializedSizingVariablesSuggestionsResults = {
  oldValue: number;
  suggestions: { variable: SerializedVariable; value: number }[];
  consumers: {
    node: SerializedBaseNode;
    closestInstanceNode: SerializedInstanceNode | null;
    properties: (typeof SIZING_VARIABLE_BINDABLE_NODE_FIELDS)[number][];
    selectedNewVariableId: SerializedVariable["id"] | null;
  }[];
}[];

export type LayoutVariablesSuggestionsResults = {
  oldValue: number;
  suggestions: { variable: Variable; value: number }[];
  consumers: {
    node: SceneNode;
    properties: (typeof LAYOUT_VARIABLE_BINDABLE_NODE_FIELDS)[number][];
  }[];
}[];

export type SerializedLayoutVariablesSuggestionsResults = {
  oldValue: number;
  suggestions: { variable: SerializedVariable; value: number }[];
  consumers: {
    node: SerializedBaseNode;
    closestInstanceNode: SerializedInstanceNode | null;
    properties: (typeof LAYOUT_VARIABLE_BINDABLE_NODE_FIELDS)[number][];
    selectedNewVariableId: SerializedVariable["id"] | null;
  }[];
}[];

export type StrokeWeightAndCornerRadiusVariablesSuggestionsResults = {
  oldValue: { type: "strokeWeight" | "cornerRadius"; value: number };
  suggestions: { variable: Variable; value: number }[];
  consumers: {
    node: SceneNode;
    properties: (
      | (typeof STROKE_WEIGHT_VARIABLE_BINDABLE_NODE_FIELDS)[number]
      | (typeof CORNER_RADIUS_VARIABLE_BINDABLE_NODE_FIELDS)[number]
    )[];
  }[];
}[];

export type SerializedStrokeWeightAndCornerRadiusVariablesSuggestionsResults = {
  oldValue: { type: "strokeWeight" | "cornerRadius"; value: number };
  suggestions: { variable: SerializedVariable; value: number }[];
  consumers: {
    node: SerializedBaseNode;
    closestInstanceNode: SerializedInstanceNode | null;
    properties: (
      | (typeof STROKE_WEIGHT_VARIABLE_BINDABLE_NODE_FIELDS)[number]
      | (typeof CORNER_RADIUS_VARIABLE_BINDABLE_NODE_FIELDS)[number]
    )[];
    selectedNewVariableId: SerializedVariable["id"] | null;
  }[];
}[];

export interface FigmaMetadata {
  currentUser: {
    id: string;
    name: string;
  };
  currentPage: {
    id: string;
    name: string;
  };
  currentRoot: {
    name: string;
  };
  fileKey: string;
}

export interface SolidPaint {
  type: "SOLID";
  color: {
    r: number;
    g: number;
    b: number;
  };
  opacity?: number;
  visible?: boolean;
  blendMode?: BlendMode;
  boundVariables?: {
    color?: {
      type: string;
      id: string;
    };
  };
  variableId?: string;
}

// 컴포넌트

export interface InstanceInfo {
  id: string;
  name: string;
  key: string;
  componentProperties: ComponentProperties;
  version: "v2" | "v3";
}

export type SwapResult = Record<
  InstanceInfo["id"],
  {
    ok: boolean;
    errorMessage?: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    metadata?: Record<string, any>;
  }
>;
