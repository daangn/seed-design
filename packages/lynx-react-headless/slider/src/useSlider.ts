import { getRectByRef } from "@lynx-js/lynx-ui-common";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import {
  clampRatio,
  eventPageX,
  geometryFromRect,
  getStickyLabelOffset,
  getThumbInBoundsOffset,
  hasMinimumSteps,
  nearestValueIndex,
  normalizeValue,
  normalizeValues,
  percentageForValue,
  thumbOffsetRatio,
  valueForPercentage,
} from "./utils.js";

type ViewProps = IntrinsicElements["view"];
type LayoutChangeHandler = NonNullable<ViewProps["bindlayoutchange"]>;
type LayoutChangeEvent = Parameters<LayoutChangeHandler>[0];
type TouchHandler = NonNullable<ViewProps["catchtouchstart"]>;
type NodeRefCallback = (node: NodesRef | null) => void;

const DEFAULT_CONSUME_SLIDE_EVENT: ViewProps["consume-slide-event"] = [
  [-180, -135],
  [-45, 45],
  [135, 180],
];

function getLayoutWidth(event: LayoutChangeEvent): number | null {
  const eventWithWidth = event as LayoutChangeEvent & { width?: number };
  const nextWidth = event.detail?.width ?? event.params?.width ?? eventWithWidth.width;
  if (typeof nextWidth !== "number" || !Number.isFinite(nextWidth)) return null;
  return Math.max(0, nextWidth);
}

function defaultGetValueIndicatorLabel({ value }: { value: number }): ReactNode {
  return String(value);
}

export interface UseSliderProps {
  /** 제어 상태에서 thumb별 값을 지정합니다. 값의 개수가 thumb 개수입니다. */
  values?: number[];
  /**
   * 비제어 상태에서 thumb별 초기 값을 지정합니다.
   * @default [(min + max) / 2]
   */
  defaultValues?: number[];
  /** drag 중 값이 바뀔 때마다 호출됩니다. touch move는 frame마다 한 번으로 병합됩니다. */
  onValuesChange?: (values: number[]) => void;
  /** 값을 바꾼 drag의 touch release에서 한 번 호출됩니다. touch cancel에서는 호출되지 않습니다. */
  onValuesCommit?: (values: number[]) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** thumb이 가질 수 있는 값입니다. 지정하면 `step`과 `minStepsBetweenThumbs`보다 우선합니다. */
  allowedValues?: number[];
  /**
   * 인접한 thumb 사이에 유지할 최소 step 수입니다.
   * @default 0
   */
  minStepsBetweenThumbs?: number;
  /**
   * 값이 증가하는 방향입니다. `"rtl"`이면 오른쪽 끝이 `min`입니다.
   * @default "ltr"
   */
  dir?: "ltr" | "rtl";
  /** @default false */
  disabled?: boolean;
  /** 값을 표시하되 변경할 수 없도록 합니다. @default false */
  readOnly?: boolean;
  /** @default false */
  invalid?: boolean;
  /** thumb의 `accessibility-label`을 반환합니다. */
  getAccessibilityLabel?: (thumbIndex: number) => string;
  /**
   * thumb의 `accessibility-value`를 반환합니다.
   * @default `minimum ${min}, maximum ${max}, current ${value}`
   */
  getAccessibilityValueText?: (value: number, thumbIndex: number) => string;
  /**
   * Value Indicator에 표시할 내용을 반환합니다.
   * @default ({ value }) => String(value)
   */
  getValueIndicatorLabel?: (params: { value: number; thumbIndex: number }) => ReactNode;
  /**
   * Value Indicator를 표시할 조건입니다. Lynx에는 hover·focus가 없어 `"auto"`는 `"active"`와 같습니다.
   * @default "auto"
   */
  valueIndicatorTrigger?: "auto" | "active";
}

export interface UseSliderRootProps {
  "consume-slide-event": ViewProps["consume-slide-event"];
  catchtouchstart: TouchHandler;
  catchtouchmove: TouchHandler;
  catchtouchend: TouchHandler;
  catchtouchcancel: TouchHandler;
  bindlayoutchange: LayoutChangeHandler;
}

export interface UseSliderThumbProps {
  "accessibility-element": true;
  "accessibility-label": string | undefined;
  "accessibility-role-description": "adjustable";
  "accessibility-value": string;
  "accessibility-traits": "disabled" | undefined;
  style: CSSProperties;
  bindtouchstart: TouchHandler;
}

export interface UseSliderDecorationProps {
  style: CSSProperties;
  "accessibility-elements-hidden": true;
}

export interface UseSliderValueIndicatorProps {
  /** thumb을 조작하는 동안 표시해야 하면 `true`입니다. disabled·readOnly에서는 항상 `false`입니다. */
  isShown: boolean;
  /** 위치 변수(`--slider-value-indicator-*`, `--slider-thumb-offset`)와 폭 측정 handler입니다. */
  rootProps: UseSliderDecorationProps & { bindlayoutchange: LayoutChangeHandler };
  rootRef: NodeRefCallback;
  labelProps: { children: ReactNode };
}

export interface UseSliderReturn {
  values: number[];
  min: number;
  max: number;
  step: number;
  dir: "ltr" | "rtl";
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  isDragging: boolean;
  /** drag 중인 thumb의 index입니다. drag 중이 아니면 `null`입니다. */
  activeThumbIndex: number | null;
  /** Value Indicator가 한 번이라도 표시되었으면 `true`입니다. 첫 표시 전 transition을 끄는 데 씁니다. */
  valueIndicatorEverShown: boolean;
  /** 좌표 변환 기준인 Root native node를 연결합니다. */
  refs: { root: NodeRefCallback };
  /** touch 해석, slide 소비와 Root 크기 변화 감지를 연결합니다. */
  rootProps: UseSliderRootProps;
  /** 선택 구간 위치 변수(`--slider-range-left`, `--slider-range-width`)입니다. */
  rangeProps: { style: CSSProperties };
  /**
   * thumb 위치 변수와 `adjustable` 접근성 값을 반환합니다.
   * `--slider-thumb-left`는 Root 가로 범위의 백분율이고, `--slider-thumb-offset-ratio`는 thumb 크기에 곱해
   * 양 끝의 thumb이 Root 밖으로 나가지 않게 하는 보정 비율입니다.
   * 측정 없이 첫 렌더부터 확정되므로 `left: calc(var(--slider-thumb-left) + <thumb 크기> * var(--slider-thumb-offset-ratio))`로 배치합니다.
   */
  getThumbProps: (thumbIndex: number) => UseSliderThumbProps;
  /** thumb 크기 측정을 위해 native node를 연결합니다. index별로 같은 함수를 반환합니다. */
  getThumbRef: (thumbIndex: number) => NodeRefCallback;
  /** `--slider-tick-left`와 thumb 크기에 곱할 `--slider-tick-offset-ratio`를 반환합니다. */
  getTickProps: (value: number) => UseSliderDecorationProps;
  /** `--slider-marker-left`와 thumb 크기에 곱할 `--slider-marker-offset-ratio`를 반환합니다. 양 끝 값은 `0`입니다. */
  getMarkerProps: (value: number) => UseSliderDecorationProps;
  getValueIndicatorProps: (thumbIndex: number) => UseSliderValueIndicatorProps;
}

interface SliderInteraction {
  active: boolean;
  index: number | null;
  changed: boolean;
  pendingX: number | null;
}

function cachedByIndex<T>(cache: Map<number, T>, index: number, create: () => T): T {
  const cached = cache.get(index);
  if (cached) return cached;
  const created = create();
  cache.set(index, created);
  return created;
}

export function useSlider(props: UseSliderProps): UseSliderReturn {
  const {
    values: valuesProp,
    defaultValues,
    onValuesChange,
    onValuesCommit,
    min = 0,
    max = 100,
    step = 1,
    allowedValues,
    minStepsBetweenThumbs = 0,
    dir = "ltr",
    disabled = false,
    readOnly = false,
    invalid = false,
    getAccessibilityLabel,
    getAccessibilityValueText,
    getValueIndicatorLabel = defaultGetValueIndicatorLabel,
  } = props;

  const initialValues = useMemo(
    () => normalizeValues(defaultValues ?? valuesProp, min, max, step, allowedValues),
    [defaultValues, valuesProp, min, max, step, allowedValues],
  );
  const controlledValues = useMemo(
    () =>
      valuesProp === undefined
        ? undefined
        : normalizeValues(valuesProp, min, max, step, allowedValues),
    [valuesProp, min, max, step, allowedValues],
  );
  const [values, setValues] = useControllableState<number[]>({
    value: controlledValues,
    defaultValue: initialValues,
    onChange: onValuesChange,
  });
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const interaction = useRef<SliderInteraction>({
    active: false,
    index: null,
    changed: false,
    pendingX: null,
  });
  const pendingEndRef = useRef(false);
  const moveFrameRef = useRef<number | null>(null);
  const [valueIndicatorEverShown, setValueIndicatorEverShown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumbIndex, setActiveThumbIndex] = useState<number | null>(null);

  const rootNodeRef = useRef<NodesRef | null>(null);
  const thumbNodes = useRef(new Map<number, NodesRef>());
  const indicatorNodes = useRef(new Map<number, NodesRef>());
  const thumbRefCallbacks = useRef(new Map<number, NodeRefCallback>());
  const indicatorRefCallbacks = useRef(new Map<number, NodeRefCallback>());

  const rootLeftRef = useRef(0);
  const rootWidthRef = useRef(0);
  const [rootWidth, setRootWidth] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [indicatorWidths, setIndicatorWidths] = useState<Record<number, number>>({});
  const updateIndicatorWidth = useCallback((index: number, width: number) => {
    setIndicatorWidths((previous) => {
      if (previous[index] === width) return previous;
      return { ...previous, [index]: width };
    });
  }, []);

  const measureInFlight = useRef(false);
  const remeasureRef = useRef(false);
  const measureRef = useRef<(() => void) | undefined>(undefined);
  const finalizeRef = useRef<(() => void) | undefined>(undefined);
  const updateFromRatioRef = useRef<((ratio: number) => void) | undefined>(undefined);

  const measure = useCallback(() => {
    "background only";
    const rootNode = rootNodeRef.current;
    if (measureInFlight.current || !rootNode) return;
    measureInFlight.current = true;
    const thumbNode = thumbNodes.current.get(0);
    const settle = () => {
      measureInFlight.current = false;
      if (!remeasureRef.current) return;
      remeasureRef.current = false;
      measureRef.current?.();
    };
    Promise.all([
      getRectByRef({ current: rootNode }),
      thumbNode ? getRectByRef({ current: thumbNode }) : Promise.resolve(null),
    ])
      .then(([rootRect, thumbRect]) => {
        const root = geometryFromRect(rootRect);
        const thumb = geometryFromRect(thumbRect);
        if (root) {
          rootLeftRef.current = root.left;
          rootWidthRef.current = root.width;
          setRootWidth(root.width);
        }
        if (thumb) setThumbWidth(thumb.width);
        measureInFlight.current = false;
        const pending = interaction.current.pendingX;
        if (pending !== null && root) {
          interaction.current.pendingX = null;
          updateFromRatioRef.current?.(clampRatio((pending - root.left) / root.width));
        }
        if (pendingEndRef.current) finalizeRef.current?.();
        settle();
      })
      .catch(() => {
        measureInFlight.current = false;
        if (pendingEndRef.current) {
          const pending = interaction.current.pendingX;
          if (pending !== null && rootWidthRef.current > 0) {
            interaction.current.pendingX = null;
            updateFromRatioRef.current?.(
              clampRatio((pending - rootLeftRef.current) / rootWidthRef.current),
            );
          }
          finalizeRef.current?.();
        }
        settle();
      });
  }, []);
  measureRef.current = measure;

  const requestMeasure = useCallback(() => {
    "background only";
    if (measureInFlight.current) {
      remeasureRef.current = true;
      return;
    }
    measure();
  }, [measure]);

  const updateFromRatio = useCallback(
    (ratio: number) => {
      "background only";
      if (disabled || readOnly || !interaction.current.active) return;
      const current = valuesRef.current;
      const requested = valueForPercentage(ratio * 100, min, max, dir);
      const index = interaction.current.index ?? nearestValueIndex(current, requested);
      const nextValue = normalizeValue(requested, min, max, step, allowedValues);
      const next = [...current];
      next[index] = nextValue;
      next.sort((a, b) => a - b);
      if (!allowedValues?.length && !hasMinimumSteps(next, minStepsBetweenThumbs, step)) return;
      if (next.every((value, valueIndex) => value === current[valueIndex])) return;
      valuesRef.current = next;
      interaction.current.index = next.indexOf(nextValue);
      interaction.current.changed = true;
      setActiveThumbIndex(interaction.current.index);
      setValues(next);
    },
    [allowedValues, dir, disabled, max, min, minStepsBetweenThumbs, readOnly, setValues, step],
  );
  updateFromRatioRef.current = updateFromRatio;

  const cancelPendingMove = useCallback(() => {
    if (moveFrameRef.current === null) return;
    cancelAnimationFrame(moveFrameRef.current);
    moveFrameRef.current = null;
  }, []);

  const flushPendingMove = useCallback(() => {
    "background only";
    moveFrameRef.current = null;
    if (!interaction.current.active || disabled || readOnly) return;
    const pending = interaction.current.pendingX;
    if (pending === null) return;
    const width = rootWidthRef.current;
    if (!width) {
      measure();
      return;
    }
    interaction.current.pendingX = null;
    updateFromRatio(clampRatio((pending - rootLeftRef.current) / width));
  }, [disabled, measure, readOnly, updateFromRatio]);

  const finalize = useCallback(() => {
    "background only";
    if (!interaction.current.active) return;
    interaction.current.active = false;
    interaction.current.pendingX = null;
    pendingEndRef.current = false;
    setIsDragging(false);
    setActiveThumbIndex(null);
    if (interaction.current.changed && !disabled && !readOnly)
      onValuesCommit?.([...valuesRef.current]);
    interaction.current.index = null;
    interaction.current.changed = false;
  }, [disabled, onValuesCommit, readOnly]);
  finalizeRef.current = finalize;

  const begin = useCallback<TouchHandler>(
    (event) => {
      "background only";
      if (disabled || readOnly) {
        interaction.current.index = null;
        return;
      }
      const x = eventPageX(event);
      if (!Number.isFinite(x)) return;
      pendingEndRef.current = false;
      interaction.current.active = true;
      interaction.current.changed = false;
      interaction.current.pendingX = x;
      const current = valuesRef.current;
      if (interaction.current.index === null && rootWidthRef.current > 0) {
        const ratio = clampRatio((x - rootLeftRef.current) / rootWidthRef.current);
        interaction.current.index = nearestValueIndex(
          current,
          valueForPercentage(ratio * 100, min, max, dir),
        );
      }
      setActiveThumbIndex(interaction.current.index);
      setIsDragging(true);
      setValueIndicatorEverShown(true);
      measure();
      if (rootWidthRef.current > 0) {
        updateFromRatio(clampRatio((x - rootLeftRef.current) / rootWidthRef.current));
      }
    },
    [dir, disabled, max, measure, min, readOnly, updateFromRatio],
  );

  const move = useCallback<TouchHandler>(
    (event) => {
      "background only";
      if (!interaction.current.active || disabled || readOnly) return;
      const x = eventPageX(event);
      if (!Number.isFinite(x)) return;
      interaction.current.pendingX = x;
      if (moveFrameRef.current !== null) return;
      moveFrameRef.current = requestAnimationFrame(flushPendingMove);
    },
    [disabled, flushPendingMove, readOnly],
  );

  const finish = useCallback<TouchHandler>(
    (event) => {
      "background only";
      if (!interaction.current.active) return;
      cancelPendingMove();
      const x = eventPageX(event);
      if (Number.isFinite(x)) interaction.current.pendingX = x;
      if (
        interaction.current.pendingX !== null &&
        (measureInFlight.current || rootWidthRef.current <= 0)
      ) {
        pendingEndRef.current = true;
        setIsDragging(false);
        setActiveThumbIndex(null);
        measure();
        return;
      }
      if (interaction.current.pendingX !== null) {
        const pending = interaction.current.pendingX;
        interaction.current.pendingX = null;
        updateFromRatio(clampRatio((pending - rootLeftRef.current) / rootWidthRef.current));
      }
      finalizeRef.current?.();
    },
    [cancelPendingMove, measure, updateFromRatio],
  );

  const cancel = useCallback<TouchHandler>(() => {
    "background only";
    if (!interaction.current.active) return;
    cancelPendingMove();
    interaction.current.active = false;
    interaction.current.pendingX = null;
    pendingEndRef.current = false;
    setIsDragging(false);
    setActiveThumbIndex(null);
    interaction.current.index = null;
    interaction.current.changed = false;
  }, [cancelPendingMove]);

  const handleRootLayoutChange = useCallback<LayoutChangeHandler>(
    (event) => {
      "background only";
      const width = getLayoutWidth(event);
      if (width !== null && width !== rootWidthRef.current) requestMeasure();
    },
    [requestMeasure],
  );

  useEffect(() => cancelPendingMove, [cancelPendingMove]);

  useEffect(() => {
    measure();
  }, [measure, values.length]);

  useEffect(() => {
    for (const [index, node] of indicatorNodes.current) {
      getRectByRef({ current: node })
        .then((rect) => {
          const geometry = geometryFromRect(rect);
          if (geometry) updateIndicatorWidth(index, geometry.width);
        })
        .catch(() => undefined);
    }
  }, [updateIndicatorWidth, values]);

  const rootRef = useCallback<NodeRefCallback>((node) => {
    "background only";
    rootNodeRef.current = node;
  }, []);

  const getThumbRef = useCallback(
    (thumbIndex: number) =>
      cachedByIndex(thumbRefCallbacks.current, thumbIndex, () => (node: NodesRef | null) => {
        "background only";
        if (node) thumbNodes.current.set(thumbIndex, node);
        else thumbNodes.current.delete(thumbIndex);
      }),
    [],
  );

  const getIndicatorRef = useCallback(
    (thumbIndex: number) =>
      cachedByIndex(indicatorRefCallbacks.current, thumbIndex, () => (node: NodesRef | null) => {
        "background only";
        if (node) indicatorNodes.current.set(thumbIndex, node);
        else indicatorNodes.current.delete(thumbIndex);
      }),
    [],
  );

  const rootProps = useMemo<UseSliderRootProps>(
    () => ({
      "consume-slide-event": DEFAULT_CONSUME_SLIDE_EVENT,
      catchtouchstart: begin,
      catchtouchmove: move,
      catchtouchend: finish,
      catchtouchcancel: cancel,
      bindlayoutchange: handleRootLayoutChange,
    }),
    [begin, cancel, finish, handleRootLayoutChange, move],
  );

  const rangeProps = useMemo(() => {
    const percentages = values.map((value) => percentageForValue(value, min, max));
    const end = values.length > 1 ? Math.max(...percentages) : (percentages[0] ?? 0);
    const start = values.length > 1 ? Math.min(...percentages) : 0;
    const left = dir === "ltr" ? start : 100 - end;
    const width = Math.max(0, end - start);
    return {
      style: {
        "--slider-range-left": `${left}%`,
        "--slider-range-width": `${width}%`,
      } as CSSProperties,
    };
  }, [dir, max, min, values]);

  const physicalPercentFor = useCallback(
    (value: number) => {
      const percent = percentageForValue(value, min, max);
      return dir === "ltr" ? percent : 100 - percent;
    },
    [dir, max, min],
  );

  const getThumbProps = useCallback(
    (thumbIndex: number): UseSliderThumbProps => {
      const value = values[thumbIndex] ?? min;
      const physicalPercent = physicalPercentFor(value);
      return {
        "accessibility-element": true,
        "accessibility-label": getAccessibilityLabel?.(thumbIndex),
        "accessibility-role-description": "adjustable",
        "accessibility-value":
          getAccessibilityValueText?.(value, thumbIndex) ??
          `minimum ${min}, maximum ${max}, current ${value}`,
        "accessibility-traits": disabled ? "disabled" : undefined,
        style: {
          "--slider-thumb-left": `${physicalPercent}%`,
          "--slider-thumb-offset-ratio": thumbOffsetRatio(physicalPercent),
        } as CSSProperties,
        bindtouchstart: () => {
          "background only";
          interaction.current.index = thumbIndex;
        },
      };
    },
    [
      disabled,
      getAccessibilityLabel,
      getAccessibilityValueText,
      max,
      min,
      physicalPercentFor,
      values,
    ],
  );

  const getTickProps = useCallback(
    (value: number): UseSliderDecorationProps => {
      const physicalPercent = physicalPercentFor(value);
      return {
        style: {
          "--slider-tick-left": `${physicalPercent}%`,
          "--slider-tick-offset-ratio": thumbOffsetRatio(physicalPercent),
        } as CSSProperties,
        "accessibility-elements-hidden": true,
      };
    },
    [physicalPercentFor],
  );

  const getMarkerProps = useCallback(
    (value: number): UseSliderDecorationProps => {
      const percent = percentageForValue(value, min, max);
      const physicalPercent = physicalPercentFor(value);
      return {
        style: {
          "--slider-marker-left": `${physicalPercent}%`,
          "--slider-marker-offset-ratio":
            percent === 0 || percent === 100 ? 0 : thumbOffsetRatio(physicalPercent),
        } as CSSProperties,
        "accessibility-elements-hidden": true,
      };
    },
    [max, min, physicalPercentFor],
  );

  const getValueIndicatorProps = useCallback(
    (thumbIndex: number): UseSliderValueIndicatorProps => {
      const value = values[thumbIndex] ?? min;
      const physicalPercent = physicalPercentFor(value);
      const indicatorOffset = getStickyLabelOffset(
        indicatorWidths[thumbIndex] ?? 0,
        physicalPercent,
        thumbWidth,
        rootWidth,
        1,
      );
      return {
        isShown: !disabled && !readOnly && isDragging && activeThumbIndex === thumbIndex,
        rootProps: {
          style: {
            "--slider-value-indicator-left": `${physicalPercent}%`,
            "--slider-value-indicator-offset": `${indicatorOffset}px`,
            "--slider-thumb-offset": `${getThumbInBoundsOffset(thumbWidth, physicalPercent, 1)}px`,
          } as CSSProperties,
          "accessibility-elements-hidden": true,
          bindlayoutchange: (event) => {
            "background only";
            const width = getLayoutWidth(event);
            if (width !== null) updateIndicatorWidth(thumbIndex, width);
          },
        },
        rootRef: getIndicatorRef(thumbIndex),
        labelProps: { children: getValueIndicatorLabel({ value, thumbIndex }) },
      };
    },
    [
      activeThumbIndex,
      disabled,
      getIndicatorRef,
      getValueIndicatorLabel,
      indicatorWidths,
      isDragging,
      min,
      physicalPercentFor,
      readOnly,
      rootWidth,
      thumbWidth,
      updateIndicatorWidth,
      values,
    ],
  );

  const refs = useMemo(() => ({ root: rootRef }), [rootRef]);

  return useMemo<UseSliderReturn>(
    () => ({
      values,
      min,
      max,
      step,
      dir,
      disabled,
      readOnly,
      invalid,
      isDragging,
      activeThumbIndex,
      valueIndicatorEverShown,
      refs,
      rootProps,
      rangeProps,
      getThumbProps,
      getThumbRef,
      getTickProps,
      getMarkerProps,
      getValueIndicatorProps,
    }),
    [
      activeThumbIndex,
      dir,
      disabled,
      getMarkerProps,
      getThumbProps,
      getThumbRef,
      getTickProps,
      getValueIndicatorProps,
      invalid,
      isDragging,
      max,
      min,
      rangeProps,
      readOnly,
      refs,
      rootProps,
      step,
      valueIndicatorEverShown,
      values,
    ],
  );
}
