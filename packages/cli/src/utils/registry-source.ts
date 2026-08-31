import { CliError } from "./error";

/**
 * 아카이브된 SEED React 버전별 레지스트리 도메인.
 *
 * 모든 minor 버전이 아니라 보존(아카이브)된 버전만 서브도메인으로 배포되어 있어,
 * 동적으로 URL을 만들지 않고 알려진 버전만 하드코딩한다. 새 버전을 아카이브하면 여기 추가한다.
 */
const SEED_REACT_VERSION_BASE_URLS: Record<string, string> = {
  "1.0": "https://v1-0.seed-design.io",
  "1.1": "https://v1-1.seed-design.io",
  "1.2": "https://v1-2.seed-design.io",
};

/**
 * `--seed-react-version` 옵션을 레지스트리 소스(framework + baseUrl)로 해석한다.
 * 옵션이 없으면 null을 반환한다 (= 레거시 `--baseUrl` / `--framework` 경로 사용).
 *
 * 지원하지 않는 버전이면 사용 가능한 버전을 안내하며 에러를 던진다.
 * 옵션이 지정되면 framework도 react로 고정한다. (Lynx는 자체 버전 배포가 없어 별도 옵션을
 * 제공하지 않으며, 기본값(latest)을 쓰거나 필요 시 `--baseUrl`로 직접 지정한다.)
 */
export function resolveSeedVersion(opts: {
  seedReactVersion?: string;
}): { framework: "react"; baseUrl: string } | null {
  const version = opts.seedReactVersion?.trim();
  if (!version) return null;

  const baseUrl = SEED_REACT_VERSION_BASE_URLS[version];
  if (!baseUrl) {
    throw new CliError({
      message: `지원하지 않는 SEED React 버전이에요: "${opts.seedReactVersion}"`,
      hint: `사용 가능한 버전: ${Object.keys(SEED_REACT_VERSION_BASE_URLS).join(", ")}`,
    });
  }

  return { framework: "react", baseUrl };
}
