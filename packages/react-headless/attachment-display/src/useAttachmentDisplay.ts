import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { dataAttr, elementProps, buttonProps } from "@seed-design/dom-utils";
import { useCallback } from "react";
import type { DisplayItemEntry, DisplayItemStatusDetails } from "./types";

interface UseAttachmentDisplayStateProps {
  items?: DisplayItemEntry[];
  defaultItems?: DisplayItemEntry[];
  onItemsChange?: (items: DisplayItemEntry[]) => void;
}

function useAttachmentDisplayState(props: UseAttachmentDisplayStateProps) {
  const [items, setItems] = useControllableState<DisplayItemEntry[]>({
    prop: props.items,
    defaultProp: props.defaultItems ?? [],
    onChange: (items) => {
      props.onItemsChange?.(items);
    },
  });

  return {
    items: items ?? [],
    setItems,
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
   * @default 1
   */
  maxItems?: number;

  onTriggerClick?: () => void;
}

export type UseAttachmentDisplayReturn = ReturnType<typeof useAttachmentDisplay>;

export function useAttachmentDisplay({
  disabled = false,
  invalid = false,
  maxItems = 1,
  onTriggerClick,
  ...props
}: UseAttachmentDisplayProps = {}) {
  const { items, setItems } = useAttachmentDisplayState(props);

  const maxItemsReached = items.length >= maxItems;
  const triggerDisabled = disabled || maxItemsReached;

  const addItems = useCallback(
    (newItems: DisplayItemEntry[]) => {
      if (disabled) return;

      setItems((prev) => {
        const current = prev ?? [];
        const remaining = maxItems - current.length;
        if (remaining <= 0) return prev;
        return [...current, ...newItems.slice(0, remaining)];
      });
    },
    [disabled, maxItems, setItems],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => (prev ?? []).filter((item) => item.id !== id));
    },
    [setItems],
  );

  const clearItems = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const reorderItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled) return;
      setItems((prev) => {
        const items = [...(prev ?? [])];
        if (fromIndex < 0 || fromIndex >= items.length) return prev;
        if (toIndex < 0 || toIndex >= items.length) return prev;
        const [removed] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, removed);
        return items;
      });
    },
    [disabled, setItems],
  );

  const updateItemStatus = useCallback(
    (id: string, details: DisplayItemStatusDetails) => {
      setItems((prev) =>
        (prev ?? []).map((item) => (item.id === id ? { ...item, ...details } : item)),
      );
    },
    [setItems],
  );

  const stateProps = elementProps({
    "data-disabled": dataAttr(triggerDisabled),
    "data-invalid": dataAttr(invalid),
  });

  return {
    items,
    disabled,
    invalid,
    maxItems,
    currentItemCount: items.length,

    addItems,
    removeItem,
    clearItems,
    reorderItem,
    updateItemStatus,

    stateProps,

    triggerProps: buttonProps({
      ...stateProps,
      type: "button",
      disabled: triggerDisabled,
      onClick: () => {
        if (triggerDisabled) return;
        onTriggerClick?.();
      },
    }) as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,

    getItemRemoveButtonProps: (id: string) =>
      buttonProps({
        type: "button",
        onClick: () => {
          removeItem(id);
        },
      }),
  };
}
