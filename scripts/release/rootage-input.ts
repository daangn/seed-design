import { appendFile } from "node:fs/promises";

interface RegistryDocument {
  versions?: Record<string, { dist?: { integrity?: string } }>;
}

const version = Bun.argv[2] ?? "";
const outputPath = process.env.GITHUB_OUTPUT;
if (!version) {
  if (outputPath) await appendFile(outputPath, "integrity=\n");
  process.exit(0);
}

let integrity = "";
for (let attempt = 1; attempt <= 12; attempt += 1) {
  const response = await fetch("https://registry.npmjs.org/%40seed-design%2Frootage-artifacts", {
    headers: { accept: "application/json" },
  });
  if (response.ok) {
    const document = (await response.json()) as RegistryDocument;
    integrity = document.versions?.[version]?.dist?.integrity ?? "";
    if (integrity) break;
  }
  if (attempt < 12) await Bun.sleep(5_000);
}
if (!integrity) throw new Error(`Rootage ${version}의 npm integrity를 확인하지 못했습니다.`);
if (outputPath) await appendFile(outputPath, `integrity=${integrity}\n`);
console.log(`@seed-design/rootage-artifacts@${version}: ${integrity}`);
