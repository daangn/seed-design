import preview from "../.storybook/preview";
import {
  Box,
  ContinuousDatePicker,
  DatePicker,
  Text,
  TwoMonthDatePicker,
  WeekDatePicker,
  type DatePickerProps,
} from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { withChromaticParameters } from "./utils/parameters";

type DatePickerPreviewProps = DatePickerProps & {
  previewWidth?: string;
  layout?: "month" | "twoMonths" | "week";
};

const customCellProps = {
  constraints: [(date) => date.day !== 13],
  renderDateCellSupplement: ({ date, isUnavailable }) => (
    <Box asChild maxWidth="full">
      <Text as="span" textStyle="t1Regular" color="fg.neutralMuted" maxLines={1}>
        {isUnavailable ? "마감" : date.day % 3 === 0 ? "9만원" : "예약 가능"}
      </Text>
    </Box>
  ),
} satisfies DatePickerProps;

const DatePickerPreview = ({
  previewWidth = "358px",
  layout = "month",
  ...props
}: DatePickerPreviewProps) => {
  const Component =
    layout === "twoMonths" ? TwoMonthDatePicker : layout === "week" ? WeekDatePicker : DatePicker;

  return (
    <Box width={previewWidth} maxWidth="100%">
      <Component
        today={{ year: 2026, month: 7, day: 30 }}
        yearRange={{ start: 2025, end: 2027 }}
        {...props}
      />
    </Box>
  );
};

const meta = preview.meta({
  component: DatePickerPreview,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  case: {
    Single: {
      defaultValue: { year: 2026, month: 7, day: 30 },
    },
    Range: {
      selectionMode: "range",
      defaultValue: {
        start: { year: 2026, month: 7, day: 10 },
        end: { year: 2026, month: 7, day: 15 },
      },
    },
    "Range Start Read Only": {
      selectionMode: "range",
      rangeStartReadOnly: true,
      defaultValue: {
        start: { year: 2026, month: 7, day: 7 },
        end: { year: 2026, month: 7, day: 9 },
      },
    },
    Multiple: {
      selectionMode: "multiple",
      defaultValue: [
        { year: 2026, month: 7, day: 7 },
        { year: 2026, month: 7, day: 14 },
        { year: 2026, month: 7, day: 21 },
      ],
    },
    "Two Months": {
      selectionMode: "range",
      layout: "twoMonths",
      previewWidth: "720px",
    },
    Week: {
      layout: "week",
    },
    "Custom Cell": {
      ...customCellProps,
    },
    Disabled: {
      defaultValue: { year: 2026, month: 7, day: 30 },
      disabled: true,
    },
  } satisfies Record<string, DatePickerPreviewProps>,
};

const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={{}} conditionMap={conditionMap} {...args} />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});

export const Continuous = meta.story({
  render: () => (
    <Box width="358px" height="420px">
      <ContinuousDatePicker
        selectionMode="range"
        height="full"
        today={{ year: 2026, month: 7, day: 30 }}
        yearRange={{ start: 2025, end: 2027 }}
      />
    </Box>
  ),
});

export const ContinuousCustomCell = meta.story({
  render: () => (
    <Box width="358px" height="560px">
      <ContinuousDatePicker
        height="full"
        today={{ year: 2026, month: 7, day: 30 }}
        yearRange={{ start: 2025, end: 2027 }}
        {...customCellProps}
      />
    </Box>
  ),
});
