import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useControllableState } from "@seed-design/react-use-controllable-state";
import { useCallback, useId, useReducer, useRef, useState } from "react";
import { getRootId, getSegmentElements } from "./dom";

export interface UseSegmentedTextInputProps {
  /**
   * 입력 Segment 순서대로 나열한 값. 정적 Segment는 포함하지 않는다.
   */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /**
   * @default false
   */
  disabled?: boolean;
  /**
   * @default false
   */
  readOnly?: boolean;
  /**
   * @default false
   */
  invalid?: boolean;
  /**
   * @default false
   */
  required?: boolean;
}

interface SegmentConfig {
  length: number;
}

export type UseSegmentedTextInputReturn = ReturnType<typeof useSegmentedTextInput>;

export function useSegmentedTextInput(props: UseSegmentedTextInputProps) {
  const id = useId();
  const rootId = getRootId(id);
  const {
    value: propValue,
    defaultValue,
    onValueChange,
    disabled = false,
    readOnly = false,
    invalid = false,
    required = false,
  } = props;

  const [values, setValues] = useControllableState<string[]>({
    prop: propValue,
    defaultProp: defaultValue ?? [],
    onChange: (next) => onValueChange?.(next),
    caller: "SegmentedTextInput",
  });
  const [focused, setFocused] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const segmentConfigs = useRef(new Map<string, SegmentConfig>());

  // Segment의 값 위치는 DOM 순서로 정한다. Segment가 붙거나 떨어지면 다시 센다.
  const [segmentIds, setSegmentIds] = useState<string[]>([]);
  const [segmentsVersion, invalidateSegments] = useReducer((version: number) => version + 1, 0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: recount when segments mount or unmount
  useLayoutEffect(() => {
    const ids = getSegmentElements(rootRef.current, rootId).map((el) => el.dataset["segmentId"]);
    setSegmentIds((prev) =>
      prev.length === ids.length && prev.every((segmentId, i) => segmentId === ids[i])
        ? prev
        : (ids as string[]),
    );
  }, [rootId, segmentsVersion]);

  const registerSegment = useCallback((segmentId: string, config: SegmentConfig) => {
    segmentConfigs.current.set(segmentId, config);
    invalidateSegments();

    return () => {
      segmentConfigs.current.delete(segmentId);
      invalidateSegments();
    };
  }, []);

  const getSegmentLength = useCallback(
    (el: HTMLInputElement) =>
      segmentConfigs.current.get(el.dataset["segmentId"] ?? "")?.length ?? 0,
    [],
  );

  const getSegments = useCallback(() => getSegmentElements(rootRef.current, rootId), [rootId]);

  /**
   * 여러 Segment의 값을 한 번에 바꾼다. key는 입력 Segment의 순서다.
   */
  const setSegmentValues = useCallback(
    (updates: Record<number, string>) => {
      const count = Math.max(segmentIds.length, values.length);
      const next = Array.from({ length: count }, (_, i) => updates[i] ?? values[i] ?? "");

      if (next.every((segmentValue, i) => segmentValue === values[i])) return;

      setValues(next);
    },
    [segmentIds.length, values, setValues],
  );

  const stateProps = elementProps({
    "data-focus": dataAttr(focused),
    "data-disabled": dataAttr(disabled),
    "data-readonly": dataAttr(readOnly),
    "data-invalid": dataAttr(invalid),
  });

  return {
    rootId,
    rootRef,
    values,
    segmentIds,
    focused,
    disabled,
    readOnly,
    invalid,
    required,

    registerSegment,
    getSegments,
    getSegmentLength,
    setSegmentValues,

    stateProps,

    rootProps: elementProps({
      ...stateProps,
      role: "group",
      onFocus() {
        setFocused(true);
      },
      onBlur(event) {
        // Segment 사이로 focus가 옮겨 갈 때는 focus 상태를 유지한다.
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setFocused(false);
      },
    }),
  };
}
