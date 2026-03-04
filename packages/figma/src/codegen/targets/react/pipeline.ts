import { createCodeGenerator, createValueResolver } from "@/codegen/core";
import { iconService, styleService, variableService } from "@/codegen/default-services";
import { SKIP_COMPONENT_KEYS } from "@/codegen/skip-components";
import {
  type UnboundComponentHandler,
  bindComponentHandler,
  unboundSeedComponentHandlers,
} from "./component";
import { createFrameTransformer } from "./frame";
import { createIconHandler } from "./icon";
import { createInstanceTransformer } from "./instance";
import {
  createContainerLayoutPropsConverter,
  createFrameFillPropsConverter,
  createIconSelfLayoutPropsConverter,
  createRadiusPropsConverter,
  createSelfLayoutPropsConverter,
  createShadowPropsConverter,
  createShapeFillPropsConverter,
  createStrokePropsConverter,
  createTextFillPropsConverter,
  createTypeStylePropsConverter,
  createVectorChildrenFillPropsConverter,
} from "./props";
import {
  createBooleanOperationTransformer,
  createRectangleTransformer,
  createVectorTransformer,
} from "./shape";
import { createTextTransformer } from "./text";
import {
  defaultEffectStyleNameFormatter,
  defaultFillStyleResolver,
  defaultRawValueFormatters,
  defaultTextStyleNameFormatter,
  defaultVariableNameFormatter,
} from "./value-resolver";

export interface CreatePipelineConfig {
  shouldInferAutoLayout?: boolean;
  shouldInferVariableName?: boolean;
  extend?: {
    componentHandlers?: Array<UnboundComponentHandler<any>>;
  };
}

const iconHandler = createIconHandler({
  iconService,
});

export function createPipeline(options: CreatePipelineConfig = {}) {
  const { shouldInferAutoLayout = true, shouldInferVariableName = true, extend = {} } = options;

  const valueResolver = createValueResolver({
    variableService,
    variableNameFormatter: defaultVariableNameFormatter,
    styleService,
    textStyleNameFormatter: defaultTextStyleNameFormatter,
    effectStyleNameFormatter: defaultEffectStyleNameFormatter,
    fillStyleResolver: defaultFillStyleResolver,
    rawValueFormatters: defaultRawValueFormatters,
    shouldInferVariableName,
  });

  const containerLayoutPropsConverter = createContainerLayoutPropsConverter(valueResolver);
  const selfLayoutPropsConverter = createSelfLayoutPropsConverter(valueResolver);
  const iconSelfLayoutPropsConverter = createIconSelfLayoutPropsConverter(valueResolver);
  const frameFillPropsConverter = createFrameFillPropsConverter(valueResolver);
  const shapeFillPropsConverter = createShapeFillPropsConverter(valueResolver);
  const textFillPropsConverter = createTextFillPropsConverter(valueResolver);
  const vectorChildrenFillPropsConverter = createVectorChildrenFillPropsConverter(valueResolver);
  const radiusPropsConverter = createRadiusPropsConverter(valueResolver);
  const strokePropsConverter = createStrokePropsConverter(valueResolver);
  const shadowPropsConverter = createShadowPropsConverter(valueResolver);
  const typeStylePropsConverter = createTypeStylePropsConverter({
    valueResolver,
  });
  const propsConverters = {
    containerLayout: containerLayoutPropsConverter,
    selfLayout: selfLayoutPropsConverter,
    iconSelfLayout: iconSelfLayoutPropsConverter,
    frameFill: frameFillPropsConverter,
    shapeFill: shapeFillPropsConverter,
    textFill: textFillPropsConverter,
    vectorChildrenFill: vectorChildrenFillPropsConverter,
    radius: radiusPropsConverter,
    stroke: strokePropsConverter,
    shadow: shadowPropsConverter,
    typeStyle: typeStylePropsConverter,
  };

  const componentHandlers = Object.fromEntries(
    [...unboundSeedComponentHandlers, ...(extend.componentHandlers ?? [])]
      .map((h) =>
        bindComponentHandler(h, {
          valueResolver,
          iconHandler,
        }),
      )
      .map((t) => [t.key, t]),
  );

  const frameTransformer = createFrameTransformer({
    propsConverters,
  });
  const instanceTransformer = createInstanceTransformer({
    iconHandler,
    propsConverters,
    componentHandlers,
    frameTransformer,
  });
  const textTransformer = createTextTransformer({
    propsConverters,
  });
  const rectangleTransformer = createRectangleTransformer({
    propsConverters,
  });
  const vectorTransformer = createVectorTransformer();
  const booleanOperationTransformer = createBooleanOperationTransformer();

  const codeGenerator = createCodeGenerator({
    frameTransformer,
    textTransformer,
    rectangleTransformer,
    instanceTransformer,
    vectorTransformer,
    booleanOperationTransformer,
    shouldInferAutoLayout,
    skipComponentKeys: SKIP_COMPONENT_KEYS,
  });

  return codeGenerator;
}
