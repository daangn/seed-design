import { Api as figma } from "figma-api";
import { ENV } from "../env";
import type { Config } from "../cli/config";

export function createApiClient(config: Config) {
  const personalAccessToken = config.personalAccessToken ?? ENV.FIGMA_PERSONAL_ACCESS_TOKEN;

  if (!personalAccessToken) {
    throw new Error(
      "`FIGMA_PERSONAL_ACCESS_TOKEN` 환경 변수를 제공하거나 config 파일에 `personalAccessToken`을 설정해주세요.",
    );
  }

  return new figma({ personalAccessToken });
}
