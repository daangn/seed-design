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

/** 같은 컴포넌트의 예제는 bundle 하나를 공유하므로 `example` query로 렌더할 예제 ID를 넘긴다. */
export function createLynxExampleUrls(bundlePath: string, origin: string, example: string) {
  const native = new URL(bundlePath, origin);
  native.searchParams.set("example", example);
  native.searchParams.set("fullscreen", "true");
  return {
    native: native.href,
    qr: native.href,
    explorer: `lynx://open?url=${encodeURIComponent(native.href)}`,
    loopback: isLoopbackUrl(native),
  };
}
