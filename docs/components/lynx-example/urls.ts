export function configuredLynxBundleOrigin(value: string | undefined) {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value);
    if ((url.protocol === "http:" || url.protocol === "https:") && url.origin !== "null") {
      return url.origin;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function isLoopbackUrl(url: URL) {
  return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
}

export function createLynxExampleUrls(bundlePath: string, origin: string) {
  const native = new URL(bundlePath, origin);
  native.searchParams.set("fullscreen", "true");
  return {
    native: native.href,
    explorer: `lynx://open?url=${native.href}`,
    loopback: isLoopbackUrl(native),
  };
}
