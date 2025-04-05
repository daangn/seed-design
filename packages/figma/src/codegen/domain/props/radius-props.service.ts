import { definePropsTransformer, type PropsTransformer } from "@/codegen/core";
import type { NormalizedCornerTrait, NormalizedIsLayerTrait } from "@/normalizer";
import { objectEntries } from "@/utils/common";
import type { VariableService } from "../variable.service";

type RadiusTrait = NormalizedCornerTrait & NormalizedIsLayerTrait;

export interface RadiusPropsService<T extends Record<string, any>> {
  transform: PropsTransformer<RadiusTrait, T>;
}

type RadiusPropsKey =
  | "borderRadius"
  | "borderTopLeftRadius"
  | "borderTopRightRadius"
  | "borderBottomLeftRadius"
  | "borderBottomRightRadius";

type ApperancePropHandler = (props: RadiusTrait) => string | number | boolean | undefined;

export type SeedRadiusProps = Partial<Record<RadiusPropsKey, string | number | boolean>>;

export function createRadiusPropsService({
  variableService,
}: { variableService: VariableService }): RadiusPropsService<SeedRadiusProps> {
  const getLayoutVariableName = (id: string) => variableService.getVariableName(id);
  const inferRadiusVariableName = (value: number) =>
    variableService.inferVariableName("CORNER_RADIUS", value);

  const radiusPropHandlers: Record<RadiusPropsKey, ApperancePropHandler> = {
    borderRadius: ({ cornerRadius, boundVariables }) => {
      // If all corner radii are the same, use the first one
      if (
        cornerRadius &&
        boundVariables?.bottomLeftRadius === boundVariables?.bottomRightRadius &&
        boundVariables?.bottomLeftRadius === boundVariables?.topLeftRadius &&
        boundVariables?.bottomLeftRadius === boundVariables?.topRightRadius
      ) {
        return boundVariables?.bottomLeftRadius
          ? getLayoutVariableName(boundVariables.bottomLeftRadius.id)
          : inferRadiusVariableName(cornerRadius ?? 0);
      }

      // TODO: handle individual corner radii
      return undefined;
    },
    borderTopLeftRadius: ({ rectangleCornerRadii, boundVariables }) =>
      boundVariables?.topLeftRadius
        ? getLayoutVariableName(boundVariables.topLeftRadius.id)
        : inferRadiusVariableName(rectangleCornerRadii?.[0] ?? 0),
    borderTopRightRadius: ({ rectangleCornerRadii, boundVariables }) =>
      boundVariables?.topRightRadius
        ? getLayoutVariableName(boundVariables.topRightRadius.id)
        : inferRadiusVariableName(rectangleCornerRadii?.[1] ?? 0),
    borderBottomLeftRadius: ({ rectangleCornerRadii, boundVariables }) =>
      boundVariables?.bottomLeftRadius
        ? getLayoutVariableName(boundVariables.bottomLeftRadius.id)
        : inferRadiusVariableName(rectangleCornerRadii?.[2] ?? 0),
    borderBottomRightRadius: ({ rectangleCornerRadii, boundVariables }) =>
      boundVariables?.bottomRightRadius
        ? getLayoutVariableName(boundVariables.bottomRightRadius.id)
        : inferRadiusVariableName(rectangleCornerRadii?.[3] ?? 0),
  };

  // Default values
  const radiusPropDefaults: SeedRadiusProps = {
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  };

  const transform = definePropsTransformer((node: RadiusTrait) => {
    const result: SeedRadiusProps = {};

    for (const [prop, handler] of objectEntries(radiusPropHandlers)) {
      const value = handler(node);
      if (value !== undefined && value !== radiusPropDefaults[prop]) {
        result[prop] = value;
      }
    }

    return result;
  });

  return { transform };
}
