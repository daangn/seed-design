import { composeRefs } from "@radix-ui/react-compose-refs";
import { selectBox, type SelectBoxVariantProps } from "@seed-design/css/recipes/select-box";
import {
  selectBoxGroup,
  type SelectBoxGroupVariantProps,
} from "@seed-design/css/recipes/select-box-group";
import {
  Collapsible,
  CollapsibleProvider,
  useCollapsible,
  useCollapsibleContext,
} from "@seed-design/react-collapsible";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  RadioGroup as RadioGroupPrimitive,
  useRadioGroupItemContext,
} from "@seed-design/react-radio-group";
import { createContext, forwardRef, useCallback, useContext, useState } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import clsx from "clsx";

const { PropsProvider, ClassNamesProvider, withContext, useProps, useClassNames } =
  createSlotRecipeContext(selectBox);

const withStateProps = createWithStateProps([useRadioGroupItemContext]);

const FooterContext = createContext<{
  isFooterRendered: boolean;
  footerRef: (node: HTMLDivElement | null) => void;
} | null>(null);

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

function FooterVisibilityProvider({ children }: { children: React.ReactNode }) {
  const { checked } = useRadioGroupItemContext();
  const collapsible = useCollapsible({ open: checked });

  const [isFooterRendered, setIsFooterRendered] = useState(false);
  const footerRef = useCallback((node: HTMLDivElement | null) => {
    setIsFooterRendered(!!node);
  }, []);

  return (
    <CollapsibleProvider value={collapsible}>
      <FooterContext.Provider value={{ isFooterRendered, footerRef }}>
        {children}
      </FooterContext.Provider>
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

export const RadioSelectBoxItem = forwardRef<HTMLLabelElement, RadioSelectBoxItemProps>(
  ({ footerVisibility = "when-selected", className, children, ...props }, ref) => {
    const [variantProps, otherProps] = selectBox.splitVariantProps(props);
    const classNames = selectBox({
      ...useProps(),
      ...variantProps,
    });

    return (
      <ClassNamesProvider value={classNames}>
        <RadioGroupPrimitive.Item
          ref={ref}
          className={clsx(classNames.root, className)}
          {...otherProps}
        >
          {footerVisibility === "when-selected" ? (
            <FooterVisibilityProvider>{children}</FooterVisibilityProvider>
          ) : (
            children
          )}
        </RadioGroupPrimitive.Item>
      </ClassNamesProvider>
    );
  },
);

export interface RadioSelectBoxTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioSelectBoxTrigger = withContext<HTMLDivElement, RadioSelectBoxTriggerProps>(
  withStateProps(Primitive.div),
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
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioSelectBoxLabel = withContext<HTMLDivElement, RadioSelectBoxLabelProps>(
  withStateProps(Primitive.div),
  "label",
);

export interface RadioSelectBoxDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioSelectBoxDescription = withContext<
  HTMLDivElement,
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
  const footerContext = useContext(FooterContext);

  const triggerAriaProps = footerContext?.isFooterRendered
    ? collapsibleContext?.triggerAriaProps
    : undefined;

  return <RadioGroupPrimitive.ItemHiddenInput ref={ref} {...triggerAriaProps} {...props} />;
});
RadioSelectBoxHiddenInput.displayName = "RadioSelectBoxHiddenInput";

export interface RadioSelectBoxFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const RadioSelectBoxFooter = forwardRef<HTMLDivElement, RadioSelectBoxFooterProps>(
  ({ className, children, ...props }, ref) => {
    const classNames = useClassNames();
    const { stateProps } = useRadioGroupItemContext();
    const collapsibleContext = useCollapsibleContext({ strict: false });
    const footerContext = useContext(FooterContext);

    const composedRef = composeRefs(ref, footerContext?.footerRef ?? null);

    if (collapsibleContext) {
      return (
        <Collapsible.Content
          ref={composedRef}
          className={clsx(classNames.footer, className)}
          {...stateProps}
          {...props}
        >
          {children}
        </Collapsible.Content>
      );
    }

    return (
      <Primitive.div
        ref={composedRef}
        className={clsx(classNames.footer, className)}
        {...stateProps}
        {...props}
      >
        {children}
      </Primitive.div>
    );
  },
);
RadioSelectBoxFooter.displayName = "RadioSelectBoxFooter";
