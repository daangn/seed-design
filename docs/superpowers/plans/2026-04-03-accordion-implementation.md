# Accordion Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional Accordion component with rootage spec, qvism-preset recipe, React styled component, registry snippet, docs, storybook, and examples.

**Architecture:** Root manages value state via context, each Item derives its open state and controls a Collapsible internally. Recipe provides slot-based styles with variant (inline/separated) and size (medium/large) variants. Registry snippet wraps primitives with built-in chevron.

**Tech Stack:** React, TypeScript, qvism-preset (Panda CSS recipes), @seed-design/react-collapsible, bunchee (build)

**Spec:** `docs/superpowers/specs/2026-04-03-accordion-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `packages/rootage/components/accordion.yaml` | Create | Design token spec |
| `packages/qvism-preset/src/recipes/accordion.ts` | Create | Style recipe |
| `packages/qvism-preset/src/recipes.ts` | Modify | Add accordion export |
| `packages/react/src/components/Accordion/useAccordion.ts` | Create | State management hook |
| `packages/react/src/components/Accordion/AccordionContext.tsx` | Create | Context providers |
| `packages/react/src/components/Accordion/Accordion.tsx` | Create | Styled components |
| `packages/react/src/components/Accordion/Accordion.namespace.ts` | Create | Namespace exports |
| `packages/react/src/components/Accordion/index.ts` | Create | Barrel exports |
| `packages/react/src/components/index.ts` | Modify | Add Accordion re-export |
| `docs/registry/ui/accordion.tsx` | Create | Registry snippet |
| `docs/registry/registry-ui.ts` | Modify | Add accordion entry |
| `docs/examples/react/accordion/*.tsx` | Create | 12 code examples |
| `docs/content/react/components/accordion.mdx` | Create | React docs |
| `docs/content/docs/components/(layout)/accordion.mdx` | Create | Design docs |
| `docs/stories/Accordion.stories.tsx` | Create | Storybook stories |
| `examples/stackflow-spa/src/seed-design/ui/accordion.tsx` | Create | Stackflow snippet |
| `examples/stackflow-spa/src/activities/ActivityAccordion.tsx` | Create | Interactive demo |

---

## Task 1: Rootage YAML Spec + Generate

**Files:**
- Create: `packages/rootage/components/accordion.yaml`

- [ ] **Step 1: Create rootage YAML spec**

```yaml
kind: ComponentSpec
metadata:
  id: accordion
  name: Accordion
data:
  schema:
    slots:
      root:
        properties:
          gap:
            type: dimension
      item:
        properties:
          borderColor:
            type: color
          cornerRadius:
            type: dimension
      trigger:
        properties:
          paddingX:
            type: dimension
          paddingY:
            type: dimension
      prefixIcon:
        properties:
          size:
            type: dimension
          paddingRight:
            type: dimension
      prefixAvatar:
        properties:
          size:
            type: dimension
          paddingRight:
            type: dimension
      title:
        properties:
          fontSize:
            type: dimension
          lineHeight:
            type: dimension
          fontWeight:
            type: number
          color:
            type: color
      description:
        properties:
          fontSize:
            type: dimension
          lineHeight:
            type: dimension
          fontWeight:
            type: number
          color:
            type: color
          gap:
            type: dimension
      suffixIcon:
        properties:
          size:
            type: dimension
          color:
            type: color
          paddingLeft:
            type: dimension
          rotateDuration:
            type: duration
          rotateTimingFunction:
            type: cubicBezier
      content:
        properties:
          paddingX:
            type: dimension
          paddingTop:
            type: dimension
          paddingBottom:
            type: dimension
          expandHeightDuration:
            type: duration
          expandHeightTimingFunction:
            type: cubicBezier
          collapseHeightDuration:
            type: duration
          collapseHeightTimingFunction:
            type: cubicBezier
    variants:
      variant:
        values:
          inline:
            description: Full-width items with dividers
          separated:
            description: Card-style independent items with gap
      size:
        values:
          medium: {}
          large: {}
  definitions:
    base:
      enabled:
        trigger:
          paddingX: $dimension.spacing-x.global-gutter
        title:
          color: $color.fg.neutral
          fontWeight: $font-weight.medium
        description:
          color: $color.fg.neutral-subtle
          fontWeight: $font-weight.regular
          gap: $dimension.x0,5
        suffixIcon:
          color: $color.fg.neutral-subtle
          rotateDuration: $duration.d6
          rotateTimingFunction: $timing-function.easing
        content:
          expandHeightDuration: $duration.d6
          expandHeightTimingFunction: $timing-function.easing
          collapseHeightDuration: $duration.d6
          collapseHeightTimingFunction: $timing-function.easing
      disabled:
        trigger:
          opacity: 0.4
    size=medium:
      enabled:
        trigger:
          paddingY: $dimension.x4
        title:
          fontSize: $font-size.t5
          lineHeight: $line-height.t5
        description:
          fontSize: $font-size.t3
          lineHeight: $line-height.t3
    size=large:
      enabled:
        trigger:
          paddingY: $dimension.x6
        title:
          fontSize: $font-size.t7
          lineHeight: $line-height.t7
        description:
          fontSize: $font-size.t5
          lineHeight: $line-height.t5
    variant=separated:
      enabled:
        item:
          borderColor: $color.stroke.neutral-muted
          cornerRadius: $radius.r3
    variant=separated, size=medium:
      enabled:
        root:
          gap: $dimension.x3
    variant=separated, size=large:
      enabled:
        root:
          gap: $dimension.x4
```

Note: Some token values (description fontSize, prefixIcon size, etc.) may need adjustment based on Figma inspection. The above uses reasonable defaults from the design system. Verify against the Figma spec during implementation and adjust if needed.

- [ ] **Step 2: Run rootage generation**

Run: `bun rootage:generate`
Expected: generates `packages/qvism-preset/src/vars/component/accordion.ts` and `packages/css/vars/component/accordion.ts`

- [ ] **Step 3: Verify generated vars**

Run: `ls packages/qvism-preset/src/vars/component/accordion.ts packages/css/vars/component/accordion.ts`
Expected: both files exist. Read `packages/qvism-preset/src/vars/component/accordion.ts` to confirm it exports accordion variable tokens.

- [ ] **Step 4: Commit**

```bash
git add packages/rootage/components/accordion.yaml packages/qvism-preset/src/vars/ packages/css/vars/
git commit -m "feat(accordion): add rootage component spec and generate vars"
```

---

## Task 2: Recipe (qvism-preset)

**Files:**
- Create: `packages/qvism-preset/src/recipes/accordion.ts`
- Modify: `packages/qvism-preset/src/recipes.ts`

- [ ] **Step 1: Create the recipe file**

Read `packages/qvism-preset/src/vars/component/accordion.ts` first to verify the exact variable names generated by rootage. Then write the recipe using those var names.

The recipe structure should follow existing patterns like `packages/qvism-preset/src/recipes/chip.ts`:

```typescript
import { accordion as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { disabled, focusVisible, pseudo } from "../utils/pseudo";
import { createFocusRingRestStyles, createFocusRingStyles } from "../utils/focus-ring";

const accordion = defineSlotRecipe({
  name: "accordion",
  slots: ["root", "item", "trigger", "prefixIcon", "prefixAvatar", "title", "description", "suffixIcon", "content"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    item: {
      display: "flex",
      flexDirection: "column",
    },
    trigger: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
      cursor: "pointer",
      border: "none",
      background: "transparent",
      textAlign: "start",
      fontFamily: "inherit",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      paddingLeft: vars.base.enabled.trigger.paddingX,
      paddingRight: vars.base.enabled.trigger.paddingX,

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    prefixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
    },
    prefixAvatar: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
    },
    title: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontWeight: vars.base.enabled.title.fontWeight,
      color: vars.base.enabled.title.color,
      flex: "1 0 0",
    },
    description: {
      color: vars.base.enabled.description.color,
      fontWeight: vars.base.enabled.description.fontWeight,
    },
    suffixIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginLeft: "auto",
      transitionProperty: "transform",
      transitionDuration: vars.base.enabled.suffixIcon.rotateDuration,
      transitionTimingFunction: vars.base.enabled.suffixIcon.rotateTimingFunction,

      "&[data-open]": {
        transform: "rotate(180deg)",
      },
    },
    content: {
      overflow: "hidden",
      height: "var(--collapsible-content-height)",
      transitionProperty: "height",
      transitionDuration: vars.base.enabled.content.expandHeightDuration,
      transitionTimingFunction: vars.base.enabled.content.expandHeightTimingFunction,
    },
  },
  variants: {
    variant: {
      inline: {},
      separated: {
        item: {
          boxShadow: `inset 0 0 0 1px ${vars.variantSeparated.enabled.item.borderColor}`,
          borderRadius: vars.variantSeparated.enabled.item.cornerRadius,
        },
      },
    },
    size: {
      medium: {
        trigger: {
          paddingTop: vars.sizeMedium.enabled.trigger.paddingY,
          paddingBottom: vars.sizeMedium.enabled.trigger.paddingY,
        },
        title: {
          fontSize: vars.sizeMedium.enabled.title.fontSize,
          lineHeight: vars.sizeMedium.enabled.title.lineHeight,
        },
        description: {
          fontSize: vars.sizeMedium.enabled.description.fontSize,
          lineHeight: vars.sizeMedium.enabled.description.lineHeight,
        },
      },
      large: {
        trigger: {
          paddingTop: vars.sizeLarge.enabled.trigger.paddingY,
          paddingBottom: vars.sizeLarge.enabled.trigger.paddingY,
        },
        title: {
          fontSize: vars.sizeLarge.enabled.title.fontSize,
          lineHeight: vars.sizeLarge.enabled.title.lineHeight,
        },
        description: {
          fontSize: vars.sizeLarge.enabled.description.fontSize,
          lineHeight: vars.sizeLarge.enabled.description.lineHeight,
        },
      },
    },
  },
  compoundVariants: [
    {
      variant: "separated",
      size: "medium",
      css: {
        root: {
          gap: vars.variantSeparatedSizeMedium.enabled.root.gap,
        },
      },
    },
    {
      variant: "separated",
      size: "large",
      css: {
        root: {
          gap: vars.variantSeparatedSizeLarge.enabled.root.gap,
        },
      },
    },
  ],
  defaultVariants: {
    variant: "inline",
    size: "medium",
  },
});

export default accordion;
```

Note: The exact `vars` property paths depend on the generated output from rootage. Read `packages/qvism-preset/src/vars/component/accordion.ts` first and adjust paths to match. Some patterns:
- `vars.base.enabled.trigger.paddingX` — base definition
- `vars.sizeMedium.enabled.trigger.paddingY` — size variant definition
- `vars.variantSeparated.enabled.item.borderColor` — variant definition
- `vars.variantSeparatedSizeMedium.enabled.root.gap` — compound variant definition (may be structured differently — verify)

- [ ] **Step 2: Add accordion to recipes export**

In `packages/qvism-preset/src/recipes.ts`, add import and export:

```typescript
import accordion from "./recipes/accordion";

// Add to the recipes export object
export const recipes = {
  // ... existing recipes
  accordion,
};
```

- [ ] **Step 3: Run qvism generation**

Run: `bun qvism:generate`
Expected: generates CSS files in `packages/css/recipes/accordion.ts`

- [ ] **Step 4: Verify generated CSS recipe**

Run: `ls packages/css/recipes/accordion.ts`
Expected: file exists with exported `accordion` recipe function

- [ ] **Step 5: Commit**

```bash
git add packages/qvism-preset/src/recipes/accordion.ts packages/qvism-preset/src/recipes.ts packages/css/recipes/
git commit -m "feat(accordion): add qvism-preset recipe and generate CSS"
```

---

## Task 3: React Component — Hook and Context

**Files:**
- Create: `packages/react/src/components/Accordion/useAccordion.ts`
- Create: `packages/react/src/components/Accordion/AccordionContext.tsx`

- [ ] **Step 1: Create AccordionContext.tsx**

```typescript
import { createContext, useContext } from "react";

export interface AccordionContextValue {
  type: "single" | "multiple";
  value: string | string[];
  toggle: (itemValue: string) => void;
  disabled: boolean;
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export const AccordionProvider = AccordionContext.Provider;

export function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion.Item must be used within Accordion.Root");
  }
  return context;
}

export interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export const AccordionItemProvider = AccordionItemContext.Provider;

export function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("Accordion sub-components must be used within Accordion.Item");
  }
  return context;
}
```

- [ ] **Step 2: Create useAccordion.ts**

```typescript
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback } from "react";

export interface UseAccordionSingleProps {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
  disabled?: boolean;
}

export interface UseAccordionMultipleProps {
  type?: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
}

export type UseAccordionProps = UseAccordionSingleProps | UseAccordionMultipleProps;

export function useAccordion(props: UseAccordionProps) {
  const type = props.type ?? "multiple";
  const disabled = props.disabled ?? false;
  const collapsible = type === "single" ? ((props as UseAccordionSingleProps).collapsible ?? true) : true;

  // Single mode
  const [singleValue, setSingleValue] = useControllableState({
    prop: type === "single" ? (props.value as string | undefined) : undefined,
    defaultProp: type === "single" ? ((props.defaultValue as string | undefined) ?? "") : "",
    onChange: type === "single" ? (props.onValueChange as ((v: string) => void) | undefined) : undefined,
  });

  // Multiple mode
  const [multipleValue, setMultipleValue] = useControllableState({
    prop: type === "multiple" ? (props.value as string[] | undefined) : undefined,
    defaultProp: type === "multiple" ? ((props.defaultValue as string[] | undefined) ?? []) : [],
    onChange: type === "multiple" ? (props.onValueChange as ((v: string[]) => void) | undefined) : undefined,
  });

  const value = type === "single" ? singleValue : multipleValue;

  const toggle = useCallback(
    (itemValue: string) => {
      if (type === "single") {
        const currentValue = singleValue as string;
        if (currentValue === itemValue) {
          if (collapsible) {
            setSingleValue("");
          }
        } else {
          setSingleValue(itemValue);
        }
      } else {
        const currentValues = multipleValue as string[];
        if (currentValues.includes(itemValue)) {
          setMultipleValue(currentValues.filter((v) => v !== itemValue));
        } else {
          setMultipleValue([...currentValues, itemValue]);
        }
      }
    },
    [type, singleValue, multipleValue, collapsible, setSingleValue, setMultipleValue],
  );

  return {
    type,
    value,
    toggle,
    disabled,
    collapsible,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/react/src/components/Accordion/
git commit -m "feat(accordion): add useAccordion hook and context definitions"
```

---

## Task 4: React Component — Styled Components

**Files:**
- Create: `packages/react/src/components/Accordion/Accordion.tsx`
- Create: `packages/react/src/components/Accordion/Accordion.namespace.ts`
- Create: `packages/react/src/components/Accordion/index.ts`
- Modify: `packages/react/src/components/index.ts`

- [ ] **Step 1: Create Accordion.tsx**

Read the following files first for exact patterns:
- `packages/react/src/utils/createSlotRecipeContext.tsx` — for `withProvider`/`withContext` API
- `packages/css/recipes/accordion.ts` — for generated recipe import path and variant types
- `packages/react-headless/collapsible/src/Collapsible.tsx` — for Collapsible component API

Then implement:

```typescript
import { accordion, type AccordionVariantProps } from "@seed-design/css/recipes/accordion";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  Collapsible,
  useCollapsible,
  CollapsibleProvider,
  useCollapsibleContext,
} from "@seed-design/react-collapsible";
import * as React from "react";
import { useId, useCallback, useRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { useAccordion, type UseAccordionProps } from "./useAccordion";
import {
  AccordionProvider,
  useAccordionContext,
  AccordionItemProvider,
  useAccordionItemContext,
  type AccordionContextValue,
  type AccordionItemContextValue,
} from "./AccordionContext";

const { withProvider, withContext } = createSlotRecipeContext(accordion);

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionRootProps
  extends PrimitiveProps,
    AccordionVariantProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue">,
    UseAccordionProps {}

export const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  (props, ref) => {
    const {
      type,
      value,
      defaultValue,
      onValueChange,
      collapsible,
      disabled,
      children,
      ...rest
    } = props;

    const [variantProps, otherProps] = accordion.splitVariantProps(rest);
    const classNames = accordion(variantProps);

    const accordionState = useAccordion({
      type,
      value,
      defaultValue,
      onValueChange,
      collapsible,
      disabled,
    } as UseAccordionProps);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const triggers = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>(
            "[data-accordion-trigger]:not([data-disabled])"
          )
        );
        const currentIndex = triggers.indexOf(
          event.target as HTMLButtonElement
        );
        if (currentIndex === -1) return;

        let nextIndex: number | null = null;

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            nextIndex = (currentIndex + 1) % triggers.length;
            break;
          case "ArrowUp":
            event.preventDefault();
            nextIndex =
              (currentIndex - 1 + triggers.length) % triggers.length;
            break;
          case "Home":
            event.preventDefault();
            nextIndex = 0;
            break;
          case "End":
            event.preventDefault();
            nextIndex = triggers.length - 1;
            break;
        }

        if (nextIndex !== null) {
          triggers[nextIndex].focus();
        }
      },
      []
    );

    return (
      <AccordionProvider value={accordionState}>
        <Primitive.div
          ref={ref}
          className={classNames.root}
          onKeyDown={handleKeyDown}
          {...otherProps}
        >
          {children}
        </Primitive.div>
      </AccordionProvider>
    );
  }
);
AccordionRoot.displayName = "Accordion.Root";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled: itemDisabled, children, className, ...props }, ref) => {
    const rootContext = useAccordionContext();
    const id = useId();
    const triggerId = `accordion-trigger-${id}`;
    const contentId = `accordion-content-${id}`;

    const disabled = itemDisabled ?? rootContext.disabled;
    const open =
      rootContext.type === "single"
        ? rootContext.value === value
        : (rootContext.value as string[]).includes(value);

    const collapsibleState = useCollapsible({
      open,
      onOpenChange: () => rootContext.toggle(value),
      disabled,
    });

    const classNames = accordion({});

    const itemContext: AccordionItemContextValue = {
      value,
      open,
      disabled,
      triggerId,
      contentId,
    };

    return (
      <AccordionItemProvider value={itemContext}>
        <CollapsibleProvider value={collapsibleState}>
          <Primitive.div
            ref={ref}
            className={className || classNames.item}
            data-open={open ? "" : undefined}
            data-disabled={disabled ? "" : undefined}
            {...props}
          >
            {children}
          </Primitive.div>
        </CollapsibleProvider>
      </AccordionItemProvider>
    );
  }
);
AccordionItem.displayName = "Accordion.Item";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, onClick, ...props }, ref) => {
    const itemContext = useAccordionItemContext();
    const collapsibleContext = useCollapsibleContext();
    const classNames = accordion({});

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        collapsibleContext.triggerHandlers.onClick?.(event as any);
        onClick?.(event);
      },
      [collapsibleContext.triggerHandlers, onClick]
    );

    return (
      <Primitive.button
        ref={ref}
        className={className || classNames.trigger}
        id={itemContext.triggerId}
        data-accordion-trigger=""
        data-open={itemContext.open ? "" : undefined}
        data-disabled={itemContext.disabled ? "" : undefined}
        disabled={itemContext.disabled}
        aria-expanded={itemContext.open}
        aria-controls={itemContext.contentId}
        aria-disabled={itemContext.disabled || undefined}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Primitive.button>
    );
  }
);
AccordionTrigger.displayName = "Accordion.Trigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, ref) => {
    const itemContext = useAccordionItemContext();
    const collapsibleContext = useCollapsibleContext();
    const classNames = accordion({});

    return (
      <Collapsible.Content
        ref={ref}
        className={className || classNames.content}
        id={itemContext.contentId}
        role="region"
        aria-labelledby={itemContext.triggerId}
        {...props}
      >
        {children}
      </Collapsible.Content>
    );
  }
);
AccordionContent.displayName = "Accordion.Content";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AccordionTitle = React.forwardRef<HTMLSpanElement, AccordionTitleProps>(
  ({ className, ...props }, ref) => {
    const classNames = accordion({});
    return (
      <Primitive.span
        ref={ref}
        className={className || classNames.title}
        {...props}
      />
    );
  }
);
AccordionTitle.displayName = "Accordion.Title";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AccordionDescription = React.forwardRef<HTMLSpanElement, AccordionDescriptionProps>(
  ({ className, ...props }, ref) => {
    const classNames = accordion({});
    return (
      <Primitive.span
        ref={ref}
        className={className || classNames.description}
        {...props}
      />
    );
  }
);
AccordionDescription.displayName = "Accordion.Description";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionPrefixIconProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionPrefixIcon = React.forwardRef<HTMLDivElement, AccordionPrefixIconProps>(
  ({ className, ...props }, ref) => {
    const classNames = accordion({});
    return (
      <Primitive.div
        ref={ref}
        className={className || classNames.prefixIcon}
        {...props}
      />
    );
  }
);
AccordionPrefixIcon.displayName = "Accordion.PrefixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionPrefixAvatarProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionPrefixAvatar = React.forwardRef<HTMLDivElement, AccordionPrefixAvatarProps>(
  ({ className, ...props }, ref) => {
    const classNames = accordion({});
    return (
      <Primitive.div
        ref={ref}
        className={className || classNames.prefixAvatar}
        {...props}
      />
    );
  }
);
AccordionPrefixAvatar.displayName = "Accordion.PrefixAvatar";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionSuffixIconProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionSuffixIcon = React.forwardRef<HTMLDivElement, AccordionSuffixIconProps>(
  ({ className, ...props }, ref) => {
    const classNames = accordion({});
    const itemContext = useAccordionItemContext();
    return (
      <Primitive.div
        ref={ref}
        className={className || classNames.suffixIcon}
        data-open={itemContext.open ? "" : undefined}
        {...props}
      />
    );
  }
);
AccordionSuffixIcon.displayName = "Accordion.SuffixIcon";
```

**IMPORTANT:** The implementation above uses `accordion({})` calls for className in each sub-component. This is a **simplified pattern**. During actual implementation, verify whether `createSlotRecipeContext`'s `withProvider`/`withContext` pattern should be used instead (like in Chip). The key difference is that Accordion.Root needs custom logic (context providers, keyboard handler) that may not fit neatly into `withProvider`. Read the actual `createSlotRecipeContext` code to decide:
- If `withProvider` supports custom render logic, use it
- If not, use manual className assignment as shown above, but ensure variant props flow correctly from Root to all children via context

- [ ] **Step 2: Create Accordion.namespace.ts**

```typescript
export {
  AccordionRoot as Root,
  AccordionItem as Item,
  AccordionTrigger as Trigger,
  AccordionContent as Content,
  AccordionTitle as Title,
  AccordionDescription as Description,
  AccordionPrefixIcon as PrefixIcon,
  AccordionPrefixAvatar as PrefixAvatar,
  AccordionSuffixIcon as SuffixIcon,
} from "./Accordion";

export type {
  AccordionRootProps as RootProps,
  AccordionItemProps as ItemProps,
  AccordionTriggerProps as TriggerProps,
  AccordionContentProps as ContentProps,
  AccordionTitleProps as TitleProps,
  AccordionDescriptionProps as DescriptionProps,
  AccordionPrefixIconProps as PrefixIconProps,
  AccordionPrefixAvatarProps as PrefixAvatarProps,
  AccordionSuffixIconProps as SuffixIconProps,
} from "./Accordion";
```

- [ ] **Step 3: Create index.ts barrel**

```typescript
export {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionTitle,
  AccordionDescription,
  AccordionPrefixIcon,
  AccordionPrefixAvatar,
  AccordionSuffixIcon,
  type AccordionRootProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
  type AccordionTitleProps,
  type AccordionDescriptionProps,
  type AccordionPrefixIconProps,
  type AccordionPrefixAvatarProps,
  type AccordionSuffixIconProps,
} from "./Accordion";

export * as Accordion from "./Accordion.namespace";
```

- [ ] **Step 4: Add to components index**

In `packages/react/src/components/index.ts`, add:

```typescript
export * from "./Accordion";
```

- [ ] **Step 5: Build and verify**

Run: `bun packages:build`
Expected: builds successfully without type errors

- [ ] **Step 6: Commit**

```bash
git add packages/react/src/components/Accordion/ packages/react/src/components/index.ts
git commit -m "feat(accordion): add React styled components"
```

---

## Task 5: Registry Snippet

**Files:**
- Create: `docs/registry/ui/accordion.tsx`
- Modify: `docs/registry/registry-ui.ts`

- [ ] **Step 1: Create the registry snippet**

```tsx
"use client";

import { Accordion as SeedAccordion } from "@seed-design/react";
import { IconChevronDownSmallLine } from "@karrotmarket/react-monochrome-icon";
import { accordion } from "@seed-design/css/recipes/accordion";
import * as React from "react";

export interface AccordionRootProps extends SeedAccordion.RootProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionRoot = SeedAccordion.Root;

export interface AccordionItemProps extends SeedAccordion.ItemProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionItem = SeedAccordion.Item;

export interface AccordionTriggerProps extends SeedAccordion.TriggerProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, ...props }, ref) => (
    <SeedAccordion.Trigger ref={ref} {...props}>
      {children}
      <SeedAccordion.SuffixIcon>
        <IconChevronDownSmallLine />
      </SeedAccordion.SuffixIcon>
    </SeedAccordion.Trigger>
  ),
);
AccordionTrigger.displayName = "Accordion.Trigger";

export interface AccordionContentProps extends SeedAccordion.ContentProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionContent = SeedAccordion.Content;

export interface AccordionTitleProps extends SeedAccordion.TitleProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionTitle = SeedAccordion.Title;

export interface AccordionDescriptionProps extends SeedAccordion.DescriptionProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionDescription = SeedAccordion.Description;

export interface AccordionPrefixIconProps extends SeedAccordion.PrefixIconProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionPrefixIcon = SeedAccordion.PrefixIcon;

export interface AccordionPrefixAvatarProps extends SeedAccordion.PrefixAvatarProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionPrefixAvatar = SeedAccordion.PrefixAvatar;

export interface AccordionSuffixIconProps extends SeedAccordion.SuffixIconProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionSuffixIcon = SeedAccordion.SuffixIcon;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
  Title: AccordionTitle,
  Description: AccordionDescription,
  PrefixIcon: AccordionPrefixIcon,
  PrefixAvatar: AccordionPrefixAvatar,
  SuffixIcon: AccordionSuffixIcon,
});
```

- [ ] **Step 2: Register in registry-ui.ts**

Read `docs/registry/registry-ui.ts` to find the exact format, then add accordion entry:

```typescript
{
  id: "accordion",
  snippets: [
    {
      path: "accordion.tsx",
      dependencies: {
        "@seed-design/react": "latest",
        "@seed-design/css": "latest",
      },
    },
  ],
},
```

Note: check existing entries for the exact dependency version format (e.g., `"~1.2.0"` vs `"latest"`).

- [ ] **Step 3: Commit**

```bash
git add docs/registry/ui/accordion.tsx docs/registry/registry-ui.ts
git commit -m "feat(accordion): add registry snippet with built-in chevron"
```

---

## Task 6: Documentation — Code Examples

**Files:**
- Create: `docs/examples/react/accordion/preview.tsx`
- Create: `docs/examples/react/accordion/inline.tsx`
- Create: `docs/examples/react/accordion/separated.tsx`
- Create: `docs/examples/react/accordion/single.tsx`
- Create: `docs/examples/react/accordion/size-large.tsx`
- Create: `docs/examples/react/accordion/with-prefix-icon.tsx`
- Create: `docs/examples/react/accordion/with-description.tsx`
- Create: `docs/examples/react/accordion/disabled.tsx`
- Create: `docs/examples/react/accordion/controlled.tsx`
- Create: `docs/examples/react/accordion/default-expanded.tsx`
- Create: `docs/examples/react/accordion/customizing-trigger.tsx`

- [ ] **Step 1: Create preview.tsx**

```tsx
import { Accordion } from "seed-design/ui/accordion";

export default function AccordionPreview() {
  return (
    <Accordion>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>
          <Accordion.Title>아코디언 항목 1</Accordion.Title>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>첫 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>
          <Accordion.Title>아코디언 항목 2</Accordion.Title>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>두 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>
          <Accordion.Title>아코디언 항목 3</Accordion.Title>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>세 번째 항목의 내용입니다.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
```

- [ ] **Step 2: Create remaining examples**

Create each file following the same pattern. Key variations:
- `inline.tsx` — explicit `variant="inline"` with explanation
- `separated.tsx` — `variant="separated"` showing card-style items
- `single.tsx` — `type="single" defaultValue="item-1"` showing only-one-open behavior
- `size-large.tsx` — `size="large"` showing larger trigger padding/font
- `with-prefix-icon.tsx` — using `Accordion.PrefixIcon` with an icon component
- `with-description.tsx` — using `Accordion.Description` below title
- `disabled.tsx` — both `<Accordion disabled>` (全体) and `<Accordion.Item disabled>` (個別)
- `controlled.tsx` — using `useState` with `value`/`onValueChange`
- `default-expanded.tsx` — using `defaultValue={["item-1"]}`
- `customizing-trigger.tsx` — putting Badge/Count components inside Trigger alongside Title

Each example should be a complete, runnable component with default export. Follow existing patterns from `docs/examples/react/chip/` or `docs/examples/react/select-box/`.

- [ ] **Step 3: Commit**

```bash
git add docs/examples/react/accordion/
git commit -m "docs(accordion): add code examples for all variants and features"
```

---

## Task 7: Documentation — React Docs MDX

**Files:**
- Create: `docs/content/react/components/accordion.mdx`

- [ ] **Step 1: Create the React docs MDX**

Follow `docs/content/react/components/select-box.mdx` pattern:

```mdx
---
title: Accordion
description: 여러 개의 관련된 콘텐츠 섹션을 수직으로 나열하고, 각 섹션을 펼치거나 접어 정보를 탐색할 수 있는 컴포넌트입니다.
---

<ComponentExample name="react/accordion/preview">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/preview.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

## Installation

```package-install
npx @seed-design/cli@latest add ui:accordion
```

<ManualInstallation name="accordion" />

## Props

### `AccordionRoot`

<react-type-table
  path="./registry/ui/accordion.tsx"
  name="AccordionRootProps"
/>

### `AccordionItem`

<react-type-table
  path="./registry/ui/accordion.tsx"
  name="AccordionItemProps"
/>

### `AccordionTrigger`

<react-type-table
  path="./registry/ui/accordion.tsx"
  name="AccordionTriggerProps"
/>

### `AccordionContent`

<react-type-table
  path="./registry/ui/accordion.tsx"
  name="AccordionContentProps"
/>

## Examples

### Inline Variant

기본 variant입니다. 아이템이 연속된 흐름으로 제공되고, 구분선으로 구분됩니다. FAQ와 같은 패턴에 적합합니다.

<ComponentExample name="react/accordion/inline">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/inline.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### Separated Variant

각 아이템이 독립된 카드 형태로 분리됩니다. 모달 내 사용이나 독립적인 항목이 강조될 때 적합합니다.

<ComponentExample name="react/accordion/separated">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/separated.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### Single Expand

`type="single"`을 사용하면 한 번에 하나의 항목만 열립니다. step-by-step 흐름에 적합합니다.

<ComponentExample name="react/accordion/single">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/single.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### Size Large

`size="large"`를 사용하면 더 큰 패딩과 폰트 크기가 적용됩니다.

<ComponentExample name="react/accordion/size-large">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/size-large.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### With Prefix Icon

`PrefixIcon`을 사용하여 트리거 좌측에 아이콘을 배치할 수 있습니다.

<ComponentExample name="react/accordion/with-prefix-icon">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/with-prefix-icon.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### With Description

`Description`을 사용하여 타이틀 아래에 부가 설명을 추가할 수 있습니다.

<ComponentExample name="react/accordion/with-description">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/with-description.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### Disabled

전체 Accordion 또는 개별 Item을 비활성화할 수 있습니다. 비활성화된 항목은 키보드 네비게이션에서 건너뛰어집니다.

<ComponentExample name="react/accordion/disabled">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/disabled.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### Controlled

`value`와 `onValueChange`를 사용하여 열림/닫힘 상태를 외부에서 제어할 수 있습니다.

<ComponentExample name="react/accordion/controlled">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/controlled.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### Default Expanded

`defaultValue`로 초기에 열려 있을 항목을 지정할 수 있습니다.

<ComponentExample name="react/accordion/default-expanded">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/default-expanded.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

### Customizing Trigger

Trigger 내부에 Badge, Count 등 커스텀 요소를 자유롭게 배치할 수 있습니다.

<ComponentExample name="react/accordion/customizing-trigger">
  ```json doc-gen:file
  {
    "file": "examples/react/accordion/customizing-trigger.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

## Accessibility

Accordion은 [WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)을 준수합니다.

### Keyboard Navigation

| 키 | 동작 |
|-----|------|
| `Enter` / `Space` | 포커스된 트리거 토글 |
| `ArrowDown` | 다음 트리거로 포커스 이동 |
| `ArrowUp` | 이전 트리거로 포커스 이동 |
| `Home` | 첫 번째 트리거로 포커스 이동 |
| `End` | 마지막 트리거로 포커스 이동 |
| `Tab` | 일반 탭 순서 (트리거 → 콘텐츠 → 다음 트리거) |
```

- [ ] **Step 2: Commit**

```bash
git add docs/content/react/components/accordion.mdx
git commit -m "docs(accordion): add React implementation docs with examples"
```

---

## Task 8: Documentation — Design Docs MDX

**Files:**
- Create: `docs/content/docs/components/(layout)/accordion.mdx`

- [ ] **Step 1: Create the design docs MDX**

Follow existing component doc patterns (like chip.mdx). Include:
- Figma images via `<FigmaImage>` with node IDs from the Figma spec
- Anatomy section
- Variants explanation (inline vs separated)
- Size explanation (medium vs large)
- Interaction spec (touch area, scroll behavior)
- Accessibility section
- When to use Accordion vs Collapsible

Note: The exact Figma node IDs for images need to be obtained from the Figma file during implementation. Reference the URLs from the PRD:
- `https://www.figma.com/design/ibKgKzfKUSuUHlqy0aQedq/branch/Lupf8PwdOBLeA7UmJDDJdg/SEED-Components?node-id=6120-3516`
- `https://www.figma.com/design/ibKgKzfKUSuUHlqy0aQedq/branch/Lupf8PwdOBLeA7UmJDDJdg/SEED-Components?node-id=6802-27478`

- [ ] **Step 2: Commit**

```bash
git add docs/content/docs/components/\(layout\)/accordion.mdx
git commit -m "docs(accordion): add design documentation with variants and accessibility guide"
```

---

## Task 9: Storybook Stories

**Files:**
- Create: `docs/stories/Accordion.stories.tsx`

- [ ] **Step 1: Create storybook stories**

Follow the pattern from existing stories (e.g., `docs/stories/Chip.Button.stories.tsx`):

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Accordion } from "seed-design/ui/accordion";
import { accordion } from "@seed-design/css/recipes/accordion";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = {
  component: Accordion,
  decorators: [SeedThemeDecorator],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const conditionMap = {
  variant: Object.keys(accordion.variantMap.variant),
  size: Object.keys(accordion.variantMap.size),
} as const;

const AccordionDemo = (props: any) => (
  <Accordion {...props} defaultValue={["item-1"]} style={{ width: 360 }}>
    <Accordion.Item value="item-1">
      <Accordion.Trigger>
        <Accordion.Title>아코디언 항목 1</Accordion.Title>
      </Accordion.Trigger>
      <Accordion.Content>
        <p style={{ padding: "0 16px 16px" }}>첫 번째 항목의 내용입니다.</p>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Trigger>
        <Accordion.Title>아코디언 항목 2</Accordion.Title>
      </Accordion.Trigger>
      <Accordion.Content>
        <p style={{ padding: "0 16px 16px" }}>두 번째 항목의 내용입니다.</p>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.Trigger>
        <Accordion.Title>아코디언 항목 3</Accordion.Title>
      </Accordion.Trigger>
      <Accordion.Content>
        <p style={{ padding: "0 16px 16px" }}>세 번째 항목의 내용입니다.</p>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
);

export const LightTheme: Story = {
  render: () => (
    <VariantTable Component={AccordionDemo} conditionMap={conditionMap} />
  ),
  parameters: {
    theme: "light",
  },
};

export const DarkTheme: Story = {
  render: () => (
    <VariantTable Component={AccordionDemo} conditionMap={conditionMap} />
  ),
  parameters: {
    theme: "dark",
  },
};
```

Note: Verify the exact `VariantTable` API and `SeedThemeDecorator` usage by reading existing stories first. Adjust the above code to match.

- [ ] **Step 2: Commit**

```bash
git add docs/stories/Accordion.stories.tsx
git commit -m "docs(accordion): add storybook stories with variant table"
```

---

## Task 10: Stackflow Example

**Files:**
- Create: `examples/stackflow-spa/src/seed-design/ui/accordion.tsx`
- Create: `examples/stackflow-spa/src/activities/ActivityAccordion.tsx`

- [ ] **Step 1: Copy registry snippet to stackflow example**

The file at `examples/stackflow-spa/src/seed-design/ui/accordion.tsx` should be identical to `docs/registry/ui/accordion.tsx`. Copy it.

- [ ] **Step 2: Create ActivityAccordion.tsx**

Follow patterns from existing activities (e.g., `ActivityChipButton.tsx`):

```tsx
import { Accordion } from "../seed-design/ui/accordion";

export default function ActivityAccordion() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Accordion</h2>
      <Accordion defaultValue={["item-1"]}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>
            <Accordion.Title>자주 묻는 질문 1</Accordion.Title>
          </Accordion.Trigger>
          <Accordion.Content>
            <p style={{ padding: "0 16px 16px" }}>
              답변 내용이 여기에 표시됩니다.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>
            <Accordion.Title>자주 묻는 질문 2</Accordion.Title>
          </Accordion.Trigger>
          <Accordion.Content>
            <p style={{ padding: "0 16px 16px" }}>
              두 번째 질문에 대한 답변입니다.
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
```

Note: Check the existing stackflow-spa routing setup to register this activity if needed.

- [ ] **Step 3: Commit**

```bash
git add examples/stackflow-spa/src/seed-design/ui/accordion.tsx examples/stackflow-spa/src/activities/ActivityAccordion.tsx
git commit -m "feat(accordion): add stackflow-spa example"
```

---

## Task 11: Build Verification and Generate All

- [ ] **Step 1: Run full generation**

Run: `bun generate:all`
Expected: all generation steps pass

- [ ] **Step 2: Run full build**

Run: `bun packages:build`
Expected: all packages build successfully

- [ ] **Step 3: Run tests**

Run: `bun test:all`
Expected: all existing tests pass (no regression)

- [ ] **Step 4: Run docs test**

Run: `bun docs:test`
Expected: docs build/test passes

- [ ] **Step 5: Verify storybook**

Run: `bun --filter @seed-design/docs storybook`
Expected: Accordion stories render in the Storybook UI with all variant combinations

- [ ] **Step 6: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix(accordion): address build/test issues"
```
