import path from "node:path";
import { getComponentMetadataItemsInFile, type ComponentMetadataItem } from "../api/nodes";
import { createContent, createIndex, getFileName, writeFile } from "../cli/write";
import { POSSIBLE_DATA_TYPES } from "../constants";
import { defaultFilter, defaultTransform, type Filter, type Transform } from "../cli/config";

export type GenerateComponentMetadataOptions = {
  filter?: Filter<ComponentMetadataItem>;
  transform?: Transform<ComponentMetadataItem>;
};

export async function generateComponentMetadata({
  fileKey,
  dir,
  options: { filter = defaultFilter, transform = defaultTransform } = {},
}: { fileKey: string; dir: string; options?: GenerateComponentMetadataOptions }) {
  console.log("component 메타데이터 생성 중");

  const componentsMetadata = (await getComponentMetadataItemsInFile({ fileKey }))
    .filter(filter)
    .map(transform)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (componentsMetadata.length === 0) {
    console.error("추출할 component 메타데이터가 없습니다.");

    return;
  }

  for await (const data of componentsMetadata) {
    const { mjs, dts } = createContent(data);

    const mjsPath = path.join(dir, POSSIBLE_DATA_TYPES.COMPONENTS, `${getFileName(data.name)}.mjs`);
    const dtsPath = path.join(
      dir,
      POSSIBLE_DATA_TYPES.COMPONENTS,
      `${getFileName(data.name)}.d.ts`,
    );

    await writeFile(mjsPath, mjs);
    await writeFile(dtsPath, dts);
  }

  const { mjs, dts } = createIndex(componentsMetadata);

  const mjsPath = path.join(dir, POSSIBLE_DATA_TYPES.COMPONENTS, "index.mjs");
  const dtsPath = path.join(dir, POSSIBLE_DATA_TYPES.COMPONENTS, "index.d.ts");

  await writeFile(mjsPath, mjs);
  await writeFile(dtsPath, dts);

  console.log(`component 메타데이터 ${componentsMetadata.length}개 생성 완료`);
}
