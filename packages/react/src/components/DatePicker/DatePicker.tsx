"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { datePicker } from "@seed-design/css/recipes/date-picker";
import { mergeProps } from "@seed-design/dom-utils";
import {
  useDatePicker,
  type DatePickerCell,
  type DatePickerCellState,
  type DatePickerMonth,
  type UseDatePickerProps,
} from "@seed-design/react-date-picker";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { InternalWheelPickerColumn, InternalWheelPickerRoot } from "../private/WheelPicker";
import { useStyleProps, type StyleProps } from "../../utils/styled";
import { ActionButton } from "../ActionButton";
import { Icon } from "../Icon";

const WHEEL_ITEM_SIZE = 44;
const WHEEL_VISIBLE_ITEM_COUNT = 7;

type DatePickerRootProps = PrimitiveProps &
  Pick<StyleProps, "height" | "minHeight" | "maxHeight"> &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "onChange" | "onValueChange"
  >;

export interface DatePickerCellContentRenderProps extends DatePickerCellState {}

export type DatePickerProps = UseDatePickerProps &
  DatePickerRootProps & {
    /**
     * 날짜 셀의 접근성·인터랙션 구조는 유지하면서 내부 콘텐츠를 교체합니다.
     */
    renderDateCellContent?: (props: DatePickerCellContentRenderProps) => React.ReactNode;
  };

function NavigationChevronIcon({ direction }: { direction: "left" | "right" }) {
  const path =
    direction === "left"
      ? "M22.7931 13.0704C23.0788 13.3703 23.0672 13.8451 22.7673 14.1307L16.5875 20.0166L22.7672 25.9017C23.0672 26.1873 23.0788 26.6621 22.7931 26.962C22.5075 27.262 22.0327 27.2736 21.7328 26.9879L14.9828 20.5598C14.8341 20.4182 14.75 20.2219 14.75 20.0167C14.75 19.8114 14.8341 19.6151 14.9827 19.4736L21.7327 13.0446C22.0327 12.7589 22.5074 12.7704 22.7931 13.0704Z"
      : "M17.2069 13.0704C16.9212 13.3703 16.9328 13.8451 17.2327 14.1307L23.4125 20.0166L17.2328 25.9017C16.9328 26.1873 16.9212 26.6621 17.2069 26.962C17.4925 27.262 17.9673 27.2736 18.2672 26.9879L25.0172 20.5598C25.1659 20.4182 25.25 20.2219 25.25 20.0167C25.25 19.8114 25.1659 19.6151 25.0173 19.4736L18.2673 13.0446C17.9673 12.7589 17.4926 12.7704 17.2069 13.0704Z";

  return (
    <svg viewBox="8 8 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d={path} fill="currentColor" />
    </svg>
  );
}

function HeaderChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.2453 7.74286C5.57141 7.4181 6.09905 7.41919 6.42381 7.7453L9.98736 11.3237L13.5808 7.77134C13.9081 7.44778 14.4357 7.45081 14.7593 7.77812C15.0829 8.10542 15.0798 8.63305 14.7525 8.95661L10.5686 13.0926C10.2422 13.4154 9.7162 13.4133 9.39228 13.088L5.24286 8.92137C4.9181 8.59526 4.91919 8.06762 5.2453 7.74286Z"
        fill="currentColor"
        transform={expanded ? "rotate(180 10 10)" : undefined}
      />
    </svg>
  );
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
}: {
  cell: DatePickerCell | null;
  classNames: ReturnType<typeof datePicker>;
  renderDateCellContent: DatePickerProps["renderDateCellContent"];
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
            <Primitive.span>{cell.formattedDay}</Primitive.span>
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
  showWeekdays,
  showMonthLabel,
  renderHeader,
  monthRef,
}: {
  api: ReturnType<typeof useDatePicker>;
  classNames: ReturnType<typeof datePicker>;
  month: DatePickerMonth;
  renderDateCellContent: DatePickerProps["renderDateCellContent"];
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
        <span>{api.headerLabel}</span>
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

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (props, forwardedRef) => {
    const api = useDatePicker(props);
    const [variantProps, otherProps] = datePicker.splitVariantProps(props);
    const classNames = datePicker({
      ...variantProps,
      visibleRange: api.visibleRange,
    });
    const {
      renderDateCellContent,
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
      constraints: _constraints,
      disabled: _disabled,
      readOnly: _readOnly,
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
        console.warn(
          'DatePicker: visibleRange="continuous"는 height, minHeight 또는 maxHeight가 필요합니다.',
        );
      }
    }, [api.visibleRange, hasContinuousSizeConstraint]);

    const rootAriaLabel = ariaLabelledby
      ? ariaLabel
      : (ariaLabel ??
        (new Intl.Locale(api.locale).language === "ko" ? "날짜 선택" : "Select date"));

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
              <Primitive.div aria-hidden="true" style={{ height: api.virtual.topHeight }} />
              {api.months.map((month) => (
                <MonthView
                  key={month.key}
                  api={api}
                  classNames={classNames}
                  month={month}
                  renderDateCellContent={renderDateCellContent}
                  showWeekdays={false}
                  showMonthLabel
                  monthRef={api.refs.continuousMonth(month.key)}
                />
              ))}
              <Primitive.div aria-hidden="true" style={{ height: api.virtual.bottomHeight }} />
            </Primitive.div>
          </Primitive.div>
        ) : (
          <>
            {api.visibleRange !== "twoMonths" && <Header api={api} classNames={classNames} />}
            {api.isWheelOpen && api.visibleRange !== "twoMonths" ? (
              <WheelView api={api} classNames={classNames} />
            ) : (
              <Primitive.div className={classNames.months}>
                {api.months.map((month, index) => (
                  <MonthView
                    key={month.key}
                    api={api}
                    classNames={classNames}
                    month={month}
                    renderDateCellContent={renderDateCellContent}
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
DatePicker.displayName = "DatePicker";

export type {
  DatePickerAriaLabels,
  DatePickerConstraint,
  DatePickerConstraintContext,
  DatePickerDate,
  DatePickerMultipleProps,
  DatePickerRangeProps,
  DatePickerRangeValue,
  DatePickerSelectionMode,
  DatePickerSingleProps,
  DatePickerValue,
  DatePickerVisibleRange,
} from "@seed-design/react-date-picker";
