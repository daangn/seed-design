import preview from "../.storybook/preview";
import { snackbarVariantMap } from "@seed-design/css/recipes/snackbar";
import { Box } from "@seed-design/react";
import { Snackbar, SnackbarProvider } from "seed-design/ui/snackbar";

import { createStoryParameters } from "@/stories/utils/parameters";
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

const meta = preview.meta({
  component: SnackbarPreview,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  action: {
    withAction: { actionLabel: "확인" },
    withoutAction: { actionLabel: undefined },
  },
};

const CommonStoryTemplate = meta.story({
  render: (args) => (
    <VariantTable
      Component={SnackbarPreview}
      variantMap={snackbarVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});
