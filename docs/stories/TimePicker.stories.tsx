import preview from "../.storybook/preview";
import { Box, TimePicker, type TimePickerProps } from "@seed-design/react";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryParameters } from "./utils/parameters";

type TimePickerPreviewProps = TimePickerProps & {
  previewWidth?: string;
};

const TimePickerPreview = ({ previewWidth = "358px", ...props }: TimePickerPreviewProps) => (
  <Box width={previewWidth} maxWidth="100%">
    <TimePicker {...props} />
  </Box>
);

const meta = preview.meta({
  component: TimePickerPreview,
  decorators: [SeedThemeDecorator],
});
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

const CommonStoryTemplate = meta.story({
  render: (args) => (
    <VariantTable
      Component={TimePickerPreview}
      variantMap={{}}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});
