import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import {
  wheelPicker,
  type WheelPickerVariantProps,
} from "@seed-design/lynx-css/recipes/wheel-picker";
import { wheelPicker as vars } from "@seed-design/lynx-css/vars/component";
import { LoopScroll, type LoopScrollItem } from "@seed-design/lynx-react-loop-scroll";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import clsx from "clsx";
import type { LynxAccessibilityProps, LynxViewProps } from "../../types";
import { toArray } from "../../utils/children";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { ScrollFog, type ScrollFogProps } from "../ScrollFog/ScrollFog";

type MainThreadTouchKey =
  `main-thread:${"bind" | "catch" | "capture-bind" | "capture-catch" | "global-bind"}touch${"start" | "move" | "end" | "cancel"}`;

const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
  createSlotRecipeContext(wheelPicker);

interface WheelPickerContextValue {
  itemSize: number;
  visibleItemCount: number;
  disabled: boolean;
  readOnly: boolean;
}

const WheelPickerContext = React.createContext<WheelPickerContextValue | null>(null);

function useWheelPickerContext() {
  const context = React.useContext(WheelPickerContext);
  if (!context) throw new Error("WheelPicker.Column must be rendered inside WheelPicker.Root.");
  return context;
}

export interface WheelPickerOption {
  value: string;
  label: React.ReactNode;
  /** React 요소 label을 스크린 리더에서 읽을 문자열입니다. */
  ariaLabel?: string;
}

export interface WheelPickerValueChangeDetails {
  /** 직전에 정착한 항목에서 이동한 칸 수입니다. 뒤 항목으로 이동하면 양수입니다. */
  stepDelta: number;
}

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - keyboard / focus / Tab: Lynx에 DOM 키보드 포커스·Tab 탐색 모델이 없습니다.
 * - readOnly의 포커스 유지: 같은 이유로 포커스 의미 없이 터치 조작만 막고 enabled 색을 유지합니다.
 * - group 역할: Lynx accessibility-element는 하위 컬럼 탐색을 가릴 수 있어 Root에는 기본 접근성 역할을 두지 않습니다.
 *   이름과 현재 값은 각 Column의 accessibility-*로 제공합니다.
 */
export interface WheelPickerRootProps
  extends Omit<WheelPickerVariantProps, "selected">,
    Omit<LynxViewProps, "children">,
    LynxAccessibilityProps {
  /** WheelPicker.Column 목록입니다. */
  children: React.ReactNode;
  /** 모든 컬럼의 터치 조작을 막고 disabled 색을 적용합니다. */
  disabled?: boolean;
  /** 터치 조작을 막되 enabled 색을 유지합니다. */
  readOnly?: boolean;
  /** Scroll Fog가 위아래에서 차지하는 크기입니다. 숫자는 px 단위입니다. */
  scrollFogSize?: ScrollFogProps["size"];
  /** 한 항목의 높이(px)입니다. 기본값은 small 36 / medium 44입니다. */
  itemSize?: number;
  /** 화면에 보이는 항목 수입니다. 5 이상의 홀수를 권장합니다. @default 5 */
  visibleItemCount?: number;
}

export const WheelPickerRoot = React.forwardRef<NodesRef, WheelPickerRootProps>((props, ref) => {
  const [variantProps, otherProps] = wheelPicker.splitVariantProps(props);
  const {
    children,
    className,
    style,
    itemSize: itemSizeProp,
    visibleItemCount = 5,
    readOnly = false,
    scrollFogSize,
    ...nativeProps
  } = otherProps;
  const size = variantProps.size ?? "medium";
  const disabled = variantProps.disabled ?? false;
  const sizeVars = size === "small" ? vars.sizeSmall.enabled : vars.sizeMedium.enabled;
  const itemSize = itemSizeProp ?? Number.parseFloat(sizeVars.item.height);
  const viewportSize = itemSize * visibleItemCount;
  const fogSize =
    scrollFogSize ??
    Math.min(Number(vars.base.enabled.scrollFog.maxHeightFraction) * viewportSize, itemSize * 3);
  const classNames = React.useMemo(() => wheelPicker(variantProps), [size, disabled]);
  const context = React.useMemo(
    () => ({ itemSize, visibleItemCount, disabled, readOnly }),
    [itemSize, visibleItemCount, disabled, readOnly],
  );
  // 수치 geometry만 CSS 변수로 넘기고 시각 스타일은 Recipe가 소유한다.
  const geometry = {
    "--seed-wheel-picker-item-size": `${itemSize}px`,
    "--seed-wheel-picker-viewport-size": `${viewportSize}px`,
  };
  const rootStyle =
    typeof style === "string"
      ? `${style};--seed-wheel-picker-item-size:${itemSize}px;--seed-wheel-picker-viewport-size:${viewportSize}px`
      : { ...style, ...geometry };

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!Number.isFinite(itemSize) || itemSize <= 0) {
      console.warn("WheelPicker.Root: itemSize는 0보다 큰 유한한 숫자여야 합니다.");
    }
    if (
      !Number.isInteger(visibleItemCount) ||
      visibleItemCount <= 0 ||
      visibleItemCount % 2 === 0
    ) {
      console.warn("WheelPicker.Root: visibleItemCount는 0보다 큰 홀수여야 합니다.");
    }
  }, [itemSize, visibleItemCount]);

  return (
    <ClassNamesProvider value={classNames}>
      <PropsProvider value={variantProps}>
        <WheelPickerContext.Provider value={context}>
          <view
            {...nativeProps}
            {...(ref ? { ref } : {})}
            className={clsx(classNames.root, className)}
            style={rootStyle}
          >
            <view className={classNames.selectionIndicator} accessibility-elements-hidden />
            <ScrollFog
              className={classNames.scrollFog}
              placement={["top", "bottom"]}
              size={fogSize}
            >
              <view className={classNames.columns}>{children}</view>
            </ScrollFog>
          </view>
        </WheelPickerContext.Provider>
      </PropsProvider>
    </ClassNamesProvider>
  );
});
WheelPickerRoot.displayName = "WheelPickerRoot";

export interface WheelPickerItemLabelProps extends LynxViewProps {}

/** 항목의 기본 여백·타이포그래피를 적용하며 문자열과 숫자는 text로 감쌉니다. */
export const WheelPickerItemLabel = React.forwardRef<NodesRef, WheelPickerItemLabelProps>(
  ({ children, className, ...nativeProps }, ref) => {
    const classes = useClassNames();
    return (
      <view
        {...nativeProps}
        {...(ref ? { ref } : {})}
        className={clsx(classes.itemLabel, className)}
      >
        {toArray(children).map((child, index) =>
          typeof child === "string" || typeof child === "number" ? (
            <text key={index} className={classes.itemText}>
              {child}
            </text>
          ) : (
            child
          ),
        )}
      </view>
    );
  },
);
WheelPickerItemLabel.displayName = "WheelPickerItemLabel";

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - keyboard / focus / Tab: DOM 키보드 포커스 모델이 없어 native touch로 탐색합니다.
 * - aria-*: Lynx accessibility-*를 사용하며 현재 값을 accessibility-value로 제공합니다.
 */
export interface WheelPickerColumnProps
  extends Omit<LynxViewProps, "children" | MainThreadTouchKey>,
    LynxAccessibilityProps {
  /** 선택 항목입니다. value는 고유해야 하며 하나 이상의 항목이 필요합니다. */
  options: readonly WheelPickerOption[];
  value?: string;
  defaultValue?: string;
  /** 사용자 조작이 다른 항목에 정착했을 때 한 번 호출합니다. */
  onValueChange?: (value: string, details: WheelPickerValueChangeDetails) => void;
  /** 사용자 조작 중 가운데를 지난 항목마다 호출합니다. */
  onIndexChange?: (index: number, value: string) => void;
  /** 마지막 항목과 첫 항목을 이어 반복합니다. @default false */
  loop?: boolean;
  /** 외부 value 변경 시 이동 방식입니다. auto는 instant로 처리합니다. @default "auto" */
  valueChangeBehavior?: "auto" | "instant" | "smooth";
  /**
   * 현재 값의 접근성 텍스트입니다. ariaLabel·문자열 label·value보다 우선합니다.
   * 렌더 중에 호출되어 첫 화면에서는 Main Thread에서도 실행되므로, `NativeModules` 같은 Background 전용 API를 호출하지 않는 순수 함수여야 합니다.
   */
  getAriaValueText?: (value: string) => string;
  /**
   * 기본 ItemLabel 대신 항목 내용을 렌더합니다. 자손 text에는 항목의 선택·비활성 색을 적용합니다.
   * 렌더 중에 호출되어 첫 화면에서는 Main Thread에서도 실행되므로, Background 전용 API를 호출하지 않는 순수 함수여야 합니다.
   * inline 함수는 매 렌더 memo를 무효화하므로 `useCallback` 등으로 안정된 함수를 전달하는 것을 권장합니다.
   */
  renderLabel?: (option: WheelPickerOption) => React.ReactNode;
}

export const WheelPickerColumn = React.forwardRef<NodesRef, WheelPickerColumnProps>(
  (props, ref) => {
    const {
      options,
      value: valueProp,
      defaultValue,
      onValueChange,
      onIndexChange,
      loop = false,
      valueChangeBehavior = "auto",
      getAriaValueText,
      renderLabel,
      className,
      ...nativeProps
    } = props;
    const context = useWheelPickerContext();
    const classes = useClassNames();
    const variantProps = useProps();
    const highlightedClasses = React.useMemo(
      () => wheelPicker({ ...variantProps, selected: true }),
      [variantProps],
    );
    const fallbackValue = options[0]?.value;
    const detailsRef = React.useRef<WheelPickerValueChangeDetails>({ stepDelta: 0 });
    const [value, setValue] = useControllableState({
      value: valueProp,
      defaultValue: options.some((option) => option.value === defaultValue)
        ? defaultValue
        : fallbackValue,
      onChange: (nextValue) => {
        "background only";
        if (nextValue !== undefined) onValueChange?.(nextValue, detailsRef.current);
      },
    });
    const index = Math.max(
      options.findIndex((option) => option.value === value),
      0,
    );
    const currentOption = options[index];
    const inert = context.disabled || context.readOnly;

    React.useEffect(() => {
      if (process.env.NODE_ENV === "production") return;
      if (options.length === 0)
        console.warn("WheelPicker.Column: options에는 하나 이상의 항목이 필요합니다.");
      if (new Set(options.map((option) => option.value)).size !== options.length) {
        console.warn("WheelPicker.Column: option value는 고유해야 합니다.");
      }
      if (valueProp !== undefined && !options.some((option) => option.value === valueProp)) {
        console.warn("WheelPicker.Column: value는 options에 존재해야 합니다.");
      }
    }, [options, valueProp]);

    const handleSettled = React.useCallback(
      (nextIndex: number, details: WheelPickerValueChangeDetails) => {
        "background only";
        const option = options[nextIndex];
        if (inert || !option) return;
        detailsRef.current = details;
        setValue(option.value);
      },
      [inert, options, setValue],
    );
    const handleActiveIndex = React.useCallback(
      (nextIndex: number) => {
        "background only";
        const option = options[nextIndex];
        if (!inert && option) onIndexChange?.(nextIndex, option.value);
      },
      [inert, onIndexChange, options],
    );

    function renderItem(option: WheelPickerOption, itemClasses: typeof classes) {
      return (
        <view className={itemClasses.item}>
          {renderLabel ? (
            renderLabel(option)
          ) : (
            <WheelPickerItemLabel>{option.label}</WheelPickerItemLabel>
          )}
        </view>
      );
    }

    const sizingContent = React.useMemo(
      () => (
        <view className={classes.sizingContent} accessibility-elements-hidden>
          {options.map((option) => (
            <React.Fragment key={option.value}>{renderItem(option, classes)}</React.Fragment>
          ))}
        </view>
      ),
      [options, renderLabel, classes],
    );

    const accessibilityValue =
      currentOption === undefined
        ? undefined
        : (getAriaValueText?.(currentOption.value) ??
          currentOption.ariaLabel ??
          (typeof currentOption.label === "string" || typeof currentOption.label === "number"
            ? String(currentOption.label)
            : currentOption.value));

    return (
      <LoopScroll.Root
        accessibility-element
        accessibility-role-description="spinbutton"
        accessibility-value={accessibilityValue}
        accessibility-traits={context.disabled || options.length === 0 ? "disabled" : undefined}
        {...nativeProps}
        {...(ref ? { ref } : {})}
        className={clsx(classes.column, className)}
        itemCount={options.length}
        itemSize={context.itemSize}
        visibleItemCount={context.visibleItemCount}
        loop={loop}
        index={index}
        onIndexChange={handleSettled}
        onActiveIndexChange={onIndexChange ? handleActiveIndex : undefined}
        indexChangeBehavior={valueChangeBehavior === "smooth" ? "smooth" : "instant"}
        disabled={inert}
      >
        {sizingContent}
        <LoopScroll.Track className={classes.track} accessibility-elements-hidden>
          {({ index }: LoopScrollItem) => renderItem(options[index], classes)}
        </LoopScroll.Track>
        <ClassNamesProvider value={highlightedClasses}>
          <LoopScroll.Highlight>
            <LoopScroll.Track className={highlightedClasses.track}>
              {({ index }: LoopScrollItem) => renderItem(options[index], highlightedClasses)}
            </LoopScroll.Track>
          </LoopScroll.Highlight>
        </ClassNamesProvider>
      </LoopScroll.Root>
    );
  },
);
WheelPickerColumn.displayName = "WheelPickerColumn";
