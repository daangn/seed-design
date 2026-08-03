import './date-picker.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const datePickerSlotNames = [
  [
    "root",
    "seed-date-picker__root"
  ],
  [
    "header",
    "seed-date-picker__header"
  ],
  [
    "headerLabel",
    "seed-date-picker__headerLabel"
  ],
  [
    "headerChevron",
    "seed-date-picker__headerChevron"
  ],
  [
    "navigation",
    "seed-date-picker__navigation"
  ],
  [
    "navigationButton",
    "seed-date-picker__navigationButton"
  ],
  [
    "twoMonthHeader",
    "seed-date-picker__twoMonthHeader"
  ],
  [
    "twoMonthLabel",
    "seed-date-picker__twoMonthLabel"
  ],
  [
    "twoMonthNavigationButton",
    "seed-date-picker__twoMonthNavigationButton"
  ],
  [
    "weekdayRow",
    "seed-date-picker__weekdayRow"
  ],
  [
    "weekday",
    "seed-date-picker__weekday"
  ],
  [
    "months",
    "seed-date-picker__months"
  ],
  [
    "month",
    "seed-date-picker__month"
  ],
  [
    "monthLabel",
    "seed-date-picker__monthLabel"
  ],
  [
    "grid",
    "seed-date-picker__grid"
  ],
  [
    "weekRow",
    "seed-date-picker__weekRow"
  ],
  [
    "dateCell",
    "seed-date-picker__dateCell"
  ],
  [
    "dateButton",
    "seed-date-picker__dateButton"
  ],
  [
    "dateContent",
    "seed-date-picker__dateContent"
  ],
  [
    "emptyCell",
    "seed-date-picker__emptyCell"
  ],
  [
    "continuousScroll",
    "seed-date-picker__continuousScroll"
  ],
  [
    "continuousContent",
    "seed-date-picker__continuousContent"
  ],
  [
    "continuousSpacer",
    "seed-date-picker__continuousSpacer"
  ],
  [
    "wheelContainer",
    "seed-date-picker__wheelContainer"
  ],
  [
    "wheelView",
    "seed-date-picker__wheelView"
  ],
  [
    "wheelColumns",
    "seed-date-picker__wheelColumns"
  ],
  [
    "wheelSelectionIndicator",
    "seed-date-picker__wheelSelectionIndicator"
  ],
  [
    "wheelScrollFog",
    "seed-date-picker__wheelScrollFog"
  ],
  [
    "yearColumn",
    "seed-date-picker__yearColumn"
  ],
  [
    "monthColumn",
    "seed-date-picker__monthColumn"
  ],
  [
    "wheelItem",
    "seed-date-picker__wheelItem"
  ],
  [
    "liveRegion",
    "seed-date-picker__liveRegion"
  ]
];

const defaultVariant = {
  "visibleRange": "month"
};

const compoundVariants = [];

export const datePickerVariantMap = {
  "visibleRange": [
    "month",
    "twoMonths",
    "continuous",
    "week"
  ]
};

export const datePickerVariantKeys = Object.keys(datePickerVariantMap);

export function datePicker(props) {
  return Object.fromEntries(
    datePickerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(datePicker, { splitVariantProps: (props) => splitVariantProps(props, datePickerVariantMap) });

// @recipe(seed): date-picker