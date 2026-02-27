export function isMobileFirefox(): boolean | undefined {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return (
    (/Firefox/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent)) ||
    /FxiOS/.test(navigator.userAgent)
  );
}

export function isMac(): boolean | undefined {
  return testPlatform(/^Mac/);
}

export function isIPhone(): boolean | undefined {
  return testPlatform(/^iPhone/);
}

export function isSafari(): boolean | undefined {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isIPad(): boolean | undefined {
  return (
    testPlatform(/^iPad/) ||
    // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
    (isMac() && navigator.maxTouchPoints > 1)
  );
}

export function isIOS(): boolean | undefined {
  return isIPhone() || isIPad();
}

export function isAndroid(): boolean | undefined {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  return /Android/.test(navigator.userAgent);
}

// TODO: use userAgent instead?
export function testPlatform(re: RegExp): boolean | undefined {
  return typeof window !== "undefined" && window.navigator != null
    ? re.test(window.navigator.platform)
    : undefined;
}
