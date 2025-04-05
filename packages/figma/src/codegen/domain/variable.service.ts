import { isVariableAlias, sanitizeVariableId } from "@/utils/figma-variable";
import type { Variable, VariableScope, VariableValueResolved } from "./variable.interface";
import type { VariableRepository } from "./variable.repository";

export interface VariableService {
  getVariableName: (id: string) => string;
  inferVariableName: (scope: VariableScope, value: number | string | boolean) => string | undefined;
}

export interface VariableServiceDeps {
  variableRepository: VariableRepository;
  variableNameTransformer: ({ slug }: { slug: string[] }) => string;
}

export function createSeedVariableService({
  variableRepository,
  variableNameTransformer,
}: VariableServiceDeps): VariableService {
  const variables = variableRepository.getVariableList();

  // private
  function getFigmaVariableName(key: string) {
    const sanitizedId = sanitizeVariableId(key);
    const variable = variableRepository.findVariableByKey(sanitizedId);

    if (!variable) {
      return "UNKNOWN_VARIABLE";
    }

    return variable.name;
  }

  function getFigmaVariableSlug(key: string): string[] {
    const name = getFigmaVariableName(key);
    return name.split("/");
  }

  function getDefaultModeId(variable: Variable) {
    const variableCollection = variableRepository.findVariableCollectionById(
      variable.variableCollectionId,
    );

    if (!variableCollection) {
      console.log(
        `Variable collection not found: ${variable.variableCollectionId}, falling back to variable.valuesByMode key`,
      );
      return Object.keys(variable.valuesByMode)[0]!;
    }

    return variableCollection.defaultModeId;
  }

  function resolveVariableValue(id: string, mode: string): VariableValueResolved {
    const variable = variableRepository.findVariableById(id);
    if (!variable) {
      throw new Error(`Variable not found: ${id}`);
    }

    const value = variable.valuesByMode[mode];

    if (value === undefined) {
      throw new Error(`Variable value not found: ${id} ${mode}`);
    }

    if (isVariableAlias(value)) {
      return resolveVariableValue(value.id, mode);
    }

    return value;
  }

  // public
  function getVariableName(key: string) {
    const slug = getFigmaVariableSlug(key);
    return variableNameTransformer({ slug });
  }

  function inferVariableName(scope: VariableScope, value: number | string | boolean) {
    // NOTE: We assume that the variable is in the default mode or value is equal between all modes for simplicity.
    const inferredVariable = variables.find(
      (variable) =>
        variable.scopes.includes(scope) &&
        resolveVariableValue(variable.id, getDefaultModeId(variable)) === value,
    );

    if (!inferredVariable) {
      return undefined;
    }

    return getVariableName(inferredVariable.key);
  }

  return {
    getVariableName,
    inferVariableName,
  };
}
