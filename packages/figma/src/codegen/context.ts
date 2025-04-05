import { camelCasePreserveUnderscoreBetweenNumbers } from "@/utils/common";
import { camelCase } from "change-case";
import { FIGMA_ICONS } from "./data/icons";
import { FIGMA_TEXT_STYLES } from "./data/styles";
import { FIGMA_VARIABLE_COLLECTIONS } from "./data/variable-collections";
import { FIGMA_VARIABLES } from "./data/variables";
import {
  createCodegenService,
  createContainerLayoutPropsService,
  createFigmaComponentService,
  createFrameFillPropsService,
  createFrameStrokePropsService,
  createFrameTypeStylePropsService,
  createIconService,
  createRadiusPropsService,
  createSeedComponentTransformers,
  createSeedFrameService,
  createSeedInstanceService,
  createSeedRectangleService,
  createSeedTextService,
  createSelfLayoutPropsService,
  createShapeFillPropsService,
  createStaticIconRepository,
  createStaticStyleRepository,
  createStaticVariableRepository,
  createStyleService,
  createVariableService,
} from "./domain";

const IGNORED_COMPONENT_KEYS = new Set<string>([
  "1acdc7247c83a73a0504d6fad86d08783938cb1a",
  "b38b719b61cdf1a24458d7a7888bee74b7649084",
]);

export interface CodegenContextOptions {
  ignoredComponentKeys?: Set<string>;
  shouldInferVariableName: boolean;
  shouldPrintSource: boolean;
}

export function createCodegenContext(options: CodegenContextOptions) {
  const {
    ignoredComponentKeys = IGNORED_COMPONENT_KEYS,
    shouldInferVariableName,
    shouldPrintSource,
  } = options;

  const styleRepository = createStaticStyleRepository(FIGMA_TEXT_STYLES);
  const variableRepository = createStaticVariableRepository({
    variables: FIGMA_VARIABLES,
    variableCollections: FIGMA_VARIABLE_COLLECTIONS,
  });
  const iconRepository = createStaticIconRepository(FIGMA_ICONS);

  const styleService = createStyleService({
    styleRepository,
    styleNameTransformer: ({ slug }) =>
      camelCase(slug[slug.length - 1]!, { mergeAmbiguousCharacters: true }),
  });
  const variableService = createVariableService({
    variableRepository,
    variableNameTransformer: ({ slug }) =>
      slug
        .filter((s) => s !== "dimension")
        .map((s) => s.replaceAll(",", "_"))
        .map(camelCasePreserveUnderscoreBetweenNumbers)
        .join("."),
  });
  const iconService = createIconService({
    iconRepository,
  });

  const containerLayoutPropsService = createContainerLayoutPropsService({
    variableService,
    shouldInferVariableName,
  });
  const selfLayoutPropsService = createSelfLayoutPropsService({
    variableService,
    shouldInferVariableName,
  });
  const frameFillPropsService = createFrameFillPropsService({
    variableService,
  });
  const shapeFillPropsService = createShapeFillPropsService({
    variableService,
  });
  const radiusPropsService = createRadiusPropsService({
    variableService,
    shouldInferVariableName,
  });
  const strokePropsService = createFrameStrokePropsService({
    variableService,
  });
  const typeStylePropsService = createFrameTypeStylePropsService({
    variableService,
  });

  const figmaComponentService = createFigmaComponentService({
    transformers: createSeedComponentTransformers({
      iconService,
      variableService,
    }),
  });

  const frameService = createSeedFrameService({
    containerLayoutPropsService,
    selfLayoutPropsService,
    radiusPropsService,
    fillPropsService: frameFillPropsService,
    strokePropsService,
  });
  const instanceService = createSeedInstanceService({
    figmaComponentService,
    fillPropsService: shapeFillPropsService,
    selfLayoutPropsService,
    iconService,
    frameService,
    ignoredComponentKeys,
  });
  const textService = createSeedTextService({
    styleService,
    fillPropsService: shapeFillPropsService,
    typeStylePropsService,
  });
  const rectangleService = createSeedRectangleService({
    selfLayoutPropsService,
  });

  const codegenService = createCodegenService({
    frameService,
    textService,
    rectangleService,
    instanceService,
    shouldPrintSource,
  });

  return codegenService;
}

export const codegenService = createCodegenContext({
  shouldInferVariableName: true,
  shouldPrintSource: false,
});

export const devCodegenService = createCodegenContext({
  shouldInferVariableName: false,
  shouldPrintSource: true,
});
