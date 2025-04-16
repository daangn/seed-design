import { isVariableAlias, sanitizeVariableId } from "@/utils/figma-variable";
import type { Variable, VariableScope, VariableValueResolved } from "./variable.interface";
import type { VariableRepository } from "./variable.repository";

export interface VariableService {
  getVariableName: (id: string) => string;
  inferVariableName: (value: VariableValueResolved, scope: VariableScope) => string | undefined;
}

export interface VariableServiceDeps {
  variableRepository: VariableRepository;
  variableNameTransformer: ({ slug }: { slug: string[] }) => string;
  inferCompareFunction: (name1: string, name2: string) => number;
}

export function createVariableService({
  variableRepository,
  variableNameTransformer,
  inferCompareFunction,
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
      // Variable collection not found: ${variable.variableCollectionId}, falling back to variable.valuesByMode key
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

  function isIdenticalVariableValue(value1: VariableValueResolved, value2: VariableValueResolved) {
    if (typeof value1 !== typeof value2) {
      return false;
    }

    if (typeof value1 === "string" || typeof value1 === "number" || typeof value1 === "boolean") {
      return value1 === value2;
    }

    return (
      value1.r === (value2 as RGBA).r &&
      value1.g === (value2 as RGBA).g &&
      value1.b === (value2 as RGBA).b &&
      value1.a === (value2 as RGBA).a
    );
  }

  function isInsideScope(variable: Variable, scope: VariableScope) {
    if (variable.scopes.includes("ALL_SCOPES")) {
      return true;
    }

    if (variable.scopes.includes("ALL_FILLS")) {
      if (scope === "FRAME_FILL" || scope === "SHAPE_FILL" || scope === "TEXT_FILL") {
        return true;
      }
    }

    return variable.scopes.includes(scope);
  }

  // public
  function getVariableName(key: string) {
    const slug = getFigmaVariableSlug(key);
    return variableNameTransformer({ slug });
  }

  function inferVariableName(value: VariableValueResolved, scope: VariableScope) {
    // NOTE: We assume that the variable is in the default mode or value is equal between all modes for simplicity.
    const inferredVariables = variables.filter(
      (variable) =>
        isInsideScope(variable, scope) &&
        isIdenticalVariableValue(
          resolveVariableValue(variable.id, getDefaultModeId(variable)),
          value,
        ),
    );

    const inferredVariableNames = inferredVariables.map((variable) =>
      getVariableName(variable.key),
    );

    const sortedVariableNames = inferredVariableNames.sort(inferCompareFunction);

    return sortedVariableNames[0];
  }

  return {
    getVariableName,
    inferVariableName,
  };
}
