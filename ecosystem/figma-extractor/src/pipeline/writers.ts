import path from "node:path";
import type { WriterContext } from "../cli/write";
import { camelCase, kebabCase } from "change-case";

export const writers = {
  default: async <T extends { name: string }>(
    items: T[],
    { pipelineName, utils, write }: WriterContext,
  ) => {
    const indexMjsLines = [];
    const indexDtsLines = [];

    for await (const item of items) {
      const fileName = kebabCase(item.name);

      const mjs = utils.toMjs("metadata", item);
      const dts = utils.toDts("metadata", item);

      const mjsPath = path.join(pipelineName, `${fileName}.mjs`);
      const dtsPath = path.join(pipelineName, `${fileName}.d.ts`);

      await write(mjsPath, mjs);
      await write(dtsPath, dts);

      const identifierName = getIdentifierName(item.name);

      indexMjsLines.push(`export { metadata as ${identifierName} } from "./${fileName}.mjs";`);
      indexDtsLines.push(`export { metadata as ${identifierName} } from "./${fileName}";`);
    }

    const indexMjsPath = path.join(pipelineName, "index.mjs");
    const indexDtsPath = path.join(pipelineName, "index.d.ts");

    await write(indexMjsPath, indexMjsLines.join("\n").concat("\n"));
    await write(indexDtsPath, indexDtsLines.join("\n").concat("\n"));

    console.log(`${items.length}개 항목 ${pipelineName} 에 생성 완료`);
  },
};

export function getFileName(name: string) {
  return kebabCase(name.replace(/ |\//g, " "));
}

export function getIdentifierName(name: string) {
  return camelCase(name.replace(/ |\//g, " "));
}
