import { definePropsTransformer, type PropsTransformer } from "@/codegen/core";
import type { NormalizedTextNode } from "@/normalizer";
import type { VariableService } from "../variable.service";

export interface TypeStylePropsService {
  transform: PropsTransformer<NormalizedTextNode>;
}

export function createFrameTypeStylePropsService({
  variableService,
}: { variableService: VariableService }) {
  const transform = definePropsTransformer((node: NormalizedTextNode) => {
    const fontSizeBoundVariables = node.boundVariables?.fontSize?.[0];
    const fontStyleBoundVariables = node.boundVariables?.fontStyle?.[0];
    const lineHeightBoundVariables = node.boundVariables?.lineHeight?.[0];

    return {
      fontSize: fontSizeBoundVariables
        ? variableService.getVariableName(fontSizeBoundVariables.id)
        : undefined,
      fontWeight: fontStyleBoundVariables
        ? variableService.getVariableName(fontStyleBoundVariables.id)
        : undefined,
      lineHeight: lineHeightBoundVariables
        ? variableService.getVariableName(lineHeightBoundVariables.id)
        : undefined,
    };
  });

  return { transform } satisfies TypeStylePropsService;
}
