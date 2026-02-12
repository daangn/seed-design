import * as p from "@clack/prompts";
import { cosmiconfig } from "cosmiconfig";
import { z } from "zod";
import { CliCancelError, CliError } from "./error";
import { DEFAULT_INIT_CONFIG, writeInitConfigFile } from "./init-config";

const MODULE_NAME = "seed-design";

const explorer = cosmiconfig(MODULE_NAME, {
  searchPlaces: [`${MODULE_NAME}.json`],
});

export const configSchema = z
  .object({
    $schema: z.string().optional(),
    rsc: z.coerce.boolean().default(false),
    tsx: z.coerce.boolean().default(true),
    path: z.string(),
    telemetry: z.coerce.boolean().optional().default(true),
  })
  .strict();

export type Config = z.infer<typeof configSchema>;

export async function getConfig(cwd: string): Promise<Config> {
  const config = await getRawConfig(cwd);
  if (config) return config;

  p.log.error("프로젝트 루트 경로에 `seed-design.json` 파일이 없어요.");

  const isConfirm = await p.confirm({ message: "seed-design.json 파일을 생성하시겠어요?" });

  if (p.isCancel(isConfirm) || !isConfirm) {
    throw new CliCancelError();
  }

  try {
    await writeInitConfigFile({
      cwd,
      config: DEFAULT_INIT_CONFIG,
    });
    p.log.message("seed-design.json 파일이 생성됐어요.");
    return configSchema.parse(DEFAULT_INIT_CONFIG);
  } catch (error) {
    throw new CliError({
      code: "CONFIG_WRITE_FAILED",
      message: "seed-design.json 파일 생성에 실패했어요.",
      hint: "디렉토리 쓰기 권한과 경로를 확인한 뒤 다시 시도해보세요.",
      cause: error,
    });
  }
}

export async function getRawConfig(cwd: string): Promise<Config | null> {
  const configResult = await explorer.search(cwd);
  if (!configResult || configResult.isEmpty) return null;

  try {
    return configSchema.parse(configResult.config);
  } catch (error) {
    throw new CliError({
      code: "CONFIG_INVALID",
      message: "seed-design.json 형식이 올바르지 않아요.",
      hint: "https://seed-design.com/react/getting-started/cli/configuration 문서를 참고해 주세요.",
      cause: error,
    });
  }
}
