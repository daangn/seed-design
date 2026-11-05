#!/usr/bin/env bun

import { formatValidationResult, validateOgCoverAssets } from "./og-cover-assets";

const result = validateOgCoverAssets();
console.log(formatValidationResult(result));

if (result.errors.length > 0) {
  process.exit(1);
}
