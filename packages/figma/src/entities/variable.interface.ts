import type {
  LocalVariable,
  LocalVariableCollection,
  VariableAlias,
  VariableResolvedDataType,
} from "@figma/rest-api-spec";

export type Variable = LocalVariable;

export type VariableCollection = LocalVariableCollection;

export type VariableType = VariableResolvedDataType;

export type VariableValue = Variable["valuesByMode"][string];

export type VariableValueResolved = Exclude<VariableValue, VariableAlias>;

export type { VariableScope } from "@figma/rest-api-spec";
