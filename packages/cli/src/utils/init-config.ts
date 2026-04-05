import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { highlight } from "./color";
import { CliCancelError } from "./error";
import { getPackageInfo } from "./get-package-info";

import type { Config } from "./get-config";

export const DEFAULT_INIT_CONFIG: Config = {
  rsc: false,
  tsx: true,
  framework: "react",
  path: "./seed-design",
  telemetry: true,
};

export function detectFramework(cwd: string): "react" | "lynx" {
  try {
    const pkg = getPackageInfo(cwd);
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
    };
    if ("@lynx-js/react" in allDeps || "@seed-design/lynx-react" in allDeps) {
      return "lynx";
    }
  } catch {}
  return "react";
}

export async function promptInitConfig(cwd: string): Promise<Config> {
  const detectedFramework = detectFramework(cwd);

  const group = await p.group(
    {
      tsx: () =>
        p.confirm({
          message: `${highlight("TypeScript")}를 사용중이신가요?`,
          initialValue: DEFAULT_INIT_CONFIG.tsx,
        }),
      rsc: () =>
        p.confirm({
          message: `${highlight("React Server Components")}를 사용중이신가요?`,
          initialValue: DEFAULT_INIT_CONFIG.rsc,
        }),
      framework: () =>
        p.select({
          message: `어떤 ${highlight("프레임워크")}를 사용하시나요?`,
          initialValue: detectedFramework,
          options: [
            { value: "react" as const, label: "React" },
            { value: "lynx" as const, label: "Lynx" },
          ],
        }),
      path: () =>
        p.text({
          message: `${highlight("seed-design 폴더")} 경로를 입력해주세요. (기본값은 프로젝트 루트에 생성됩니다.)`,
          initialValue: DEFAULT_INIT_CONFIG.path,
          defaultValue: DEFAULT_INIT_CONFIG.path,
          placeholder: DEFAULT_INIT_CONFIG.path,
        }),
      telemetry: () =>
        p.confirm({
          message: `개선을 위해 ${highlight("익명 사용 데이터")}를 수집할까요?`,
          initialValue: DEFAULT_INIT_CONFIG.telemetry,
        }),
    },
    {
      onCancel: () => {
        throw new CliCancelError();
      },
    },
  );

  return group;
}

export async function writeInitConfigFile({
  cwd,
  config,
}: {
  cwd: string;
  config: Config;
}): Promise<{ relativePath: string; targetPath: string }> {
  const targetPath = path.resolve(cwd, "seed-design.json");
  await fs.writeFile(targetPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
  const relativePath = path.relative(process.cwd(), targetPath);

  return {
    relativePath,
    targetPath,
  };
}
