import type { Meta, StoryObj } from "@storybook/nextjs";

import { RadioGroupField, VisuallyHidden, PrefixIcon, Box } from "@seed-design/react";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { fieldVariantMap } from "@seed-design/css/recipes/field";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

interface RadioGroupFieldWrapperProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupField.Root> {
  label?: React.ReactNode;
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;
  children?: React.ReactNode;
}

const RadioGroupFieldWrapper = React.forwardRef<HTMLDivElement, RadioGroupFieldWrapperProps>(
  (
    {
      label,
      indicator,
      description,
      errorMessage,
      showRequiredIndicator,
      children,
      invalid,
      ...props
    },
    ref,
  ) => {
    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && invalid;
    const renderFooter = renderDescription || renderErrorMessage;

    return (
      <RadioGroupField.Root ref={ref} invalid={invalid} {...props}>
        {renderHeader && (
          <RadioGroupField.Header>
            <RadioGroupField.Label weight="medium">
              {label}
              {showRequiredIndicator && <RadioGroupField.RequiredIndicator />}
              {indicator && (
                <RadioGroupField.IndicatorText>{indicator}</RadioGroupField.IndicatorText>
              )}
            </RadioGroupField.Label>
          </RadioGroupField.Header>
        )}
        {children}
        {renderFooter && (
          <RadioGroupField.Footer>
            {renderDescription &&
              (renderErrorMessage ? (
                <VisuallyHidden asChild>
                  <RadioGroupField.Description>{description}</RadioGroupField.Description>
                </VisuallyHidden>
              ) : (
                <RadioGroupField.Description>{description}</RadioGroupField.Description>
              ))}
            {renderErrorMessage && (
              <RadioGroupField.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </RadioGroupField.ErrorMessage>
            )}
          </RadioGroupField.Footer>
        )}
      </RadioGroupField.Root>
    );
  },
);
RadioGroupFieldWrapper.displayName = "RadioGroupFieldWrapper";

const meta = {
  component: RadioGroupFieldWrapper,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof RadioGroupFieldWrapper>;

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
