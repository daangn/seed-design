import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useId, useState } from "react";
import { getDescriptionId, getErrorMessageId } from "./dom";
import type { DisplayItemEntry, DisplayItemStatusDetails } from "./types";

interface UseAttachmentDisplayStateProps {
  entries?: DisplayItemEntry[];
  defaultEntries?: DisplayItemEntry[];
  onEntriesChange?: (entries: DisplayItemEntry[]) => void;
}

function useAttachmentDisplayState(props: UseAttachmentDisplayStateProps) {
  const [entries, setEntries] = useControllableState<DisplayItemEntry[]>({
    prop: props.entries,
    defaultProp: props.defaultEntries ?? [],
    onChange: (next) => {
      props.onEntriesChange?.(next);
    },
  });

  return {
    entries: entries ?? [],
    setEntries,
  };
}

export interface UseAttachmentDisplayProps extends UseAttachmentDisplayStateProps {
  /**
   * @default false
   */
  disabled?: boolean;
  /**
   * @default false
   */
  invalid?: boolean;
  /**
   * @default false
   */
  readOnly?: boolean;
  /**
   * @default 1
   */
  maxEntries?: number;
}

export type UseAttachmentDisplayReturn = ReturnType<typeof useAttachmentDisplay>;

export function useAttachmentDisplay({
  disabled = false,
  invalid = false,
  readOnly = false,
  maxEntries = 1,
  ...props
}: UseAttachmentDisplayProps = {}) {
  const id = useId();
  const { entries, setEntries } = useAttachmentDisplayState(props);

  const [isDescriptionRendered, setIsDescriptionRendered] = useState(false);
  const descriptionRef = useCallback((node: HTMLElement | null) => {
    setIsDescriptionRendered(!!node);
  }, []);
  const [isErrorMessageRendered, setIsErrorMessageRendered] = useState(false);
  const errorMessageRef = useCallback((node: HTMLElement | null) => {
    setIsErrorMessageRendered(!!node);
  }, []);

  const ariaDescribedBy =
    [
      isDescriptionRendered ? getDescriptionId(id) : false,
      isErrorMessageRendered ? getErrorMessageId(id) : false,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const multiple = maxEntries > 1;
  const maxEntriesReached = entries.length >= maxEntries;
  const triggerDisabled = disabled || maxEntriesReached || readOnly;

  // Append new entries from an external source (e.g. native media picker callback).
  // Silently drops anything beyond `maxEntries` — there is no reject callback because
  // external pickers should already cap their selection (e.g. `maxMediaCount`).
  const addEntries = useCallback(
    (incoming: DisplayItemEntry[]) => {
      if (disabled || readOnly) return;
      if (incoming.length === 0) return;

      setEntries((prev) => {
        const current = prev ?? [];
        if (!multiple) return [incoming[0]];

        const room = maxEntries - current.length;
        if (room <= 0) return current;

        return [...current, ...incoming.slice(0, room)];
      });
    },
    [disabled, readOnly, multiple, maxEntries, setEntries],
  );

  // Root `disabled` intentionally does NOT block removal — disabled trigger should still allow
  // pruning what's already displayed. Root `readOnly` does block it: readOnly preserves the value.
  const removeEntry = useCallback(
    (id: string) => {
      if (readOnly) return;
      setEntries((prev) => (prev ?? []).filter((entry) => entry.id !== id));
    },
    [readOnly, setEntries],
  );

  const clearEntries = useCallback(() => {
    if (readOnly) return;
    setEntries([]);
  }, [readOnly, setEntries]);

  const reorderEntry = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled || readOnly) return;
      setEntries((prev) => {
        const next = [...(prev ?? [])];
        if (fromIndex < 0 || fromIndex >= next.length) return prev;
        if (toIndex < 0 || toIndex >= next.length) return prev;
        if (fromIndex === toIndex) return prev;

        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);

        return next;
      });
    },
    [disabled, readOnly, setEntries],
  );

  // Status push from external systems (upload subscriptions, retries, etc.).
  // Intentionally not gated by `disabled`/`readOnly` — those guard user input, not external events.
  // Wholesale-replaces the status detail so fields from previous variants (e.g. `progress` on
  // "uploading") don't leak across to the new variant of the discriminated union.
  const updateEntryStatus = useCallback(
    (id: string, details: DisplayItemStatusDetails) => {
      setEntries((prev) =>
        (prev ?? []).map((entry) =>
          entry.id === id ? { id: entry.id, thumbnailUrl: entry.thumbnailUrl, ...details } : entry,
        ),
      );
    },
    [setEntries],
  );

  const stateProps = elementProps({
    "data-disabled": dataAttr(triggerDisabled),
    "data-readonly": dataAttr(readOnly),
    "data-invalid": dataAttr(invalid),
  });

  return {
    entries,
    disabled,
    invalid,
    readOnly,
    maxEntries,
    currentEntryCount: entries.length,

    addEntries,
    removeEntry,
    reorderEntry,
    clearEntries,
    updateEntryStatus,

    refs: {
      description: descriptionRef,
      errorMessage: errorMessageRef,
    },

    stateProps,

    triggerProps: buttonProps({
      ...stateProps,
      type: "button",
      disabled: triggerDisabled,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaAttr(invalid),
    }) as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,

    descriptionProps: elementProps({
      ...stateProps,
      id: getDescriptionId(id),
    }),

    errorMessageProps: elementProps({
      ...stateProps,
      id: getErrorMessageId(id),
      "aria-live": "polite",
    }),
  };
}
