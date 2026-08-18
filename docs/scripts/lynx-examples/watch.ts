import { watch } from "node:fs";
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  DEVELOPMENT_DIRECTORY,
  DOCS_DIRECTORY,
  EXAMPLES_DIRECTORY,
  PUBLIC_DIRECTORY,
} from "./constants.js";
import { buildLynxExamples } from "./build.js";

let child: ReturnType<typeof Bun.spawn> | undefined;
let restarting = false;
let queued = false;

async function prepareAndStart() {
  restarting = true;
  child?.kill();
  if (child) await child.exited;

  await buildLynxExamples({ mode: "development" });

  child = Bun.spawn(
    [
      "bunx",
      "--bun",
      "rspeedy",
      "build",
      "--watch",
      "--config",
      "lynx.config.ts",
      "--mode",
      "development",
    ],
    {
      cwd: DOCS_DIRECTORY,
      stdout: "inherit",
      stderr: "inherit",
      env: { ...process.env, LYNX_EXAMPLES_DEV_OUTPUT: "1" },
    },
  );
  restarting = false;
  if (queued) {
    queued = false;
    await prepareAndStart();
  }
}

await prepareAndStart();

const pendingCopies = new Map<string, ReturnType<typeof setTimeout>>();

async function copyDevelopmentBundle(filename: string) {
  try {
    const target = resolve(PUBLIC_DIRECTORY, filename);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(resolve(DEVELOPMENT_DIRECTORY, filename), target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

const outputWatcher = watch(DEVELOPMENT_DIRECTORY, { recursive: true }, (_event, filename) => {
  if (!filename?.endsWith(".bundle")) return;
  const previous = pendingCopies.get(filename);
  if (previous) clearTimeout(previous);
  pendingCopies.set(
    filename,
    setTimeout(() => {
      pendingCopies.delete(filename);
      void copyDevelopmentBundle(filename).catch((error: unknown) => {
        console.error("Lynx 개발 bundle을 public 디렉터리에 반영하지 못했습니다.", error);
        stop();
        process.exitCode = 1;
      });
    }, 100),
  );
});

let debounce: ReturnType<typeof setTimeout> | undefined;
const entryWatcher = watch(EXAMPLES_DIRECTORY, { recursive: true }, (_event, filename) => {
  if (!filename?.endsWith(".tsx")) return;
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(() => {
    if (restarting) queued = true;
    else void prepareAndStart();
  }, 150);
});

function stop() {
  entryWatcher.close();
  outputWatcher.close();
  for (const timeout of pendingCopies.values()) clearTimeout(timeout);
  child?.kill();
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
