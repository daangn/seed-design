import type { Api as figma } from "figma-api";
import type { PublishedStyle } from "@figma/rest-api-spec";

export type StyleMetadataItem = PublishedStyle;

async function getStylesInFile({
  api,
  fileKey,
}: {
  api: figma;
  fileKey: string;
}): Promise<StyleMetadataItem[]> {
  const {
    meta: { styles },
  } = await api.getFileStyles({ file_key: fileKey });

  return styles;
}

export const getStylesMetadataInFile = getStylesInFile;
