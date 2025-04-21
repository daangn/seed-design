import type { Variable, VariableCollection } from "./variable.interface";

export interface VariableRepository {
  getVariableList(): Variable[];
  getVariableCollectionList(): VariableCollection[];
  findVariableByKey(key: string): Variable | undefined;
  findVariableById(id: string): Variable | undefined;
  findVariableByName(name: string): Variable | undefined;
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
  const variablesNameMap = new Map<string, Variable>();
  const variableCollectionsKeyMap = new Map<string, VariableCollection>();
  const variableCollectionsIdMap = new Map<string, VariableCollection>();

  for (const variable of Object.values(variables)) {
    if (variable.remote) {
      continue;
    }

    variablesKeyMap.set(variable.key, variable);
    variablesIdMap.set(variable.id, variable);
    variablesNameMap.set(variable.name, variable);
  }

  for (const variableCollection of Object.values(variableCollections)) {
    if (variableCollection.remote) {
      continue;
    }

    variableCollectionsKeyMap.set(variableCollection.key, variableCollection);
    variableCollectionsIdMap.set(variableCollection.id, variableCollection);
  }

  const variablesList = [...variablesKeyMap.values()];
  const variableCollectionsList = [...variableCollectionsKeyMap.values()];

  return {
    getVariableList: () => variablesList,
    getVariableCollectionList: () => variableCollectionsList,
    findVariableByName: (name: string) => variablesNameMap.get(name),
    findVariableByKey: (key: string) => variablesKeyMap.get(key),
    findVariableById: (id: string) => variablesIdMap.get(id),
    findVariableCollectionByKey: (key: string) => variableCollectionsKeyMap.get(key),
    findVariableCollectionById: (id: string) => variableCollectionsIdMap.get(id),
  };
}
