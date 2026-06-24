import type { Meta, StoryObj } from "@storybook/nextjs";

import { snackbarVariantMap } from "@seed-design/css/recipes/snackbar";
import { Box } from "@seed-design/react";
import { Snackbar, SnackbarProvider } from "seed-design/ui/snackbar";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const SnackbarPreview = ({
  variant,
  message,
  actionLabel,
}: {
  variant?: "default" | "positive" | "critical";
  message?: string;
  actionLabel?: string;
}) => (
  <Box width="360px">
    {/* Snackbar is animated in/out via [data-open]; freeze it visible for the snapshot. */}
    <style>{".seed-snackbar__root { animation: none !important; }"}</style>
    <SnackbarProvider>
      <Snackbar
        variant={variant}
        message={message ?? "알림 메세지입니다."}
        actionLabel={actionLabel}
        onAction={() => {}}
      />
    </SnackbarProvider>
  </Box>
);

const meta = {
  component: SnackbarPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof SnackbarPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  action: {
    withAction: { actionLabel: "확인" },
    withoutAction: { actionLabel: undefined },
  },
};

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={snackbarVariantMap}
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
