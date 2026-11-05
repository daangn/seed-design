import { useCallback, useMemo, useReducer, useRef, useState, type RefObject } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import { useFieldContext } from "@seed-design/lynx-react-field";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

export interface UseSegmentedTextInputProps {
  /**
   * 입력 Segment 순서대로 나열한 값입니다. 정적 Segment는 포함하지 않습니다.
   */
  value?: string[];
  /**
   * @default []
   */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /**
   * `FieldRoot` 안에서 생략하면 Field 값을 따릅니다.
   * @default false
   */
  required?: boolean;
  /**
   * `FieldRoot` 안에서 생략하면 Field 값을 따릅니다.
   * @default false
   */
  disabled?: boolean;
  /**
   * `FieldRoot` 안에서 생략하면 Field 값을 따릅니다.
   * @default false
   */
  readOnly?: boolean;
  /**
   * `FieldRoot` 안에서 생략하면 Field 값을 따릅니다.
   * @default false
   */
  invalid?: boolean;
}

/** 입력 Segment가 렌더링마다 Root에 알리는 설정입니다. 붙여넣기 분배와 focus 이동에 씁니다. */
export interface SegmentedTextInputSegmentEntry {
  length: number;
  masked: boolean;
  readOnly: boolean;
  focus: () => void;
}

export interface UseSegmentedTextInputReturn {
  /** Root native `<view>`의 ref입니다. 각 Segment가 키보드 회피의 입력 영역으로 씁니다. */
  rootRef: RefObject<NodesRef | null>;
  values: string[];
  /** 입력 Segment 중 하나라도 focus되어 있는지 여부입니다. `FieldRoot` 안에서는 Field에도 알립니다. */
  focused: boolean;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  /** 입력 Segment의 값 위치를 정합니다. 처음 렌더링한 순서대로 자리를 받습니다. */
  claimSegment: (key: object) => number;
  releaseSegment: (key: object) => void;
  getSegmentIndex: (key: object) => number;
  updateSegment: (key: object, entry: SegmentedTextInputSegmentEntry) => void;
  /** 여러 Segment의 값을 한 번에 바꿉니다. key는 입력 Segment의 순서입니다. */
  setSegmentValues: (updates: Record<number, string>) => void;
  /** `startIndex` Segment부터 `text`를 차례로 채우고, 다 채운 Segment 다음으로 focus를 옮깁니다. */
  distribute: (startIndex: number, text: string) => void;
  focusSegment: (index: number) => void;
  setSegmentFocused: (key: object, focused: boolean) => void;
}

/**
 * @platform Lynx
 *
 * SegmentedTextInput Root의 값·상태와 Segment 등록부를 만듭니다. 값은 입력 Segment 순서대로 나열한
 * `string[]`이고, Segment의 순서는 처음 렌더링한 순서입니다.
 */
export function useSegmentedTextInput(
  props: UseSegmentedTextInputProps,
): UseSegmentedTextInputReturn {
  const fieldContext = useFieldContext({ strict: false });
  const required = props.required ?? fieldContext?.required ?? false;
  const disabled = props.disabled ?? fieldContext?.disabled ?? false;
  const readOnly = props.readOnly ?? fieldContext?.readOnly ?? false;
  const invalid = props.invalid ?? fieldContext?.invalid ?? false;

  const [values, setValues] = useControllableState<string[]>({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: props.onValueChange,
  });
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const rootRef = useRef<NodesRef | null>(null);

  // Segment 사이로 focus가 옮겨 갈 때 blur와 focus가 따로 와도 focus 상태가 깜빡이지 않게 한다.
  const focusedKeysRef = useRef(new Set<object>());
  const [focused, setFocused] = useState(false);
  const fieldSetFocusedRef = useRef(fieldContext?.setFocused);
  fieldSetFocusedRef.current = fieldContext?.setFocused;

  const orderRef = useRef<object[]>([]);
  const entriesRef = useRef(new Map<object, SegmentedTextInputSegmentEntry>());
  const [, invalidateOrder] = useReducer((version: number) => version + 1, 0);

  const claimSegment = useCallback((key: object) => {
    const order = orderRef.current;
    if (!order.includes(key)) order.push(key);
    return order.indexOf(key);
  }, []);

  const releaseSegment = useCallback((key: object) => {
    orderRef.current = orderRef.current.filter((segmentKey) => segmentKey !== key);
    entriesRef.current.delete(key);
    // focus된 채 unmount된 Segment에는 blur가 오지 않을 수 있다.
    if (focusedKeysRef.current.delete(key) && focusedKeysRef.current.size === 0) {
      setFocused(false);
      fieldSetFocusedRef.current?.(false);
    }
    invalidateOrder();
  }, []);

  const getSegmentIndex = useCallback((key: object) => orderRef.current.indexOf(key), []);

  const updateSegment = useCallback((key: object, entry: SegmentedTextInputSegmentEntry) => {
    entriesRef.current.set(key, entry);
  }, []);

  const setSegmentValues = useCallback(
    (updates: Record<number, string>) => {
      "background only";

      const current = valuesRef.current;
      const count = Math.max(orderRef.current.length, current.length);
      const next = Array.from({ length: count }, (_, i) => updates[i] ?? current[i] ?? "");
      if (next.every((segmentValue, i) => segmentValue === (current[i] ?? ""))) return;

      valuesRef.current = next;
      setValues(next);
    },
    [setValues],
  );

  const focusSegment = useCallback((index: number) => {
    "background only";

    const key = orderRef.current[index];
    if (key) entriesRef.current.get(key)?.focus();
  }, []);

  const distribute = useCallback(
    (startIndex: number, text: string) => {
      "background only";

      const order = orderRef.current;
      const updates: Record<number, string> = {};
      let rest = text;
      let focusIndex = startIndex;

      for (let i = startIndex; i < order.length; i++) {
        const entry = entriesRef.current.get(order[i] as object);
        if (!entry) break;

        const chunk = rest.slice(0, entry.length);
        rest = rest.slice(entry.length);
        updates[i] = chunk;

        const next = entriesRef.current.get(order[i + 1] as object);
        const isFull = chunk.length === entry.length;
        focusIndex = isFull && next ? i + 1 : i;

        // masked·readOnly Segment는 붙여넣기로 채우지 않는다.
        if (!isFull || rest === "" || !next || next.masked || next.readOnly) break;
      }

      setSegmentValues(updates);
      if (focusIndex !== startIndex) focusSegment(focusIndex);
    },
    [focusSegment, setSegmentValues],
  );

  const setSegmentFocused = useCallback((key: object, segmentFocused: boolean) => {
    "background only";

    if (segmentFocused) {
      focusedKeysRef.current.add(key);
      setFocused(true);
      fieldSetFocusedRef.current?.(true);
      return;
    }

    focusedKeysRef.current.delete(key);
    setTimeout(() => {
      "background only";
      if (focusedKeysRef.current.size > 0) return;
      setFocused(false);
      fieldSetFocusedRef.current?.(false);
    }, 0);
  }, []);

  return useMemo<UseSegmentedTextInputReturn>(
    () => ({
      rootRef,
      values,
      focused,
      required,
      disabled,
      readOnly,
      invalid,
      claimSegment,
      releaseSegment,
      getSegmentIndex,
      updateSegment,
      setSegmentValues,
      distribute,
      focusSegment,
      setSegmentFocused,
    }),
    [
      values,
      focused,
      required,
      disabled,
      readOnly,
      invalid,
      claimSegment,
      releaseSegment,
      getSegmentIndex,
      updateSegment,
      setSegmentValues,
      distribute,
      focusSegment,
      setSegmentFocused,
    ],
  );
}
