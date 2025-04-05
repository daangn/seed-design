import { definePropsTransformer, type PropsTransformer } from "@/codegen/core";
import type { NormalizedHasGeometryTrait, NormalizedIsLayerTrait } from "@/normalizer";
import type { VariableService } from "../variable.service";

type FillTrait = NormalizedIsLayerTrait & NormalizedHasGeometryTrait;

export interface FillPropsService<T extends Record<string, any>> {
  transform: PropsTransformer<FillTrait, T>;
}

export interface FrameFillProps {
  background?: string;
}

export function createFrameFillPropsService({
  variableService,
}: { variableService: VariableService }): FillPropsService<FrameFillProps> {
  const transform = definePropsTransformer((node: FillTrait) => {
    const fills = node.fills;
    if (fills.length === 0) {
      return {};
    }

    const fill = fills[0];
    if (!fill || ("visible" in fill && !fill.visible) || fill.type !== "SOLID") {
      return {};
    }

    if (node.boundVariables?.fills?.length === 1) {
      return {
        background: variableService.getVariableName(node.boundVariables.fills[0]!.id),
      };
    }

    const color = fill.color;
    return {
      background: `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${fill.opacity})`,
    };
  });

  return { transform };
}

export interface ShapeFillProps {
  color?: string;
}

export function createShapeFillPropsService({
  variableService,
}: { variableService: VariableService }): FillPropsService<ShapeFillProps> {
  const transform = definePropsTransformer((node: FillTrait) => {
    const fills = node.fills;
    if (fills.length === 0) {
      return {};
    }

    const fill = fills[0];
    if (!fill || ("visible" in fill && !fill.visible) || fill.type !== "SOLID") {
      return {};
    }
    if (node.boundVariables?.fills?.length === 1) {
      return {
        color: variableService.getVariableName(node.boundVariables.fills[0]!.id),
      };
    }

    const color = fill.color;
    return {
      color: `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${fill.opacity})`,
    };
  });

  return { transform };
}
