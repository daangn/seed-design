import { createStaticIconRepository } from "./icon.repository";
import { createStaticStyleRepository } from "./style.repository";
import { createStaticVariableRepository } from "./variable.repository";
import { createStaticComponentRepository } from "./component.repository";
import { FIGMA_ICONS } from "./data/__generated__/icons";

// Archive
import { FIGMA_STYLES as FIGMA_STYLES_ARCHIVE } from "./data/__generated__/archive/styles";
import { FIGMA_VARIABLE_COLLECTIONS as FIGMA_VARIABLE_COLLECTIONS_ARCHIVE } from "./data/__generated__/archive/variable-collections";
import { FIGMA_VARIABLES as FIGMA_VARIABLES_ARCHIVE } from "./data/__generated__/archive/variables";
import * as FIGMA_COMPONENTS_ARCHIVE from "./data/__generated__/archive/component-sets";

// Current
import { FIGMA_STYLES } from "./data/__generated__/styles";
import { FIGMA_VARIABLE_COLLECTIONS } from "./data/__generated__/variable-collections";
import { FIGMA_VARIABLES } from "./data/__generated__/variables";
import * as FIGMA_COMPONENTS from "./data/__generated__/component-sets";

export * from "./icon.interface";
export * from "./icon.repository";
export * from "./icon.service";
export * from "./style.interface";
export * from "./style.repository";
export * from "./style.service";
export * from "./variable.interface";
export * from "./variable.repository";
export * from "./variable.service";
export * from "./component.interface";
export * from "./component.repository";

export const styleRepository = createStaticStyleRepository([
  ...FIGMA_STYLES_ARCHIVE,
  ...FIGMA_STYLES,
]);
export const variableRepository = createStaticVariableRepository({
  variables: { ...FIGMA_VARIABLES_ARCHIVE, ...FIGMA_VARIABLES },
  variableCollections: { ...FIGMA_VARIABLE_COLLECTIONS_ARCHIVE, ...FIGMA_VARIABLE_COLLECTIONS },
});
export const iconRepository = createStaticIconRepository(FIGMA_ICONS);
export const componentRepository = createStaticComponentRepository({
  ...FIGMA_COMPONENTS_ARCHIVE,
  ...FIGMA_COMPONENTS,
});

export function getFigmaVariableKey(name: string) {
  return variableRepository.findVariableByName(name)?.key;
}

export function getFigmaStyleKey(name: string) {
  return styleRepository.findOneByName(name)?.key;
}

export function getFigmaColorVariableNames(scopes: Array<"fg" | "bg" | "stroke" | "palette">) {
  const variables = variableRepository.getVariableList();
  return variables
    .filter((variable) =>
      scopes.includes(variable.name.split("/")[0] as "fg" | "bg" | "stroke" | "palette"),
    )
    .map((variable) => variable.name);
}
