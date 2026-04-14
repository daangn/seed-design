import {
  SideNavigation as SideNavigationPrimitive,
  SideNavigationMenuItemProvider as ItemProviderPrimitive,
  useCollapsibleContext,
  useSideNavigationContext,
  useSideNavigationMenuItem,
  useSideNavigationMenuItemContext,
  type UseSideNavigationMenuItemProps,
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
const { ClassNamesProvider: MenuItemClassNamesProvider, withContext: withMenuItemContext } =
  createSlotRecipeContext(sideNavigationMenuItem);
const { withContext: withInsetContext } = createRecipeContext(sideNavigationInset);

const withSideNavigationStateProps = createWithStateProps([useSideNavigationContext]);
const withMenuItemStateProps = createWithStateProps([
  useSideNavigationContext,
  { useContext: useSideNavigationMenuItemContext, strict: false },
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

export interface SideNavigationMenuItemProps
  extends SideNavigationMenuItemVariantProps,
    UseSideNavigationMenuItemProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationMenuItem = React.forwardRef<
  HTMLButtonElement,
  SideNavigationMenuItemProps
>(({ current, disabled, className, ...props }, ref) => {
  const [variantProps, restProps] = sideNavigationMenuItem.splitVariantProps(props);
  const classNames = sideNavigationMenuItem(variantProps);

  const { stateProps: sideNavStateProps } = useSideNavigationContext();
  const api = useSideNavigationMenuItem({ current, disabled });

  return (
    <ItemProviderPrimitive value={api}>
      <MenuItemClassNamesProvider value={classNames}>
        <Primitive.button
          className={clsx(classNames.root, className)}
          ref={ref}
          {...restProps}
          {...sideNavStateProps}
          {...api.rootProps}
        />
      </MenuItemClassNamesProvider>
    </ItemProviderPrimitive>
  );
});

SideNavigationMenuItem.displayName = "SideNavigationMenuItem";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SideNavigationMenuItemLabel = withMenuItemContext<
  HTMLSpanElement,
  SideNavigationMenuItemLabelProps
>(withMenuItemStateProps(Primitive.span), "label");

SideNavigationMenuItemLabel.displayName = "SideNavigationMenuItemLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemPrefixIconProps extends InternalIconProps {}

export const SideNavigationMenuItemPrefixIcon = withMenuItemContext<
  SVGSVGElement,
  SideNavigationMenuItemPrefixIconProps
>(withMenuItemStateProps(InternalIcon), "prefixIcon");

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemSuffixIconProps extends InternalIconProps {}

export const SideNavigationMenuItemSuffixIcon = withMenuItemContext<
  SVGSVGElement,
  SideNavigationMenuItemSuffixIconProps
>(withMenuItemStateProps(InternalIcon), "suffixIcon");

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleRootProps
  extends SideNavigationMenuItemVariantProps,
    SideNavigationPrimitive.MenuItemCollapsibleRootProps {}

export const SideNavigationMenuItemCollapsibleRoot = React.forwardRef<
  HTMLDivElement,
  SideNavigationMenuItemCollapsibleRootProps
>(({ children, ...props }, ref) => {
  const [variantProps, restProps] = sideNavigationMenuItem.splitVariantProps(props);
  const classNames = sideNavigationMenuItem(variantProps);

  return (
    <MenuItemClassNamesProvider value={classNames}>
      <SideNavigationPrimitive.MenuItemCollapsibleRoot ref={ref} {...restProps}>
        {children}
      </SideNavigationPrimitive.MenuItemCollapsibleRoot>
    </MenuItemClassNamesProvider>
  );
});

SideNavigationMenuItemCollapsibleRoot.displayName = "SideNavigationMenuItemCollapsibleRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleTriggerProps
  extends SideNavigationPrimitive.MenuItemCollapsibleTriggerProps {}

export const SideNavigationMenuItemCollapsibleTrigger = withMenuItemContext<
  HTMLButtonElement,
  SideNavigationMenuItemCollapsibleTriggerProps
>(withSideNavigationStateProps(SideNavigationPrimitive.MenuItemCollapsibleTrigger), "root");

SideNavigationMenuItemCollapsibleTrigger.displayName = "SideNavigationMenuItemCollapsibleTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleContentProps
  extends SideNavigationPrimitive.MenuItemCollapsibleContentProps {}

export const SideNavigationMenuItemCollapsibleContent = withMenuItemContext<
  HTMLDivElement,
  SideNavigationMenuItemCollapsibleContentProps
>(SideNavigationPrimitive.MenuItemCollapsibleContent, "panel");

SideNavigationMenuItemCollapsibleContent.displayName = "SideNavigationMenuItemCollapsibleContent";

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
