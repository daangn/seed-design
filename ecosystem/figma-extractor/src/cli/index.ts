#!/usr/bin/env node

import { cac } from "cac";
import { z } from "zod";
import { ENV } from "../env";
import { loadConfig } from "./config";
import { createApiClient } from "../api/client";
import { getNodesInFile } from "../api/nodes";
import pkg from "../../package.json" with { type: "json" };
import { createWriterContext } from "./write";

const cli = cac();
const paramSchema = z.object({
  pipelines: z.array(z.string()),
  dir: z.string(),
});
const optionsSchema = z.object({
  config: z.string().optional(),
});

cli
  .command(
    "<dir> [...pipelines]",
    "파일 저장 경로 및 실행할 파이프라인 지정. 파이프라인을 지정하지 않으면 모든 파이프라인이 실행됩니다.",
  )
  .option("--config <path>", "Path to the config file")
  .example(
    `  $ FIGMA_FILE_KEY="foo" FIGMA_PERSONAL_ACCESS_TOKEN="bar" bun figma-extractor src/data icons buttons`,
  )
  .action(async (paramDir, paramPipelines, options) => {
    const { pipelines, dir } = paramSchema.parse({ pipelines: paramPipelines, dir: paramDir });
    const { config: configPath } = optionsSchema.parse(options);

    const generateAll = pipelines.length === 0;

    const config = await loadConfig(configPath);
    const fileKey = config.fileKey ?? ENV.FIGMA_FILE_KEY;

    try {
      if (!fileKey)
        throw new Error(
          "`FIGMA_FILE_KEY` 환경 변수를 제공하거나 config 파일에 `fileKey`를 설정해주세요.",
        );

      const api = createApiClient(config.personalAccessToken);

      const pipelinesToRun = generateAll
        ? Object.entries(config.pipelines)
        : Object.entries(config.pipelines).filter(([name]) => pipelines.includes(name));

      if (pipelinesToRun.length === 0) {
        console.warn("No pipelines found to execute");

        return;
      }

      for (const [name, pipeline] of pipelinesToRun) {
        console.log(`Executing pipeline: ${name}`);

        const writerContext = createWriterContext({ baseDir: dir, pipelineName: name });

        await pipeline.execute({
          ...writerContext,
          api,
          fileKey,
          fetchNodes: ({ fileKey, nodeIds }) => getNodesInFile({ api, fileKey, nodeIds }),
        });
      }
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  });

cli.version(pkg.version);
cli.help();
cli.parse();
