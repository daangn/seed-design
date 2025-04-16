import { createStaticIconRepository } from "./icon.repository";
import { FIGMA_ICONS } from "./data/icons";
import { FIGMA_TEXT_STYLES } from "./data/styles";
import { FIGMA_VARIABLE_COLLECTIONS } from "./data/variable-collections";
import { FIGMA_VARIABLES } from "./data/variables";
import { createStaticStyleRepository } from "./style.repository";
import { createStaticVariableRepository } from "./variable.repository";

export * from "./icon.interface";
export * from "./icon.repository";
export * from "./icon.service";
export * from "./style.interface";
export * from "./style.repository";
export * from "./style.service";
export * from "./variable.interface";
export * from "./variable.repository";
export * from "./variable.service";

export const styleRepository = createStaticStyleRepository(FIGMA_TEXT_STYLES);
export const variableRepository = createStaticVariableRepository({
  variables: FIGMA_VARIABLES,
  variableCollections: FIGMA_VARIABLE_COLLECTIONS,
});
export const iconRepository = createStaticIconRepository(FIGMA_ICONS);

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
