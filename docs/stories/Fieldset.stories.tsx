import type { Meta, StoryObj } from "@storybook/nextjs";

import { Fieldset, VisuallyHidden, PrefixIcon, Box } from "@ride-developer/react";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { fieldVariantMap } from "@ride-developer/css/recipes/field";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

interface FieldsetWrapperProps extends React.ComponentPropsWithoutRef<typeof Fieldset.Root> {
  label?: React.ReactNode;
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;
  children?: React.ReactNode;
}

const FieldsetWrapper = React.forwardRef<HTMLDivElement, FieldsetWrapperProps>(
  (
    { label, indicator, description, errorMessage, showRequiredIndicator, children, ...props },
    ref,
  ) => {
    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = !!errorMessage;
    const renderFooter = renderDescription || renderErrorMessage;

    return (
      <Fieldset.Root ref={ref} {...props}>
        {renderHeader && (
          <Fieldset.Header>
            <Fieldset.Label weight="medium">
              {label}
              {showRequiredIndicator && <Fieldset.RequiredIndicator />}
              {indicator && <Fieldset.IndicatorText>{indicator}</Fieldset.IndicatorText>}
            </Fieldset.Label>
          </Fieldset.Header>
        )}
        {children}
        {renderFooter && (
          <Fieldset.Footer>
            {renderDescription &&
              (renderErrorMessage ? (
                <VisuallyHidden asChild>
                  <Fieldset.Description>{description}</Fieldset.Description>
                </VisuallyHidden>
              ) : (
                <Fieldset.Description>{description}</Fieldset.Description>
              ))}
            {renderErrorMessage && (
              <Fieldset.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </Fieldset.ErrorMessage>
            )}
          </Fieldset.Footer>
        )}
      </Fieldset.Root>
    );
  },
);
FieldsetWrapper.displayName = "FieldsetWrapper";

const meta = {
  component: FieldsetWrapper,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof FieldsetWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

const label =
  "Sunt nisi labore nostrud. Proident incididunt cillum ad ullamco aute amet excepteur ipsum aute excepteur ex sint tempor dolor.";
const indicator =
  "선택 Nisi consequat elit reprehenderit laboris laboris enim laborum quis adipisicing.";
const description =
  "Laborum quis reprehenderit non elit id esse. Duis duis sint anim incididunt aute ad incididunt aute ad duis dolore qui anim enim.";
const errorMessage =
  "Aliqua culpa incididunt amet voluptate. Sint ea tempor laboris. Aliqua pariatur veniam magna cupidatat aliquip velit voluptate elit.";

const conditionMap = {
  header: {
    hidden: {},
    label: { label },
    labelWithIndicator: { label, indicator },
    labelWithRequiredIndicator: { label, showRequiredIndicator: true },
    labelWithIndicatorAndRequiredIndicator: { label, indicator, showRequiredIndicator: true },
  },
  footer: {
    hidden: {},
    description: { description },
    errorMessage: { invalid: true, errorMessage },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    children: <Box bg="bg.brandWeak" height="x8" />,
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={fieldVariantMap}
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
