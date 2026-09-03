"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
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
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { clsx } from "cn";
import * as React from "react";
import { InternalWheelPickerColumn, InternalWheelPickerRoot } from "../private/WheelPicker";
import { useStyleProps, type StyleProps } from "../../utils/styled";
import { ActionButton } from "../ActionButton";
import { Icon } from "../Icon";

// 44px × 7개 항목으로 308px viewport를 만들고, 336px 컨테이너 안에 중앙 정렬합니다.
const WHEEL_ITEM_SIZE = 44;
const WHEEL_VISIBLE_ITEM_COUNT = 7;

type DatePickerCssProperties = React.CSSProperties & {
  "--seed-date-picker-continuous-spacer-height"?: string;
};

function getContinuousSpacerStyle(height: number): DatePickerCssProperties {
  return { "--seed-date-picker-continuous-spacer-height": `${height}px` };
}

type DatePickerRootProps = PrimitiveProps &
  Pick<StyleProps, "height" | "minHeight" | "maxHeight"> &
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

type DatePickerSharedProps = DatePickerBehaviorProps &
  DatePickerRootProps & {
    /** 날짜 이동과 포커스 action을 받는 ref입니다. */
    actionsRef?: React.Ref<DatePickerActions>;
  } & DatePickerCellCustomization;

type ContinuousSizeConstraint =
  | (Required<Pick<StyleProps, "height">> & Pick<StyleProps, "minHeight" | "maxHeight">)
  | (Required<Pick<StyleProps, "minHeight">> & Pick<StyleProps, "height" | "maxHeight">)
  | (Required<Pick<StyleProps, "maxHeight">> & Pick<StyleProps, "height" | "minHeight">);

export type DatePickerProps = DatePickerSharedProps;
export type TwoMonthDatePickerProps = DatePickerSharedProps;
export type WeekDatePickerProps = DatePickerSharedProps;
type DatePickerPropsWithoutSize<Props = DatePickerSharedProps> = Props extends DatePickerSharedProps
  ? Omit<Props, "height" | "minHeight" | "maxHeight">
  : never;
export type ContinuousDatePickerProps = DatePickerPropsWithoutSize &
  ContinuousSizeConstraint & {
    /**
     * 노출하고 이동할 수 있는 월 범위입니다. 양끝 월을 포함합니다.
     * 생략하면 `yearRange.start`의 1월부터 `yearRange.end`의 12월까지 노출합니다.
     */
    monthRange?: DatePickerMonthRange;
  };

type DatePickerImplementationProps = DatePickerSharedProps & {
  visibleRange: DatePickerVisibleRange;
  monthRange?: DatePickerMonthRange;
};

type NavigationChevronIconProps = React.SVGProps<SVGSVGElement> & {
  direction: "left" | "right";
};

const NavigationChevronIcon = React.forwardRef<SVGSVGElement, NavigationChevronIconProps>(
  ({ direction, ...props }, ref) => {
    const path =
      direction === "left"
        ? "M22.7931 13.0704C23.0788 13.3703 23.0672 13.8451 22.7673 14.1307L16.5875 20.0166L22.7672 25.9017C23.0672 26.1873 23.0788 26.6621 22.7931 26.962C22.5075 27.262 22.0327 27.2736 21.7328 26.9879L14.9828 20.5598C14.8341 20.4182 14.75 20.2219 14.75 20.0167C14.75 19.8114 14.8341 19.6151 14.9827 19.4736L21.7327 13.0446C22.0327 12.7589 22.5074 12.7704 22.7931 13.0704Z"
        : "M17.2069 13.0704C16.9212 13.3703 16.9328 13.8451 17.2327 14.1307L23.4125 20.0166L17.2328 25.9017C16.9328 26.1873 16.9212 26.6621 17.2069 26.962C17.4925 27.262 17.9673 27.2736 18.2672 26.9879L25.0172 20.5598C25.1659 20.4182 25.25 20.2219 25.25 20.0167C25.25 19.8114 25.1659 19.6151 25.0173 19.4736L18.2673 13.0446C17.9673 12.7589 17.4926 12.7704 17.2069 13.0704Z";

    return (
      <svg ref={ref} {...props} viewBox="8 8 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d={path} fill="currentColor" />
      </svg>
    );
  },
);
NavigationChevronIcon.displayName = "NavigationChevronIcon";

type HeaderChevronIconProps = React.SVGProps<SVGSVGElement> & {
  expanded: boolean;
};

const HeaderChevronIcon = React.forwardRef<SVGSVGElement, HeaderChevronIconProps>(
  ({ expanded, ...props }, ref) => (
    <svg ref={ref} {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.2453 7.74286C5.57141 7.4181 6.09905 7.41919 6.42381 7.7453L9.98736 11.3237L13.5808 7.77134C13.9081 7.44778 14.4357 7.45081 14.7593 7.77812C15.0829 8.10542 15.0798 8.63305 14.7525 8.95661L10.5686 13.0926C10.2422 13.4154 9.7162 13.4133 9.39228 13.088L5.24286 8.92137C4.9181 8.59526 4.91919 8.06762 5.2453 7.74286Z"
        fill="currentColor"
        transform={expanded ? "rotate(180 10 10)" : undefined}
      />
    </svg>
  ),
);
HeaderChevronIcon.displayName = "HeaderChevronIcon";

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
  renderDateCellContent: DatePickerImplementationProps["renderDateCellContent"];
  renderDateCellSupplement: DatePickerImplementationProps["renderDateCellSupplement"];
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
  renderDateCellContent: DatePickerImplementationProps["renderDateCellContent"];
  renderDateCellSupplement: DatePickerImplementationProps["renderDateCellSupplement"];
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
  direction,
  className,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  direction: "left" | "right";
}) {
  return (
    <ActionButton {...props} variant="ghost" size="medium" layout="iconOnly" className={className}>
      <Icon svg={<NavigationChevronIcon direction={direction} />} />
    </ActionButton>
  );
}

function Header({
  api,
  classNames,
}: {
  api: ReturnType<typeof useDatePicker>;
  classNames: ReturnType<typeof datePicker>;
}) {
  const previousDirection = api.isRtl ? "right" : "left";
  const nextDirection = api.isRtl ? "left" : "right";

  return (
    <Primitive.div className={classNames.header}>
      <Primitive.button
        {...api.monthYearButtonProps}
        id={`${api.rootProps.id}-header-label`}
        className={classNames.headerLabel}
      >
        <Primitive.span data-date-picker-header-label="">{api.headerLabel}</Primitive.span>
        <Primitive.span className={classNames.headerChevron}>
          <Icon svg={<HeaderChevronIcon expanded={api.isWheelOpen} />} />
        </Primitive.span>
      </Primitive.button>
      <Primitive.div className={classNames.navigation}>
        <NavigationButton
          {...api.previousButtonProps}
          direction={previousDirection}
          className={classNames.navigationButton}
        />
        <NavigationButton
          {...api.nextButtonProps}
          direction={nextDirection}
          className={classNames.navigationButton}
        />
      </Primitive.div>
    </Primitive.div>
  );
}

function TwoMonthHeader({
  api,
  classNames,
  label,
  labelId,
  position,
}: {
  api: ReturnType<typeof useDatePicker>;
  classNames: ReturnType<typeof datePicker>;
  label: string;
  labelId: string;
  position: "first" | "last";
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
        direction={direction}
        data-placement={isFirst ? "start" : "end"}
        className={classNames.twoMonthNavigationButton}
      />
    </Primitive.div>
  );
}

function WheelView({
  api,
  classNames,
}: {
  api: ReturnType<typeof useDatePicker>;
  classNames: ReturnType<typeof datePicker>;
}) {
  return (
    <Primitive.div className={classNames.wheelContainer}>
      <InternalWheelPickerRoot
        {...api.wheelProps}
        itemSize={WHEEL_ITEM_SIZE}
        visibleItemCount={WHEEL_VISIBLE_ITEM_COUNT}
        disabled={api.disabled}
        readOnly={api.readOnly}
        aria-label={api.headerLabel}
        className={classNames.wheelView}
        columnsClassName={classNames.wheelColumns}
        scrollFogClassName={classNames.wheelScrollFog}
        selectionIndicatorClassName={classNames.wheelSelectionIndicator}
        fogSize={102}
      >
        <InternalWheelPickerColumn
          aria-label={api.ariaLabels.yearWheel}
          className={classNames.yearColumn}
          itemClassName={classNames.wheelItem}
          options={api.wheel.yearOptions}
          value={api.wheel.yearValue}
          onValueChange={api.wheel.onYearValueChange}
          loop={false}
        />
        <InternalWheelPickerColumn
          aria-label={api.ariaLabels.monthWheel}
          className={classNames.monthColumn}
          itemClassName={classNames.wheelItem}
          options={api.wheel.monthOptions}
          value={api.wheel.monthValue}
          onValueChange={api.wheel.onMonthValueChange}
          loop
        />
      </InternalWheelPickerRoot>
    </Primitive.div>
  );
}

const DatePickerImplementation = React.forwardRef<HTMLDivElement, DatePickerImplementationProps>(
  (props, forwardedRef) => {
    const api = useDatePicker(props);
    const [variantProps, otherProps] = datePicker.splitVariantProps(props);
    const classNames = datePicker({
      ...variantProps,
      visibleRange: api.visibleRange,
    });
    const {
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
      ...styleAndRootProps
    } = otherProps;
    const { style: styleProps, restProps: rootProps } = useStyleProps(styleAndRootProps);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const hasContinuousSizeConstraint =
      props.height !== undefined || props.minHeight !== undefined || props.maxHeight !== undefined;

    React.useEffect(() => {
      if (process.env.NODE_ENV === "production" || api.visibleRange !== "continuous") return;
      if (!hasContinuousSizeConstraint) {
        console.warn("ContinuousDatePicker: height, minHeight 또는 maxHeight가 필요합니다.");
      }
    }, [api.visibleRange, hasContinuousSizeConstraint]);

    React.useImperativeHandle(actionsRef, () => api.actions, [api.actions]);

    const rootAriaLabel = ariaLabelledby ? ariaLabel : (ariaLabel ?? api.ariaLabels.root);

    return (
      <Primitive.div
        ref={composeRefs(forwardedRef, rootRef, api.refs.root)}
        {...mergeProps(api.rootProps, rootProps)}
        aria-label={rootAriaLabel}
        aria-labelledby={ariaLabelledby}
        className={clsx(classNames.root, className)}
        style={styleProps}
      >
        {api.visibleRange === "continuous" ? (
          <Primitive.div
            ref={api.refs.continuousScroll}
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
        ) : (
          <>
            {api.visibleRange !== "twoMonths" && <Header api={api} classNames={classNames} />}
            <Primitive.div
              data-wheel-open={api.isWheelOpen && api.visibleRange !== "twoMonths" ? "" : undefined}
              aria-hidden={api.isWheelOpen && api.visibleRange !== "twoMonths" ? true : undefined}
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
                          />
                        )
                      : undefined
                  }
                />
              ))}
            </Primitive.div>
            {api.isWheelOpen && api.visibleRange !== "twoMonths" && (
              <WheelView api={api} classNames={classNames} />
            )}
          </>
        )}
        <Primitive.span {...api.liveRegionProps} className={classNames.liveRegion}>
          {api.headerLabel}
        </Primitive.span>
      </Primitive.div>
    );
  },
);
DatePickerImplementation.displayName = "DatePickerImplementation";

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => (
  <DatePickerImplementation ref={ref} {...props} visibleRange="month" />
));
DatePicker.displayName = "DatePicker";

export const TwoMonthDatePicker = React.forwardRef<HTMLDivElement, TwoMonthDatePickerProps>(
  (props, ref) => <DatePickerImplementation ref={ref} {...props} visibleRange="twoMonths" />,
);
TwoMonthDatePicker.displayName = "TwoMonthDatePicker";

export const WeekDatePicker = React.forwardRef<HTMLDivElement, WeekDatePickerProps>(
  (props, ref) => <DatePickerImplementation ref={ref} {...props} visibleRange="week" />,
);
WeekDatePicker.displayName = "WeekDatePicker";

export const ContinuousDatePicker = React.forwardRef<HTMLDivElement, ContinuousDatePickerProps>(
  (props, ref) => <DatePickerImplementation ref={ref} {...props} visibleRange="continuous" />,
);
ContinuousDatePicker.displayName = "ContinuousDatePicker";

export type {
  DatePickerActions,
  DatePickerAriaLabels,
  DatePickerConstraint,
  DatePickerConstraintContext,
  DatePickerDate,
  DatePickerMonthRange,
  DatePickerMultipleProps,
  DatePickerRangeProps,
  DatePickerRangeValue,
  DatePickerSelectionMode,
  DatePickerSingleProps,
  DatePickerValue,
  DatePickerYearMonth,
} from "@seed-design/react-date-picker";
