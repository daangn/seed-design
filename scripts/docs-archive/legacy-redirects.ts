import archives from "./archives.json";
import { type ArchiveDefinition, archivePrefix, validateArchive } from "./config";

// 공개 원본이 등록된 1.x 채널만 전환한다. 미배포 경로로의 리다이렉트는 만들지 않는다.
export function legacyReactRedirectRules(definitions: readonly ArchiveDefinition[]) {
  return definitions
    .filter((entry) => entry.platform === "react" && /^v1\.[012]$/.test(entry.version))
    .map((entry) => {
      validateArchive(entry);
      const prefix = archivePrefix(entry);
      const hostname = `${entry.version.replace(".", "-")}.seed-design.io`;
      return {
        ref: `seed_react_${entry.version.replace(".", "_")}_archive`,
        description: `React ${entry.version} documentation archive`,
        enabled: true,
        expression: `(http.host eq "${hostname}" and (http.request.uri.path eq "/react" or starts_with(http.request.uri.path, "/react/")))`,
        action: "redirect",
        action_parameters: {
          from_value: {
            target_url: {
              expression: `concat("https://seed-design.io${prefix}", substring(http.request.uri.path, 6))`,
            },
            status_code: 308,
            preserve_query_string: true,
          },
        },
      };
    });
}

if (import.meta.main) {
  console.log(JSON.stringify(legacyReactRedirectRules(archives), null, 2));
}
