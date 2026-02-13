import * as p from "@clack/prompts";
import { execa } from "execa";
import { CliError } from "./error";
import { getPackageManager } from "./get-package-manager";
import { getPackageInfo } from "./get-package-info";

interface InstallDependenciesProps {
  cwd: string;
  deps: string[];
  dev?: boolean;
}

export async function installDependencies({ cwd, deps, dev = false }: InstallDependenciesProps) {
  const { start, stop } = p.spinner();
  const packageManager = await getPackageManager(cwd);
  const packageInfo = getPackageInfo(cwd);

  // 이미 설치된 의존성 필터링
  const existingDeps = {
    ...packageInfo.dependencies,
    // ...packageInfo.devDependencies,
    // commented out because stated dependencies should be installed as actual dependencies even though they are listed in devDependencies
  };

  const depsToInstall = new Set(deps.filter((dep) => !existingDeps[dep]));
  const filteredDeps = new Set(deps.filter((dep) => existingDeps[dep]));

  if (!depsToInstall.size) return { installed: new Set<string>(), filtered: depsToInstall };

  start("의존성 설치중...");

  const isDev = dev ? "-D" : null;
  const addCommand = packageManager === "npm" ? "install" : "add";
  const command = [addCommand, isDev, ...depsToInstall].filter(Boolean);
  const commandLabel = `${packageManager} ${command.join(" ")}`;

  try {
    await execa(packageManager, command, { cwd });
  } catch (error) {
    stop("의존성 설치에 실패했어요.");
    throw new CliError({
      message: "의존성 설치에 실패했어요.",
      hint: "네트워크 상태를 확인하고, 설치 명령어를 직접 실행해 상세 오류를 확인해보세요.",
      details: [`실행 명령어: ${commandLabel}`],
      cause: error,
    });
  }

  stop("의존성 설치가 완료됐어요.");

  return {
    installed: depsToInstall,
    filtered: filteredDeps,
  };
}
