import { createCodeGenerator, createValueResolver } from "@/codegen/core";
import type { CodeGenerator } from "@/codegen/core/codegen";
import { styleService, variableService } from "@/codegen/default-services";
import { componentRepository } from "@/entities";
import { createFrameTransformer } from "./frame";
import { createInstanceTransformer } from "./instance";
import {
  createContainerLayoutPropsConverter,
  createFrameFillPropsConverter,
  createRadiusPropsConverter,
  createSelfLayoutPropsConverter,
  createShapeFillPropsConverter,
  createStrokePropsConverter,
  createTextFillPropsConverter,
  createTypeStylePropsConverter,
} from "./props";
import {
  createBooleanOperationTransformer,
  createRectangleTransformer,
  createVectorTransformer,
} from "./shape";
import { createTextTransformer } from "./text";
import {
  defaultRawValueFormatters,
  defaultStyleNameFormatter,
  defaultVariableNameFormatter,
} from "./value-resolver";

export interface CreatePipelineConfig {
  shouldInferAutoLayout?: boolean;
  shouldInferVariableName?: boolean;
}

export function createPipeline(options: CreatePipelineConfig = {}): CodeGenerator {
  const { shouldInferAutoLayout = true, shouldInferVariableName = true } = options;

  const valueResolver = createValueResolver({
    variableService,
    variableNameFormatter: defaultVariableNameFormatter,
    styleService,
    styleNameFormatter: defaultStyleNameFormatter,
    rawValueFormatters: defaultRawValueFormatters,
    shouldInferVariableName,
  });

  const containerLayoutPropsConverter = createContainerLayoutPropsConverter(valueResolver);
  const selfLayoutPropsConverter = createSelfLayoutPropsConverter(valueResolver);
  const frameFillPropsConverter = createFrameFillPropsConverter(valueResolver);
  const shapeFillPropsConverter = createShapeFillPropsConverter(valueResolver);
  const textFillPropsConverter = createTextFillPropsConverter(valueResolver);
  const radiusPropsConverter = createRadiusPropsConverter(valueResolver);
  const strokePropsConverter = createStrokePropsConverter(valueResolver);
  const typeStylePropsConverter = createTypeStylePropsConverter(valueResolver);

  const propsConverters = {
    containerLayout: containerLayoutPropsConverter,
    selfLayout: selfLayoutPropsConverter,
    frameFill: frameFillPropsConverter,
    shapeFill: shapeFillPropsConverter,
    textFill: textFillPropsConverter,
    radius: radiusPropsConverter,
    stroke: strokePropsConverter,
    typeStyle: typeStylePropsConverter,
  };

  const frameTransformer = createFrameTransformer({
    propsConverters,
  });
  const instanceTransformer = createInstanceTransformer({
    frameTransformer,
    componentRepository,
  });
  const textTransformer = createTextTransformer({
    propsConverters,
  });
  const rectangleTransformer = createRectangleTransformer({
    propsConverters,
  });
  const vectorTransformer = createVectorTransformer({
    propsConverters,
  });
  const booleanOperationTransformer = createBooleanOperationTransformer({
    propsConverters,
  });

  const codegenTransformer = createCodeGenerator({
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
