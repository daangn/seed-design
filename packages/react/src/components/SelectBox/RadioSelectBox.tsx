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
import { forwardRef } from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import clsx from "clsx";

const { PropsProvider: GroupPropsProvider } = createRecipeContext(selectBoxGroup);
const { PropsProvider, ClassNamesProvider, withContext, useProps } =
  createSlotRecipeContext(selectBox);
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
    RadioGroupPrimitive.ItemProps {
  /**
   * Number of columns to span in the grid.
   * @default 1
   */
  span?: number;
}

export const RadioSelectBoxItem = forwardRef<HTMLLabelElement, RadioSelectBoxItemProps>(
  ({ span = 1, className, style, ...props }, ref) => {
    const [variantProps, otherProps] = selectBox.splitVariantProps(props);
    const classNames = selectBox({
      ...useProps(),
      ...variantProps,
    });

    return (
      <ClassNamesProvider value={classNames}>
        <RadioGroupPrimitive.Item
          className={clsx(classNames.root, className)}
          ref={ref}
          style={
            {
              ...style,
              "--seed-select-box--span": span,
            } as React.CSSProperties
          }
          {...otherProps}
        />
      </ClassNamesProvider>
    );
  },
);

export interface RadioSelectBoxFooProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioSelectBoxFoo = withContext<HTMLDivElement, RadioSelectBoxFooProps>(
  withStateProps(Primitive.div),
  "foo",
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
