import findup from "findup-sync";
import fs from "fs-extra";
import type { PackageJson } from "type-fest";

const PACKAGE_JSON = "package.json";

function getPackagePath() {
  const packageJsonPath = findup(PACKAGE_JSON);
  if (!packageJsonPath) {
    throw new Error("No package.json file found in the project.");
  }
  return packageJsonPath;
}

export function getPackageInfo() {
  return fs.readJSONSync(getPackagePath()) as PackageJson;
}
