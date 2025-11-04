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
      <Field.Root ref={ref} invalid={invalid} {...props}>
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
            <Field.CharacterCount current={100} max={1000} />
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

const conditionMap = {
  invalid: {
    false: { invalid: false },
    true: { invalid: true },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    children: <Box bg="bg.brandWeak" height="x8" />,
    label: "Label Sunt nisi labore nostrud.",
    indicator:
      "선택 Nisi consequat elit reprehenderit laboris laboris enim laborum quis adipisicing. Et consequat sit mollit dolor voluptate enim amet duis mollit eu consequat tempor reprehenderit. Veniam ipsum eiusmod in cillum ad ea quis. Lorem pariatur anim ad.",
    description:
      "This is a description text. Et deserunt occaecat enim mollit aute proident reprehenderit. Eiusmod est incididunt ipsum velit. Velit ea sunt est voluptate aliqua aliquip ipsum occaecat ullamco. Minim sunt voluptate laborum dolor. Ut nisi aliqua nisi culpa ipsum eu et veniam nulla esse voluptate non. Occaecat sit amet laboris occaecat et est amet voluptate minim.",
    errorMessage:
      "This is an error message. Laborum nostrud sint magna reprehenderit consequat fugiat nostrud reprehenderit fugiat eu in enim quis. Aliqua labore consectetur officia minim irure laboris aliquip nisi. Pariatur laboris velit elit officia dolore ad fugiat velit adipisicing Lorem incididunt ipsum ad. Laborum esse Lorem ut esse do. Minim eu cillum proident adipisicing magna excepteur aliquip. Ad ea duis excepteur enim qui dolor incididunt ullamco cillum adipisicing. Commodo non consectetur et id exercitation Lorem aliquip do consectetur nisi excepteur consectetur. Laborum ex esse anim irure tempor nisi irure esse.",
    showRequiredIndicator: true,
    required: true,
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
