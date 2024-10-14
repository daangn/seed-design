import ts from "typescript";
import fs from "fs";
import path from "path";

export function getAllFileNamesWithMatchingExtension({
  dir,
  ext,
}: {
  dir: string;
  ext: string[];
}) {
  // XXX: requires Node.js 20+
  return fs
    .readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter(
      (item) => item.isFile() && ext.some((ext) => item.name.endsWith(ext))
    )
    .map((item) => `${item.parentPath}/${item.name}`);
}

export function getAllTypeScriptCompiledFileNames({
  dirToFindTsconfig,
}: {
  dirToFindTsconfig: string;
}) {
  const tsconfigPath = ts.findConfigFile(dirToFindTsconfig, ts.sys.fileExists);
  const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  // FIXME: throw할 수 있을 것 같음
  const { fileNames } = ts.parseJsonConfigFileContent(
    tsconfigFile.config,
    ts.sys,
    path.dirname(tsconfigPath)
  );

  return fileNames;
}
