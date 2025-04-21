import { createCodegenTransformer, createValueTransformer } from "@/codegen/core";
import {
  createStyleService,
  createVariableService,
  styleRepository,
  variableRepository,
} from "@/entities";
import { toCssRgba } from "@/utils/css";
import { createFrameTransformer } from "./frame";
import { createInstanceTransformer } from "./instance";
import {
  createContainerLayoutPropsTransformer,
  createFrameFillPropsTransformer,
  createRadiusPropsTransformer,
  createSelfLayoutPropsTransformer,
  createShapeFillPropsTransformer,
  createStrokePropsTransformer,
  createTextFillPropsTransformer,
  createTypeStylePropsTransformer,
} from "./props";
import {
  createBooleanOperationTransformer,
  createRectangleTransformer,
  createVectorTransformer,
} from "./shape";
import { createTextTransformer } from "./text";

export interface CreateContextOptions {
  ignoredComponentKeys?: Set<string>;
  shouldInferVariableName: boolean;
  shouldInferAutoLayout: boolean;
}

const styleService = createStyleService({
  styleRepository,
  styleNameTransformer: ({ slug }) => slug[slug.length - 1]!,
});
const variableService = createVariableService({
  variableRepository,
  variableNameTransformer: ({ slug }) =>
    slug
      .filter((s) => s !== "dimension")
      .map((s) => s.replaceAll(",", "_"))
      .join("/"),
  inferCompareFunction: (name1: string, name2: string) => {
    const scoreFn = (name: string) => {
      let score = 0;
      if (name.includes("bg")) {
        score += 100;
      }
      if (name.includes("fg")) {
        score += 100;
      }
      if (name.includes("stroke")) {
        score += 100;
      }
      if (name.includes("spacing-x")) {
        score -= 100;
      }
      if (name.includes("spacing-y")) {
        score -= 100;
      }
      if (name.endsWith("pressed")) {
        score -= 100;
      }
      return score;
    };

    return scoreFn(name2) - scoreFn(name1);
  },
});

export function createContext(options: CreateContextOptions) {
  const { shouldInferVariableName, shouldInferAutoLayout } = options;

  const valueTransformer = createValueTransformer({
    variableService,
    formatters: {
      color: (value: RGBA) => toCssRgba(value),
      dimension: (value: number) => value,
      fontDimension: (value: number) => value,
      fontWeight: (value: number) => value,
    },
    shouldInferVariableName,
  });

  const containerLayoutPropsTransformer = createContainerLayoutPropsTransformer(valueTransformer);
  const selfLayoutPropsTransformer = createSelfLayoutPropsTransformer(valueTransformer);
  const frameFillPropsTransformer = createFrameFillPropsTransformer(valueTransformer);
  const shapeFillPropsTransformer = createShapeFillPropsTransformer(valueTransformer);
  const textFillPropsTransformer = createTextFillPropsTransformer(valueTransformer);
  const radiusPropsTransformer = createRadiusPropsTransformer(valueTransformer);
  const strokePropsTransformer = createStrokePropsTransformer(valueTransformer);
  const typeStylePropsTransformer = createTypeStylePropsTransformer({
    valueTransformer,
    styleService,
  });
  const propsTransformers = {
    containerLayout: containerLayoutPropsTransformer,
    selfLayout: selfLayoutPropsTransformer,
    frameFill: frameFillPropsTransformer,
    shapeFill: shapeFillPropsTransformer,
    textFill: textFillPropsTransformer,
    radius: radiusPropsTransformer,
    stroke: strokePropsTransformer,
    typeStyle: typeStylePropsTransformer,
  };

  const frameTransformer = createFrameTransformer({
    propsTransformers,
  });
  const instanceTransformer = createInstanceTransformer({
    frameTransformer,
  });
  const textTransformer = createTextTransformer({
    propsTransformers,
  });
  const rectangleTransformer = createRectangleTransformer({
    propsTransformers,
  });
  const vectorTransformer = createVectorTransformer({
    propsTransformers,
  });
  const booleanOperationTransformer = createBooleanOperationTransformer({
    propsTransformers,
  });

  const codegenTransformer = createCodegenTransformer({
    frameTransformer,
    textTransformer,
    rectangleTransformer,
    instanceTransformer,
    vectorTransformer,
    booleanOperationTransformer,
    shouldInferAutoLayout,
  });

  return codegenTransformer;
}
