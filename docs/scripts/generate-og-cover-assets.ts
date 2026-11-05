#!/usr/bin/env bun

import { $ } from "bun";
import { mkdirSync } from "node:fs";
import path from "node:path";
import {
  formatGenerationPlan,
  formatValidationResult,
  planOgCoverAssetGeneration,
  type CoverImageGenerationAction,
  validateOgCoverAssets,
} from "./og-cover-assets";

const isDryRun = process.argv.includes("--dry-run");

async function ensureFfmpeg() {
  try {
    await $`ffmpeg -version`.quiet();
  } catch {
    console.error("ffmpeg is required to generate OG cover image pairs.");
    console.error("Install it locally, then rerun: bun docs:images:og:generate");
    process.exit(1);
  }
}

async function generateAction(action: CoverImageGenerationAction) {
  mkdirSync(path.dirname(action.targetFilePath), { recursive: true });

  if (action.targetFormat === "webp") {
    await $`ffmpeg -y -i ${action.sourceFilePath} -c:v libwebp -lossless 1 -compression_level 6 -q:v 100 -pix_fmt bgra ${action.targetFilePath}`.quiet();
    return;
  }

  await $`ffmpeg -y -i ${action.sourceFilePath} -frames:v 1 ${action.targetFilePath}`.quiet();
}

const plan = planOgCoverAssetGeneration();
console.log(formatGenerationPlan(plan));

if (plan.errors.length > 0) {
  process.exit(1);
}

if (isDryRun || plan.actions.length === 0) {
  process.exit(0);
}

await ensureFfmpeg();

for (const action of plan.actions) {
  await generateAction(action);
}

const result = validateOgCoverAssets();
console.log(formatValidationResult(result));

if (result.errors.length > 0) {
  process.exit(1);
}
