import type { RootageConfig, RootagePlugin } from "@seed-design/rootage-core/config";
import { cosmiconfig } from "cosmiconfig";

function fail(filepath: string, message: string): never {
  throw new Error(`Invalid rootage config at ${filepath}: ${message}`);
}

function validatePlugin(value: unknown, index: number, filepath: string): RootagePlugin {
  if (typeof value !== "object" || value === null) {
    fail(filepath, `plugins[${index}] must be an object`);
  }

  const { name, transform, tokenCssGenerator } = value as Record<string, unknown>;

  if (typeof name !== "string" || name === "") {
    fail(filepath, `plugins[${index}].name must be a non-empty string`);
  }
  if (transform !== undefined && typeof transform !== "function") {
    fail(filepath, `plugins[${index}] (${name}): transform must be a function`);
  }
  if (tokenCssGenerator !== undefined && typeof tokenCssGenerator !== "function") {
    fail(filepath, `plugins[${index}] (${name}): tokenCssGenerator must be a function`);
  }

  return value as RootagePlugin;
}

function validateConfig(value: unknown, filepath: string): RootageConfig {
  if (typeof value !== "object" || value === null) {
    fail(filepath, "config must export an object");
  }

  const { prefix, plugins } = value as Record<string, unknown>;

  if (prefix !== undefined && typeof prefix !== "string") {
    fail(filepath, "prefix must be a string");
  }
  if (plugins !== undefined && !Array.isArray(plugins)) {
    fail(filepath, "plugins must be an array");
  }

  return {
    prefix,
    plugins: (plugins as unknown[] | undefined)?.map((plugin, index) =>
      validatePlugin(plugin, index, filepath),
    ),
  };
}

// 탐색은 cwd 한 디렉토리다. 패키지마다 자기 디렉토리에서 CLI를 돌리므로 상위로 올라가지 않는다.
export async function loadConfig(configPath?: string): Promise<RootageConfig> {
  const explorer = cosmiconfig("rootage");
  const result = configPath ? await explorer.load(configPath) : await explorer.search();

  if (!result || result.isEmpty) return {};

  return validateConfig(result.config, result.filepath);
}
