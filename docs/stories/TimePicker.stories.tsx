import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box, TimePicker, type TimePickerProps } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "./utils/parameters";

type TimePickerPreviewProps = TimePickerProps & {
  previewWidth?: string;
};

const TimePickerPreview = ({ previewWidth = "358px", ...props }: TimePickerPreviewProps) => (
  <Box width={previewWidth} maxWidth="100%">
    <TimePicker {...props} />
  </Box>
);

const meta = {
  component: TimePickerPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof TimePickerPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  case: {
    "기본값 · minuteStep 5": {
      defaultValue: { hour: 10, minute: 30 },
    },
    "minuteStep 1": {
      defaultValue: { hour: 10, minute: 13 },
      minuteStep: 1,
    },
    "minuteStep 5 · 13분 → 15분": {
      defaultValue: { hour: 9, minute: 13 },
      minuteStep: 5,
    },
    "minuteStep 15": {
      defaultValue: { hour: 13, minute: 30 },
      minuteStep: 15,
    },
    "minuteStep 30": {
      defaultValue: { hour: 23, minute: 30 },
      minuteStep: 30,
    },
    "en-US · locale 순서": {
      locale: "en-US",
      defaultValue: { hour: 13, minute: 30 },
      "aria-label": "Select time",
      periodAriaLabel: "AM/PM",
      hourAriaLabel: "Hour",
      minuteAriaLabel: "Minute",
    },
    disabled: {
      defaultValue: { hour: 10, minute: 30 },
      disabled: true,
      previewWidth: "320px",
    },
  },
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
