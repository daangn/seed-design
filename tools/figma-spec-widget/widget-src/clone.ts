export function cloneVariable({
  id,
  name,
  description,
  valuesByMode,
  resolvedType,
  variableCollectionId,
  key,
  remote,
  scopes,
}: Variable) {
  return {
    id,
    name,
    description,
    valuesByMode,
    resolvedType,
    variableCollectionId,
    key,
    remote,
    scopes,
  };
}

export function cloneVariableCollection({
  id,
  name,
  variableIds,
  defaultModeId,
  key,
  modes,
  remote,
}: VariableCollection) {
  return {
    id,
    name,
    variableIds,
    defaultModeId,
    key,
    modes,
    remote,
  };
}
