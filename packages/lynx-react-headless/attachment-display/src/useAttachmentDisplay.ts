import { useCallback, useMemo, useRef } from "@lynx-js/react";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import type { DisplayItemEntry, DisplayItemStatusDetails } from "./types.js";

export interface UseAttachmentDisplayProps {
  /** controlled 항목 목록입니다. 변경은 `onEntriesChange`로 알리고 부모 값을 그대로 표시합니다. */
  entries?: DisplayItemEntry[];
  /** uncontrolled 초기 항목 목록입니다. */
  defaultEntries?: DisplayItemEntry[];
  /** 항목 목록이 실제로 바뀔 때만 호출합니다. 아무것도 바뀌지 않는 동작에서는 호출하지 않습니다. */
  onEntriesChange?: (entries: DisplayItemEntry[]) => void;
  /**
   * 추가·순서 변경을 막습니다. 상태 갱신과 삭제·정리는 막지 않습니다.
   * @default false
   */
  disabled?: boolean;
  /** @default false */
  invalid?: boolean;
  /**
   * 추가·삭제·정리·순서 변경을 막습니다. 상태 갱신은 막지 않습니다.
   * @default false
   */
  readOnly?: boolean;
  /** @default false */
  required?: boolean;
  /**
   * 최대 항목 수입니다. 1 이하이면 `addEntries`가 목록을 첫 항목 하나로 바꿉니다.
   * 0 이하 값을 1로 보정하지 않으며, 이때 Trigger는 항상 비활성입니다.
   * @default 1
   */
  maxEntries?: number;
}

export interface UseAttachmentDisplayReturn {
  entries: DisplayItemEntry[];
  currentEntryCount: number;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  required: boolean;
  maxEntries: number;
  /** `disabled`·`readOnly`이거나 항목 수가 `maxEntries`에 도달하면 `true`입니다. */
  triggerDisabled: boolean;
  /** Root와 Root 하위 파트에 붙이는 상태 속성입니다. `data-disabled`는 Root `disabled`만 반영합니다. */
  stateProps: {
    "data-disabled": boolean;
    "data-readonly": boolean;
    "data-invalid": boolean;
    "data-required": boolean;
  };
  /**
   * 외부 picker가 반환한 항목을 추가합니다. `disabled`·`readOnly`이거나 빈 배열이면 무시합니다.
   * `maxEntries`가 1 이하이면 첫 항목으로 목록을 바꾸고, 그 밖에는 남은 자리만큼만 뒤에 붙입니다.
   */
  addEntries: (entries: DisplayItemEntry[]) => void;
  /** `readOnly`이면 무시합니다. `disabled`에서는 삭제합니다. */
  removeEntry: (id: string) => void;
  /** `disabled`·`readOnly`이거나 범위 밖·같은 index이면 무시합니다. */
  reorderEntry: (fromIndex: number, toIndex: number) => void;
  /** `readOnly`이면 무시합니다. `disabled`에서는 정리합니다. */
  clearEntries: () => void;
  /**
   * 업로드 구독·재시도처럼 외부 이벤트로 상태를 바꿉니다. `disabled`·`readOnly`와 관계없이 반영합니다.
   * 이전 상태의 `progress`가 남지 않도록 상태 정보를 통째로 바꾸고 metadata는 유지합니다.
   */
  updateEntryStatus: (id: string, details: DisplayItemStatusDetails) => void;
}

/**
 * @platform Lynx
 *
 * 원격 첨부 목록의 controlled·uncontrolled 상태와 추가·삭제·순서·상태 갱신 동작을 관리합니다.
 * 동작은 최신 목록을 기준으로 하므로 비동기 picker·업로드 callback에서 호출해도 이전 목록으로 덮어쓰지 않습니다.
 */
export function useAttachmentDisplay(
  props: UseAttachmentDisplayProps = {},
): UseAttachmentDisplayReturn {
  const {
    entries: value,
    defaultEntries,
    onEntriesChange,
    disabled = false,
    invalid = false,
    readOnly = false,
    required = false,
    maxEntries = 1,
  } = props;
  const [controllableEntries, setEntries] = useControllableState<DisplayItemEntry[]>({
    value,
    defaultValue: defaultEntries ?? [],
    onChange: onEntriesChange,
  });
  const entries = controllableEntries ?? [];
  const entriesRef = useRef(entries);
  entriesRef.current = entries;
  const optionsRef = useRef({ disabled, readOnly, maxEntries });
  optionsRef.current = { disabled, readOnly, maxEntries };
  const triggerDisabled = disabled || readOnly || entries.length >= maxEntries;

  const commit = useCallback(
    (next: DisplayItemEntry[]) => {
      "background only";
      entriesRef.current = next;
      setEntries(next);
    },
    [setEntries],
  );

  const addEntries = useCallback(
    (incoming: DisplayItemEntry[]) => {
      "background only";
      const options = optionsRef.current;
      if (options.disabled || options.readOnly || incoming.length === 0) return;
      if (options.maxEntries <= 1) {
        commit([incoming[0]]);
        return;
      }
      const current = entriesRef.current;
      const room = options.maxEntries - current.length;
      if (room <= 0) return;
      commit([...current, ...incoming.slice(0, room)]);
    },
    [commit],
  );

  const removeEntry = useCallback(
    (id: string) => {
      "background only";
      if (optionsRef.current.readOnly) return;
      commit(entriesRef.current.filter((entry) => entry.id !== id));
    },
    [commit],
  );

  const clearEntries = useCallback(() => {
    "background only";
    if (optionsRef.current.readOnly) return;
    commit([]);
  }, [commit]);

  const reorderEntry = useCallback(
    (fromIndex: number, toIndex: number) => {
      "background only";
      const options = optionsRef.current;
      if (options.disabled || options.readOnly) return;
      const current = entriesRef.current;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= current.length ||
        toIndex >= current.length ||
        fromIndex === toIndex
      ) {
        return;
      }
      const next = [...current];
      const [entry] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, entry);
      commit(next);
    },
    [commit],
  );

  const updateEntryStatus = useCallback(
    (id: string, details: DisplayItemStatusDetails) => {
      "background only";
      commit(
        entriesRef.current.map((entry) => {
          if (entry.id !== id) return entry;
          const metadata = {
            id: entry.id,
            thumbnailUrl: entry.thumbnailUrl,
            name: entry.name,
            type: entry.type,
            size: entry.size,
          };
          return details.status === "uploading"
            ? { ...metadata, status: details.status, progress: details.progress }
            : { ...metadata, status: details.status };
        }),
      );
    },
    [commit],
  );

  return useMemo<UseAttachmentDisplayReturn>(
    () => ({
      entries,
      currentEntryCount: entries.length,
      disabled,
      invalid,
      readOnly,
      required,
      maxEntries,
      triggerDisabled,
      stateProps: {
        "data-disabled": disabled,
        "data-readonly": readOnly,
        "data-invalid": invalid,
        "data-required": required,
      },
      addEntries,
      removeEntry,
      reorderEntry,
      clearEntries,
      updateEntryStatus,
    }),
    [
      entries,
      disabled,
      invalid,
      readOnly,
      required,
      maxEntries,
      triggerDisabled,
      addEntries,
      removeEntry,
      reorderEntry,
      clearEntries,
      updateEntryStatus,
    ],
  );
}
