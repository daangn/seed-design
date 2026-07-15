import {
  nextListItem,
  type NextListItemVariantProps,
} from "@seed-design/css/recipes/next-list-item";
import { dataAttr, elementProps, mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { Checkbox as CheckboxPrimitive, useCheckboxContext } from "@seed-design/react-checkbox";
import {
  RadioGroup as RadioGroupPrimitive,
  useRadioGroupItemContext,
} from "@seed-design/react-radio-group";
import { Switch as SwitchPrimitive, useSwitchContext } from "@seed-design/react-switch";
import { composeRefs } from "@radix-ui/react-compose-refs";
import clsx from "clsx";
import * as React from "react";
import { forwardRef } from "react";

import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { useStyleProps, withStyleProps, type StyleProps } from "../../utils/styled";

// ────────────────────────────────────────────────────────────────────────────
// Interaction context
//
// For button/anchor items the press signal lives on the inner <button>/<a>, but
// the row-wide scale and pressed background must react on the root + layout. This
// context lets `ButtonItem`/`AnchorItem` (1) tell `Content` which element to
// render and wire press handlers onto it, and (2) feed press/hover/disabled state
// back to root + layout via the shared `withStateProps` pipeline. Checkbox/radio/
// switch items don't use it — their headless contexts already forward state.
// ────────────────────────────────────────────────────────────────────────────

type NextListContentTag = "button" | "a";

interface NextListInteractionContextValue {
  contentTag: NextListContentTag;
  contentProps: React.HTMLAttributes<HTMLElement>;
  contentRef: React.Ref<HTMLElement>;
  stateProps: React.HTMLAttributes<HTMLElement>;
}

const NextListInteractionContext = React.createContext<NextListInteractionContextValue | null>(
  null,
);

const useNextListInteractionContext = (_options?: { strict?: boolean }) =>
  React.useContext(NextListInteractionContext);

const { useClassNames, withContext, withProvider } = createSlotRecipeContext(nextListItem);

const withStateProps = createWithStateProps([
  { useContext: useCheckboxContext, strict: false },
  { useContext: useRadioGroupItemContext, strict: false },
  { useContext: useSwitchContext, strict: false },
  { useContext: useNextListInteractionContext, strict: false },
]);

// ────────────────────────────────────────────────────────────────────────────
// Structural slots
// ────────────────────────────────────────────────────────────────────────────

// NextList has no container of its own: reuse `List` / `ListDivider` as the
// container and divider. Only the items below differ (pressed-scale recipe +
// interaction context), so only they carry the `Next` name.
interface NextListItemRootBaseProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLElement>,
    NextListItemVariantProps {}

// root element (li by default, label via asChild). carries the pressed background
// (root::before) and forwards data-active/data-hover/data-disabled.
const NextListItemRoot = withProvider<HTMLElement, NextListItemRootBaseProps>(
  withStateProps(withStyleProps(Primitive.li)),
  "root",
);

interface NextListLayoutProps
  extends PrimitiveProps,
    Pick<StyleProps, "alignItems">,
    React.HTMLAttributes<HTMLDivElement> {}

// layout layer — the flex row that scales as a whole on press.
const NextListLayout = withContext<HTMLDivElement, NextListLayoutProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "layout",
);

export interface NextListContentProps
  extends Pick<StyleProps, "gap" | "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLElement> {}

// content slot. renders <button>/<a> when inside an interactive item (wiring the
// press handlers + interactive props from context), otherwise a plain <div>.
export const NextListContent = forwardRef<HTMLElement, NextListContentProps>(
  ({ className, children, ...props }, ref) => {
    const classNames = useClassNames();
    const interaction = useNextListInteractionContext();
    const contentClassName = clsx(classNames.content, className);

    const stateProps = {
      ...useCheckboxContext({ strict: false })?.stateProps,
      ...useRadioGroupItemContext({ strict: false })?.stateProps,
      ...useSwitchContext({ strict: false })?.stateProps,
    };

    const { style, restProps } = useStyleProps(props);

    if (interaction?.contentTag === "button") {
      return (
        <Primitive.button
          ref={composeRefs(interaction.contentRef, ref)}
          style={style}
          {...interaction.contentProps}
          {...restProps}
          className={clsx(contentClassName, interaction.contentProps.className)}
        >
          {children}
        </Primitive.button>
      );
    }

    if (interaction?.contentTag === "a") {
      return (
        <Primitive.a
          ref={composeRefs(interaction.contentRef, ref)}
          style={style}
          {...interaction.contentProps}
          {...restProps}
          className={clsx(contentClassName, interaction.contentProps.className)}
        >
          {children}
        </Primitive.a>
      );
    }

    return (
      <Primitive.div
        ref={composeRefs(interaction?.contentRef, ref)}
        style={style}
        className={contentClassName}
        {...stateProps}
        {...restProps}
      >
        {children}
      </Primitive.div>
    );
  },
);
NextListContent.displayName = "NextListContent";

export interface NextListPrefixProps
  extends PrimitiveProps,
    Pick<StyleProps, "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLDivElement> {}

export const NextListPrefix = withContext<HTMLDivElement, NextListPrefixProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "prefix",
);

export interface NextListSuffixProps
  extends PrimitiveProps,
    Pick<StyleProps, "gap" | "position">,
    React.HTMLAttributes<HTMLDivElement> {}

export const NextListSuffix = withContext<HTMLDivElement, NextListSuffixProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "suffix",
);

export interface NextListTitleProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const NextListTitle = withContext<HTMLDivElement, NextListTitleProps>(
  withStateProps(Primitive.div),
  "title",
);

export interface NextListDetailProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const NextListDetail = withContext<HTMLDivElement, NextListDetailProps>(
  withStateProps(Primitive.div),
  "detail",
);

// ────────────────────────────────────────────────────────────────────────────
// Item variants
// ────────────────────────────────────────────────────────────────────────────

export interface NextListItemProps
  extends PrimitiveProps,
    Pick<StyleProps, "alignItems">,
    React.HTMLAttributes<HTMLLIElement>,
    NextListItemVariantProps {}

export const NextListItem = forwardRef<HTMLLIElement, NextListItemProps>(
  ({ children, alignItems, ...props }, ref) => {
    const [variantProps, restProps] = nextListItem.splitVariantProps(props);

    return (
      <NextListItemRoot ref={ref as React.Ref<HTMLElement>} {...variantProps} {...restProps}>
        <NextListLayout alignItems={alignItems}>{children}</NextListLayout>
      </NextListItemRoot>
    );
  },
);
NextListItem.displayName = "NextListItem";

export interface NextListButtonItemProps
  extends NextListItemVariantProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof NextListItemVariantProps> {
  alignItems?: StyleProps["alignItems"];
  rootRef?: React.Ref<HTMLLIElement>;
  rootProps?: React.HTMLAttributes<HTMLLIElement>;
}

export const NextListButtonItem = forwardRef<HTMLButtonElement, NextListButtonItemProps>(
  ({ children, alignItems, rootRef, rootProps, ...props }, ref) => {
    const [variantProps, restProps] = nextListItem.splitVariantProps(props);
    const { disabled } = restProps;

    const [pressed, setPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);

    const contentProps = mergeProps({ type: "button" as const }, restProps, {
      onPointerDown: () => {
        if (!disabled) setPressed(true);
      },
      onPointerUp: () => setPressed(false),
      onPointerCancel: () => setPressed(false),
      onPointerEnter: () => {
        if (!disabled) setHovered(true);
      },
      onPointerLeave: () => {
        setHovered(false);
        setPressed(false);
      },
    });

    const interaction: NextListInteractionContextValue = {
      contentTag: "button",
      contentProps,
      contentRef: ref as React.Ref<HTMLElement>,
      stateProps: elementProps({
        "data-active": dataAttr(pressed),
        "data-hover": dataAttr(hovered),
        "data-disabled": dataAttr(disabled),
      }),
    };

    return (
      <NextListInteractionContext.Provider value={interaction}>
        <NextListItemRoot ref={rootRef as React.Ref<HTMLElement>} {...variantProps} {...rootProps}>
          <NextListLayout alignItems={alignItems}>{children}</NextListLayout>
        </NextListItemRoot>
      </NextListInteractionContext.Provider>
    );
  },
);
NextListButtonItem.displayName = "NextListButtonItem";

export interface NextListAnchorItemProps
  extends NextListItemVariantProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextListItemVariantProps> {
  alignItems?: StyleProps["alignItems"];
  rootRef?: React.Ref<HTMLLIElement>;
  rootProps?: React.HTMLAttributes<HTMLLIElement>;
}

export const NextListAnchorItem = forwardRef<HTMLAnchorElement, NextListAnchorItemProps>(
  ({ children, alignItems, rootRef, rootProps, ...props }, ref) => {
    const [variantProps, restProps] = nextListItem.splitVariantProps(props);

    const [pressed, setPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);

    const contentProps = mergeProps(restProps, {
      onPointerDown: () => setPressed(true),
      onPointerUp: () => setPressed(false),
      onPointerCancel: () => setPressed(false),
      onPointerEnter: () => setHovered(true),
      onPointerLeave: () => {
        setHovered(false);
        setPressed(false);
      },
    });

    const interaction: NextListInteractionContextValue = {
      contentTag: "a",
      contentProps,
      contentRef: ref as React.Ref<HTMLElement>,
      stateProps: elementProps({
        "data-active": dataAttr(pressed),
        "data-hover": dataAttr(hovered),
      }),
    };

    return (
      <NextListInteractionContext.Provider value={interaction}>
        <NextListItemRoot ref={rootRef as React.Ref<HTMLElement>} {...variantProps} {...rootProps}>
          <NextListLayout alignItems={alignItems}>{children}</NextListLayout>
        </NextListItemRoot>
      </NextListInteractionContext.Provider>
    );
  },
);
NextListAnchorItem.displayName = "NextListAnchorItem";

export interface NextListCheckboxItemProps
  extends NextListItemVariantProps,
    Omit<CheckboxPrimitive.RootProps, keyof NextListItemVariantProps> {
  alignItems?: StyleProps["alignItems"];
  rootRef?: React.Ref<HTMLLabelElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const NextListCheckboxItem = forwardRef<HTMLInputElement, NextListCheckboxItemProps>(
  ({ children, alignItems, rootRef, inputProps, ...props }, ref) => {
    const [variantProps, restProps] = nextListItem.splitVariantProps(props);

    return (
      <NextListItemRoot asChild {...variantProps}>
        <CheckboxPrimitive.Root ref={rootRef} {...restProps}>
          <NextListLayout alignItems={alignItems}>{children}</NextListLayout>
          <CheckboxPrimitive.HiddenInput ref={ref} {...inputProps} />
        </CheckboxPrimitive.Root>
      </NextListItemRoot>
    );
  },
);
NextListCheckboxItem.displayName = "NextListCheckboxItem";

export interface NextListRadioItemProps
  extends NextListItemVariantProps,
    Omit<RadioGroupPrimitive.ItemProps, keyof NextListItemVariantProps> {
  alignItems?: StyleProps["alignItems"];
  rootRef?: React.Ref<HTMLLabelElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const NextListRadioItem = forwardRef<HTMLInputElement, NextListRadioItemProps>(
  ({ children, alignItems, rootRef, inputProps, ...props }, ref) => {
    const [variantProps, restProps] = nextListItem.splitVariantProps(props);

    return (
      <NextListItemRoot asChild {...variantProps}>
        <RadioGroupPrimitive.Item ref={rootRef} {...restProps}>
          <NextListLayout alignItems={alignItems}>{children}</NextListLayout>
          <RadioGroupPrimitive.ItemHiddenInput ref={ref} {...inputProps} />
        </RadioGroupPrimitive.Item>
      </NextListItemRoot>
    );
  },
);
NextListRadioItem.displayName = "NextListRadioItem";

export interface NextListSwitchItemProps
  extends NextListItemVariantProps,
    Omit<SwitchPrimitive.RootProps, keyof NextListItemVariantProps> {
  alignItems?: StyleProps["alignItems"];
  rootRef?: React.Ref<HTMLLabelElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const NextListSwitchItem = forwardRef<HTMLInputElement, NextListSwitchItemProps>(
  ({ children, alignItems, rootRef, inputProps, ...props }, ref) => {
    const [variantProps, restProps] = nextListItem.splitVariantProps(props);

    return (
      <NextListItemRoot asChild {...variantProps}>
        <SwitchPrimitive.Root ref={rootRef} {...restProps}>
          <NextListLayout alignItems={alignItems}>{children}</NextListLayout>
          <SwitchPrimitive.HiddenInput ref={ref} {...inputProps} />
        </SwitchPrimitive.Root>
      </NextListItemRoot>
    );
  },
);
NextListSwitchItem.displayName = "NextListSwitchItem";
