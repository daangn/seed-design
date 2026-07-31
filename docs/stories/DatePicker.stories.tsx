import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box, DatePicker, Text, type DatePickerProps } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "./utils/parameters";

type DatePickerPreviewProps = DatePickerProps & {
  previewWidth?: string;
};

const customCellProps = {
  constraints: [(date) => date.day !== 13],
  renderDateCellContent: ({ date, formattedDay, isUnavailable }) => (
    <>
      <Text as="span">{formattedDay}</Text>
      <Box asChild maxWidth="full">
        <Text as="span" textStyle="t1Regular" color="fg.neutralMuted" maxLines={1}>
          {isUnavailable ? "마감" : date.day % 3 === 0 ? "9만원" : "예약 가능"}
        </Text>
      </Box>
    </>
  ),
} satisfies DatePickerProps;

const DatePickerPreview = ({ previewWidth = "358px", ...props }: DatePickerPreviewProps) => (
  <Box width={previewWidth} maxWidth="100%">
    <DatePicker
      today={{ year: 2026, month: 7, day: 30 }}
      yearRange={{ start: 2025, end: 2027 }}
      {...props}
    />
  </Box>
);

const meta = {
  component: DatePickerPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof DatePickerPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

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
      visibleRange: "twoMonths",
      previewWidth: "720px",
    },
    Week: {
      visibleRange: "week",
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

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{}}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = CommonStoryTemplate;

export const DarkTheme = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});

export const Continuous: Story = {
  render: () => (
    <Box width="358px" height="420px">
      <DatePicker
        selectionMode="range"
        visibleRange="continuous"
        height="full"
        today={{ year: 2026, month: 7, day: 30 }}
        yearRange={{ start: 2025, end: 2027 }}
      />
    </Box>
  ),
};

export const ContinuousCustomCell: Story = {
  render: () => (
    <Box width="358px" height="560px">
      <DatePicker
        visibleRange="continuous"
        height="full"
        today={{ year: 2026, month: 7, day: 30 }}
        yearRange={{ start: 2025, end: 2027 }}
        {...customCellProps}
      />
    </Box>
  ),
};
