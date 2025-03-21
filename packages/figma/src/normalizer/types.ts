import type * as FigmaRestSpec from "@figma/rest-api-spec";

export type CommonProps = "type" | "id" | "name" | "boundVariables";

export type RadiusProps = "cornerRadius" | "rectangleCornerRadii";

export type ShapeProps =
  | "layoutGrow"
  | "layoutAlign"
  | "layoutSizingHorizontal"
  | "layoutSizingVertical"
  | "absoluteBoundingBox"
  | "fills"
  | "strokes"
  | "strokeWeight";

export type LayoutProps =
  | "layoutMode"
  | "layoutWrap"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "paddingBottom"
  | "primaryAxisAlignItems"
  | "counterAxisAlignItems"
  | "primaryAxisSizingMode"
  | "counterAxisSizingMode"
  | "itemSpacing"
  | "counterAxisSpacing";

export interface NormalizedFrameNode
  extends Pick<FigmaRestSpec.FrameNode, CommonProps | ShapeProps | RadiusProps | LayoutProps> {
  children: NormalizedSceneNode[];
}

export interface NormalizedRectangleNode
  extends Pick<FigmaRestSpec.RectangleNode, CommonProps | ShapeProps | RadiusProps> {}

export interface NormalizedTextNode
  extends Pick<
    FigmaRestSpec.TextNode,
    CommonProps | "layoutGrow" | "layoutAlign" | "style" | "characters" | "fills"
  > {
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

export interface NormalizedComponentNode
  extends Pick<FigmaRestSpec.ComponentNode, CommonProps | ShapeProps | RadiusProps | LayoutProps> {
  children: NormalizedSceneNode[];
}

export interface NormalizedInstanceNode
  extends Pick<FigmaRestSpec.InstanceNode, CommonProps | ShapeProps | RadiusProps | LayoutProps> {
  componentProperties: {
    [key: string]: FigmaRestSpec.ComponentProperty & { componentKey?: string };
  };

  componentKey: string;

  componentSetKey?: string;

  children: NormalizedSceneNode[];
}

export interface NormalizedVectorNode
  extends Pick<FigmaRestSpec.VectorNode, CommonProps | ShapeProps> {}

export interface NormalizedBooleanOperationNode
  extends Pick<FigmaRestSpec.BooleanOperationNode, CommonProps | "fills"> {}

export type NormalizedSceneNode =
  | NormalizedFrameNode
  | NormalizedRectangleNode
  | NormalizedTextNode
  | NormalizedComponentNode
  | NormalizedInstanceNode
  | NormalizedVectorNode
  | NormalizedBooleanOperationNode;
