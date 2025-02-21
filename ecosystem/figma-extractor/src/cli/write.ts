import fs from "fs-extra";
import path from "node:path";
import { camelCase, kebabCase } from "change-case";

export type MetadataItem = Record<string | number, unknown> & { name: string };

export async function writeFile(dir: string, content: string) {
  console.log("Writing to", dir);

  if (!fs.existsSync(path.dirname(dir))) {
    fs.mkdirpSync(path.dirname(dir));
  }

  fs.writeFileSync(dir, content);
}

export function createContent(metadataItem: MetadataItem) {
  const mjs = `export const metadata = ${JSON.stringify(metadataItem, null, 2)};\n`;
  const dts = `export declare const metadata: ${JSON.stringify(metadataItem, null, 2)};\n`;

  return { mjs, dts };
}

export function createJson(metadataItems: MetadataItem[]) {
  return JSON.stringify(metadataItems, null, 2);
}

export function createIndex(metadataItems: MetadataItem[]) {
  const mjsLines = [];
  const dtsLines = [];

  for (const { name } of metadataItems) {
    const mjsLine = `export { metadata as ${getVariableName(name)} } from "./${getFileName(name)}.mjs";`;
    const dtsLine = `export { metadata as ${getVariableName(name)} } from "./${getFileName(name)}";`;

    mjsLines.push(mjsLine);
    dtsLines.push(dtsLine);
  }

  return {
    mjs: mjsLines.join("\n").concat("\n"),
    dts: dtsLines.join("\n").concat("\n"),
  };
}

export function getFileName(name: string) {
  return kebabCase(name.replace(/ |\//g, " "));
}

export function getVariableName(name: string) {
  return camelCase(name.replace(/ |\//g, " "));
}
