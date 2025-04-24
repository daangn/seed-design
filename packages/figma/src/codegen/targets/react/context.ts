import {
  createCodegenTransformer,
  createValueTransformer,
  type ComponentTransformer,
} from "@/codegen/core";
import {
  createIconService,
  createStyleService,
  createVariableService,
  iconRepository,
  styleRepository,
  variableRepository,
} from "@/entities";
import { camelCasePreserveUnderscoreBetweenNumbers } from "@/utils/common";
import { toCssPixel, toCssRgba } from "@/utils/css";
import { camelCase } from "change-case";
import { createSeedComponentTransformers } from "./component";
import { createFrameTransformer } from "./frame";
import { createInstanceTransformer } from "./instance";
import {
  createContainerLayoutPropsTransformer,
  createFrameFillPropsTransformer,
  createIconSelfLayoutPropsTransformer,
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

const IGNORED_COMPONENT_KEYS = new Set<string>([
  "1acdc7247c83a73a0504d6fad86d08783938cb1a",
  "b38b719b61cdf1a24458d7a7888bee74b7649084",
]);

export interface CreateContextOptions {
  ignoredComponentKeys?: Set<string>;
  shouldInferVariableName: boolean;
  shouldInferAutoLayout: boolean;
  extend?: {
    componentTransformers?: ComponentTransformer[];
  };
}

export const styleService = createStyleService({
  styleRepository,
  styleNameTransformer: ({ slug }) =>
    camelCase(slug[slug.length - 1]!, { mergeAmbiguousCharacters: true }),
});
export const variableService = createVariableService({
  variableRepository,
  variableNameTransformer: ({ slug }) =>
    slug
      .filter(
        (s) =>
          !(
            s === "dimension" ||
            s === "radius" ||
            s === "font-size" ||
            s === "font-weight" ||
            s === "line-height"
          ),
      )
      .map((s) => s.replaceAll(",", "_"))
      .map(camelCasePreserveUnderscoreBetweenNumbers)
      .join("."),
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
export const iconService = createIconService({
  iconRepository,
});

// TODO: implement figma component service
const seedComponentTransformers = createSeedComponentTransformers({
  iconService,
  variableService,
});

export function createContext(options: CreateContextOptions) {
  const {
    ignoredComponentKeys = IGNORED_COMPONENT_KEYS,
    extend = {},
    shouldInferVariableName,
    shouldInferAutoLayout,
  } = options;

  const valueTransformer = createValueTransformer({
    variableService,
    formatters: {
      color: (value: RGBA) => toCssRgba(value),
      dimension: (value: number) => toCssPixel(value),
      fontDimension: (value: number) => toCssPixel(value),
      fontWeight: (value: number) => value,
    },
    shouldInferVariableName,
  });

  const containerLayoutPropsTransformer = createContainerLayoutPropsTransformer(valueTransformer);
  const selfLayoutPropsTransformer = createSelfLayoutPropsTransformer(valueTransformer);
  const iconSelfLayoutPropsTransformer = createIconSelfLayoutPropsTransformer(valueTransformer);
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
    iconSelfLayout: iconSelfLayoutPropsTransformer,
    frameFill: frameFillPropsTransformer,
    shapeFill: shapeFillPropsTransformer,
    textFill: textFillPropsTransformer,
    radius: radiusPropsTransformer,
    stroke: strokePropsTransformer,
    typeStyle: typeStylePropsTransformer,
  };

  const componentTransformers = Object.fromEntries(
    [...seedComponentTransformers, ...(extend.componentTransformers ?? [])].map((t) => [t.key, t]),
  );

  const frameTransformer = createFrameTransformer({
    propsTransformers,
  });
  const instanceTransformer = createInstanceTransformer({
    iconService,
    ignoredComponentKeys,
    propsTransformers,
    componentTransformers,
    frameTransformer,
  });
  const textTransformer = createTextTransformer({
    propsTransformers,
  });
  const rectangleTransformer = createRectangleTransformer({
    propsTransformers,
  });
  const vectorTransformer = createVectorTransformer();
  const booleanOperationTransformer = createBooleanOperationTransformer();

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
