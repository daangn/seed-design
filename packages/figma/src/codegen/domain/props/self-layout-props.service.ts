import { definePropsTransformer, type PropsTransformer } from "@/codegen/core";
import type {
  NormalizedHasFramePropertiesTrait,
  NormalizedHasLayoutTrait,
  NormalizedIsLayerTrait,
} from "@/normalizer";
import { objectEntries } from "@/utils/common";
import type { VariableService } from "../variable.service";

type SelfLayoutTrait = NormalizedIsLayerTrait &
  NormalizedHasLayoutTrait &
  NormalizedHasFramePropertiesTrait;

export interface SelfLayoutPropsService<T extends Record<string, any>> {
  transform: PropsTransformer<SelfLayoutTrait, T>;
}

type LayoutPropsKey =
  | "flexGrow"
  | "alignSelf"
  | "width"
  | "height"
  | "minWidth"
  | "minHeight"
  | "maxWidth"
  | "maxHeight";

type LayoutPropHandler = (props: SelfLayoutTrait) => string | number | boolean | undefined;

export type SeedSelfLayoutProps = Partial<Record<LayoutPropsKey, string | number | boolean>>;

export function createSelfLayoutPropsService({
  variableService,
}: { variableService: VariableService }): SelfLayoutPropsService<SeedSelfLayoutProps> {
  const getLayoutVariableName = (id: string) => variableService.getVariableName(id);
  const inferSizeVariableName = (value: number) =>
    variableService.inferVariableName("WIDTH_HEIGHT", value);

  const layoutPropHandlers: Record<LayoutPropsKey, LayoutPropHandler> = {
    flexGrow: ({ layoutGrow }) => layoutGrow,
    alignSelf: ({ layoutAlign }) => {
      switch (layoutAlign) {
        case "STRETCH":
          return "stretch";
        case "MIN":
          return "flexStart";
        case "CENTER":
          return "center";
        case "MAX":
          return "flexEnd";
      }
    },
    height: ({ boundVariables, layoutSizingVertical, absoluteBoundingBox }) =>
      layoutSizingVertical === "FIXED"
        ? boundVariables?.size?.y
          ? getLayoutVariableName(boundVariables.size.y.id)
          : inferSizeVariableName(absoluteBoundingBox?.height ?? 0)
        : undefined,
    width: ({ boundVariables, layoutSizingHorizontal, absoluteBoundingBox }) =>
      layoutSizingHorizontal === "FIXED"
        ? boundVariables?.size?.x
          ? getLayoutVariableName(boundVariables.size.x.id)
          : inferSizeVariableName(absoluteBoundingBox?.width ?? 0)
        : undefined,
    minHeight: ({ boundVariables, layoutSizingVertical, minHeight }) =>
      layoutSizingVertical === "HUG"
        ? boundVariables?.minHeight
          ? getLayoutVariableName(boundVariables.minHeight.id)
          : inferSizeVariableName(minHeight ?? 0)
        : undefined,
    maxHeight: ({ boundVariables, layoutSizingVertical, maxHeight }) =>
      layoutSizingVertical === "HUG"
        ? boundVariables?.maxHeight
          ? getLayoutVariableName(boundVariables.maxHeight.id)
          : inferSizeVariableName(maxHeight ?? 0)
        : undefined,
    minWidth: ({ boundVariables, layoutSizingHorizontal, minWidth }) =>
      layoutSizingHorizontal === "HUG"
        ? boundVariables?.minWidth
          ? getLayoutVariableName(boundVariables.minWidth.id)
          : inferSizeVariableName(minWidth ?? 0)
        : undefined,
    maxWidth: ({ boundVariables, layoutSizingHorizontal, maxWidth }) =>
      layoutSizingHorizontal === "HUG"
        ? boundVariables?.maxWidth
          ? getLayoutVariableName(boundVariables.maxWidth.id)
          : inferSizeVariableName(maxWidth ?? 0)
        : undefined,
  };

  // Default values
  const layoutPropDefaults: SeedSelfLayoutProps = {
    flexGrow: 0,
  };

  const transform = definePropsTransformer((node: SelfLayoutTrait) => {
    const result: SeedSelfLayoutProps = {};

    for (const [prop, handler] of objectEntries(layoutPropHandlers)) {
      const value = handler(node);
      if (value !== undefined && value !== layoutPropDefaults[prop]) {
        result[prop] = value;
      }
    }

    return result;
  });

  return { transform };
}
