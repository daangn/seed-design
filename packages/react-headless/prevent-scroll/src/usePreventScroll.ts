// This code includes portions derived from adobe/react-spectrum (https://github.com/adobe/react-spectrum)
// Used under the Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
//
// Source: packages/react-aria/src/overlays/usePreventScroll.ts
// The mobile Safari (iOS) path is actively patched upstream across OS releases — re-check it
// against the source above when bumping iOS support, rather than treating it as frozen.

import { chain } from "./utils/chain";
import { getActiveElement, getEventTarget } from "./utils/dom";
import { getNonce } from "./utils/getNonce";
import { getScrollParent } from "./utils/getScrollParent";
import { isScrollable } from "./utils/isScrollable";
import { isIOS } from "./utils/platform";
import { useLayoutEffect } from "./utils/useLayoutEffect";
import { willOpenKeyboard } from "./utils/keyboard";

export interface PreventScrollOptions {
  /** Whether the scroll lock is disabled. */
  isDisabled?: boolean;
}

const visualViewport = typeof document !== "undefined" ? window.visualViewport : null;

// The number of active usePreventScroll calls. Used to determine whether to revert back to the
// original page style/scroll position. Nested modals share one lock via this refcount.
let preventScrollCount = 0;
let restore: (() => void) | undefined;

/**
 * Prevents scrolling on the document body on mount, and restores it on unmount. Also ensures
 * that content does not shift due to the scrollbars disappearing.
 */
export function usePreventScroll(options: PreventScrollOptions = {}): void {
  const { isDisabled } = options;

  useLayoutEffect(() => {
    if (isDisabled) return;

    preventScrollCount++;
    if (preventScrollCount === 1) {
      restore = isIOS() ? preventScrollMobileSafari() : preventScrollStandard();
    }

    return () => {
      preventScrollCount--;
      if (preventScrollCount === 0) {
        restore?.();
      }
    };
  }, [isDisabled]);
}

type ScrollLockStyleKey = "scrollbarGutter" | "paddingRight" | "overflow";

// Sets a CSS property on an element, and returns a function to revert it to the previous value.
function setStyle(element: HTMLElement, key: ScrollLockStyleKey, value: string) {
  const prev = element.style[key];
  element.style[key] = value;

  return () => {
    element.style[key] = prev;
  };
}

// For most browsers, all we need to do is set `overflow: hidden` on the root element, and add
// some padding to prevent the page from shifting when the scrollbar is hidden.
function preventScrollStandard() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  return chain(
    scrollbarWidth > 0 &&
      // Use scrollbar-gutter when supported because it also works for fixed positioned elements.
      ("scrollbarGutter" in document.documentElement.style
        ? setStyle(document.documentElement, "scrollbarGutter", "stable")
        : setStyle(document.documentElement, "paddingRight", `${scrollbarWidth}px`)),
    setStyle(document.documentElement, "overflow", "hidden"),
  );
}

// Mobile Safari is a whole different beast. Even with overflow: hidden, it still scrolls the page
// in many situations:
//
// 1. When the bottom toolbar and address bar are collapsed, page scrolling is always allowed.
// 2. When the keyboard is visible, the viewport does not resize. Instead the keyboard covers part
//    of it, so it becomes scrollable.
// 3. When tapping on an input, the page always scrolls so that the input is centered in the visual
//    viewport. This may cause even fixed position elements to scroll off the screen.
// 4. When using the next/previous buttons in the keyboard to navigate between inputs, the whole
//    page always scrolls, even if the input is inside a nested scrollable element.
//
// To work around these cases and prevent scrolling without jankiness, we:
//
// 1. Prevent default on `touchmove` events that are not in a scrollable element. This prevents
//    touch scrolling on the window.
// 2. Set `overscroll-behavior: contain` on nested scrollable regions so they do not scroll the
//    page when at the top or bottom. Work around a bug where this does not work when the element
//    does not actually overflow by preventing default in a `touchmove` event.
// 3. Prevent default on `touchend` events on input elements and handle focusing the element.
// 4. When focus moves to an input, focus it without scrolling and scroll it into view manually,
//    without scrolling the whole page.
function preventScrollMobileSafari() {
  // Set overflow hidden so programmatic scrollIntoView only scrolls scroll parents instead of
  // moving the window.
  const restoreOverflow = setStyle(document.documentElement, "overflow", "hidden");

  let scrollable: Element | undefined;
  let allowTouchMove = false;

  const onTouchStart = (e: TouchEvent) => {
    // Store the nearest scrollable parent element from the element that the user touched.
    const target = getEventTarget(e) as Element;
    scrollable = isScrollable(target) ? target : getScrollParent(target, true);
    allowTouchMove = false;

    // If the target is selected, don't preventDefault in touchmove to allow adjusting the selection.
    const selection = target.ownerDocument.defaultView?.getSelection();
    if (selection && !selection.isCollapsed && selection.containsNode(target, true)) {
      allowTouchMove = true;
    }

    // If this is a range input, allow touch move to allow the user to adjust the slider value.
    if (e.composedPath().some((el) => el instanceof HTMLInputElement && el.type === "range")) {
      allowTouchMove = true;
    }

    // If this is a focused input element with a selected range, allow dragging the selection handles.
    if (
      (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) &&
      target.selectionStart != null &&
      target.selectionEnd != null &&
      target.selectionStart < target.selectionEnd &&
      target.ownerDocument.activeElement === target
    ) {
      allowTouchMove = true;
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    // Allow pinch-zooming.
    if (e.touches.length === 2 || allowTouchMove) return;

    // Prevent scrolling the window.
    if (!scrollable || scrollable === document.documentElement || scrollable === document.body) {
      e.preventDefault();
      return;
    }

    // overscroll-behavior should prevent scroll chaining, but currently does not if the element
    // doesn't actually overflow. https://bugs.webkit.org/show_bug.cgi?id=243452
    // Check both width and height so we don't block horizontal scrolling too.
    if (
      scrollable.scrollHeight === scrollable.clientHeight &&
      scrollable.scrollWidth === scrollable.clientWidth
    ) {
      e.preventDefault();
    }
  };

  const onBlur = (e: FocusEvent) => {
    const target = getEventTarget(e) as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget && willOpenKeyboard(relatedTarget)) {
      // Focus without scrolling the whole page, and then scroll into view manually.
      relatedTarget.focus({ preventScroll: true });
      scrollIntoViewWhenReady(relatedTarget, willOpenKeyboard(target));
    } else if (!relatedTarget) {
      // When tapping the Done button on the keyboard, focus moves to the body. FocusScope then
      // restores focus back to the input. Later, tapping the same input again fires no blur (it is
      // already focused), so the flow above never runs and Safari scrolls natively. Instead, move
      // focus to the parent focusable element (e.g. the dialog).
      const focusable = target.parentElement?.closest("[tabindex]");
      if (focusable instanceof HTMLElement) focusable.focus({ preventScroll: true });
    }
  };

  // Prevent scrolling up when at the top and down when at the bottom of a nested scrollable area,
  // otherwise mobile Safari starts scrolling the window. This must be applied before the touchstart
  // event as of iOS 26, so inject it as a <style> element.
  //
  // TODO: switch to a constructable CSSStyleSheet via document.adoptedStyleSheets once the minimum
  // supported version is Safari/iOS 16.4+ (where constructable stylesheets land). That also removes
  // the getNonce CSP handling below.
  const style = document.createElement("style");
  const nonce = getNonce();
  if (nonce) style.nonce = nonce;
  style.textContent = `
@layer {
  * {
    overscroll-behavior: contain;
  }
}`.trim();
  document.head.prepend(style);

  // Override programmatic focus to scroll into view without scrolling the whole page.
  const focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function focusWithoutScrolling(
    this: HTMLElement,
    opts?: FocusOptions,
  ) {
    // Track whether the keyboard was already visible before.
    const activeElement = getActiveElement();
    const wasKeyboardVisible = activeElement != null && willOpenKeyboard(activeElement);

    // Focus the element without scrolling the page.
    focus.call(this, { ...opts, preventScroll: true });

    if (!opts?.preventScroll) {
      scrollIntoViewWhenReady(this, wasKeyboardVisible);
    }
  };

  const removeEvents = chain(
    addEvent(document, "touchstart", onTouchStart, { passive: false, capture: true }),
    addEvent(document, "touchmove", onTouchMove, { passive: false, capture: true }),
    addEvent(document, "blur", onBlur, true),
  );

  return () => {
    restoreOverflow();
    removeEvents();
    style.remove();
    HTMLElement.prototype.focus = focus;
  };
}

// Adds an event listener to the document, and returns a function to remove it.
function addEvent<K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  target.addEventListener(event, handler as EventListener, options);
  return () => {
    target.removeEventListener(event, handler as EventListener, options);
  };
}

function scrollIntoViewWhenReady(target: Element, wasKeyboardVisible: boolean) {
  if (wasKeyboardVisible || !visualViewport) {
    // If the keyboard was already visible, scroll the target into view immediately.
    scrollIntoView(target);
  } else {
    // Otherwise, wait for the visual viewport to resize before scrolling so we can measure the
    // correct position to scroll to.
    visualViewport.addEventListener("resize", () => scrollIntoView(target), { once: true });
  }
}

function scrollIntoView(target: Element) {
  const root = document.scrollingElement ?? document.documentElement;
  let nextTarget: Element | null = target;
  while (nextTarget && nextTarget !== root) {
    // Find the parent scrollable element and adjust the scroll position if the target is not
    // already in view.
    const scrollable = getScrollParent(nextTarget);
    if (
      scrollable !== document.documentElement &&
      scrollable !== document.body &&
      scrollable !== nextTarget
    ) {
      const scrollableRect = scrollable.getBoundingClientRect();
      const targetRect = nextTarget.getBoundingClientRect();
      if (
        targetRect.top < scrollableRect.top ||
        targetRect.bottom > scrollableRect.top + nextTarget.clientHeight
      ) {
        let bottom = scrollableRect.bottom;
        if (visualViewport) {
          bottom = Math.min(bottom, visualViewport.offsetTop + visualViewport.height);
        }

        // Center within the viewport.
        const adjustment =
          targetRect.top -
          scrollableRect.top -
          ((bottom - scrollableRect.top) / 2 - targetRect.height / 2);
        scrollable.scrollTo({
          // Clamp to the valid range to prevent over-scrolling.
          top: Math.max(
            0,
            Math.min(
              scrollable.scrollHeight - scrollable.clientHeight,
              scrollable.scrollTop + adjustment,
            ),
          ),
          behavior: "smooth",
        });
      }
    }

    nextTarget = scrollable.parentElement;
  }
}
