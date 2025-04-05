import type { Variable, VariableCollection } from "./variable.interface";

export interface VariableRepository {
  getVariableList(): Variable[];
  getVariableCollectionList(): VariableCollection[];
  findVariableByKey(key: string): Variable | undefined;
  findVariableById(id: string): Variable | undefined;
  findVariableCollectionByKey(key: string): VariableCollection | undefined;
  findVariableCollectionById(id: string): VariableCollection | undefined;
}

export function createStaticVariableRepository({
  variables,
  variableCollections,
}: {
  variables: Record<string, Variable>;
  variableCollections: Record<string, VariableCollection>;
}): VariableRepository {
  const variablesKeyMap = new Map<string, Variable>();
  const variablesIdMap = new Map<string, Variable>();
  const variableCollectionsKeyMap = new Map<string, VariableCollection>();
  const variableCollectionsIdMap = new Map<string, VariableCollection>();
  const variablesList = Object.values(variables);
  const variableCollectionsList = Object.values(variableCollections);

  for (const variable of variablesList) {
    variablesKeyMap.set(variable.key, variable);
    variablesIdMap.set(variable.id, variable);
  }

  for (const variableCollection of variableCollectionsList) {
    variableCollectionsKeyMap.set(variableCollection.key, variableCollection);
    variableCollectionsIdMap.set(variableCollection.id, variableCollection);
  }

  return {
    getVariableList: () => variablesList,
    getVariableCollectionList: () => variableCollectionsList,
    findVariableByKey: (key: string) => variablesKeyMap.get(key),
    findVariableById: (id: string) => variablesIdMap.get(id),
    findVariableCollectionByKey: (key: string) => variableCollectionsKeyMap.get(key),
    findVariableCollectionById: (id: string) => variableCollectionsIdMap.get(id),
  };
}
