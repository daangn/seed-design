import { selectBox, type SelectBoxVariantProps } from "@seed-design/css/recipes/select-box";
import {
  selectBoxCheckmark,
  type SelectBoxCheckmarkVariantProps,
} from "@seed-design/css/recipes/selectBoxCheckmark";
import {
  selectBoxGroup,
  type SelectBoxGroupVariantProps,
} from "@seed-design/css/recipes/select-box-group";
import { Checkbox as CheckboxPrimitive, useCheckboxContext } from "@seed-design/react-checkbox";
import {
  CollapsibleProvider,
  useCollapsible,
  useCollapsibleContext,
} from "@seed-design/react-collapsible";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";
import {
  PropsProvider,
  ClassNamesProvider,
  withContext,
  useProps,
  useFooterState,
  FooterStateProvider,
  useFooterStateContext,
} from "./context";

const withStateProps = createWithStateProps([useCheckboxContext]);

export interface CheckSelectBoxGroupProps
  extends SelectBoxGroupVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns in the grid layout. When bigger than 1, child `CheckSelectBoxRoot` will have a default layout of "vertical".
   * @default 1
   */
  columns?: number;
}

export const CheckSelectBoxGroup = forwardRef<HTMLDivElement, CheckSelectBoxGroupProps>(
  ({ columns = 1, className, style, ...props }, ref) => {
    const [variantProps, otherProps] = selectBoxGroup.splitVariantProps(props);
    const recipeClassName = selectBoxGroup(variantProps);
    const layout = columns === 1 ? "horizontal" : "vertical";

    return (
      <PropsProvider value={{ layout }}>
        <Primitive.div
          ref={ref}
          role="group"
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
  const { checked } = useCheckboxContext();
  const collapsible = useCollapsible({ open: checked });
  const footerState = useFooterState();

  return (
    <CollapsibleProvider value={collapsible}>
      <FooterStateProvider value={footerState}>{children}</FooterStateProvider>
    </CollapsibleProvider>
  );
}

export interface CheckSelectBoxRootProps
  extends SelectBoxVariantProps,
    CheckboxPrimitive.RootProps {
  /**
   * Number of columns to span in the grid.
   * @default 1
   */
  span?: number;

  /**
   * Controls when the footer is visible.
   * @default "when-selected"
   */
  footerVisibility?: "always" | "when-selected";
}

export const CheckSelectBoxRoot = forwardRef<HTMLDivElement, CheckSelectBoxRootProps>(
  ({ span = 1, footerVisibility = "when-selected", className, style, children, ...props }, ref) => {
    const [variantProps, otherProps] = selectBox.splitVariantProps(props);
    const classNames = selectBox({
      ...useProps(),
      ...variantProps,
    });

    return (
      <ClassNamesProvider value={classNames}>
        <CheckboxPrimitive.Root asChild {...otherProps}>
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
            {footerVisibility === "when-selected" ? (
              <SelectBoxCollapsibleRoot>{children}</SelectBoxCollapsibleRoot>
            ) : (
              children
            )}
          </Primitive.div>
        </CheckboxPrimitive.Root>
      </ClassNamesProvider>
    );
  },
);

export interface CheckSelectBoxTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLLabelElement> {}

export const CheckSelectBoxTrigger = withContext<HTMLLabelElement, CheckSelectBoxTriggerProps>(
  withStateProps(Primitive.label),
  "trigger",
);

export interface CheckSelectBoxContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckSelectBoxContent = withContext<HTMLDivElement, CheckSelectBoxContentProps>(
  withStateProps(Primitive.div),
  "content",
);

export interface CheckSelectBoxBodyProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckSelectBoxBody = withContext<HTMLDivElement, CheckSelectBoxBodyProps>(
  withStateProps(Primitive.div),
  "body",
);

export interface CheckSelectBoxLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const CheckSelectBoxLabel = withContext<HTMLSpanElement, CheckSelectBoxLabelProps>(
  withStateProps(Primitive.div),
  "label",
);

export interface CheckSelectBoxDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const CheckSelectBoxDescription = withContext<
  HTMLSpanElement,
  CheckSelectBoxDescriptionProps
>(withStateProps(Primitive.div), "description");

const { withProvider: withCheckmarkProvider, withContext: withCheckmarkContext } =
  createSlotRecipeContext(selectBoxCheckmark);
const withCheckmarkStateProps = createWithStateProps([useCheckboxContext]);

export interface CheckSelectBoxCheckmarkControlProps
  extends SelectBoxCheckmarkVariantProps,
    CheckboxPrimitive.ControlProps {}

export const CheckSelectBoxCheckmarkControl = withCheckmarkProvider<
  HTMLDivElement,
  CheckSelectBoxCheckmarkControlProps
>(CheckboxPrimitive.Control, "root");

export interface CheckSelectBoxCheckmarkIconProps extends InternalIconProps {}

export const CheckSelectBoxCheckmarkIcon = withCheckmarkContext<
  SVGSVGElement,
  CheckSelectBoxCheckmarkIconProps
>(withCheckmarkStateProps(InternalIcon), "icon");

export interface CheckSelectBoxHiddenInputProps extends CheckboxPrimitive.HiddenInputProps {}

export const CheckSelectBoxHiddenInput = forwardRef<
  HTMLInputElement,
  CheckSelectBoxHiddenInputProps
>((props, ref) => {
  // when footerVisibility !== "when-selected", this context is automatically unavailable since it's not wrapped in CollapsibleProvider
  const collapsibleContext = useCollapsibleContext({ strict: false });
  const footerStateContext = useFooterStateContext();

  const triggerAriaProps = footerStateContext?.isFooterRendered
    ? collapsibleContext?.triggerAriaProps
    : undefined;

  return <CheckboxPrimitive.HiddenInput ref={ref} {...triggerAriaProps} {...props} />;
});
CheckSelectBoxHiddenInput.displayName = "CheckSelectBoxHiddenInput";
