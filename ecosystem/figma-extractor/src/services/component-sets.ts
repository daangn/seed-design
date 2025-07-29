import path from "node:path";
import type { Api as figma } from "figma-api";
import { getComponentSetMetadataItemsInFile, type ComponentSetMetadataItem } from "../api/nodes";
import { createContent, createIndex, getFileName, writeFile } from "../cli/write";
import { POSSIBLE_DATA_TYPES } from "../constants";
import { defaultFilter, defaultTransform, type Filter, type Transform } from "../cli/config";

export type GenerateComponentSetMetadataOptions = {
  filter?: Filter<ComponentSetMetadataItem>;
  transform?: Transform<ComponentSetMetadataItem>;
};

export async function generateComponentSetMetadata({
  api,
  fileKey,
  dir,
  options: { filter = defaultFilter, transform = defaultTransform } = {},
}: { api: figma; fileKey: string; dir: string; options?: GenerateComponentSetMetadataOptions }) {
  console.log("component set 메타데이터 생성 중");

  const componentSetsMetadata = (await getComponentSetMetadataItemsInFile({ api, fileKey }))
    .filter(filter)
    .map(transform)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (componentSetsMetadata.length === 0) {
    console.error("추출할 component set 메타데이터가 없습니다.");

    return;
  }

  for await (const data of componentSetsMetadata) {
    const { mjs, dts } = createContent(data);

    const mjsPath = path.join(
      dir,
      POSSIBLE_DATA_TYPES.COMPONENT_SETS,
      `${getFileName(data.name)}.mjs`,
    );
    const dtsPath = path.join(
      dir,
      POSSIBLE_DATA_TYPES.COMPONENT_SETS,
      `${getFileName(data.name)}.d.ts`,
    );

    await writeFile(mjsPath, mjs);
    await writeFile(dtsPath, dts);
  }

  const { mjs, dts } = createIndex(componentSetsMetadata);

  const mjsPath = path.join(dir, POSSIBLE_DATA_TYPES.COMPONENT_SETS, "index.mjs");
  const dtsPath = path.join(dir, POSSIBLE_DATA_TYPES.COMPONENT_SETS, "index.d.ts");

  await writeFile(mjsPath, mjs);
  await writeFile(dtsPath, dts);

  console.log(`component set 메타데이터 ${componentSetsMetadata.length}개 생성 완료`);
}
