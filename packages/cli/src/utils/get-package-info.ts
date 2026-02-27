import findup from "findup-sync";
import fs from "fs-extra";
import type { PackageJson } from "type-fest";

const PACKAGE_JSON = "package.json";

function getPackagePath(cwd = process.cwd()) {
  const packageJsonPath = findup(PACKAGE_JSON, { cwd });
  if (!packageJsonPath) {
    throw new Error("No package.json file found in the project.");
  }
  return packageJsonPath;
}

export function getPackageInfo(cwd = process.cwd()) {
  const packageJsonPath = getPackagePath(cwd);
  return fs.readJSONSync(packageJsonPath) as PackageJson;
}
