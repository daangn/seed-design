import {
  SideNavigation as SideNavigationPrimitive,
  SideNavigationItemProvider as ItemProviderPrimitive,
  useCollapsibleContext,
  useSideNavigationContext,
  useSideNavigationItem,
  useSideNavigationItemContext,
  type UseSideNavigationItemProps,
  type SideNavigationProviderProps as SideNavigationProviderPrimitiveProps,
} from "@seed-design/react-side-navigation";
import {
  sideNavigation,
  type SideNavigationVariantProps,
} from "@seed-design/css/recipes/side-navigation";
import {
  sideNavigationInset,
  type SideNavigationInsetVariantProps,
} from "@seed-design/css/recipes/side-navigation-inset";
import {
  sideNavigationMenuItem,
  type SideNavigationMenuItemVariantProps,
} from "@seed-design/css/recipes/side-navigation-menu-item";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { InternalIcon, type InternalIconProps } from "../private/Icon";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { mediaQueries } from "@seed-design/css/breakpoints";
import { composeRefs } from "@radix-ui/react-compose-refs";
import React from "react";
import clsx from "clsx";
import { dataAttr } from "@seed-design/dom-utils";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(sideNavigation);
const { ClassNamesProvider: ItemClassNamesProvider, withContext: withItemContext } =
  createSlotRecipeContext(sideNavigationMenuItem);
const { withContext: withInsetContext } = createRecipeContext(sideNavigationInset);

const withSideNavigationStateProps = createWithStateProps([useSideNavigationContext]);
const withItemStateProps = createWithStateProps([
  useSideNavigationContext,
  { useContext: useSideNavigationItemContext, strict: false },
  { useContext: useCollapsibleContext, strict: false },
]);

////////////////////////////////////////////////////////////////////////////////////

function ResponsiveCollapseEffect() {
  const { setCollapsed } = useSideNavigationContext();

  React.useEffect(() => {
    const mql = window.matchMedia(mediaQueries.lg);

    const handler = (e: MediaQueryListEvent) => {
      setCollapsed(!e.matches);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [setCollapsed]);

  return null;
}

export interface SideNavigationProviderProps extends SideNavigationProviderPrimitiveProps {}

export function SideNavigationProvider(props: SideNavigationProviderProps) {
  return (
    <SideNavigationPrimitive.Provider {...props}>
      <ResponsiveCollapseEffect />
      {props.children}
    </SideNavigationPrimitive.Provider>
  );
}

SideNavigationProvider.displayName = "SideNavigationProvider";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationRootProps
  extends SideNavigationVariantProps,
    SideNavigationPrimitive.RootProps {}

export const SideNavigationRoot = withProvider<HTMLElement, SideNavigationRootProps>(
  SideNavigationPrimitive.Root,
  "root",
);

SideNavigationRoot.displayName = "SideNavigationRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationHeader = withContext<HTMLDivElement, SideNavigationHeaderProps>(
  withSideNavigationStateProps(Primitive.div),
  "header",
);

SideNavigationHeader.displayName = "SideNavigationHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationContent = React.forwardRef<HTMLDivElement, SideNavigationContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const classNames = useClassNames();
    const { stateProps } = useSideNavigationContext();
    const ref = React.useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const check = () => setScrolled(element.scrollTop > 0);
      check();

      element.addEventListener("scroll", check);

      const observer = new ResizeObserver(check);
      observer.observe(element);

      return () => {
        element.removeEventListener("scroll", check);
        observer.disconnect();
      };
    }, []);

    return (
      <Primitive.div
        ref={composeRefs(ref, forwardedRef)}
        className={clsx(classNames.content, className)}
        {...{ "data-scrolled": dataAttr(scrolled) }}
        {...stateProps}
        {...props}
      />
    );
  },
);

SideNavigationContent.displayName = "SideNavigationContent";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationFooter = withContext<HTMLDivElement, SideNavigationFooterProps>(
  withSideNavigationStateProps(Primitive.div),
  "footer",
);

SideNavigationFooter.displayName = "SideNavigationFooter";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationGroup = withContext<HTMLDivElement, SideNavigationGroupProps>(
  withSideNavigationStateProps(Primitive.div),
  "group",
);

SideNavigationGroup.displayName = "SideNavigationGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationGroupLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationGroupLabel = withContext<HTMLDivElement, SideNavigationGroupLabelProps>(
  withSideNavigationStateProps(Primitive.div),
  "groupLabel",
);

SideNavigationGroupLabel.displayName = "SideNavigationGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationItemProps
  extends SideNavigationMenuItemVariantProps,
    UseSideNavigationItemProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationItem = React.forwardRef<
  HTMLButtonElement,
  SideNavigationItemProps
>(({ current, disabled, className, ...props }, ref) => {
  const [variantProps, restProps] = sideNavigationMenuItem.splitVariantProps(props);
  const classNames = sideNavigationMenuItem(variantProps);

  const { stateProps: sideNavStateProps } = useSideNavigationContext();
  const api = useSideNavigationItem({ current, disabled });

  return (
    <ItemProviderPrimitive value={api}>
      <ItemClassNamesProvider value={classNames}>
        <Primitive.button
          className={clsx(classNames.root, className)}
          ref={ref}
          {...restProps}
          {...sideNavStateProps}
          {...api.rootProps}
        />
      </ItemClassNamesProvider>
    </ItemProviderPrimitive>
  );
});

SideNavigationItem.displayName = "SideNavigationItem";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SideNavigationItemLabel = withItemContext<
  HTMLSpanElement,
  SideNavigationItemLabelProps
>(withItemStateProps(Primitive.span), "label");

SideNavigationItemLabel.displayName = "SideNavigationItemLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationItemPrefixIconProps extends InternalIconProps {}

export const SideNavigationItemPrefixIcon = withItemContext<
  SVGSVGElement,
  SideNavigationItemPrefixIconProps
>(withItemStateProps(InternalIcon), "prefixIcon");

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationItemSuffixIconProps extends InternalIconProps {}

export const SideNavigationItemSuffixIcon = withItemContext<
  SVGSVGElement,
  SideNavigationItemSuffixIconProps
>(withItemStateProps(InternalIcon), "suffixIcon");

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationItemCollapsibleRootProps
  extends SideNavigationMenuItemVariantProps,
    SideNavigationPrimitive.ItemCollapsibleRootProps {}

export const SideNavigationItemCollapsibleRoot = React.forwardRef<
  HTMLDivElement,
  SideNavigationItemCollapsibleRootProps
>(({ children, ...props }, ref) => {
  const [variantProps, restProps] = sideNavigationMenuItem.splitVariantProps(props);
  const classNames = sideNavigationMenuItem(variantProps);

  return (
    <ItemClassNamesProvider value={classNames}>
      <SideNavigationPrimitive.ItemCollapsibleRoot ref={ref} {...restProps}>
        {children}
      </SideNavigationPrimitive.ItemCollapsibleRoot>
    </ItemClassNamesProvider>
  );
});

SideNavigationItemCollapsibleRoot.displayName = "SideNavigationItemCollapsibleRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationItemCollapsibleTriggerProps
  extends SideNavigationPrimitive.ItemCollapsibleTriggerProps {}

export const SideNavigationItemCollapsibleTrigger = withItemContext<
  HTMLButtonElement,
  SideNavigationItemCollapsibleTriggerProps
>(withSideNavigationStateProps(SideNavigationPrimitive.ItemCollapsibleTrigger), "root");

SideNavigationItemCollapsibleTrigger.displayName = "SideNavigationItemCollapsibleTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationItemCollapsibleContentProps
  extends SideNavigationPrimitive.ItemCollapsibleContentProps {}

export const SideNavigationItemCollapsibleContent = withItemContext<
  HTMLDivElement,
  SideNavigationItemCollapsibleContentProps
>(SideNavigationPrimitive.ItemCollapsibleContent, "panel");

SideNavigationItemCollapsibleContent.displayName = "SideNavigationItemCollapsibleContent";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationTriggerProps extends SideNavigationPrimitive.TriggerProps {}

export const SideNavigationTrigger = withContext<HTMLButtonElement, SideNavigationTriggerProps>(
  SideNavigationPrimitive.Trigger,
  "trigger",
);

SideNavigationTrigger.displayName = "SideNavigationTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationInsetProps
  extends SideNavigationInsetVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationInset = withInsetContext<HTMLDivElement, SideNavigationInsetProps>(
  Primitive.div,
);
