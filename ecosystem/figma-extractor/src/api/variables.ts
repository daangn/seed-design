import type { LocalVariable } from "@figma/rest-api-spec";
import { api } from "./client";

export type VariableMetadataItem = LocalVariable;

async function getVariablesInFile({ fileKey }: { fileKey: string }) {
  const {
    meta: { variables },
  } = await api.getLocalVariables({ file_key: fileKey });

  return variables;
}

export async function getVariableMetadataItemsInFile({
  fileKey,
}: { fileKey: string }): Promise<LocalVariable[]> {
  const variablesInFile = await getVariablesInFile({ fileKey });

  return Object.values(variablesInFile);
}
