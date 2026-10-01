import { composeRefs, useComposedRefs } from "@radix-ui/react-compose-refs";
import { Slottable } from "@radix-ui/react-slot";
import { selectBox, type SelectBoxVariantProps } from "@seed-design/css/recipes/select-box";
import {
  selectBoxCheckmark,
  type SelectBoxCheckmarkVariantProps,
} from "@seed-design/css/recipes/select-box-checkmark";
import {
  selectBoxGroup,
  type SelectBoxGroupVariantProps,
} from "@seed-design/css/recipes/select-box-group";
import { Checkbox as CheckboxPrimitive, useCheckboxContext } from "@seed-design/react-checkbox";
import {
  Collapsible,
  CollapsibleProvider,
  useCollapsible,
  useCollapsibleContext,
} from "@seed-design/react-collapsible";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { ContentScale, useScaleFeedback } from "@seed-design/react-scale-feedback";
import clsx from "clsx";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { PropsProvider, ClassNamesProvider, withContext, useProps, useClassNames } =
  createSlotRecipeContext(selectBox);

const withStateProps = createWithStateProps([useCheckboxContext]);

const FooterContext = createContext<{
  isFooterRendered: boolean;
  footerRef: (node: HTMLDivElement | null) => void;
  footerVisibility: Exclude<NonNullable<CheckSelectBoxRootProps["footerVisibility"]>, "always">;
} | null>(null);
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

function FooterVisibilityProvider({
  children,
  footerVisibility,
}: PropsWithChildren<{
  footerVisibility: Exclude<NonNullable<CheckSelectBoxRootProps["footerVisibility"]>, "always">;
}>) {
  const { checked } = useCheckboxContext();

  const collapsible = useCollapsible({
    open: {
      "when-selected": checked,
      "when-not-selected": !checked,
    }[footerVisibility],
  });

  const [isFooterRendered, setIsFooterRendered] = useState(false);
  const footerRef = useCallback((node: HTMLDivElement | null) => {
    setIsFooterRendered(!!node);
  }, []);

  return (
    <CollapsibleProvider value={collapsible}>
      <FooterContext.Provider value={{ isFooterRendered, footerRef, footerVisibility }}>
        {children}
      </FooterContext.Provider>
    </CollapsibleProvider>
  );
}

export interface CheckSelectBoxRootProps
  extends SelectBoxVariantProps,
    CheckboxPrimitive.RootProps {
  /**
   * Controls when the footer is visible.
   * @default "when-selected"
   */
  footerVisibility?: "when-selected" | "when-not-selected" | "always";
}

/**
 * Assembled by hand instead of through `withContentScale`, because the footer provider has to
 * sit inside the element to read the checkbox context, and `Slot` only recognises a `Slottable`
 * among its direct children. Wrapping the HOC's `Slottable` in the provider would hide it, and
 * `Slot` would then fall back to slotting onto the provider, which drops the class and the ref.
 * Owning both here keeps the provider inside the content scale box, below the `Slottable`.
 */
export const CheckSelectBoxRoot = forwardRef<HTMLLabelElement, CheckSelectBoxRootProps>(
  ({ footerVisibility = "when-selected", className, children, ...props }, ref) => {
    const [variantProps, otherProps] = selectBox.splitVariantProps(props);
    const classNames = selectBox({
      ...useProps(),
      ...variantProps,
    });

    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();
    const composedRef = useComposedRefs(scaleFeedbackRef, ref);

    return (
      <ClassNamesProvider value={classNames}>
        <CheckboxPrimitive.Root
          ref={composedRef}
          className={clsx(scaleFeedbackClassName, classNames.root, className)}
          {...otherProps}
        >
          <Slottable child={children}>
            {(content) => (
              <ContentScale>
                {footerVisibility === "always" ? (
                  content
                ) : (
                  <FooterVisibilityProvider footerVisibility={footerVisibility}>
                    {content}
                  </FooterVisibilityProvider>
                )}
              </ContentScale>
            )}
          </Slottable>
        </CheckboxPrimitive.Root>
      </ClassNamesProvider>
    );
  },
);

export interface CheckSelectBoxTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckSelectBoxTrigger = withContext<HTMLDivElement, CheckSelectBoxTriggerProps>(
  withStateProps(Primitive.div),
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
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckSelectBoxLabel = withContext<HTMLDivElement, CheckSelectBoxLabelProps>(
  withStateProps(Primitive.div),
  "label",
);

export interface CheckSelectBoxDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckSelectBoxDescription = withContext<
  HTMLDivElement,
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
  const footerContext = useContext(FooterContext);

  const triggerAriaProps = footerContext?.isFooterRendered
    ? collapsibleContext?.triggerAriaProps
    : undefined;

  return <CheckboxPrimitive.HiddenInput ref={ref} {...triggerAriaProps} {...props} />;
});
CheckSelectBoxHiddenInput.displayName = "CheckSelectBoxHiddenInput";

export interface CheckSelectBoxFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const CheckSelectBoxFooter = forwardRef<HTMLDivElement, CheckSelectBoxFooterProps>(
  ({ className, children, ...props }, ref) => {
    const classNames = useClassNames();
    const { stateProps } = useCheckboxContext();
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
CheckSelectBoxFooter.displayName = "CheckSelectBoxFooter";
