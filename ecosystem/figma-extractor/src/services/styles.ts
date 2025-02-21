import path from "node:path";
import { getStylesMetadataInFile, type StyleMetadataItem } from "../api/styles";
import { createContent, createIndex, getFileName, writeFile } from "../cli/write";
import { POSSIBLE_DATA_TYPES } from "../constants";
import { defaultFilter, defaultTransform, type Filter, type Transform } from "../cli/config";

export type GenerateStylesMetadataOptions = {
  filter?: Filter<StyleMetadataItem>;
  transform?: Transform<StyleMetadataItem>;
};

export async function generateStyleMetadata({
  fileKey,
  dir,
  options: { filter = defaultFilter, transform = defaultTransform } = {},
}: {
  fileKey: string;
  dir: string;
  options?: GenerateStylesMetadataOptions;
}) {
  console.log("style 메타데이터 생성 중");

  const stylesMetadata = (await getStylesMetadataInFile({ fileKey }))
    .filter(filter)
    .map(transform)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (stylesMetadata.length === 0) {
    console.error("추출할 style 메타데이터가 없습니다.");

    return;
  }

  for await (const data of stylesMetadata) {
    const { mjs, dts } = createContent(data);

    const mjsPath = path.join(dir, POSSIBLE_DATA_TYPES.STYLES, `${getFileName(data.name)}.mjs`);
    const dtsPath = path.join(dir, POSSIBLE_DATA_TYPES.STYLES, `${getFileName(data.name)}.d.ts`);

    await writeFile(mjsPath, mjs);
    await writeFile(dtsPath, dts);
  }

  const { mjs, dts } = createIndex(stylesMetadata);

  const mjsPath = path.join(dir, POSSIBLE_DATA_TYPES.STYLES, "index.mjs");
  const dtsPath = path.join(dir, POSSIBLE_DATA_TYPES.STYLES, "index.d.ts");

  await writeFile(mjsPath, mjs);
  await writeFile(dtsPath, dts);

  console.log(`style 메타데이터 ${stylesMetadata.length}개 생성 완료`);
}
