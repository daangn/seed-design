// Next static export requires nonempty params for legacy dynamic routes. They are compiled
// but not exported by the React archive, so only React MDX needs live Figma resolution.
export function needsArchiveFigmaImages(version: string, filePath: string): boolean {
  if (!version) return true;
  return /(?:^|[\\/])content[\\/]react[\\/]/.test(filePath);
}
