import { definePropsTransformer, type PropsTransformer } from "@/codegen/core";
import type { NormalizedHasGeometryTrait, NormalizedIsLayerTrait } from "@/normalizer";
import type { VariableService } from "../variable.service";

type StrokeTrait = NormalizedIsLayerTrait & NormalizedHasGeometryTrait;

export interface StrokePropsService<T extends Record<string, any>> {
  transform: PropsTransformer<StrokeTrait, T>;
}

export interface SeedFrameStrokeProps {
  borderWidth?: number;
  borderColor?: string;
}

export function createFrameStrokePropsService({
  variableService,
}: { variableService: VariableService }): StrokePropsService<SeedFrameStrokeProps> {
  const transform = definePropsTransformer((node: StrokeTrait) => {
    const strokes = node.strokes;
    if (strokes === undefined || strokes.length === 0) {
      return {};
    }

    const stroke = strokes[0];
    if (!stroke || ("visible" in stroke && !stroke.visible) || stroke.type !== "SOLID") {
      return {};
    }

    if (node.boundVariables?.strokes?.length === 1) {
      return {
        borderWidth: node.strokeWeight as number,
        borderColor: variableService.getVariableName(node.boundVariables.strokes[0]!.id),
      };
    }

    const color = stroke.color;
    return {
      borderWidth: node.strokeWeight as number,
      borderColor: `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${stroke.opacity})`,
    };
  });

  return { transform };
}
