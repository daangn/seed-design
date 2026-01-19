import chalk from "chalk";
import { createClient } from "@sanity/client";
import { promises as fs } from "fs";
import path from "node:path";
import { apiVersion, dataset, projectId } from "../sanity-studio/env.js";

interface ComponentFrontmatter {
  title: string;
  description?: string;
}

interface ComponentToImport {
  id: string;
  name: string;
  filePath: string;
}

// Parse MDX frontmatter
function parseFrontmatter(content: string): ComponentFrontmatter | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const frontmatterContent = match[1];
  const titleMatch = frontmatterContent.match(/title:\s*(.+)/);
  const descriptionMatch = frontmatterContent.match(/description:\s*"?([^"\n]+)"?/);

  if (!titleMatch) return null;

  return {
    title: titleMatch[1].trim(),
    description: descriptionMatch ? descriptionMatch[1].trim() : undefined,
  };
}

// Scan components directory
async function scanComponents(): Promise<ComponentToImport[]> {
  const componentsDir = path.join(process.cwd(), "content", "docs", "components");
  const files = await fs.readdir(componentsDir);
  const components: ComponentToImport[] = [];

  console.log(chalk.gray(`🔍 Scanning ${componentsDir}...`));

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;

    const filePath = path.join(componentsDir, file);
    const content = await fs.readFile(filePath, "utf-8");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      console.log(chalk.yellow(`⚠️  Skipping ${file} - no frontmatter found`));
      continue;
    }

    const componentId = file.replace(".mdx", "");
    components.push({
      id: componentId,
      name: frontmatter.title,
      filePath: file,
    });
  }

  return components;
}

// Create Sanity client with write permissions
function createWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!token) {
    throw new Error(
      chalk.red(
        "SANITY_WRITE_TOKEN environment variable is required.\n" +
          "Get your token from: https://www.sanity.io/manage/project/" +
          projectId +
          "/api#tokens",
      ),
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

// Import components to Sanity
async function importComponents(components: ComponentToImport[], options: { dryRun: boolean }) {
  const client = options.dryRun ? null : createWriteClient();

  console.log(
    chalk.cyan(
      `\n💾 ${options.dryRun ? "[DRY RUN] Would import" : "Importing"} ${components.length} components to Sanity...\n`,
    ),
  );

  const results = {
    created: 0,
    updated: 0,
    errors: 0,
  };

  for (const component of components) {
    try {
      const doc = {
        _type: "component",
        _id: `component-${component.id}`,
        id: component.id,
        name: component.name,
        deprecated: false,
        iosStatus: "not-ready",
        androidStatus: "not-ready",
        reactStatus: "not-ready",
        figmaStatus: "not-ready",
      };

      if (options.dryRun) {
        console.log(chalk.gray(`  ✓ ${component.id} → ${component.name}`));
      } else {
        if (!client) {
          throw new Error("Sanity client not initialized");
        }

        // Check if document exists
        const existing = await client.getDocument(doc._id);
        const isUpdate = !!existing;

        await client.createOrReplace(doc);

        if (isUpdate) {
          results.updated++;
          console.log(chalk.blue(`  ↻ ${component.id} → ${component.name} (updated)`));
        } else {
          results.created++;
          console.log(chalk.green(`  ✓ ${component.id} → ${component.name} (created)`));
        }
      }
    } catch (error) {
      results.errors++;
      console.error(
        chalk.red(
          `  ✗ ${component.id} → Failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  return results;
}

// Prompt user for confirmation
async function confirm(message: string): Promise<boolean> {
  console.log(chalk.yellow(`\n${message}`));
  console.log(chalk.gray("Type 'y' or 'yes' to continue, anything else to cancel:"));

  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      const input = data.toString().trim().toLowerCase();
      process.stdin.setRawMode(false);
      process.stdin.pause();
      console.log(); // newline
      resolve(input === "y" || input === "yes");
    });
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log(chalk.bold.cyan("\n🚀 Sanity Component Import Script\n"));

  try {
    // Scan components
    const components = await scanComponents();

    if (components.length === 0) {
      console.log(chalk.yellow("No components found to import."));
      process.exit(0);
    }

    console.log(chalk.green(`\n📦 Found ${components.length} components\n`));

    // List components
    components.forEach((c) => {
      console.log(chalk.gray(`  • ${c.id} → ${c.name}`));
    });

    if (dryRun) {
      console.log(chalk.yellow("\n🔍 DRY RUN MODE - No changes will be made\n"));
      await importComponents(components, { dryRun: true });
      console.log(chalk.cyan("\nDry run complete! Run without --dry-run to actually import."));
      process.exit(0);
    }

    // Confirm before actual import
    const confirmed = await confirm(
      `Ready to import ${components.length} components to Sanity. Continue?`,
    );

    if (!confirmed) {
      console.log(chalk.yellow("Import cancelled."));
      process.exit(0);
    }

    // Actual import
    const results = await importComponents(components, { dryRun: false });

    // Summary
    console.log(chalk.bold.green("\n✨ Import Complete!\n"));
    console.log(chalk.green(`  Created: ${results.created}`));
    console.log(chalk.blue(`  Updated: ${results.updated}`));
    if (results.errors > 0) {
      console.log(chalk.red(`  Errors:  ${results.errors}`));
    }

    process.exit(results.errors > 0 ? 1 : 0);
  } catch (error) {
    console.error(chalk.red("\n❌ Error:"), error);
    process.exit(1);
  }
}

main();
