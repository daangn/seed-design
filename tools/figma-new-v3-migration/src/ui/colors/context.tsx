import { useMigration } from "common/context/migration";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { events } from "shared/event";
import type { SerializedColorVariablesSuggestionsResults, SerializedVariable } from "shared/types";

export interface ListEntry {
  groupId: string;
  itemId?: string;
}

export interface Progress {
  total: number;
  left: number;
  percent: number;
}

interface CurrentlyViewing {
  group: SerializedColorVariablesSuggestionsResults[number];
  item?: SerializedColorVariablesSuggestionsResults[number]["consumers"][number];
}

interface ColorMigrationContext {
  results: SerializedColorVariablesSuggestionsResults | null;
  progress: Progress;
  currentlyViewing: CurrentlyViewing | null;
  hasAllItemsSelectedNewColorVariableId: boolean;
  setCurrentlyViewingEntryId: (entry: ListEntry) => void;
  applyColorVariable: (params: {
    oldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"];
    consumerNodeIds: SerializedColorVariablesSuggestionsResults[number]["consumers"][number]["node"]["id"][];
    variableId: SerializedVariable["id"];
  }) => void;
  requestSuggestions: () => void;
  selectedVariableId: string | null;
  setSelectedVariableId: (variableId: string | null) => void;
}

const ColorMigrationContext = createContext<ColorMigrationContext | null>(null);

export function getOldValueId(
  oldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"],
): string {
  if (oldValue.type === "style") {
    return oldValue.style.id;
  }
  if (oldValue.type === "variable") {
    return oldValue.variable.id;
  }
  if (oldValue.type === "detached") {
    return `hex-${oldValue.hex}-${oldValue.opacity}`;
  }
  return "uncheckable";
}

function getSlashLastPart(name: string) {
  const parts = name.split("/");
  return parts[parts.length - 1];
}

export function getOldValueName(
  oldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"],
): string {
  if (oldValue.type === "style") {
    return getSlashLastPart(oldValue.style.name);
  }
  if (oldValue.type === "variable") {
    return getSlashLastPart(oldValue.variable.name);
  }
  if (oldValue.type === "detached") {
    return `#${oldValue.hex}`;
  }
  return "감지 불가능";
}

export function getOldValueType(
  oldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"],
): string {
  if (oldValue.type === "style") {
    return "스타일";
  }
  if (oldValue.type === "variable") {
    return "Variable";
  }
  if (oldValue.type === "detached") {
    return "Value";
  }
  return "감지 불가능";
}

function calculateProgress(results: SerializedColorVariablesSuggestionsResults): Progress {
  if (!results) {
    return {
      total: 0,
      left: 0,
      percent: 0,
    };
  }

  let total = 0;
  let done = 0;

  for (const result of results) {
    for (const consumer of result.consumers) {
      total += 1;
      if (consumer.selectedNewVariableId) {
        done += 1;
      }
    }
  }

  return {
    total,
    left: total - done,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function ColorMigrationProvider({ children }: { children: ReactNode }) {
  const { targets } = useMigration();
  const [results, setResults] = useState<SerializedColorVariablesSuggestionsResults | null>(null);
  const [currentlyViewingEntry, setCurrentlyViewingEntry] = useState<ListEntry | null>(null);
  const [selectedVariableId, setSelectedVariableId] = useState<string | null>(null);
  // progress 계산
  const progress = results ? calculateProgress(results) : { total: 0, left: 0, percent: 0 };

  // 모든 항목이 선택되었는지 확인
  const hasAllItemsSelectedNewColorVariableId = results
    ? results
        .flatMap(({ consumers }) => consumers)
        .every(({ selectedNewVariableId }) => selectedNewVariableId)
    : false;

  // 현재 보고 있는 항목 찾기
  let currentlyViewing: CurrentlyViewing | null = null;
  if (results && currentlyViewingEntry) {
    const group = results.find(
      ({ oldValue }) => getOldValueId(oldValue) === currentlyViewingEntry.groupId,
    );

    if (group) {
      if (!currentlyViewingEntry.itemId) {
        currentlyViewing = { group };
      } else {
        const item = group.consumers.find(({ node }) => node.id === currentlyViewingEntry.itemId);
        if (item) {
          currentlyViewing = { group, item };
        } else {
          currentlyViewing = { group };
        }
      }
    }
  }

  // 현재 보고 있는 항목 설정
  function setCurrentlyViewingEntryId(entry: ListEntry) {
    setCurrentlyViewingEntry(entry);
    setSelectedVariableId(null);
  }

  // 새로고침 요청
  function requestSuggestions() {
    setResults(null);
    events("request-color-suggestions").emit({
      nodeIds: targets.map(({ id }) => id),
    });
  }

  // 이벤트 구독
  useEffect(() => {
    const unsubscribe = events("suggest-color-variables").on((payload) => {
      console.log("suggest-color-variables", payload);
      setResults(payload.results);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    requestSuggestions();
  }, []);

  // 컬러 변수 적용
  function applyColorVariable({
    oldValue,
    consumerNodeIds,
    variableId,
  }: {
    oldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"];
    consumerNodeIds: SerializedColorVariablesSuggestionsResults[number]["consumers"][number]["node"]["id"][];
    variableId: SerializedVariable["id"];
  }) {
    setResults((prev) => {
      if (!prev) return prev;

      const oldValueFound = prev.find(
        ({ oldValue: oldValueToCompare }) =>
          getOldValueId(oldValue) === getOldValueId(oldValueToCompare),
      );
      if (!oldValueFound) return prev;

      const updatedConsumers = oldValueFound.consumers.map((consumer) => {
        if (consumerNodeIds.includes(consumer.node.id)) {
          return {
            ...consumer,
            selectedNewVariableId: variableId,
          };
        }

        return consumer;
      });

      return prev.map((group) =>
        getOldValueId(group.oldValue) === getOldValueId(oldValue)
          ? { ...group, consumers: updatedConsumers }
          : group,
      );
    });

    events("apply-color-variable").emit({
      variableId,
      consumerNodeIds,
      oldValue,
    });
  }

  // 컨텍스트 값
  const value = {
    results,
    progress,
    currentlyViewing,
    setCurrentlyViewingEntryId,
    applyColorVariable,
    hasAllItemsSelectedNewColorVariableId,
    requestSuggestions,
    selectedVariableId,
    setSelectedVariableId,
  };

  return <ColorMigrationContext.Provider value={value}>{children}</ColorMigrationContext.Provider>;
}

export function useColorMigration() {
  const context = useContext(ColorMigrationContext);
  if (!context) {
    throw new Error("useColorMigration must be used within a ColorMigrationProvider");
  }
  return context;
}
