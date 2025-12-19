import type * as FigmaRestSpec from "@figma/rest-api-spec";

export type NormalizedVariableAlias = Omit<FigmaRestSpec.VariableAlias, "id"> & {
  key: string;
};

type ReplaceVariableAliasIdWithKey<T> = T extends FigmaRestSpec.VariableAlias
  ? NormalizedVariableAlias
  : T extends Array<infer U>
    ? Array<ReplaceVariableAliasIdWithKey<U>>
    : T extends object
      ? {
          [K in keyof T]: ReplaceVariableAliasIdWithKey<T[K]>;
        }
      : T;

export type NormalizedIsLayerTrait = Pick<FigmaRestSpec.IsLayerTrait, "type" | "id" | "name"> & {
  boundVariables?: ReplaceVariableAliasIdWithKey<
    Pick<
      NonNullable<FigmaRestSpec.IsLayerTrait["boundVariables"]>,
      | "fills"
      | "strokes"
      | "itemSpacing"
      | "counterAxisSpacing"
      | "bottomLeftRadius"
      | "bottomRightRadius"
      | "topLeftRadius"
      | "topRightRadius"
      | "paddingBottom"
      | "paddingLeft"
      | "paddingRight"
      | "paddingTop"
      | "maxHeight"
      | "minHeight"
      | "maxWidth"
      | "minWidth"
    >
  >;
};

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
  | "relativeTransform"
  | "layoutPositioning"
  | "layoutSizingHorizontal"
  | "layoutSizingVertical"
  | "minHeight"
  | "minWidth"
  | "maxHeight"
  | "maxWidth"
>;

export type NormalizedSolidPaint = Omit<FigmaRestSpec.SolidPaint, "boundVariables"> & {
  boundVariables?: ReplaceVariableAliasIdWithKey<FigmaRestSpec.SolidPaint["boundVariables"]>;
};

export type NormalizedPaint =
  | NormalizedSolidPaint
  | FigmaRestSpec.GradientPaint
  | FigmaRestSpec.ImagePaint;

export type NormalizedHasGeometryTrait = Omit<
  Pick<FigmaRestSpec.HasGeometryTrait, "fills" | "strokes" | "strokeWeight">,
  "fills" | "strokes"
> & {
  fills: NormalizedPaint[];
  strokes: NormalizedPaint[];
  fillStyleKey?: string;
};

export type NormalizedShadow =
  | (Pick<FigmaRestSpec.DropShadowEffect, "type" | "color" | "offset" | "radius" | "spread"> & {
      boundVariables?: ReplaceVariableAliasIdWithKey<
        FigmaRestSpec.DropShadowEffect["boundVariables"]
      >;
    })
  | (Pick<FigmaRestSpec.InnerShadowEffect, "type" | "color" | "offset" | "radius" | "spread"> & {
      boundVariables?: ReplaceVariableAliasIdWithKey<
        FigmaRestSpec.InnerShadowEffect["boundVariables"]
      >;
    });

export type NormalizedHasEffectsTrait = Omit<FigmaRestSpec.HasEffectsTrait, "effects"> & {
  effects: NormalizedShadow[];
  effectStyleKey?: string;
};

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
    /**
     * in pixels
     */
    lineHeight?: number;
  };
}

export type NormalizedTypePropertiesTrait = Pick<
  FigmaRestSpec.TypePropertiesTrait,
  "style" | "characters"
> & {
  segments: NormalizedTextSegment[];

  textStyleKey?: string;
};

export type NormalizedDefaultShapeTrait = NormalizedIsLayerTrait &
  NormalizedHasLayoutTrait &
  NormalizedHasGeometryTrait &
  NormalizedHasEffectsTrait;

export type NormalizedFrameTrait = NormalizedIsLayerTrait &
  NormalizedHasLayoutTrait &
  NormalizedHasGeometryTrait &
  NormalizedHasEffectsTrait &
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

export interface NormalizedTextNode
  extends NormalizedDefaultShapeTrait,
    NormalizedTypePropertiesTrait {
  type: FigmaRestSpec.TextNode["type"];
}

export interface NormalizedComponentNode extends NormalizedFrameTrait {
  type: FigmaRestSpec.ComponentNode["type"];
}

export interface NormalizedInstanceNode extends NormalizedFrameTrait {
  type: FigmaRestSpec.InstanceNode["type"];

  componentProperties: {
    [key: string]: FigmaRestSpec.ComponentProperty & {
      componentKey?: string;
      componentSetKey?: string;
    };
  };

  componentKey: string;

  componentSetKey?: string;

  overrides?: FigmaRestSpec.InstanceNode["overrides"];

  children: NormalizedSceneNode[];
}

export interface NormalizedVectorNode extends NormalizedDefaultShapeTrait, NormalizedCornerTrait {
  type: FigmaRestSpec.VectorNode["type"];
}

export interface NormalizedBooleanOperationNode
  extends NormalizedIsLayerTrait,
    NormalizedHasChildrenTrait,
    NormalizedHasLayoutTrait,
    NormalizedHasGeometryTrait,
    NormalizedHasEffectsTrait {
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
