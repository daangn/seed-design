import path from "node:path";
import { getVariableMetadataItemsInFile, type VariableMetadataItem } from "../api/variables";
import { defaultFilter, defaultTransform, type Filter, type Transform } from "../cli/config";
import { createJson, writeFile } from "../cli/write";

export type GenerateVariablesMetadataOptions = {
  filter?: Filter<VariableMetadataItem>;
  transform?: Transform<VariableMetadataItem>;
};

export async function generateVariableMetadata({
  fileKey,
  dir,
  options: { filter = defaultFilter, transform = defaultTransform } = {},
}: {
  fileKey: string;
  dir: string;
  options?: GenerateVariablesMetadataOptions;
}) {
  console.log("variable 메타데이터 생성 중");

  const variablesMetadata = (await getVariableMetadataItemsInFile({ fileKey }))
    .filter(filter)
    .map(transform)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (variablesMetadata.length === 0) {
    console.error("추출할 variable 메타데이터가 없습니다.");

    return;
  }

  const jsonPath = path.join(dir, "variables.json");

  await writeFile(jsonPath, createJson(variablesMetadata));

  console.log(`variable 메타데이터 ${variablesMetadata.length}개 생성 완료`);
}
