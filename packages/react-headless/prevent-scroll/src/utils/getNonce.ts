// This code includes portions derived from adobe/react-spectrum (https://github.com/adobe/react-spectrum)
// Used under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
//
// Source: packages/react-aria/src/utils/getNonce.ts
// Simplified to the `<meta property="csp-nonce">` path (single document). The upstream
// `__webpack_nonce__` fallback and shadow-root owner-window handling are dropped.

/**
 * Returns the CSP nonce, if configured via a `<meta property="csp-nonce">` tag. This lets the
 * dynamically injected `<style>` element work under a Content Security Policy.
 */
export function getNonce(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const meta = document.querySelector('meta[property="csp-nonce"]');
  if (meta instanceof HTMLMetaElement) {
    return meta.nonce || meta.content || undefined;
  }
  return undefined;
}
