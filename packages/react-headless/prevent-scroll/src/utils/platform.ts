// This code includes portions derived from adobe/react-spectrum (https://github.com/adobe/react-spectrum)
// Used under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
//
// Source: packages/react-aria/src/utils/platform.ts
// Trimmed to the iOS-detection subset that usePreventScroll needs. The upstream `userAgentData`
// branch is dropped: Safari/WebKit (the only engine where iOS detection matters here) does not
// expose `navigator.userAgentData`, so `navigator.platform` is the reliable signal.

function testPlatform(re: RegExp): boolean {
  return typeof window !== "undefined" && window.navigator != null
    ? re.test(window.navigator.platform)
    : false;
}

function cached(fn: () => boolean): () => boolean {
  let res: boolean | null = null;
  return () => {
    if (res == null) res = fn();
    return res;
  };
}

const isMac = cached(() => testPlatform(/^Mac/i));

const isIPhone = cached(() => testPlatform(/^iPhone/i));

const isIPad = cached(
  () =>
    testPlatform(/^iPad/i) ||
    // iPadOS 13+ reports as Mac; distinguish it by touch support.
    (isMac() && navigator.maxTouchPoints > 1),
);

export const isIOS: () => boolean = cached(() => isIPhone() || isIPad());
