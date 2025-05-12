import { useMigration } from "common/context/migration";
import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { events } from "shared/event";
import type {
  GroupedSerializedTextStyleSuggestionsResults,
  SerializedTextNode,
  SerializedTextStyle,
  SerializedTextStyleSuggestionsResults,
} from "shared/types";

export interface ListEntry {
  groupId: string;
  itemId?: string;
}

export interface Progress {
  total: number;
  selected: number;
  left: number;
  percent: number;
}

interface CurrentlyViewing {
  group: GroupedSerializedTextStyleSuggestionsResults[number];
  item?: SerializedTextStyleSuggestionsResults[number];
}

interface TypographyMigrationContext {
  results: GroupedSerializedTextStyleSuggestionsResults | null;
  progress: Progress;
  currentlyViewing: CurrentlyViewing | null;
  hasAllItemsSelectedNewTextStyleId: boolean;
  setCurrentlyViewingEntryId: (entry: ListEntry) => void;
  applyTextStyle: (params: {
    textNodeIds: SerializedTextNode["id"][];
    textStyleId: SerializedTextStyle["id"];
  }) => void;
  requestSuggestions: () => void;
  selectedTextStyleId: string | null;
  setSelectedTextStyleId: (textStyleId: string | null) => void;
  setResults: React.Dispatch<
    React.SetStateAction<GroupedSerializedTextStyleSuggestionsResults | null>
  >;
}

const TypographyMigrationContext = createContext<TypographyMigrationContext | null>(null);

// Progress 계산 함수
function calculateProgress(results: GroupedSerializedTextStyleSuggestionsResults): Progress {
  if (!results) {
    return {
      total: 0,
      selected: 0,
      left: 0,
      percent: 0,
    };
  }

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
    percent: total === 0 ? 0 : Math.round((selected / total) * 100),
  };
}

export function TypographyMigrationProvider({ children }: { children: ReactNode }) {
  const { targets, setLoading } = useMigration();
  const [results, setResults] = useState<GroupedSerializedTextStyleSuggestionsResults | null>(null);
  const [currentlyViewingEntry, setCurrentlyViewingEntry] = useState<ListEntry | null>(null);
  const [selectedTextStyleId, setSelectedTextStyleId] = useState<string | null>(null);

  // progress 계산
  const progress = results
    ? calculateProgress(results)
    : { total: 0, selected: 0, left: 0, percent: 0 };

  // 모든 항목이 선택되었는지 확인
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
    return false;
  }, [results]);

  const currentlyViewing = useMemo(() => {
    if (!currentlyViewingEntry || !results) return null;

    const group = results.find(({ groupId }) => groupId === currentlyViewingEntry.groupId);
    if (!group) return null;

    if (!currentlyViewingEntry.itemId) return { group };

    const item = group.items.find(({ textNode: { id } }) => id === currentlyViewingEntry.itemId);
    if (!item) return { group };

    return { item, group };
  }, [currentlyViewingEntry, results]);

  // 현재 보고 있는 항목 설정
  function setCurrentlyViewingEntryId(entry: ListEntry) {
    setCurrentlyViewingEntry(entry);
    setSelectedTextStyleId(null);
  }

  // 새로고침 요청
  function requestSuggestions() {
    setResults(null);
    setLoading(true);
    events("request-text-style-suggestions").emit({
      nodeIds: targets.map(({ id }) => id),
    });
  }

  // 이벤트 구독
  useEffect(() => {
    const unsubscribe = events("suggest-text-styles").on((payload) => {
      setResults(payload.results);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 타이포그래피 적용
  function applyTextStyle({
    textNodeIds,
    textStyleId,
  }: {
    textNodeIds: SerializedTextNode["id"][];
    textStyleId: SerializedTextStyle["id"];
  }) {
    setResults((prev) => {
      if (!prev) return prev;

      return prev.map((group) => {
        const updatedItems = group.items.map((item) => {
          if (textNodeIds.includes(item.textNode.id)) {
            return {
              ...item,
              selectedNewTextStyleId: textStyleId,
            };
          }
          return item;
        });

        return {
          ...group,
          items: updatedItems,
        };
      });
    });

    events("apply-text-style").emit({
      textNodeIds,
      textStyleId,
    });
  }

  return (
    <TypographyMigrationContext.Provider
      value={{
        results,
        progress,
        currentlyViewing,
        hasAllItemsSelectedNewTextStyleId,
        setCurrentlyViewingEntryId,
        applyTextStyle,
        requestSuggestions,
        selectedTextStyleId,
        setSelectedTextStyleId,
        setResults,
      }}
    >
      {children}
    </TypographyMigrationContext.Provider>
  );
}

export function useTypographyMigration() {
  const context = useContext(TypographyMigrationContext);
  if (!context) {
    throw new Error("useTypographyMigration must be used within TypographyMigrationProvider");
  }
  return context;
}
