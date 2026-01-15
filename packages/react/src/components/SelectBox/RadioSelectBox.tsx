import { selectBox, type SelectBoxVariantProps } from "@seed-design/css/recipes/select-box";
import {
  selectBoxGroup,
  type SelectBoxGroupVariantProps,
} from "@seed-design/css/recipes/select-box-group";
import {
  CollapsibleProvider,
  useCollapsible,
  useCollapsibleContext,
} from "@seed-design/react-collapsible";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  RadioGroup as RadioGroupPrimitive,
  useRadioGroupItemContext,
} from "@seed-design/react-radio-group";
import { forwardRef } from "react";
import { createWithStateProps } from "../../utils/createWithStateProps";
import clsx from "clsx";
import {
  PropsProvider,
  ClassNamesProvider,
  withContext,
  useProps,
  useFooterState,
  FooterStateProvider,
  useFooterStateContext,
} from "./context";

const withStateProps = createWithStateProps([useRadioGroupItemContext]);

export interface RadioSelectBoxRootProps
  extends SelectBoxGroupVariantProps,
    RadioGroupPrimitive.RootProps {
  /**
   * Number of columns in the grid layout. When bigger than 1, child `RadioSelectBoxItem` will have a default layout of "vertical".
   * @default 1
   */
  columns?: number;
}

export const RadioSelectBoxRoot = forwardRef<HTMLDivElement, RadioSelectBoxRootProps>(
  ({ columns = 1, className, style, ...props }, ref) => {
    const [variantProps, otherProps] = selectBoxGroup.splitVariantProps(props);
    const recipeClassName = selectBoxGroup(variantProps);
    const layout = columns === 1 ? "horizontal" : "vertical";

    return (
      <PropsProvider value={{ layout }}>
        <RadioGroupPrimitive.Root
          ref={ref}
          data-columns={columns}
          className={clsx(recipeClassName, className)}
          style={
            {
              ...style,
              "--seed-select-box-group--columns": columns,
            } as React.CSSProperties
          }
          {...otherProps}
        />
      </PropsProvider>
    );
  },
);

function SelectBoxCollapsibleRoot({ children }: { children: React.ReactNode }) {
  const { checked } = useRadioGroupItemContext();
  const collapsible = useCollapsible({ open: checked });
  const footerState = useFooterState();

  return (
    <CollapsibleProvider value={collapsible}>
      <FooterStateProvider value={footerState}>{children}</FooterStateProvider>
    </CollapsibleProvider>
  );
}

export interface RadioSelectBoxItemProps
  extends SelectBoxVariantProps,
    RadioGroupPrimitive.ItemProps {
  /**
   * Controls when the footer is visible.
   * @default "when-selected"
   */
  footerVisibility?: "always" | "when-selected";
}

export const RadioSelectBoxItem = forwardRef<HTMLDivElement, RadioSelectBoxItemProps>(
  ({ footerVisibility = "when-selected", className, children, ...props }, ref) => {
    const [variantProps, otherProps] = selectBox.splitVariantProps(props);
    const classNames = selectBox({
      ...useProps(),
      ...variantProps,
    });

    return (
      <ClassNamesProvider value={classNames}>
        <RadioGroupPrimitive.Item asChild {...otherProps}>
          <Primitive.div className={clsx(classNames.root, className)} ref={ref}>
            {footerVisibility === "when-selected" ? (
              <SelectBoxCollapsibleRoot>{children}</SelectBoxCollapsibleRoot>
            ) : (
              children
            )}
          </Primitive.div>
        </RadioGroupPrimitive.Item>
      </ClassNamesProvider>
    );
  },
);

export interface RadioSelectBoxTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioSelectBoxTrigger = withContext<HTMLDivElement, RadioSelectBoxTriggerProps>(
  withStateProps(Primitive.label),
  "trigger",
);

export interface RadioSelectBoxContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioSelectBoxContent = withContext<HTMLDivElement, RadioSelectBoxContentProps>(
  withStateProps(Primitive.div),
  "content",
);

export interface RadioSelectBoxBodyProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioSelectBoxBody = withContext<HTMLDivElement, RadioSelectBoxBodyProps>(
  withStateProps(Primitive.div),
  "body",
);

export interface RadioSelectBoxLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const RadioSelectBoxLabel = withContext<HTMLSpanElement, RadioSelectBoxLabelProps>(
  withStateProps(Primitive.div),
  "label",
);

export interface RadioSelectBoxDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const RadioSelectBoxDescription = withContext<
  HTMLSpanElement,
  RadioSelectBoxDescriptionProps
>(withStateProps(Primitive.div), "description");

export interface RadioSelectBoxHiddenInputProps extends RadioGroupPrimitive.ItemHiddenInputProps {}

export const RadioSelectBoxHiddenInput = forwardRef<
  HTMLInputElement,
  RadioSelectBoxHiddenInputProps
>((props, ref) => {
  // when footerVisibility !== "when-selected", this context is automatically unavailable since it's not wrapped in CollapsibleProvider

  // NOTE: aria-expanded on role="radio" is not officially supported. See: https://github.com/w3c/aria/issues/1404
  // but it helps some screen readers to announce the expanded/collapsed state of the footer.
  // gov.uk applies aria-expanded on the radio input as well. See: https://design-system.service.gov.uk/components/radios/#conditionally-revealing-a-related-question
  const collapsibleContext = useCollapsibleContext({ strict: false });
  const footerStateContext = useFooterStateContext();

  const triggerAriaProps = footerStateContext?.isFooterRendered
    ? collapsibleContext?.triggerAriaProps
    : undefined;

  return <RadioGroupPrimitive.ItemHiddenInput ref={ref} {...triggerAriaProps} {...props} />;
});
RadioSelectBoxHiddenInput.displayName = "RadioSelectBoxHiddenInput";
