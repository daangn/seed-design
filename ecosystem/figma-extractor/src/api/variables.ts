import type { Api as figma } from "figma-api";
import type { LocalVariable } from "@figma/rest-api-spec";

export type VariableMetadataItem = LocalVariable;

async function getVariablesInFile({ api, fileKey }: { api: figma; fileKey: string }) {
  const {
    meta: { variables },
  } = await api.getLocalVariables({ file_key: fileKey });

  return variables;
}

export async function getVariableMetadataItemsInFile({
  api,
  fileKey,
}: {
  api: figma;
  fileKey: string;
}): Promise<LocalVariable[]> {
  const variablesInFile = await getVariablesInFile({ api, fileKey });

  return Object.values(variablesInFile);
}
