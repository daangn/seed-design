import { createCodeGenerator, type ComponentHandler } from "@/codegen/core";
import { iconService } from "@/codegen/default-services";
import { createSeedComponentHandlers } from "./component";
import { createFrameTransformer } from "./frame";
import { createIconHandler } from "./icon";
import { createInstanceTransformer } from "./instance";
import {
  createContainerLayoutPropsConverter,
  createFrameFillPropsConverter,
  createIconSelfLayoutPropsConverter,
  createRadiusPropsConverter,
  createSelfLayoutPropsConverter,
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
import { valueResolver } from "./value-resolver";

export interface CreatePipelineConfig {
  extend?: {
    componentHandlers?: ComponentHandler[];
  };
}

const iconHandler = createIconHandler({
  iconService,
});

const seedComponentHandlers = createSeedComponentHandlers({
  iconHandler,
  valueResolver,
});

export function createPipeline(options: CreatePipelineConfig = {}) {
  const { extend = {} } = options;

  const containerLayoutPropsConverter = createContainerLayoutPropsConverter(valueResolver);
  const selfLayoutPropsConverter = createSelfLayoutPropsConverter(valueResolver);
  const iconSelfLayoutPropsConverter = createIconSelfLayoutPropsConverter(valueResolver);
  const frameFillPropsConverter = createFrameFillPropsConverter(valueResolver);
  const shapeFillPropsConverter = createShapeFillPropsConverter(valueResolver);
  const textFillPropsConverter = createTextFillPropsConverter(valueResolver);
  const vectorChildrenFillPropsConverter = createVectorChildrenFillPropsConverter(valueResolver);
  const radiusPropsConverter = createRadiusPropsConverter(valueResolver);
  const strokePropsConverter = createStrokePropsConverter(valueResolver);
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
    typeStyle: typeStylePropsConverter,
  };

  const componentHandlers = Object.fromEntries(
    [...seedComponentHandlers, ...(extend.componentHandlers ?? [])].map((t) => [t.key, t]),
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

  const codegenTransformer = createCodeGenerator({
    frameTransformer,
    textTransformer,
    rectangleTransformer,
    instanceTransformer,
    vectorTransformer,
    booleanOperationTransformer,
  });

  return codegenTransformer;
}
