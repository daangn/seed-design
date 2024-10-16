import ts from "typescript";
import fs from "fs";
import path from "path";
import type { SimpleGit } from "simple-git";

export function getAllFileNamesWithMatchingExtension({
  dir,
  extensionsToFind,
  extensionsToExclude,
}: {
  dir: string;
  extensionsToFind: string[];
  extensionsToExclude?: string[];
}) {
  // XXX: requires Node.js 20+
  return fs
    .readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter(
      (item) =>
        item.isFile() &&
        extensionsToFind.some((ext) => item.name.endsWith(ext)) &&
        (extensionsToExclude ? !extensionsToExclude.some((ext) => item.name.endsWith(ext)) : true),
    )
    .map((item) => `${item.parentPath}/${item.name}`);
}

export function getAllTypeScriptCompiledFileNames({
  dirToFindTsconfig,
  excludeDTs,
}: {
  dirToFindTsconfig: string;
  excludeDTs?: boolean;
}) {
  const tsconfigPath = ts.findConfigFile(dirToFindTsconfig, ts.sys.fileExists);
  const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  // FIXME: throw할 수 있을 것 같음
  const { fileNames } = ts.parseJsonConfigFileContent(
    tsconfigFile.config,
    ts.sys,
    path.dirname(tsconfigPath),
  );

  return fileNames.filter((fileName) => (excludeDTs ? !fileName.endsWith(".d.ts") : true));
}

export async function filterGitIgnoredFiles({
  git,
  filePaths,
}: {
  git: SimpleGit;
  filePaths: string[];
}) {
  const promises = await Promise.all(filePaths.map((file) => isFileGitTracked(git, file)));

  return filePaths.filter((_, index) => promises[index]);
}

async function isFileGitTracked(git: SimpleGit, filePath: string) {
  const result = await git.checkIgnore(filePath);

  return result.length <= 0;
}
