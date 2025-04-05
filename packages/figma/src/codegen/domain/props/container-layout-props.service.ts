import { definePropsTransformer, type PropsTransformer } from "@/codegen/core";
import type {
  NormalizedHasChildrenTrait,
  NormalizedHasFramePropertiesTrait,
  NormalizedIsLayerTrait,
} from "@/normalizer";
import { objectEntries } from "@/utils/common";
import type { VariableService } from "../variable.service";

type ContainerLayoutTrait = NormalizedHasFramePropertiesTrait &
  NormalizedHasChildrenTrait &
  NormalizedIsLayerTrait;

export interface ContainerLayoutPropsService<T extends Record<string, any>> {
  transform: PropsTransformer<ContainerLayoutTrait, T>;
}

// Seed Implementation
type LayoutPropsKey =
  | "flexDirection"
  | "justifyContent"
  | "alignItems"
  | "flexWrap"
  | "gap"
  | "paddingBottom"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop";

type LayoutShorthandPropsKey = "padding" | "paddingX" | "paddingY";

type LayoutPropHandler = (props: ContainerLayoutTrait) => string | number | boolean | undefined;

type LayoutShorthandHandler = (
  props: Partial<Record<LayoutPropsKey, string | number | boolean | undefined>>,
) =>
  | {
      value: string | number | boolean | undefined;
      exclude: LayoutPropsKey[];
    }
  | undefined;

export type SeedContainerLayoutProps = Partial<
  Record<LayoutPropsKey | LayoutShorthandPropsKey, string | number | boolean>
>;

export function createContainerLayoutPropsService({
  variableService,
}: { variableService: VariableService }): ContainerLayoutPropsService<SeedContainerLayoutProps> {
  const getLayoutVariableName = (id: string) => variableService.getVariableName(id);
  const inferSpacingVariableName = (value: number) =>
    variableService.inferVariableName("GAP", value);

  const layoutPropHandlers: Record<LayoutPropsKey, LayoutPropHandler> = {
    flexDirection: ({ layoutMode }) => (layoutMode === "HORIZONTAL" ? "row" : "column"),
    justifyContent: ({ primaryAxisAlignItems }) => {
      switch (primaryAxisAlignItems) {
        case "MIN":
          return "flexStart";
        case "CENTER":
          return "center";
        case "MAX":
          return "flexEnd";
        case "SPACE_BETWEEN":
          return "spaceBetween";
      }
    },
    alignItems: ({ counterAxisAlignItems, children }) => {
      const isStretch = children.every((child) => {
        if (!("layoutAlign" in child)) {
          return false;
        }

        return child.layoutAlign === "STRETCH";
      });

      if (isStretch) {
        return "stretch";
      }

      switch (counterAxisAlignItems) {
        case "MIN":
          return "flexStart";
        case "CENTER":
          return "center";
        case "MAX":
          return "flexEnd";
        case "BASELINE":
          return "baseline";
      }
    },
    flexWrap: ({ layoutWrap }) => (layoutWrap === "WRAP" ? "wrap" : "nowrap"),
    gap: ({ itemSpacing, boundVariables, primaryAxisAlignItems, children }) =>
      children.length <= 1
        ? 0
        : primaryAxisAlignItems === "SPACE_BETWEEN"
          ? 0
          : boundVariables?.itemSpacing
            ? getLayoutVariableName(boundVariables.itemSpacing.id)
            : inferSpacingVariableName(itemSpacing ?? 0),
    paddingTop: ({ paddingTop, boundVariables }) =>
      boundVariables?.paddingTop
        ? getLayoutVariableName(boundVariables.paddingTop.id)
        : inferSpacingVariableName(paddingTop ?? 0),
    paddingBottom: ({ paddingBottom, boundVariables }) =>
      boundVariables?.paddingBottom
        ? getLayoutVariableName(boundVariables.paddingBottom.id)
        : inferSpacingVariableName(paddingBottom ?? 0),
    paddingLeft: ({ paddingLeft, boundVariables }) =>
      boundVariables?.paddingLeft
        ? getLayoutVariableName(boundVariables.paddingLeft.id)
        : inferSpacingVariableName(paddingLeft ?? 0),
    paddingRight: ({ paddingRight, boundVariables }) =>
      boundVariables?.paddingRight
        ? getLayoutVariableName(boundVariables.paddingRight.id)
        : inferSpacingVariableName(paddingRight ?? 0),
  };

  const layoutShorthandHandlers: Record<LayoutShorthandPropsKey, LayoutShorthandHandler> = {
    paddingX: ({ paddingLeft, paddingRight, paddingTop, paddingBottom }) => {
      if (paddingLeft === undefined || paddingRight === undefined) {
        return undefined;
      }

      if (
        paddingLeft === paddingRight &&
        paddingTop === paddingBottom &&
        paddingLeft === paddingTop
      ) {
        return undefined;
      }

      if (paddingLeft === paddingRight) {
        const value = paddingLeft;
        return {
          value,
          exclude: ["paddingLeft", "paddingRight"],
        };
      }
      return undefined;
    },
    paddingY: ({ paddingLeft, paddingRight, paddingTop, paddingBottom }) => {
      if (paddingTop === undefined || paddingBottom === undefined) {
        return undefined;
      }

      if (
        paddingLeft === paddingRight &&
        paddingTop === paddingBottom &&
        paddingLeft === paddingTop
      ) {
        return undefined;
      }

      if (paddingTop === paddingBottom) {
        return {
          value: paddingTop,
          exclude: ["paddingTop", "paddingBottom"],
        };
      }
      return undefined;
    },
    padding: ({ paddingLeft, paddingRight, paddingTop, paddingBottom }) => {
      if (
        paddingLeft === undefined ||
        paddingRight === undefined ||
        paddingTop === undefined ||
        paddingBottom === undefined
      ) {
        return undefined;
      }

      if (
        paddingLeft === paddingRight &&
        paddingTop === paddingBottom &&
        paddingLeft === paddingTop
      ) {
        return {
          value: paddingLeft,
          exclude: ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"],
        };
      }
      return undefined;
    },
  };

  // Default values
  const layoutPropDefaults: SeedContainerLayoutProps = {
    flexDirection: "row",
    justifyContent: "flexStart",
    alignItems: "stretch",
    flexWrap: "nowrap",
    gap: 0,
    padding: 0,
    paddingX: 0,
    paddingY: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
  };

  const transform = definePropsTransformer((node: ContainerLayoutTrait) => {
    const result: SeedContainerLayoutProps = {};

    for (const [prop, handler] of objectEntries(layoutPropHandlers)) {
      const value = handler(node);
      if (value !== undefined && value !== layoutPropDefaults[prop]) {
        result[prop] = value;
      }
    }

    for (const [prop, handler] of objectEntries(layoutShorthandHandlers)) {
      const shorthandResult = handler(result);
      if (shorthandResult === undefined) {
        continue;
      }
      const { value, exclude } = shorthandResult;
      if (value !== undefined && value !== layoutPropDefaults[prop]) {
        result[prop] = value;
        for (const excludedProp of exclude) {
          delete result[excludedProp];
        }
      }
    }

    return result;
  });

  return { transform };
}
