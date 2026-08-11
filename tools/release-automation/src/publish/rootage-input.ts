import { appendFile } from "node:fs/promises";
import { parsePublishPackages, type PublishPackage } from "./publish-state";

interface RegistryDocument {
  versions?: Record<string, { dist?: { integrity?: string } }>;
}

export function expectedRootageIntegrity(
  version: string,
  packages: PublishPackage[],
): string | null {
  if (!version) return null;
  const matches = packages.filter(
    (item) => item.name === "@seed-design/rootage-artifacts" && item.version === version,
  );
  if (matches.length !== 1 || !matches[0]?.integrity) {
    throw new Error(`Rootage ${version}의 승인 artifact integrity 계약이 없습니다.`);
  }
  return matches[0].integrity;
}

async function main(): Promise<void> {
  const version = Bun.argv[2] ?? "";
  const outputPath = process.env.GITHUB_OUTPUT;
  const packages = parsePublishPackages(process.env.PUBLISH_PACKAGES ?? "[]");
  const expectedIntegrity = expectedRootageIntegrity(version, packages);
  if (!expectedIntegrity) {
    if (outputPath) await appendFile(outputPath, "integrity=\n");
    return;
  }

  let integrity = "";
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    const response = await fetch("https://registry.npmjs.org/%40seed-design%2Frootage-artifacts", {
      headers: { accept: "application/json" },
    });
    if (response.ok) {
      const document = (await response.json()) as RegistryDocument;
      integrity = document.versions?.[version]?.dist?.integrity ?? "";
      if (integrity === expectedIntegrity) break;
      if (integrity && integrity !== expectedIntegrity) {
        throw new Error(`Rootage ${version}의 npm integrity가 승인 artifact와 다릅니다.`);
      }
    }
    if (attempt < 12) await Bun.sleep(5_000);
  }
  if (!integrity) throw new Error(`Rootage ${version}의 npm integrity를 확인하지 못했습니다.`);
  if (integrity !== expectedIntegrity) {
    throw new Error(`Rootage ${version}의 npm integrity가 승인 artifact와 다릅니다.`);
  }
  if (outputPath) await appendFile(outputPath, `integrity=${integrity}\n`);
  console.log(`@seed-design/rootage-artifacts@${version}: ${integrity}`);
}

if (import.meta.main) await main();
