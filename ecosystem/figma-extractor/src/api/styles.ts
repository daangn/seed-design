import type { PublishedStyle } from "@figma/rest-api-spec";
import { api } from "./client";

export type StyleMetadataItem = PublishedStyle;

async function getStylesInFile({ fileKey }: { fileKey: string }) {
  const {
    meta: { styles },
  } = await api.getFileStyles({ file_key: fileKey });

  return styles;
}

export const getStylesMetadataInFile = getStylesInFile;
