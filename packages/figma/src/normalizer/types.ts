import type * as FigmaRestSpec from "@figma/rest-api-spec";

export type NormalizedIsLayerTrait = Pick<
  FigmaRestSpec.IsLayerTrait,
  "type" | "id" | "name" | "boundVariables"
>;

export type NormalizedCornerTrait = Pick<
  FigmaRestSpec.CornerTrait,
  "cornerRadius" | "rectangleCornerRadii"
>;

export type NormalizedHasChildrenTrait = {
  children: NormalizedSceneNode[];
};

export type NormalizedHasLayoutTrait = Pick<
  FigmaRestSpec.HasLayoutTrait,
  | "layoutAlign"
  | "layoutGrow"
  | "absoluteBoundingBox"
  | "layoutPositioning"
  | "layoutSizingHorizontal"
  | "layoutSizingVertical"
  | "minHeight"
  | "minWidth"
  | "maxHeight"
  | "maxWidth"
>;

export type NormalizedHasGeometryTrait = Pick<
  FigmaRestSpec.HasGeometryTrait,
  "fills" | "strokes" | "strokeWeight" | "styles"
>;

export type NormalizedHasFramePropertiesTrait = Pick<
  FigmaRestSpec.HasFramePropertiesTrait,
  | "layoutMode"
  | "layoutWrap"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "paddingBottom"
  | "primaryAxisAlignItems"
  | "primaryAxisSizingMode"
  | "counterAxisAlignItems"
  | "counterAxisSizingMode"
  | "itemSpacing"
  | "counterAxisSpacing"
>;

export type NormalizedDefaultShapeTrait = NormalizedIsLayerTrait &
  NormalizedHasLayoutTrait &
  NormalizedHasGeometryTrait;

export type NormalizedFrameTrait = NormalizedIsLayerTrait &
  NormalizedHasLayoutTrait &
  NormalizedHasGeometryTrait &
  NormalizedHasChildrenTrait &
  NormalizedCornerTrait &
  NormalizedHasFramePropertiesTrait;

export interface NormalizedFrameNode extends NormalizedFrameTrait {
  type: FigmaRestSpec.FrameNode["type"];
}

export interface NormalizedRectangleNode
  extends NormalizedDefaultShapeTrait,
    NormalizedCornerTrait {
  type: FigmaRestSpec.RectangleNode["type"];
}

export interface NormalizedTextNode extends NormalizedDefaultShapeTrait {
  type: FigmaRestSpec.TextNode["type"];

  style: FigmaRestSpec.TextNode["style"];

  characters: FigmaRestSpec.TextNode["characters"];

  segments: NormalizedTextSegment[];

  textStyleKey?: string;
}

export interface NormalizedTextSegment {
  characters: string;
  start: number;
  end: number;
  style: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    italic?: boolean;
    textDecoration?: string;
    letterSpacing?: number;
    lineHeight?: number | { unit: string; value: number };
  };
}

export interface NormalizedComponentNode extends NormalizedFrameTrait {
  type: FigmaRestSpec.ComponentNode["type"];
}

export interface NormalizedInstanceNode extends NormalizedFrameTrait {
  type: FigmaRestSpec.InstanceNode["type"];

  componentProperties: {
    [key: string]: FigmaRestSpec.ComponentProperty & { componentKey?: string };
  };

  componentKey: string;

  componentSetKey?: string;

  children: NormalizedSceneNode[];
}

export interface NormalizedVectorNode extends NormalizedDefaultShapeTrait, NormalizedCornerTrait {
  type: FigmaRestSpec.VectorNode["type"];
}

export interface NormalizedBooleanOperationNode
  extends NormalizedIsLayerTrait,
    NormalizedHasChildrenTrait,
    NormalizedHasLayoutTrait,
    NormalizedHasGeometryTrait {
  type: FigmaRestSpec.BooleanOperationNode["type"];
}

export interface NormalizedUnhandledNode {
  type: "UNHANDLED";
  id: string;
  original: FigmaRestSpec.Node | SceneNode;
}

export type NormalizedSceneNode =
  | NormalizedFrameNode
  | NormalizedRectangleNode
  | NormalizedTextNode
  | NormalizedComponentNode
  | NormalizedInstanceNode
  | NormalizedVectorNode
  | NormalizedBooleanOperationNode
  | NormalizedUnhandledNode;
