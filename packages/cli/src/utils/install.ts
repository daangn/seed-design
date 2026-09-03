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

  // package.json의 선언만 본다. node_modules에 실제로 설치됐는지는 확인하지 않는다.
  const existingDeps = {
    ...packageInfo.dependencies,
    // ...packageInfo.devDependencies,
    // commented out because stated dependencies should be installed as actual dependencies even though they are listed in devDependencies
  };

  const depsToInstall = new Set(deps.filter((dep) => !existingDeps[dep]));
  const filteredDeps = new Set(deps.filter((dep) => existingDeps[dep]));

  if (!depsToInstall.size) return { installed: new Set<string>(), filtered: depsToInstall };

  start("의존성 설치 중...");

  const isDev = dev ? "-D" : null;
  const addCommand = packageManager === "npm" ? "install" : "add";
  const command = [addCommand, isDev, ...depsToInstall].filter((v): v is string => Boolean(v));

  try {
    await execa(packageManager, command, { cwd });
  } catch (error) {
    stop("의존성 설치에 실패했어요.");
    // No `details` of our own: the rejection carries the command it ran and what the package
    // manager printed, and guessing a reason on top of that is how a peer conflict came out
    // as a network problem.
    throw new CliError({
      message: "의존성 설치에 실패했어요.",
      hint: "위에 표시된 설치 명령어의 오류 내용을 확인해주세요. 설치 명령어를 직접 실행하면 같은 오류를 다시 볼 수 있어요.",
      cause: error,
    });
  }

  stop("의존성 설치가 완료됐어요.");

  return {
    installed: depsToInstall,
    filtered: filteredDeps,
  };
}
