"use client";

import { datePicker } from "@seed-design/css/recipes/date-picker";
import { mergeProps } from "@seed-design/dom-utils";
import {
  useDatePicker,
  type DatePickerActions,
  type DatePickerCell,
  type DatePickerCellState,
  type DatePickerMonth,
  type DatePickerMonthRange,
  type DatePickerVisibleRange,
  type UseDatePickerProps,
} from "@seed-design/react-date-picker";
import { Popover as PopoverPrimitive, usePopoverContext } from "@seed-design/react-popover";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import { Box, type BoxProps } from "../Box/Box";
import { Icon } from "../Icon/Icon";

// Month는 44px × 7개 항목으로 308px viewport를 만들고, 336px 컨테이너 안에 중앙 정렬합니다.
// Week는 Wheel Picker small 크기(36px × 5개 항목)를 popover 안에 그대로 사용합니다.
const MONTH_WHEEL_ITEM_SIZE = 44;
const MONTH_WHEEL_VISIBLE_ITEM_COUNT = 7;
const MONTH_WHEEL_SCROLL_FOG_SIZE = 102;
const WEEK_WHEEL_POPOVER_GUTTER = 4;

type DatePickerCssProperties = React.CSSProperties & {
  "--seed-date-picker-continuous-spacer-height"?: string;
};

function getContinuousSpacerStyle(height: number): DatePickerCssProperties {
  return { "--seed-date-picker-continuous-spacer-height": `${height}px` };
}

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value);
      else if (ref) ref.current = value;
    }
  };
}

type DatePickerRootElementProps = PrimitiveProps &
  Pick<BoxProps, "height" | "minHeight" | "maxHeight"> &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "onChange" | "onValueChange"
  >;

export interface DatePickerCellContentRenderProps extends DatePickerCellState {}

type DatePickerBehaviorProps = UseDatePickerProps extends infer Props
  ? Props extends UseDatePickerProps
    ? Omit<Props, "visibleRange" | "monthRange">
    : never
  : never;

type DatePickerCellCustomization =
  | {
      /**
       * 기본 날짜 숫자 아래에 부가 콘텐츠를 추가합니다.
       * 날짜 숫자를 유지하는 대부분의 사례에서는 이 prop을 우선 사용하세요.
       */
      renderDateCellSupplement?: (props: DatePickerCellContentRenderProps) => React.ReactNode;
      renderDateCellContent?: never;
    }
  | {
      /**
       * `renderDateCellSupplement`로 표현할 수 없을 때 내부 콘텐츠 전체를 교체하는
       * 저수준 이스케이프 해치입니다. 날짜 셀의 접근성·인터랙션 구조는 유지됩니다.
       */
      renderDateCellContent?: (props: DatePickerCellContentRenderProps) => React.ReactNode;
      renderDateCellSupplement?: never;
    };

export type DatePickerRootProps = DatePickerBehaviorProps &
  DatePickerRootElementProps &
  DatePickerCellCustomization & {
    /** Date Picker가 표시할 달력 레이아웃입니다. */
    visibleRange: DatePickerVisibleRange;

    /** Continuous 레이아웃에서 노출하고 이동할 수 있는 월 범위입니다. */
    monthRange?: DatePickerMonthRange;

    /** 날짜 이동과 포커스 action을 받는 ref입니다. */
    actionsRef?: React.Ref<DatePickerActions>;

    children?: React.ReactNode;
  };

type DatePickerContextValue = {
  api: ReturnType<typeof useDatePicker>;
  classNames: ReturnType<typeof datePicker>;
  renderDateCellContent: DatePickerRootProps["renderDateCellContent"];
  renderDateCellSupplement: DatePickerRootProps["renderDateCellSupplement"];
};

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

function useDatePickerContext() {
  const context = React.useContext(DatePickerContext);
  if (!context)
    throw new Error("DatePicker compound components must be used within DatePicker.Root");
  return context;
}

function WeekdayRow({
  api,
  classNames,
  semantic = true,
}: {
  api: ReturnType<typeof useDatePicker>;
  classNames: ReturnType<typeof datePicker>;
  semantic?: boolean;
}) {
  return (
    <Primitive.div
      role={semantic ? "row" : undefined}
      aria-hidden={semantic ? undefined : true}
      className={classNames.weekdayRow}
    >
      {api.weekdayLabels.map((weekday) => (
        <Primitive.div
          key={weekday.key}
          role={semantic ? "columnheader" : undefined}
          aria-label={semantic ? weekday.long : undefined}
          className={classNames.weekday}
        >
          <span aria-hidden="true">{weekday.short}</span>
        </Primitive.div>
      ))}
    </Primitive.div>
  );
}

function DateCellView({
  cell,
  classNames,
  renderDateCellContent,
  renderDateCellSupplement,
}: {
  cell: DatePickerCell | null;
  classNames: ReturnType<typeof datePicker>;
  renderDateCellContent: DatePickerRootProps["renderDateCellContent"];
  renderDateCellSupplement: DatePickerRootProps["renderDateCellSupplement"];
}) {
  if (cell === null) {
    return <Primitive.div role="gridcell" className={classNames.emptyCell} />;
  }

  const { cellProps, buttonProps, key: _key, ...renderProps } = cell;

  return (
    <Primitive.div {...cellProps} className={classNames.dateCell}>
      <Primitive.button {...buttonProps} className={classNames.dateButton}>
        <Primitive.span className={classNames.dateContent}>
          {renderDateCellContent ? (
            renderDateCellContent(renderProps)
          ) : (
            <>
              <Primitive.span data-date-picker-day="">{cell.formattedDay}</Primitive.span>
              {renderDateCellSupplement?.(renderProps)}
            </>
          )}
        </Primitive.span>
      </Primitive.button>
    </Primitive.div>
  );
}

function MonthView({
  api,
  classNames,
  month,
  renderDateCellContent,
  renderDateCellSupplement,
  showWeekdays,
  showMonthLabel,
  renderHeader,
  monthRef,
}: {
  api: ReturnType<typeof useDatePicker>;
  classNames: ReturnType<typeof datePicker>;
  month: DatePickerMonth;
  renderDateCellContent: DatePickerRootProps["renderDateCellContent"];
  renderDateCellSupplement: DatePickerRootProps["renderDateCellSupplement"];
  showWeekdays: boolean;
  showMonthLabel: boolean;
  renderHeader?: (labelId: string) => React.ReactNode;
  monthRef?: React.Ref<HTMLDivElement>;
}) {
  const labelId = `${api.rootProps.id}-${month.key}-label`;
  const headerLabelId = `${api.rootProps.id}-header-label`;

  return (
    <Primitive.div ref={monthRef} className={classNames.month}>
      {renderHeader?.(labelId)}
      {showMonthLabel ? (
        <Primitive.div id={labelId} className={classNames.monthLabel}>
          {month.label}
        </Primitive.div>
      ) : (
        <Primitive.span id={labelId} className={classNames.liveRegion}>
          {month.label}
        </Primitive.span>
      )}
      <Primitive.div
        {...api.gridProps}
        aria-labelledby={
          showMonthLabel || renderHeader
            ? labelId
            : api.visibleRange === "month"
              ? headerLabelId
              : labelId
        }
        className={classNames.grid}
      >
        {showWeekdays && <WeekdayRow api={api} classNames={classNames} />}
        {month.weeks.map((week) => (
          <Primitive.div key={week.key} role="row" className={classNames.weekRow}>
            {week.cells.map((cell, index) => (
              <DateCellView
                key={cell?.key ?? `${week.key}-empty-${index}`}
                cell={cell}
                classNames={classNames}
                renderDateCellContent={renderDateCellContent}
                renderDateCellSupplement={renderDateCellSupplement}
              />
            ))}
          </Primitive.div>
        ))}
      </Primitive.div>
    </Primitive.div>
  );
}

function NavigationButton({
  icon,
  className,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  icon: React.ReactNode;
}) {
  return (
    <ActionButton {...props} variant="ghost" size="medium" layout="iconOnly" className={className}>
      <Icon svg={icon} />
    </ActionButton>
  );
}

export interface DatePickerHeaderProps {
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  headerIcon: React.ReactNode;
}

export const DatePickerHeader = React.forwardRef<HTMLDivElement, DatePickerHeaderProps>(
  ({ leftIcon, rightIcon, headerIcon }, ref) => {
    const { api, classNames } = useDatePickerContext();
    // Week의 연·월 Wheel popover는 제목 버튼에 붙습니다.
    const popover = usePopoverContext();

    if (api.visibleRange === "continuous" || api.visibleRange === "twoMonths") return null;

    const previousIcon = api.isRtl ? rightIcon : leftIcon;
    const nextIcon = api.isRtl ? leftIcon : rightIcon;

    return (
      <Primitive.div ref={ref} className={classNames.header}>
        <Primitive.button
          ref={popover.refs.anchor}
          {...api.monthYearButtonProps}
          id={`${api.rootProps.id}-header-label`}
          className={classNames.headerLabel}
        >
          <Primitive.span data-date-picker-header-label="">{api.headerLabel}</Primitive.span>
          <Primitive.span
            data-expanded={api.isWheelOpen ? "" : undefined}
            className={classNames.headerChevron}
          >
            <Icon svg={headerIcon} />
          </Primitive.span>
        </Primitive.button>
        <Primitive.div className={classNames.navigation}>
          <NavigationButton
            {...api.previousButtonProps}
            icon={previousIcon}
            className={classNames.navigationButton}
          />
          <NavigationButton
            {...api.nextButtonProps}
            icon={nextIcon}
            className={classNames.navigationButton}
          />
        </Primitive.div>
      </Primitive.div>
    );
  },
);
DatePickerHeader.displayName = "DatePickerHeader";

function TwoMonthHeader({
  api,
  classNames,
  label,
  labelId,
  position,
  leftIcon,
  rightIcon,
}: {
  api: ReturnType<typeof useDatePicker>;
  classNames: ReturnType<typeof datePicker>;
  label: string;
  labelId: string;
  position: "first" | "last";
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
}) {
  const isFirst = position === "first";
  const direction = api.isRtl ? (isFirst ? "right" : "left") : isFirst ? "left" : "right";
  const buttonProps = isFirst ? api.previousButtonProps : api.nextButtonProps;

  return (
    <Primitive.div className={classNames.twoMonthHeader}>
      <Primitive.div id={labelId} className={classNames.twoMonthLabel}>
        {label}
      </Primitive.div>
      <NavigationButton
        {...buttonProps}
        icon={direction === "left" ? leftIcon : rightIcon}
        data-placement={isFirst ? "start" : "end"}
        className={classNames.twoMonthNavigationButton}
      />
    </Primitive.div>
  );
}

export interface DatePickerWheelColumn {
  id: "year" | "month";
  "aria-label": string;
  className: string;
  options: readonly { value: string; label: React.ReactNode }[];
  value: string;
  onValueChange: (value: string) => void;
  loop: boolean;
}

export interface DatePickerWheelRenderProps {
  rootProps: React.HTMLAttributes<HTMLDivElement> & {
    /** Month는 `medium`, Week popover는 `small` 크기를 사용합니다. */
    size: "small" | "medium";
    itemSize?: number;
    visibleItemCount?: number;
    disabled: boolean;
    readOnly: boolean;
    scrollFogSize?: number;
  };
  columns: readonly DatePickerWheelColumn[];
}

export interface DatePickerWheelProps {
  children: (props: DatePickerWheelRenderProps) => React.ReactNode;
}

export const DatePickerWheel = React.forwardRef<HTMLDivElement, DatePickerWheelProps>(
  ({ children }, ref) => {
    const { api, classNames } = useDatePickerContext();

    if (!api.isWheelOpen || api.visibleRange === "twoMonths" || api.visibleRange === "continuous") {
      return null;
    }

    const columns: readonly DatePickerWheelColumn[] = [
      {
        id: "year",
        "aria-label": api.ariaLabels.yearWheel,
        className: classNames.yearColumn,
        options: api.wheel.yearOptions,
        value: api.wheel.yearValue,
        onValueChange: api.wheel.onYearValueChange,
        loop: false,
      },
      {
        id: "month",
        "aria-label": api.ariaLabels.monthWheel,
        className: classNames.monthColumn,
        options: api.wheel.monthOptions,
        value: api.wheel.monthValue,
        onValueChange: api.wheel.onMonthValueChange,
        loop: true,
      },
    ];

    const sharedRootProps = {
      ...api.wheelProps,
      disabled: api.disabled,
      readOnly: api.readOnly,
      "aria-label": api.headerLabel,
      className: classNames.wheelView,
    };

    if (api.visibleRange === "week") {
      // Popover가 Escape·바깥 누르기·상위 layer 닫힘과 focus 이동·복귀를 맡습니다.
      return (
        <PopoverPrimitive.Positioner className={classNames.wheelPositioner}>
          <PopoverPrimitive.Content
            ref={ref}
            aria-labelledby={`${api.rootProps.id}-header-label`}
            className={classNames.wheelPopover}
          >
            {children({ rootProps: { ...sharedRootProps, size: "small" }, columns })}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Positioner>
      );
    }

    return (
      <Primitive.div ref={ref} className={classNames.wheelContainer}>
        {children({
          rootProps: {
            ...sharedRootProps,
            size: "medium",
            itemSize: MONTH_WHEEL_ITEM_SIZE,
            visibleItemCount: MONTH_WHEEL_VISIBLE_ITEM_COUNT,
            scrollFogSize: MONTH_WHEEL_SCROLL_FOG_SIZE,
          },
          columns,
        })}
      </Primitive.div>
    );
  },
);
DatePickerWheel.displayName = "DatePickerWheel";

export interface DatePickerCalendarProps {
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
}

export const DatePickerCalendar = React.forwardRef<HTMLDivElement, DatePickerCalendarProps>(
  ({ leftIcon, rightIcon }, ref) => {
    const { api, classNames, renderDateCellContent, renderDateCellSupplement } =
      useDatePickerContext();

    if (api.visibleRange === "continuous") {
      return (
        <Primitive.div
          ref={composeRefs(ref, api.refs.continuousScroll)}
          {...api.continuousScrollProps}
          data-date-picker-continuous-scroll=""
          className={classNames.continuousScroll}
        >
          <WeekdayRow api={api} classNames={classNames} semantic={false} />
          <Primitive.div className={classNames.continuousContent}>
            <Primitive.div
              aria-hidden="true"
              data-date-picker-continuous-spacer=""
              className={classNames.continuousSpacer}
              style={getContinuousSpacerStyle(api.virtual.topHeight)}
            />
            {api.months.map((month) => (
              <MonthView
                key={month.key}
                api={api}
                classNames={classNames}
                month={month}
                renderDateCellContent={renderDateCellContent}
                renderDateCellSupplement={renderDateCellSupplement}
                showWeekdays={false}
                showMonthLabel
                monthRef={api.refs.continuousMonth(month.key)}
              />
            ))}
            <Primitive.div
              aria-hidden="true"
              data-date-picker-continuous-spacer=""
              className={classNames.continuousSpacer}
              style={getContinuousSpacerStyle(api.virtual.bottomHeight)}
            />
          </Primitive.div>
        </Primitive.div>
      );
    }

    return (
      <Primitive.div
        ref={ref}
        data-wheel-open={api.isWheelOpen && api.visibleRange === "month" ? "" : undefined}
        aria-hidden={api.isWheelOpen && api.visibleRange === "month" ? true : undefined}
        className={classNames.months}
      >
        {api.months.map((month, index) => (
          <MonthView
            key={month.key}
            api={api}
            classNames={classNames}
            month={month}
            renderDateCellContent={renderDateCellContent}
            renderDateCellSupplement={renderDateCellSupplement}
            showWeekdays
            showMonthLabel={false}
            renderHeader={
              api.visibleRange === "twoMonths"
                ? (labelId) => (
                    <TwoMonthHeader
                      api={api}
                      classNames={classNames}
                      label={month.label}
                      labelId={labelId}
                      position={index === 0 ? "first" : "last"}
                      leftIcon={leftIcon}
                      rightIcon={rightIcon}
                    />
                  )
                : undefined
            }
          />
        ))}
      </Primitive.div>
    );
  },
);
DatePickerCalendar.displayName = "DatePickerCalendar";

export const DatePickerRoot = React.forwardRef<HTMLDivElement, DatePickerRootProps>(
  (props, forwardedRef) => {
    const api = useDatePicker(props);
    const [variantProps, otherProps] = datePicker.splitVariantProps(props);
    const classNames = datePicker({
      ...variantProps,
      visibleRange: api.visibleRange,
    });
    const {
      children,
      renderDateCellContent,
      renderDateCellSupplement,
      actionsRef,
      selectionMode: _selectionMode,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      viewDate: _viewDate,
      defaultViewDate: _defaultViewDate,
      onViewDateChange: _onViewDateChange,
      today: _today,
      locale: _locale,
      weekStartsOn: _weekStartsOn,
      yearRange: _yearRange,
      monthRange: _monthRange,
      constraints: _constraints,
      disabled: _disabled,
      readOnly: _readOnly,
      rangeStartReadOnly: _rangeStartReadOnly,
      ariaLabels: _ariaLabels,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      height,
      minHeight,
      maxHeight,
      ...rootProps
    } = otherProps;
    const hasContinuousSizeConstraint =
      props.height !== undefined || props.minHeight !== undefined || props.maxHeight !== undefined;

    React.useEffect(() => {
      if (process.env.NODE_ENV === "production" || api.visibleRange !== "continuous") return;
      if (!hasContinuousSizeConstraint) {
        console.warn(
          "DatePicker.Root: continuous에서는 height, minHeight 또는 maxHeight가 필요합니다.",
        );
      }
    }, [api.visibleRange, hasContinuousSizeConstraint]);

    React.useImperativeHandle(actionsRef, () => api.actions, [api.actions]);

    const rootAriaLabel = ariaLabelledby ? ariaLabel : (ariaLabel ?? api.ariaLabels.root);

    return (
      <DatePickerContext.Provider
        value={{ api, classNames, renderDateCellContent, renderDateCellSupplement }}
      >
        <PopoverPrimitive.Root
          open={api.visibleRange === "week" && api.isWheelOpen}
          // 바깥 누르기·Escape로 닫아도 제목 버튼으로 닫을 때처럼 고른 월을 반영합니다.
          onOpenChange={(open) => {
            if (!open) api.closeWheel();
          }}
          placement="bottom-start"
          gutter={WEEK_WHEEL_POPOVER_GUTTER}
        >
          <Box
            ref={composeRefs(forwardedRef, api.refs.root)}
            {...mergeProps(api.rootProps, rootProps)}
            aria-label={rootAriaLabel}
            aria-labelledby={ariaLabelledby}
            className={clsx(classNames.root, className)}
            height={height}
            minHeight={minHeight}
            maxHeight={maxHeight}
          >
            {children}
            <Primitive.span {...api.liveRegionProps} className={classNames.liveRegion}>
              {api.headerLabel}
            </Primitive.span>
          </Box>
        </PopoverPrimitive.Root>
      </DatePickerContext.Provider>
    );
  },
);
DatePickerRoot.displayName = "DatePickerRoot";

export type { DatePickerActions } from "@seed-design/react-date-picker";
