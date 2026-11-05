import path from "path";
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

/**
 * node_modules에 실제로 설치된 패키지의 package.json을 읽어요.
 * 선언 범위(`^1.1.0`)가 아니라 실제 해소된 설치본을 보므로 정확한 호환성 진단에 사용해요.
 * 미설치 또는 읽기 실패 시 null.
 */
export function getInstalledPackageJson(
  packageName: string,
  cwd = process.cwd(),
): PackageJson | null {
  try {
    // findup으로 cwd부터 상위로 올라가며 node_modules를 찾아 호이스팅된 설치본도 탐지
    const packageJsonPath = findup(path.join("node_modules", packageName, PACKAGE_JSON), { cwd });
    if (!packageJsonPath) return null;
    return fs.readJSONSync(packageJsonPath) as PackageJson;
  } catch {
    return null;
  }
}
