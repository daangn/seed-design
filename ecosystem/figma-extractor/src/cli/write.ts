import fs from "fs-extra";
import path from "node:path";

export interface WriterContext {
  pipelineName: string;
  write: (relativePath: string, content: string) => Promise<void>;
  utils: {
    toJson: (data: any, pretty?: boolean) => string;
    toTypeScript: (name: string, data: any) => string;
    toMjs: (name: string, data: any) => string;
    toDts: (name: string, data: any) => string;
  };
}

export async function writeFile(dir: string, content: string) {
  console.log("Writing to", dir);

  if (!fs.existsSync(path.dirname(dir))) {
    fs.mkdirpSync(path.dirname(dir));
  }

  fs.writeFileSync(dir, content);
}

export function createWriterContext({
  baseDir,
  pipelineName,
}: {
  baseDir: string;
  pipelineName: string;
}): WriterContext {
  return {
    pipelineName,
    write: async (relativePath: string, content: string) => {
      const fullPath = path.join(baseDir, relativePath);

      await writeFile(fullPath, content);
    },
    utils: {
      toJson: (data: unknown, pretty = true) => {
        return JSON.stringify(data, null, pretty ? 2 : undefined);
      },
      toTypeScript: (name: string, data: unknown) => {
        const jsonStr = JSON.stringify(data, null, 2);
        return `export const ${name} = ${jsonStr} as const;\n`;
      },
      toMjs: (name: string, data: unknown) => {
        const jsonStr = JSON.stringify(data, null, 2);
        return `export const ${name} = ${jsonStr};\n`;
      },
      toDts: (name: string, data: unknown) => {
        const jsonStr = JSON.stringify(data, null, 2);
        return `export declare const ${name}: ${jsonStr};\n`;
      },
    },
  };
}
