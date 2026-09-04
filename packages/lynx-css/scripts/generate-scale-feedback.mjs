import fs from "node:fs";
import path from "node:path";

import durationArtifact from "@seed-design/rootage-artifacts/duration";
import timingFunctionArtifact from "@seed-design/rootage-artifacts/timing-function";

const outputDirectory = path.join(import.meta.dirname, "..", "scale-feedback");

function getDefaultValue(artifact, tokenName) {
  const token = artifact.data.tokens[tokenName];

  if (!token) {
    throw new Error(`Unknown Rootage token: ${tokenName}`);
  }

  const value = token.values.default.value;

  if (typeof value === "string" && value.startsWith("$")) {
    return getDefaultValue(artifact, value);
  }

  return value;
}

function getDurationInMilliseconds(tokenName) {
  const duration = getDefaultValue(durationArtifact, tokenName);

  if (typeof duration !== "object" || duration === null) {
    throw new Error(`Expected ${tokenName} to resolve to a duration value.`);
  }

  if (duration.unit === "ms") return duration.value;
  if (duration.unit === "s") return duration.value * 1_000;

  throw new Error(`Unsupported duration unit for ${tokenName}: ${duration.unit}`);
}

function getCubicBezier(tokenName) {
  const value = getDefaultValue(timingFunctionArtifact, tokenName);

  if (!Array.isArray(value) || value.length !== 4) {
    throw new Error(`Expected ${tokenName} to resolve to four cubic-bezier points.`);
  }

  return `cubic-bezier(${value.join(", ")})`;
}

const feedbackScaleDuration = getDurationInMilliseconds("$duration.pressed-scale");
const feedbackScaleTimingFunction = getCubicBezier("$timing-function.pressed-scale");

const source = `// Generated from Rootage pressed-scale motion tokens. Do not edit directly.\nexport const feedbackScaleDuration = ${feedbackScaleDuration};\nexport const feedbackScaleTimingFunction = ${JSON.stringify(feedbackScaleTimingFunction)};\n`;

const types = `export declare const feedbackScaleDuration: ${feedbackScaleDuration};\nexport declare const feedbackScaleTimingFunction: ${JSON.stringify(feedbackScaleTimingFunction)};\n`;

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, "index.mjs"), source);
fs.writeFileSync(path.join(outputDirectory, "index.d.ts"), types);
