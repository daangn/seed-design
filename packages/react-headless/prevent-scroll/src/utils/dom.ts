// This code includes portions derived from adobe/react-spectrum (https://github.com/adobe/react-spectrum)
// Used under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
//
// Source: packages/react-aria/src/utils/shadowdom/DOMFunctions.ts
// Shadow DOM support is intentionally dropped here. Upstream routed these through a
// `shadowDOM()` flag that coupled react-aria to react-stately; we don't support shadow DOM,
// so these are plain `document.activeElement` / `event.target` wrappers. If shadow DOM support
// is ever needed, re-check the upstream shadowdom/DOMFunctions implementation.

export function getActiveElement(doc: Document = document): Element | null {
  return doc.activeElement;
}

export function getEventTarget(event: Event): EventTarget | null {
  return event.target;
}
