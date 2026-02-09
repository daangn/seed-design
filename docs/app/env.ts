export const env = {
  figmaFileKey: warnIfUndefined(
    process.env.FIGMA_FILE_KEY,
    "Missing environment variable: FIGMA_FILE_KEY, continuing build without Figma integration...",
  ),
  figmaPersonalAccessToken: warnIfUndefined(
    process.env.FIGMA_PERSONAL_ACCESS_TOKEN,
    "Missing environment variable: FIGMA_PERSONAL_ACCESS_TOKEN, continuing build without Figma integration...",
  ),
  figmaCacheDisabled: process.env.FIGMA_CACHE_DISABLED === "1",
};

function warnIfUndefined<T>(v: T | undefined, warningMessage: string): T | undefined {
  if (v === undefined) {
    console.warn(warningMessage);
  }

  return v;
}
