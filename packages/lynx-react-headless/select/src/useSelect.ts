import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "@lynx-js/react";
import type { BaseEvent, IntrinsicElements, NodesRef } from "@lynx-js/types";
import type { Placement, Position, Rect } from "@seed-design/lynx-react-floating";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

type ViewProps = IntrinsicElements["view"];

const EMPTY_VALUE: string[] = [];

/**
 * 열림 상태가 바뀐 원인입니다.
 *
 * - `"trigger"`: Trigger를 탭했습니다.
 * - `"interactOutside"`: 목록 바깥(backdrop)을 탭했습니다.
 * - `"itemSelect"`: 단일 선택에서 항목을 선택했습니다.
 * - `"dismiss"`: `container`를 지정한 native overlay가 닫힘을 요청했습니다. Android 뒤로 가기가 해당합니다.
 */
export type SelectOpenChangeReason = "trigger" | "interactOutside" | "itemSelect" | "dismiss";

export interface SelectOpenChangeDetails {
  reason: SelectOpenChangeReason;
  event: BaseEvent;
}

/** 선택한 값과 그 값을 가진 항목의 표시 정보입니다. */
export interface SelectSelectedItem {
  value: string;
  label: ReactNode;
  textValue: string;
  icon?: ReactNode;
  /** 값에 해당하는 항목이 등록되어 있으면 `true`입니다. `false`이면 `label`은 `null`, `textValue`는 빈 문자열입니다. */
  resolved: boolean;
}

/** 항목이 Root에 등록하는 표시 정보와 native node입니다. */
export interface SelectItemEntry {
  label: ReactNode;
  textValue: string;
  icon?: ReactNode;
  node: NodesRef | null;
}

/** Trigger가 등록하는 tap handler입니다. 열린 동안 Positioner가 Trigger 위치의 탭 영역에 연결합니다. */
export type SelectTriggerHandlers = Pick<ViewProps, "bindtap" | "main-thread:bindtap">;

export interface UseSelectProps {
  value?: string[];

  defaultValue?: string[];

  /** 사용자가 항목을 선택해 값이 바뀔 때 호출합니다. controlled 상태에서도 호출합니다. */
  onValueChange?: (value: string[]) => void;

  /** `true`이면 항목을 탭할 때마다 값을 추가·제거하고 목록을 열어 둡니다. @default false */
  multiple?: boolean;

  open?: boolean;

  defaultOpen?: boolean;

  /** 사용자 동작으로 열림 상태를 바꿀 때 호출합니다. controlled 상태에서도 호출합니다. */
  onOpenChange?: (open: boolean, details: SelectOpenChangeDetails) => void;

  /** `true`이면 열 수 없고 값을 바꿀 수 없습니다. 이미 열린 목록은 닫을 수 있습니다. @default false */
  disabled?: boolean;

  /** `true`이면 열 수 없고 값을 바꿀 수 없습니다. @default false */
  readOnly?: boolean;

  /** 상태로만 전달합니다. 동작은 바뀌지 않습니다. @default false */
  invalid?: boolean;

  /** 상태로만 전달합니다. 동작은 바뀌지 않습니다. @default false */
  required?: boolean;

  /** @default "bottom" */
  placement?: Placement;

  /** 기준 요소와 목록 사이 간격(px)입니다. @default 8 */
  gutter?: number;

  /** 화면 가장자리와 유지할 최소 간격(px)입니다. @default 8 */
  overflowPadding?: number;

  /**
   * Trigger에 표시할 값을 만듭니다. 생략하면 등록된 항목의 `textValue`를 `", "`로 잇습니다.
   * 등록되지 않은 값(`resolved: false`)도 함께 받습니다.
   */
  formatValue?: (items: SelectSelectedItem[]) => ReactNode;
}

export interface UseSelectReturn {
  value: string[];
  selectedItems: SelectSelectedItem[];
  /** 값이 하나이고 등록된 항목이면 그 항목입니다. */
  selectedItem: SelectSelectedItem | undefined;
  /** `selectedItem`의 native node입니다. 열 때 이 항목이 보이도록 스크롤합니다. */
  selectedItemNode: NodesRef | null;
  /** `showPlaceholder`이면 `undefined`입니다. */
  displayValue: ReactNode;
  /** 값이 없거나, 항목이 등록된 뒤에도 모든 값이 등록되지 않은 값이면 `true`입니다. */
  showPlaceholder: boolean;
  multiple: boolean;
  open: boolean;
  /** Positioner를 표시하는 동안 `true`입니다. 닫힘 전환이 끝날 때까지 유지합니다. */
  mounted: boolean;
  /** 현재 열림에서 위치 계산을 마쳤으면 `true`입니다. 그 전에는 `SelectContent`가 콘텐츠를 숨깁니다. */
  positioned: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  required: boolean;
  placement: Placement;
  gutter: number;
  overflowPadding: number;
  /** `boundingClientRect`의 `relativeTo: "screen"` 좌표입니다. 아래 rect도 같은 좌표계입니다. */
  position: Position | null;
  /** Positioner 레이어의 rect입니다. 콘텐츠는 이 rect를 뺀 레이어 기준 좌표로 배치합니다. */
  layerRect: Rect | null;
  triggerRect: Rect | null;
  /** 열릴 때마다 1씩 늘어납니다. 늦게 끝난 측정을 버리는 데 씁니다. */
  openEpoch: number;
  setOpen: (open: boolean, details: SelectOpenChangeDetails) => void;
  /**
   * 닫힘 전환이 끝났을 때 호출해 Positioner를 숨깁니다. 호출하지 않으면 `SelectContent`가 닫힌 뒤
   * 200ms에 호출합니다. `immediate`이면 열림 상태와 관계없이 즉시 숨깁니다.
   */
  finishClose: (immediate?: boolean) => void;
  setPosition: (position: Position, layerRect: Rect, triggerRect: Rect) => void;
  resetPosition: () => void;
  /** 항목을 선택합니다. `disabled`·`readOnly`이면 무시합니다. 단일 선택이면 `"itemSelect"`로 닫습니다. */
  selectValue: (value: string, event: BaseEvent) => void;
  registerItem: (value: string, entry: SelectItemEntry) => void;
  unregisterItem: (value: string) => void;
  triggerHandlers: SelectTriggerHandlers;
  setTriggerHandlers: (handlers: SelectTriggerHandlers) => void;
  triggerRef: MutableRefObject<NodesRef | null>;
  layerRef: MutableRefObject<NodesRef | null>;
  isOpenRef: MutableRefObject<boolean>;
  openEpochRef: MutableRefObject<number>;
}

function isSameValue(a: string[], b: string[]) {
  return a.length === b.length && a.every((entry, index) => entry === b[index]);
}

/**
 * @platform Lynx
 *
 * Select의 값·열림 상태, 단일·다중 선택, 항목 등록과 표시 값 해석, 닫힘 전환 동안의 표시, 열림마다 바뀌는
 * 측정 epoch와 위치 결과를 관리하는 headless 훅입니다. Field 상태를 읽지 않으므로 `disabled`·`readOnly`·
 * `invalid`·`required`는 호출자가 정해 넘깁니다. native 측정은 `SelectContent`가 하고 결과를
 * `setPosition`으로 저장합니다.
 */
export function useSelect(props: UseSelectProps = {}): UseSelectReturn {
  const {
    value: valueProp,
    defaultValue = EMPTY_VALUE,
    onValueChange,
    multiple = false,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    readOnly = false,
    invalid = false,
    required = false,
    placement = "bottom",
    gutter = 8,
    overflowPadding = 8,
    formatValue,
  } = props;
  const [value, setValueState] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
  });
  const [registry, setRegistry] = useState<ReadonlyMap<string, SelectItemEntry>>(() => new Map());
  const [mounted, setMounted] = useState(open);
  const [positionedEpoch, setPositionedEpoch] = useState<number | null>(null);
  const [position, setPositionState] = useState<Position | null>(null);
  const [layerRect, setLayerRect] = useState<Rect | null>(null);
  const [triggerRect, setTriggerRect] = useState<Rect | null>(null);
  const [triggerHandlers, setTriggerHandlers] = useState<SelectTriggerHandlers>({});
  const isOpenRef = useRef(open);
  const openEpochRef = useRef(0);
  const triggerRef = useRef<NodesRef | null>(null);
  const layerRef = useRef<NodesRef | null>(null);

  if (open && !isOpenRef.current) openEpochRef.current += 1;
  isOpenRef.current = open;
  const openEpoch = openEpochRef.current;
  const positioned = positionedEpoch === openEpoch;

  const selectedItems = useMemo(
    () =>
      value.map((itemValue): SelectSelectedItem => {
        const entry = registry.get(itemValue);
        return entry
          ? {
              value: itemValue,
              label: entry.label,
              textValue: entry.textValue,
              icon: entry.icon,
              resolved: true,
            }
          : { value: itemValue, label: null, textValue: "", resolved: false };
      }),
    [registry, value],
  );
  const selectedEntry = value.length === 1 ? registry.get(value[0] ?? "") : undefined;
  const selectedItem = selectedEntry ? selectedItems[0] : undefined;
  const selectedItemNode = selectedEntry?.node ?? null;
  const showPlaceholder =
    value.length === 0 || (registry.size > 0 && selectedItems.every((item) => !item.resolved));
  const displayValue = useMemo(() => {
    if (showPlaceholder) return undefined;
    if (formatValue) return formatValue(selectedItems);
    return selectedItems
      .filter((item) => item.resolved)
      .map((item) => item.textValue)
      .join(", ");
  }, [formatValue, selectedItems, showPlaceholder]);

  useEffect(() => {
    "background only";
    if (open) {
      setMounted(true);
      return;
    }
    if (!positioned) setMounted(false);
  }, [open, positioned]);

  const setOpen = useCallback(
    (nextOpen: boolean, details: SelectOpenChangeDetails) => {
      "background only";
      if (nextOpen && (disabled || readOnly)) return;
      if (nextOpen === open) return;
      setOpenState(nextOpen);
      onOpenChange?.(nextOpen, details);
    },
    [disabled, onOpenChange, open, readOnly, setOpenState],
  );
  const finishClose = useCallback((immediate = false) => {
    "background only";
    if (!immediate && isOpenRef.current) return;
    setMounted(false);
    setPositionedEpoch(null);
  }, []);
  const setPosition = useCallback(
    (nextPosition: Position, nextLayerRect: Rect, nextTriggerRect: Rect) => {
      setPositionState((previous) =>
        previous?.left === nextPosition.left &&
        previous.top === nextPosition.top &&
        previous.width === nextPosition.width &&
        previous.height === nextPosition.height &&
        previous.placement === nextPosition.placement
          ? previous
          : nextPosition,
      );
      setLayerRect(nextLayerRect);
      setTriggerRect(nextTriggerRect);
      setPositionedEpoch(openEpochRef.current);
    },
    [],
  );
  const resetPosition = useCallback(() => {
    setPositionState(null);
    setLayerRect(null);
    setTriggerRect(null);
    setPositionedEpoch(null);
  }, []);
  const selectValue = useCallback(
    (itemValue: string, event: BaseEvent) => {
      "background only";
      if (disabled || readOnly) return;
      const next = multiple
        ? value.includes(itemValue)
          ? value.filter((entry) => entry !== itemValue)
          : [...value, itemValue]
        : [itemValue];
      if (!isSameValue(value, next)) setValueState(next);
      if (!multiple) setOpen(false, { reason: "itemSelect", event });
    },
    [disabled, multiple, readOnly, setOpen, setValueState, value],
  );
  const registerItem = useCallback((itemValue: string, entry: SelectItemEntry) => {
    setRegistry((current) => {
      const previous = current.get(itemValue);
      if (
        previous &&
        previous.label === entry.label &&
        previous.textValue === entry.textValue &&
        previous.icon === entry.icon &&
        previous.node === entry.node
      ) {
        return current;
      }
      return new Map(current).set(itemValue, entry);
    });
  }, []);
  const unregisterItem = useCallback((itemValue: string) => {
    setRegistry((current) => {
      if (!current.has(itemValue)) return current;
      const next = new Map(current);
      next.delete(itemValue);
      return next;
    });
  }, []);

  return useMemo(
    () => ({
      value,
      selectedItems,
      selectedItem,
      selectedItemNode,
      displayValue,
      showPlaceholder,
      multiple,
      open,
      mounted,
      positioned,
      disabled,
      readOnly,
      invalid,
      required,
      placement,
      gutter,
      overflowPadding,
      position,
      layerRect,
      triggerRect,
      openEpoch,
      setOpen,
      finishClose,
      setPosition,
      resetPosition,
      selectValue,
      registerItem,
      unregisterItem,
      triggerHandlers,
      setTriggerHandlers,
      triggerRef,
      layerRef,
      isOpenRef,
      openEpochRef,
    }),
    [
      value,
      selectedItems,
      selectedItem,
      selectedItemNode,
      displayValue,
      showPlaceholder,
      multiple,
      open,
      mounted,
      positioned,
      disabled,
      readOnly,
      invalid,
      required,
      placement,
      gutter,
      overflowPadding,
      position,
      layerRect,
      triggerRect,
      openEpoch,
      setOpen,
      finishClose,
      setPosition,
      resetPosition,
      selectValue,
      registerItem,
      unregisterItem,
      triggerHandlers,
    ],
  );
}
