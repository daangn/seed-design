import { selectBox, type SelectBoxVariantProps } from "@seed-design/css/recipes/select-box";
import {
  selectBoxGroup,
  type SelectBoxGroupVariantProps,
} from "@seed-design/css/recipes/select-box-group";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  RadioGroup as RadioGroupPrimitive,
  useRadioGroupItemContext,
} from "@seed-design/react-radio-group";
import { forwardRef, useId } from "react";
import { createWithStateProps } from "../../utils/createWithStateProps";
import clsx from "clsx";
import {
  GroupPropsProvider,
  PropsProvider,
  ClassNamesProvider,
  ItemContextProvider,
  withContext,
  useProps,
  useItemContext,
  getFooterId,
  type ItemContextValue,
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
      <GroupPropsProvider value={{ columns }}>
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
      </GroupPropsProvider>
    );
  },
);

export interface RadioSelectBoxItemProps
  extends SelectBoxVariantProps,
    RadioGroupPrimitive.ItemProps,
    Partial<ItemContextValue> {
  /**
   * Number of columns to span in the grid.
   * @default 1
   */
  span?: number;
}

export const RadioSelectBoxItem = forwardRef<HTMLDivElement, RadioSelectBoxItemProps>(
  ({ span = 1, footerVisibility = "when-selected", className, style, children, ...props }, ref) => {
    const id = useId();

    const [variantProps, otherProps] = selectBox.splitVariantProps(props);
    const classNames = selectBox({
      ...useProps(),
      ...variantProps,
    });

    return (
      <ItemContextProvider value={{ footerVisibility, id }}>
        <ClassNamesProvider value={classNames}>
          <RadioGroupPrimitive.Item asChild {...otherProps}>
            <Primitive.div
              className={clsx(classNames.root, className)}
              ref={ref}
              style={
                {
                  ...style,
                  "--seed-select-box--span": span,
                } as React.CSSProperties
              }
            >
              {children}
            </Primitive.div>
          </RadioGroupPrimitive.Item>
        </ClassNamesProvider>
      </ItemContextProvider>
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

////////////////////////////////////////////////////////////////////////////////////

export interface RadioSelectBoxHiddenInputProps extends RadioGroupPrimitive.ItemHiddenInputProps {}

export const RadioSelectBoxHiddenInput = forwardRef<
  HTMLInputElement,
  RadioSelectBoxHiddenInputProps
>((props, ref) => {
  const itemContext = useItemContext();
  const radioItemContext = useRadioGroupItemContext({ strict: false });

  const ariaProps =
    itemContext?.footerVisibility === "when-selected"
      ? {
          // NOTE: aria-expanded on role="radio" is not officially supported. See: https://github.com/w3c/aria/issues/1404
          // but it helps some screen readers to announce the expanded/collapsed state of the footer.
          // gov.uk applies aria-expanded on the radio input as well. See: https://design-system.service.gov.uk/components/radios/#conditionally-revealing-a-related-question
          "aria-expanded": radioItemContext?.checked ?? false,
          "aria-controls": getFooterId(itemContext.id),
        }
      : {};

  return <RadioGroupPrimitive.ItemHiddenInput ref={ref} {...ariaProps} {...props} />;
});
RadioSelectBoxHiddenInput.displayName = "RadioSelectBoxHiddenInput";
