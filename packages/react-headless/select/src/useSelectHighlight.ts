import { useTypeahead, type FloatingContext } from "@floating-ui/react";
import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import {
  findEnabledIndex,
  findFirstEnabledIndex,
  findLastEnabledIndex,
  findSelectedIndex,
  getOptionValue,
  isDisabledElement,
} from "./dom";
import type { SelectOpenChangeDetails } from "./useSelect";

export interface UseSelectHighlightProps {
  open: boolean;
  interactive: boolean;
  multiple: boolean;
  value: string[];
  floatingContext: FloatingContext;
  setOpen: (open: boolean, details?: SelectOpenChangeDetails) => void;
  setValue: (value: string[]) => void;
  selectValue: (optionValue: string, event?: MouseEvent | KeyboardEvent) => void;
}

// Owns the single highlight shared by keyboard navigation, typeahead and hover,
// plus the key handling that moves it. Selection itself stays with the root: this
// hook only calls back into it once a key commits.
export function useSelectHighlight(props: UseSelectHighlightProps) {
  const { open, interactive, multiple, value, floatingContext } = props;
  const { setOpen, setValue, selectValue } = props;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);

  // Items register in layout effects after render, so rendered elements (their
  // `data-value`) are the reliable source for the selected position at any time.
  const selectedIndex = findSelectedIndex(elementsRef.current, value);

  // Closing clears the highlight so it can never leak into the next open.
  useEffect(() => {
    if (!open) setActiveIndex(null);
  }, [open]);

  // Opening reveals the current position: the seeded highlight if a keyboard
  // open placed one, otherwise the selected option (pointer opens seed no
  // highlight). Deferred a frame because at open time the content is still
  // display:none — scrollIntoView inside a hidden subtree is a no-op, and
  // hiding also dropped the previous open's scroll position — so the seeding
  // path's synchronous scroll (highlightWithKeyboard) cannot cover the open
  // transition itself.
  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      const elements = elementsRef.current;
      const target =
        elements.find((element) => element?.hasAttribute("data-highlighted")) ??
        elements.find((element) => element?.hasAttribute("data-selected"));
      target?.scrollIntoView?.({ block: "nearest" });
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  const highlightWithKeyboard = (index: number | null) => {
    setActiveIndex(index);
    if (index == null) return;

    // Keyboard-highlighted options must stay visible; hover must not scroll.
    elementsRef.current[index]?.scrollIntoView?.({ block: "nearest" });
  };

  // Keyboard opens seed the highlight: the (first, in DOM order) selected option
  // if one exists, otherwise the first enabled option. Pointer opens seed nothing
  // (mobile-first: a pre-seeded highlight under a finger reads as a stuck pressed
  // state), so this also serves the first Arrow press after a pointer open.
  const getKeyboardSeedIndex = () => {
    const elements = elementsRef.current;
    return findSelectedIndex(elements, value) ?? findFirstEnabledIndex(elements);
  };

  const handleTypeaheadMatch = (index: number) => {
    if (open) {
      highlightWithKeyboard(index);
      return;
    }

    // Closed-trigger typeahead commits directly without opening (native
    // <select> parity). No highlight is written, so none can leak into the
    // next open.
    const optionValue = getOptionValue(elementsRef.current[index] ?? null);
    if (optionValue != null) setValue([optionValue]);
  };

  const typeahead = useTypeahead(floatingContext, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
    // Closed-trigger typeahead is single-select only (multiple is ambiguous)
    // and requires interactivity; while open it always tracks the highlight.
    enabled: open || (interactive && !multiple),
  });

  // Open-state key handling, shared by the content (which holds DOM focus
  // while open) and the trigger (an AT or programmatic focus may leave DOM
  // focus there — same keys must keep working).
  const handleOpenKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const { key } = event;

    switch (key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const elements = elementsRef.current;
        const nextIndex =
          activeIndex == null
            ? getKeyboardSeedIndex()
            : findEnabledIndex(elements, activeIndex, key === "ArrowDown" ? 1 : -1);
        if (nextIndex != null) highlightWithKeyboard(nextIndex);
        return;
      }
      case "Home":
      case "End": {
        event.preventDefault();
        const elements = elementsRef.current;
        const nextIndex =
          key === "Home" ? findFirstEnabledIndex(elements) : findLastEnabledIndex(elements);
        if (nextIndex != null) highlightWithKeyboard(nextIndex);
        return;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        if (activeIndex == null) {
          setOpen(false, { reason: "keyboardClose", event: event.nativeEvent });
          return;
        }

        const element = elementsRef.current[activeIndex] ?? null;
        if (isDisabledElement(element)) return;

        const optionValue = getOptionValue(element);
        if (optionValue != null) selectValue(optionValue, event.nativeEvent);
        return;
      }
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // An in-progress typeahead consumes Space as a search character by
    // preventing it (the typeahead handler runs first); user handlers merged
    // in front of this one get the same veto.
    if (event.defaultPrevented) return;
    if (!interactive) return;

    if (!open) {
      const { key } = event;
      if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Enter" && key !== " ") return;

      // preventDefault suppresses the native button activation click, so
      // keyboard opens never double-toggle through the click handler.
      event.preventDefault();
      setOpen(true, { reason: "trigger", event: event.nativeEvent });
      highlightWithKeyboard(getKeyboardSeedIndex());
      return;
    }

    handleOpenKeyDown(event);
  };

  const handleContentKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // Same typeahead Space veto as the trigger handler.
    if (event.defaultPrevented) return;
    if (!open) return;

    handleOpenKeyDown(event);
  };

  return {
    activeIndex,
    setActiveIndex,
    selectedIndex,

    elementsRef,
    labelsRef,

    /** Places the highlight where a keyboard open should leave it. */
    seedHighlight: () => highlightWithKeyboard(getKeyboardSeedIndex()),

    onTriggerKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      typeahead.reference?.onKeyDown?.(event);
      handleTriggerKeyDown(event);
    },

    onContentKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      typeahead.floating?.onKeyDown?.(event);
      handleContentKeyDown(event);
    },
  };
}
