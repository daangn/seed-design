import {
  isIdenticalVariableValue,
  isInsideScope,
  isVariableAlias,
  sanitizeVariableId,
} from "@/utils/figma-variable";
import type { Variable, VariableScope, VariableValueResolved } from "./variable.interface";
import type { VariableRepository } from "./variable.repository";

export interface VariableService {
  getSlug: (id: string) => string[] | undefined;
  resolveValue: (variable: Variable, mode: string) => VariableValueResolved;
  infer: (value: VariableValueResolved, scope: VariableScope) => Variable | undefined;
}

export interface VariableServiceDeps {
  variableRepository: VariableRepository;
  inferCompareFunction: (a: Variable, b: Variable) => number;
}

export function createVariableService({
  variableRepository,
  inferCompareFunction,
}: VariableServiceDeps): VariableService {
  const variables = variableRepository.getVariableList();

  // private
  function getName(key: string) {
    const sanitizedId = sanitizeVariableId(key);
    const variable = variableRepository.findVariableByKey(sanitizedId);

    if (!variable) {
      return undefined;
    }

    return variable.name;
  }

  function getDefaultModeId(variable: Variable) {
    const variableCollection = variableRepository.findVariableCollectionById(
      variable.variableCollectionId,
    );

    if (!variableCollection) {
      // Variable collection not found: ${variable.variableCollectionId}, falling back to variable.valuesByMode key
      return Object.keys(variable.valuesByMode)[0]!;
    }

    return variableCollection.defaultModeId;
  }

  // public
  function getSlug(key: string): string[] | undefined {
    const name = getName(key);

    if (!name) {
      return undefined;
    }

    return name.split("/");
  }

  function resolveValue(variable: Variable, mode: string): VariableValueResolved {
    const value = variable.valuesByMode[mode];

    if (value === undefined) {
      throw new Error(`Variable value not found: ${variable.id} ${mode}`);
    }

    if (isVariableAlias(value)) {
      const resolvedVariable = variableRepository.findVariableById(value.id);

      if (!resolvedVariable) {
        throw new Error(`Variable not found: ${value.id}`);
      }

      return resolveValue(resolvedVariable, mode);
    }

    return value;
  }

  function infer(value: VariableValueResolved, scope: VariableScope) {
    // NOTE: We assume that the variable is in the default mode or value is equal between all modes for simplicity.
    const inferredVariables = variables.filter(
      (variable) =>
        isInsideScope(variable, scope) &&
        isIdenticalVariableValue(resolveValue(variable, getDefaultModeId(variable)), value),
    );

    const sortedVariables = inferredVariables.sort(inferCompareFunction);

    return sortedVariables[0];
  }

  return {
    getSlug,
    resolveValue,
    infer,
  };
}
