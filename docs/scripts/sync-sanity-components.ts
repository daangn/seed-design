import chalk from "chalk";
import { createClient } from "@sanity/client";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ALL_COMPONENTS_QUERY = `*[_type == "component"] | order(name asc) {
  id,
  name,
  deprecated,
  deprecatedMessage,
  iosStatus,
  iosUrl,
  iosNote,
  androidStatus,
  androidUrl,
  androidNote,
  reactStatus,
  reactUrl,
  reactNote,
  figmaStatus,
  figmaUrl,
  figmaNote,
}`;

async function main() {
  console.log(chalk.gray("Fetching Sanity component data..."));

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "mokd6dka",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-23",
    useCdn: false,
  });

  const components = await client.fetch(ALL_COMPONENTS_QUERY);

  const outputDir = join(process.cwd(), "public", "sanity");
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, "components.json");
  writeFileSync(outputPath, JSON.stringify(components, null, 2));

  console.log(chalk.green(`✓ Generated ${outputPath} (${components.length} components)`));
}

main().catch((err) => {
  console.error(chalk.red("Failed to generate Sanity components:"), err);
  process.exit(1);
});
