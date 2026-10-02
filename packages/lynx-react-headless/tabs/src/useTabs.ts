import * as React from "@lynx-js/react";
import type { MainThread, NodesRef } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import {
  areTabsTransitionsEnabled,
  getTabsOrderedItems,
  getTabsTriggerRects,
  type TabsLayoutRect,
} from "./Tabs.utils.js";
function invokeSelectTab(pager: NodesRef | null, index: number, smooth: boolean) {
  "background only";
  if (!pager || index < 0) return;
  try {
    pager.invoke({ method: "selectTab", params: { index, smooth } }).exec();
  } catch {
    // ReactLynx Testing Library의 NodesRef는 UI method를 구현하지 않는다.
  }
}

export interface UseTabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** trigger 사이 간격입니다. 측정한 너비로 indicator 위치를 계산할 때 사용합니다. */
  triggerGap?: number;
}
export interface UseTabsReturn {
  value: string | undefined;
  visualValue: string | undefined;
  items: { value: string; disabled: boolean }[];
  pagerValues: string[];
  indicatorIndex: number;
  selectedPagerIndex: number;
  indicatorRef: React.RefObject<MainThread.Element>;
  triggerRects: Record<string, TabsLayoutRect>;
  /**
   * 모든 trigger 측정이 끝난 다음 업데이트부터 `true`입니다.
   * 측정값이 처음 반영되는 업데이트에서는 `false`라 Indicator가 첫 진입에 미끄러지지 않습니다.
   */
  transitionsEnabled: boolean;
  registerTrigger: (value: string, disabled: boolean) => () => void;
  registerContent: (value: string) => () => void;
  updateTriggerDisabled: (value: string, disabled: boolean) => void;
  syncTriggerOrder: (values: string[]) => void;
  updateTriggerWidth: (value: string, width: number) => void;
  setPagerRef: (ref: NodesRef | null) => void;
  selectValue: (value: string) => void;
  handlePagerWillChange: (index: number) => void;
  handlePagerChange: (index: number) => void;
}

/**
 * 선택 상태, trigger 순서·측정값과 native pager를 연결합니다.
 * 기본 선택은 `defaultValue`, controlled 선택은 `value`로 지정합니다.
 */
export function useTabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  triggerGap = 0,
}: UseTabsProps): UseTabsReturn {
  const [value, setValueInternal] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange(nextValue) {
      "background only";
      if (nextValue !== undefined) onValueChange?.(nextValue);
    },
  });
  const [items, setItems] = React.useState<{ value: string; disabled: boolean }[]>([]);
  const [contentValues, setContentValues] = React.useState<string[]>([]);
  const [indicatorValue, setIndicatorValue] = React.useState<string | undefined>();
  const [triggerWidths, setTriggerWidths] = React.useState<Record<string, number>>({});
  const pagerRef = React.useRef<NodesRef | null>(null);
  const indicatorRef = React.useMainThreadRef<MainThread.Element>(null);

  const pagerValues = React.useMemo(
    () =>
      contentValues.filter(
        (contentValue) => !items.find((item) => item.value === contentValue)?.disabled,
      ),
    [contentValues, items],
  );
  const triggerRects = React.useMemo(
    () =>
      getTabsTriggerRects(
        items.map((item) => item.value),
        triggerWidths,
        triggerGap,
      ),
    [items, triggerGap, triggerWidths],
  );
  const measured = areTabsTransitionsEnabled(
    items.map((item) => item.value),
    triggerRects,
  );
  // 측정값과 같은 업데이트에서 transition을 켜면 Lynx 기기에서 첫 위치 반영이 애니메이션된다.
  const [measuredBefore, setMeasuredBefore] = React.useState(false);
  React.useEffect(() => {
    "background only";
    setMeasuredBefore(measured);
  }, [measured]);
  const transitionsEnabled = measured && measuredBefore;
  const visualValue = indicatorValue ?? value;
  const indicatorIndex = items.findIndex((item) => item.value === visualValue);
  const selectedPagerIndex = value === undefined ? -1 : pagerValues.indexOf(value);
  const setPagerNode = React.useCallback(
    (node: NodesRef | null) => {
      pagerRef.current = node;
      if (node && selectedPagerIndex >= 0) invokeSelectTab(node, selectedPagerIndex, false);
    },
    [selectedPagerIndex],
  );

  const registerTrigger = React.useCallback((triggerValue: string, disabled: boolean) => {
    setItems((current) => {
      if (current.some((item) => item.value === triggerValue)) return current;
      return [...current, { value: triggerValue, disabled }];
    });

    return () => {
      "background only";
      setItems((current) => current.filter((item) => item.value !== triggerValue));
      setTriggerWidths((current) => {
        const next = { ...current };
        delete next[triggerValue];
        return next;
      });
    };
  }, []);

  const registerContent = React.useCallback((contentValue: string) => {
    setContentValues((current) =>
      current.includes(contentValue) ? current : [...current, contentValue],
    );

    return () => {
      "background only";
      setContentValues((current) => current.filter((value) => value !== contentValue));
    };
  }, []);

  const updateTriggerDisabled = React.useCallback((triggerValue: string, disabled: boolean) => {
    setItems((current) =>
      current.map((item) =>
        item.value === triggerValue && item.disabled !== disabled ? { ...item, disabled } : item,
      ),
    );
  }, []);

  const syncTriggerOrder = React.useCallback((triggerValues: string[]) => {
    setItems((current) => {
      const ordered = getTabsOrderedItems(current, triggerValues);
      return ordered.every((item, index) => item === current[index]) ? current : ordered;
    });
  }, []);

  const updateTriggerWidth = React.useCallback((triggerValue: string, width: number) => {
    setTriggerWidths((current) =>
      current[triggerValue] === width ? current : { ...current, [triggerValue]: width },
    );
  }, []);

  const selectValue = React.useCallback(
    (nextValue: string) => {
      setIndicatorValue(undefined);
      setValueInternal(nextValue);
    },
    [setValueInternal],
  );

  const handlePagerWillChange = React.useCallback(
    (targetIndex: number) => {
      setIndicatorValue(pagerValues[targetIndex]);
    },
    [pagerValues],
  );

  const handlePagerChange = React.useCallback(
    (targetIndex: number) => {
      const nextValue = pagerValues[targetIndex];
      if (nextValue === undefined) return;
      setIndicatorValue(undefined);
      setValueInternal(nextValue);
    },
    [pagerValues, setValueInternal],
  );

  React.useEffect(() => {
    "background only";
    if (selectedPagerIndex >= 0) {
      invokeSelectTab(pagerRef.current, selectedPagerIndex, false);
    }
  }, [selectedPagerIndex]);

  const contextValue = React.useMemo<UseTabsReturn>(
    () => ({
      value,
      visualValue,
      items,
      pagerValues,
      indicatorIndex,
      selectedPagerIndex,
      indicatorRef,
      transitionsEnabled,
      triggerRects,
      registerTrigger,
      registerContent,
      updateTriggerDisabled,
      syncTriggerOrder,
      updateTriggerWidth,
      setPagerRef: setPagerNode,
      selectValue,
      handlePagerWillChange,
      handlePagerChange,
    }),
    [
      value,
      visualValue,
      items,
      pagerValues,
      indicatorIndex,
      selectedPagerIndex,
      indicatorRef,
      triggerRects,
      transitionsEnabled,
      registerTrigger,
      registerContent,
      updateTriggerDisabled,
      syncTriggerOrder,
      updateTriggerWidth,
      setPagerNode,
      selectValue,
      handlePagerWillChange,
      handlePagerChange,
    ],
  );
  return contextValue;
}
