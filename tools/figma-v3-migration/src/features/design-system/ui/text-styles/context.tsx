import { h } from "preact";
import type { PropsWithChildren } from "preact/compat";
import { createContext } from "preact";
import { useState, useMemo, useCallback, useContext, useEffect } from "preact/hooks";
import type {
  SerializedTextNode,
  SerializedTextStyle,
  GroupedSerializedTextStyleSuggestionsResults,
} from "@/features/design-system/types";
import { emit, on } from "@create-figma-plugin/utilities";
import type {
  ApplyTextStyleEventHandler,
  FocusNodeEventHandler,
  RequestTextStyleSuggestionsEventHandler,
  SuggestTextStylesEventHandler,
} from "@/features/design-system/types";
import { groupSerializedTextStyleSuggestionsResults } from "@/features/design-system/services/get-text-style-suggestions";
import { useMigration } from "@/features/design-system/ui/context";

export interface ListEntry {
  itemId?: string;
  groupId: string;
}

function useTextStyleMigrationState() {
  const { targets } = useMigration();
  const [results, setResults] = useState<GroupedSerializedTextStyleSuggestionsResults | null>(null);

  const [currentlyViewingEntryId, setCurrentlyViewingEntryId] = useState<ListEntry | null>(null);

  const hasAllItemsSelectedNewTextStyleId = useMemo(() => {
    // 로딩 중인 경우 done은 아님
    if (!results) return false;

    if (
      results
        .flatMap(({ items }) => items)
        .every(({ selectedNewTextStyleId }) => selectedNewTextStyleId)
    ) {
      return true;
    }
  }, [results]);

  const progress = useMemo(() => {
    if (!results)
      return {
        total: 0,
        selected: 0,
        left: 0,
        percent: 0,
      };

    const total = results.reduce((acc, { items }) => acc + items.length, 0);
    const selected = results.reduce(
      (acc, { items }) =>
        acc + items.filter(({ selectedNewTextStyleId }) => !!selectedNewTextStyleId).length,
      0,
    );

    return {
      total,
      selected,
      left: total - selected,
      percent: Math.round((selected / total) * 100),
    };
  }, [results]);

  const currentlyViewing = useMemo(() => {
    if (!currentlyViewingEntryId || !results) return null;

    const group = results.find(({ groupId }) => groupId === currentlyViewingEntryId.groupId);
    if (!group) return null;

    if (!currentlyViewingEntryId.itemId) return { group };

    const item = group.items.find(({ textNode: { id } }) => id === currentlyViewingEntryId.itemId);
    if (!item) return { group };

    return { item, group };
  }, [currentlyViewingEntryId, results]);

  const showNextListItemWithoutSelectedTextStyle = useCallback(() => {
    if (!results || !currentlyViewing?.item) return;

    const currentGroupIndex = results.findIndex(
      ({ groupId }) => groupId === currentlyViewing?.group?.groupId,
    );

    // should be unreachable
    if (currentGroupIndex === -1) return;

    const currentGroupItems = results[currentGroupIndex].items;

    const currentItemIndex = currentGroupItems.findIndex(
      ({ textNode }) => textNode.id === currentlyViewing.item?.textNode.id,
    );

    // 현재 그룹에서 다음 선택되지 않은 아이템 찾기
    const nextUnselectedItemIndex = currentGroupItems.findIndex(
      (item, index) => index > currentItemIndex && item.selectedNewTextStyleId === null,
    );

    // 현재 그룹에서 이후 선택 안 된 아이템이 있는 경우 해당 아이템 선택
    if (nextUnselectedItemIndex !== -1) {
      setCurrentlyViewingEntryId({
        groupId: currentlyViewing.group?.groupId,
        itemId: currentGroupItems[nextUnselectedItemIndex].textNode.id,
      });

      return;
    }

    // 현재 그룹에서 이후 선택 안 된 아이템이 없는 경우 다음 그룹에서 선택 안 된 아이템 찾기
    for (let i = currentGroupIndex + 1; i < results.length; i++) {
      const groupId = results[i].groupId;
      const groupItems = results[i].items;

      const unselectedItemIndex = groupItems.findIndex(
        (item) => item.selectedNewTextStyleId === null,
      );

      if (unselectedItemIndex !== -1) {
        setCurrentlyViewingEntryId({
          groupId: groupId,
          itemId: groupItems[unselectedItemIndex].textNode.id,
        });

        break;
      }
    }
  }, [results, currentlyViewing]);

  const showNextListGroupWithoutSelectedTextStyle = useCallback(() => {
    if (!results || !currentlyViewing?.group) return;

    const currentGroupIndex = results.findIndex(
      ({ groupId }) => groupId === currentlyViewing.group?.groupId,
    );

    // should be unreachable
    if (currentGroupIndex === -1) return;

    for (let i = currentGroupIndex + 1; i < results.length; i++) {
      const groupId = results[i].groupId;
      const groupItems = results[i].items;

      if (groupItems.some((item) => item.selectedNewTextStyleId === null)) {
        setCurrentlyViewingEntryId({ groupId: groupId });

        break;
      }
    }
  }, [results, currentlyViewing]);

  const applyTextStyle = useCallback(
    async (textNodeIds: SerializedTextNode["id"][], textStyleId: SerializedTextStyle["id"]) => {
      setResults((prev) => {
        if (!prev) return prev;

        const flattenedItems = prev.flatMap(({ items }) => items);

        const updatedItems = flattenedItems.map((item) => {
          if (textNodeIds.includes(item.textNode.id)) {
            return {
              ...item,
              selectedNewTextStyleId: textStyleId,
            };
          }

          return item;
        });

        return groupSerializedTextStyleSuggestionsResults(updatedItems);
      });

      emit<ApplyTextStyleEventHandler>("APPLY_TEXT_STYLE", {
        textNodeIds,
        textStyleId,
      });
    },
    [],
  );

  const requestSuggestions = useCallback(() => {
    setResults(null);

    emit<RequestTextStyleSuggestionsEventHandler>("REQUEST_TEXT_STYLE_SUGGESTIONS", {
      nodeIds: targets.map(({ id }) => id),
    });
  }, [targets]);

  useEffect(() => {
    requestSuggestions();
  }, [requestSuggestions]);

  useEffect(() => {
    on<SuggestTextStylesEventHandler>("SUGGEST_TEXT_STYLES", ({ results }) => {
      setResults(results);
      if (results.length === 0) return;

      setCurrentlyViewingEntryId({ groupId: results[0].groupId });

      const firstGroupNodeIds = results[0].items.map(({ textNode }) => textNode.id);

      emit<FocusNodeEventHandler>("FOCUS_NODE", { nodeIds: firstGroupNodeIds });
    });
  }, []);

  return {
    results,
    hasAllItemsSelectedNewTextStyleId,
    progress,
    setResults,
    currentlyViewing,
    setCurrentlyViewingEntryId,
    showNextListItemWithoutSelectedTextStyle,
    showNextListGroupWithoutSelectedTextStyle,
    applyTextStyle,
    requestSuggestions,
  };
}

const TextStyleMigrationStateContext = createContext<ReturnType<
  typeof useTextStyleMigrationState
> | null>(null);

export function TextStyleMigrationStateProvider({ children }: PropsWithChildren) {
  return (
    <TextStyleMigrationStateContext.Provider value={useTextStyleMigrationState()}>
      {children}
    </TextStyleMigrationStateContext.Provider>
  );
}

export function useTextStyleMigration() {
  const context = useContext(TextStyleMigrationStateContext);

  if (!context)
    throw new Error("useTextStyleMigration must be used within TextStyleMigrationStateProvider");

  return context;
}
