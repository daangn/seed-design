import type { Meta, StoryObj } from "@storybook/nextjs";

import { Field, VisuallyHidden, PrefixIcon, Box } from "@seed-design/react";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { fieldVariantMap } from "@seed-design/css/recipes/field";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

// Wrapper component that mimics the snippet pattern
interface FieldWrapperProps extends React.ComponentPropsWithoutRef<typeof Field.Root> {
  label?: React.ReactNode;
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;
  children?: React.ReactNode;

  maxGraphemeCount?: number;
}

const FieldWrapper = React.forwardRef<HTMLDivElement, FieldWrapperProps>(
  (
    {
      label,
      indicator,
      description,
      errorMessage,
      showRequiredIndicator,
      children,
      maxGraphemeCount,
      ...props
    },
    ref,
  ) => {
    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && props.invalid;
    const renderFooter = renderDescription || renderErrorMessage || maxGraphemeCount;

    return (
      <Field.Root ref={ref} {...props}>
        {renderHeader && (
          <Field.Header>
            <Field.Label weight="medium">
              {label}
              {showRequiredIndicator && <Field.RequiredIndicator />}
              {indicator && <Field.IndicatorText>{indicator}</Field.IndicatorText>}
            </Field.Label>
          </Field.Header>
        )}
        {children}
        {renderFooter && (
          <Field.Footer>
            {renderDescription &&
              (renderErrorMessage ? (
                <VisuallyHidden asChild>
                  <Field.Description>{description}</Field.Description>
                </VisuallyHidden>
              ) : (
                <Field.Description>{description}</Field.Description>
              ))}
            {renderErrorMessage && (
              <Field.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </Field.ErrorMessage>
            )}
            {maxGraphemeCount && <Field.CharacterCount current={100} max={maxGraphemeCount} />}
          </Field.Footer>
        )}
      </Field.Root>
    );
  },
);
FieldWrapper.displayName = "FieldWrapper";

const meta = {
  component: FieldWrapper,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof FieldWrapper>;

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
    descriptionWithGraphemeCount: { description, maxGraphemeCount: 200 },
    errorMessageWithGraphemeCount: { invalid: true, errorMessage, maxGraphemeCount: 200 },
    graphemeCountOnly: { maxGraphemeCount: 200 },
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
