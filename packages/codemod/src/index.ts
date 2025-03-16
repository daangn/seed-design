#!/usr/bin/env node

import { cac } from "cac";
import { execa } from "execa";
import { readdirSync } from "fs";
import { resolve } from "path";
import { minVersion, satisfies } from "semver";
import type { z } from "zod";
import { transformOptionsSchema } from "./schema.js";
import { getGitInfo } from "./utils/git.js";
import { createTrack, LOG_PREFIX } from "./utils/log.js";

const TRANSFORM_PATH = resolve(__dirname, "transforms");
const cli = cac();
const packageJson = require("../package.json");
let globalTrack = null;
let globalGitInfo = null;

function initializeApp() {
  getGitInfo().then((gitInfo) => {
    globalGitInfo = gitInfo;
    globalTrack = createTrack({ ...gitInfo });
    setupCli(globalTrack);
  });
}

function setupCli(track) {
  checkNodejsVersion();

  cli
    .version(packageJson.version)
    .help()
    .command("[transformName] [...paths]", "코드 변환 (codemod)")
    .option("-l, --list", "사용 가능한 transform 목록을 보여줘요")
    .option("--log", "로그를 파일로 저장해요")
    .option("--no-track", "사용 통계를 수집하지 않아요")
    // https://jscodeshift.com/run/cli
    .option(
      "-p, --parser <parser>",
      "jscodeshift가 사용할 파서를 지정해요 (babel|babylon|flow|ts|tsx)",
      { default: "tsx" },
    )
    .option("--extensions <extensions>", "변환할 파일 확장자")
    .option("--ignore-config <ignoreConfig>", "Ignore config")
    .example("  $ npx @seed-design/codemod migrate-icons src/ui")
    .action(async (transformName, paths, opts) => {
      const options = transformOptionsSchema.parse(opts);

      if (options.track) {
        track?.({ event: "실행", properties: { transformName, paths } });
      }

      const availableTransforms = getAvailableTransforms();

      if (options.list) {
        printTransforms(availableTransforms);
        process.exit(0);
      }

      if (!transformName) {
        console.error("transform 이름을 입력해주세요");
        printTransforms(availableTransforms);

        process.exit(1);
      }

      if (!availableTransforms.includes(transformName)) {
        console.error(`이름이 ${transformName}인 transform이 없어요`);
        printTransforms(availableTransforms);

        process.exit(1);
      }

      if (paths.length === 0) {
        console.error("파일 경로를 입력해주세요");
        process.exit(1);
      }

      const transformPath = resolve(TRANSFORM_PATH, transformName, "index.js");
      console.log(LOG_PREFIX, `${paths.join(", ")}에 ${transformName} transform을 실행해요.`);
      await runTransform(transformPath, transformName, paths, options);
    });

  cli.parse();
}

function checkNodejsVersion() {
  if (satisfies(process.versions.node, packageJson.engines.node) === false) {
    console.error(
      `Node.js 버전 요구사항을 만족시키지 않아요: "${packageJson.engines.node}"
Node.js 버전을 업그레이드해주세요.
현재 버전: ${process.versions.node}

  $ nvm install ${minVersion(packageJson.engines.node)}`,
    );

    process.exit(1);
  }
}

const cssTransformers = ["replace-css-color-variable", "replace-css-typography-variable"];

async function runTransform(
  transformPath: string,
  transformName: string,
  paths: string[],
  options: z.infer<typeof transformOptionsSchema>,
) {
  const { log, parser, extensions, ignoreConfig, track: isTrackEnabled } = options;

  const jscodeshiftPath = require.resolve("jscodeshift/bin/jscodeshift");
  const fixedPaths = paths.map((path) => resolve(process.cwd(), path));

  if (cssTransformers.includes(transformName)) {
    const transformModule = require(transformPath);
    transformModule.processCssFiles(paths, options);
    return;
  }

  if (isTrackEnabled) {
    globalTrack?.({
      event: "transform 실행",
      properties: { transformPath, paths: fixedPaths, options },
    });
  }

  const args = [
    jscodeshiftPath,
    "--transform",
    transformPath,
    "--parser",
    parser,
    "--ignore-pattern",
    "**/*.d.ts",
    ...fixedPaths,
  ];

  if (extensions) args.push("--extensions", extensions);
  if (ignoreConfig) args.push("--ignore-config", ignoreConfig);

  try {
    const env = {
      ...process.env,
      LOG: String(log),
      TRACK: String(isTrackEnabled),
      GIT_INFO: JSON.stringify(globalGitInfo),
    };

    const subprocess = execa("node", args, {
      stdio: "inherit",
      env,
    });

    await subprocess;
    return;
  } catch (error) {
    if (error.exitCode) {
      throw new Error(`Transform failed with code ${error.exitCode}`);
    }
    throw error;
  }
}

function getAvailableTransforms() {
  return readdirSync(TRANSFORM_PATH);
}

function printTransforms(transforms: string[]) {
  console.log("\n사용 가능한 transform 목록:\n", transforms.join("\n"));
}

initializeApp();
