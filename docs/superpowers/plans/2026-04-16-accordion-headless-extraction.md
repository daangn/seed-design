# Accordion Headless Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract Accordion headless logic into a new `@seed-design/react-accordion` package (Radix-style with Collapsible delegation), remove all `as` type casts via Radix Impl splitting pattern, fix `AccordionTriggerProps` type, and add unit/integration tests.

**Architecture:** New headless package `@seed-design/react-accordion` depends on `@seed-design/react-collapsible` (Radix A pattern). AccordionRoot splits into AccordionImplSingle/AccordionImplMultiple to eliminate `as` casts. AccordionItem wraps `<Collapsible.Root>`, AccordionTrigger wraps `<Collapsible.Trigger>`, AccordionContent wraps `<Collapsible.Content>`. AccordionHeader adds `<h3>` heading wrapper per WAI-ARIA APG. Styled layer at `packages/react/src/components/Accordion/` shrinks to withContext wrappers.

**Tech Stack:** React 19, TypeScript, bun:test, @testing-library/react, @radix-ui/react-use-controllable-state, bunchee (build), rootage+qvism (design tokens → CSS recipes).

**Spec:** `docs/superpowers/specs/2026-04-16-accordion-headless-extraction-design.md`

---

## File Structure

### New files

| Path | Responsibility |
|------|----------------|
| `packages/react-headless/accordion/package.json` | Package metadata, deps: @seed-design/react-collapsible |
| `packages/react-headless/accordion/tsconfig.json` | TypeScript config (extends headless base) |
| `packages/react-headless/accordion/src/index.ts` | Barrel export |
| `packages/react-headless/accordion/src/Accordion.namespace.ts` | Namespace re-export (Accordion.Root etc) |
| `packages/react-headless/accordion/src/Accordion.tsx` | Root/Item/Header/Trigger/Content components |
| `packages/react-headless/accordion/src/useAccordion.ts` | State hook with type guard predicate (no `as`) |
| `packages/react-headless/accordion/src/useAccordionContext.tsx` | Root context provider + hook |
| `packages/react-headless/accordion/src/useAccordionItemContext.tsx` | Item context provider + hook |
| `packages/react-headless/accordion/src/useAccordion.test.tsx` | useAccordion unit tests |
| `packages/react-headless/accordion/src/Accordion.test.tsx` | Accordion integration tests |

### Modified files

| Path | Change |
|------|--------|
| `packages/react/src/components/Accordion/Accordion.tsx` | Shrink to styled wrapper (~80 lines) using withContext over @seed-design/react-accordion |
| `packages/react/src/components/Accordion/Accordion.namespace.ts` | Add AccordionHeader export |
| `packages/react/src/components/Accordion/index.ts` | Add AccordionHeader export |
| `packages/react/src/components/Accordion/AccordionContext.tsx` | DELETE (moved to headless) |
| `packages/react/src/components/Accordion/useAccordion.ts` | DELETE (moved to headless) |
| `packages/react/package.json` | Add dependency `@seed-design/react-accordion` |
| `packages/rootage/components/accordion.yaml` | Add `header` slot spec |
| `packages/qvism-preset/src/recipes/accordion.ts` | Add `header` slot with reset styles |
| `docs/registry/ui/accordion.tsx` | Auto-wrap with AccordionHeader in snippet |
| `examples/stackflow-spa/src/seed-design/ui/accordion.tsx` | Mirror snippet changes |
| `.changeset/velvety-tinkering-key.md` | Add `@seed-design/react-accordion: minor` |

---

## Task 1: Scaffold @seed-design/react-accordion package (package.json + tsconfig.json)

**Files:**
- Create: `packages/react-headless/accordion/package.json`
- Create: `packages/react-headless/accordion/tsconfig.json`

- [ ] **Step 1: Create package.json**

Create `packages/react-headless/accordion/package.json`:

```json
{
  "name": "@seed-design/react-accordion",
  "version": "0.1.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/daangn/seed-design.git",
    "directory": "packages/react-headless/accordion"
  },
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "import": "./lib/index.js",
      "require": "./lib/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "main": "./lib/index.cjs",
  "files": [
    "lib",
    "src"
  ],
  "scripts": {
    "clean": "rm -rf lib",
    "build": "bunchee",
    "lint:publish": "bun publint"
  },
  "dependencies": {
    "@radix-ui/react-compose-refs": "^1.1.2",
    "@radix-ui/react-use-controllable-state": "^1.2.2",
    "@seed-design/dom-utils": "1.0.0",
    "@seed-design/react-collapsible": "0.1.0",
    "@seed-design/react-primitive": "1.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.6",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

Create `packages/react-headless/accordion/tsconfig.json`:

```json
{
  "extends": "../../../tsconfig.headless.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Install dependencies**

Run: `bun install`
Expected: workspace links @seed-design/react-accordion, no install errors.

- [ ] **Step 4: Commit**

```bash
git add packages/react-headless/accordion/package.json packages/react-headless/accordion/tsconfig.json
git commit -m "feat(react-accordion): scaffold package metadata"
```

---

## Task 2: useAccordion hook with type guard predicate (no `as`)

**Files:**
- Create: `packages/react-headless/accordion/src/useAccordion.ts`

- [ ] **Step 1: Create useAccordion.ts**

Create `packages/react-headless/accordion/src/useAccordion.ts`:

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

function isSingleProps(props: UseAccordionProps): props is UseAccordionSingleProps {
  return props.type === "single";
}

export function useAccordion(props: UseAccordionProps) {
  const disabled = props.disabled ?? false;

  const [singleValue, setSingleValue] = useControllableState<string>({
    prop: isSingleProps(props) ? props.value : undefined,
    defaultProp: isSingleProps(props) ? (props.defaultValue ?? "") : "",
    onChange: isSingleProps(props) ? props.onValueChange : undefined,
  });

  const [multipleValue, setMultipleValue] = useControllableState<string[]>({
    prop: !isSingleProps(props) ? props.value : undefined,
    defaultProp: !isSingleProps(props) ? (props.defaultValue ?? []) : [],
    onChange: !isSingleProps(props) ? props.onValueChange : undefined,
  });

  const collapsible = isSingleProps(props) ? (props.collapsible ?? true) : true;

  const isOpen = useCallback(
    (itemValue: string) =>
      isSingleProps(props) ? singleValue === itemValue : multipleValue.includes(itemValue),
    [props, singleValue, multipleValue],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (isSingleProps(props)) {
        if (singleValue === itemValue) {
          if (collapsible) setSingleValue("");
        } else {
          setSingleValue(itemValue);
        }
      } else {
        setMultipleValue((prev) =>
          prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue],
        );
      }
    },
    [props, singleValue, collapsible, setSingleValue, setMultipleValue],
  );

  return { disabled, collapsible, isOpen, toggle };
}

export type UseAccordionReturn = ReturnType<typeof useAccordion>;
```

- [ ] **Step 2: Verify no `as` casts**

Run: `grep -c " as " packages/react-headless/accordion/src/useAccordion.ts`
Expected: `0`

- [ ] **Step 3: Commit**

```bash
git add packages/react-headless/accordion/src/useAccordion.ts
git commit -m "feat(react-accordion): add useAccordion hook with type guard predicate"
```

---

## Task 3: Context providers (root + item)

**Files:**
- Create: `packages/react-headless/accordion/src/useAccordionContext.tsx`
- Create: `packages/react-headless/accordion/src/useAccordionItemContext.tsx`

- [ ] **Step 1: Create useAccordionContext.tsx**

Create `packages/react-headless/accordion/src/useAccordionContext.tsx`:

```typescript
import { createContext, useContext } from "react";
import type { UseAccordionReturn } from "./useAccordion";

export interface UseAccordionContext extends UseAccordionReturn {}

const AccordionContext = createContext<UseAccordionContext | null>(null);

export const AccordionProvider = AccordionContext.Provider;

export function useAccordionContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAccordionContext | null : UseAccordionContext {
  const context = useContext(AccordionContext);
  if (!context && strict) {
    throw new Error("useAccordionContext must be used within an AccordionRoot");
  }
  return context as UseAccordionContext;
}
```

- [ ] **Step 2: Create useAccordionItemContext.tsx**

Create `packages/react-headless/accordion/src/useAccordionItemContext.tsx`:

```typescript
import { createContext, useContext } from "react";

export interface UseAccordionItemContext {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
}

const AccordionItemContext = createContext<UseAccordionItemContext | null>(null);

export const AccordionItemProvider = AccordionItemContext.Provider;

export function useAccordionItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAccordionItemContext | null : UseAccordionItemContext {
  const context = useContext(AccordionItemContext);
  if (!context && strict) {
    throw new Error("useAccordionItemContext must be used within an AccordionItem");
  }
  return context as UseAccordionItemContext;
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/react-headless/accordion/src/useAccordionContext.tsx packages/react-headless/accordion/src/useAccordionItemContext.tsx
git commit -m "feat(react-accordion): add context providers"
```

---

## Task 4: Accordion components (Root with Impl split + Item/Header/Trigger/Content)

**Files:**
- Create: `packages/react-headless/accordion/src/Accordion.tsx`

- [ ] **Step 1: Create Accordion.tsx**

Create `packages/react-headless/accordion/src/Accordion.tsx`:

```typescript
"use client";

import { dataAttr } from "@seed-design/dom-utils";
import { Collapsible } from "@seed-design/react-collapsible";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef, useCallback, useId, useMemo } from "react";
import type * as React from "react";
import {
  useAccordion,
  type UseAccordionMultipleProps,
  type UseAccordionReturn,
  type UseAccordionSingleProps,
} from "./useAccordion";
import { AccordionProvider, useAccordionContext } from "./useAccordionContext";
import { AccordionItemProvider, useAccordionItemContext } from "./useAccordionItemContext";

////////////////////////////////////////////////////////////////////////////////////

interface AccordionRootBaseProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export type AccordionSingleRootProps = AccordionRootBaseProps & UseAccordionSingleProps;
export type AccordionMultipleRootProps = AccordionRootBaseProps & UseAccordionMultipleProps;
export type AccordionRootProps = AccordionSingleRootProps | AccordionMultipleRootProps;

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>((props, ref) => {
  if (props.type === "single") {
    return <AccordionImplSingle {...props} ref={ref} />;
  }
  return <AccordionImplMultiple {...props} ref={ref} />;
});
AccordionRoot.displayName = "AccordionRoot";

const AccordionImplSingle = forwardRef<HTMLDivElement, AccordionSingleRootProps>((props, ref) => {
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible,
    disabled,
    onKeyDown,
    children,
    ...rest
  } = props;

  const api = useAccordion({
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible,
    disabled,
  });

  return (
    <AccordionImpl ref={ref} api={api} onKeyDown={onKeyDown} {...rest}>
      {children}
    </AccordionImpl>
  );
});
AccordionImplSingle.displayName = "AccordionImplSingle";

const AccordionImplMultiple = forwardRef<HTMLDivElement, AccordionMultipleRootProps>(
  (props, ref) => {
    const { type, value, defaultValue, onValueChange, disabled, onKeyDown, children, ...rest } =
      props;

    const api = useAccordion({
      type,
      value,
      defaultValue,
      onValueChange,
      disabled,
    });

    return (
      <AccordionImpl ref={ref} api={api} onKeyDown={onKeyDown} {...rest}>
        {children}
      </AccordionImpl>
    );
  },
);
AccordionImplMultiple.displayName = "AccordionImplMultiple";

interface AccordionImplProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  api: UseAccordionReturn;
}

const AccordionImpl = forwardRef<HTMLDivElement, AccordionImplProps>(
  ({ api, onKeyDown, ...props }, ref) => {
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;

        const { key } = event;
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;

        const target = event.target as HTMLElement;
        if (!target.hasAttribute("data-accordion-trigger")) return;

        event.preventDefault();

        const triggers = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            "[data-accordion-trigger]:not([disabled])",
          ),
        );

        if (triggers.length === 0) return;

        const currentIndex = triggers.indexOf(target);

        let nextIndex: number;
        switch (key) {
          case "ArrowDown":
            nextIndex = currentIndex + 1 >= triggers.length ? 0 : currentIndex + 1;
            break;
          case "ArrowUp":
            nextIndex = currentIndex - 1 < 0 ? triggers.length - 1 : currentIndex - 1;
            break;
          case "Home":
            nextIndex = 0;
            break;
          case "End":
            nextIndex = triggers.length - 1;
            break;
          default:
            return;
        }

        triggers[nextIndex]?.focus();
      },
      [onKeyDown],
    );

    return (
      <AccordionProvider value={api}>
        <Primitive.div
          ref={ref}
          data-disabled={dataAttr(api.disabled)}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </AccordionProvider>
    );
  },
);
AccordionImpl.displayName = "AccordionImpl";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>((props, ref) => {
  const { value, disabled: itemDisabled, ...rest } = props;
  const api = useAccordionContext();
  const triggerId = useId();

  const disabled = itemDisabled ?? api.disabled;
  const open = api.isOpen(value);

  const itemContext = useMemo(
    () => ({ value, open, disabled, triggerId }),
    [value, open, disabled, triggerId],
  );

  return (
    <AccordionItemProvider value={itemContext}>
      <Collapsible.Root
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen !== open) api.toggle(value);
        }}
        disabled={disabled}
        ref={ref}
        {...rest}
      />
    </AccordionItemProvider>
  );
});
AccordionItem.displayName = "AccordionItem";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * `AccordionHeader` wraps the `AccordionTrigger` to provide a semantic heading
 * level for screen readers and document outline.
 *
 * Renders as `<h3>` by default.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/#wai-ariaroles%2Cstates%2Candproperties
 *   — "The title of each accordion header is contained in an element with role `button`.
 *   Each accordion header `button` is wrapped in an element with role `heading`..."
 */
export const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  (props, ref) => <Primitive.h3 ref={ref} {...props} />,
);
AccordionHeader.displayName = "AccordionHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * `AccordionTrigger` toggles the open/closed state of an `AccordionItem`.
 * It should always be nested inside of an `AccordionHeader` to preserve the
 * WAI-ARIA accordion pattern (heading > button).
 *
 * Renders as a native `<button>` with `aria-expanded`, `aria-controls`,
 * `aria-disabled` automatically managed via the underlying collapsible.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (props, ref) => {
    const { triggerId } = useAccordionItemContext();
    return (
      <Collapsible.Trigger ref={ref} id={triggerId} data-accordion-trigger="" {...props} />
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>((props, ref) => {
  const { triggerId } = useAccordionItemContext();
  return (
    <Collapsible.Content ref={ref} role="region" aria-labelledby={triggerId} {...props} />
  );
});
AccordionContent.displayName = "AccordionContent";
```

- [ ] **Step 2: Verify no `as` casts in components**

Run: `grep -c " as " packages/react-headless/accordion/src/Accordion.tsx`
Expected: `1` (only `as HTMLElement` in keyboard handler — DOM cast, not props cast)

- [ ] **Step 3: Commit**

```bash
git add packages/react-headless/accordion/src/Accordion.tsx
git commit -m "feat(react-accordion): add Root (Impl split) + Item/Header/Trigger/Content"
```

---

## Task 5: Barrel exports (index.ts + Accordion.namespace.ts)

**Files:**
- Create: `packages/react-headless/accordion/src/Accordion.namespace.ts`
- Create: `packages/react-headless/accordion/src/index.ts`

- [ ] **Step 1: Create Accordion.namespace.ts**

Create `packages/react-headless/accordion/src/Accordion.namespace.ts`:

```typescript
export {
  AccordionRoot as Root,
  AccordionItem as Item,
  AccordionHeader as Header,
  AccordionTrigger as Trigger,
  AccordionContent as Content,
  type AccordionRootProps as RootProps,
  type AccordionItemProps as ItemProps,
  type AccordionHeaderProps as HeaderProps,
  type AccordionTriggerProps as TriggerProps,
  type AccordionContentProps as ContentProps,
} from "./Accordion";
```

- [ ] **Step 2: Create index.ts**

Create `packages/react-headless/accordion/src/index.ts`:

```typescript
export {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  type AccordionRootProps,
  type AccordionSingleRootProps,
  type AccordionMultipleRootProps,
  type AccordionItemProps,
  type AccordionHeaderProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from "./Accordion";

export {
  useAccordion,
  type UseAccordionProps,
  type UseAccordionSingleProps,
  type UseAccordionMultipleProps,
  type UseAccordionReturn,
} from "./useAccordion";

export {
  useAccordionContext,
  AccordionProvider,
  type UseAccordionContext,
} from "./useAccordionContext";

export {
  useAccordionItemContext,
  AccordionItemProvider,
  type UseAccordionItemContext,
} from "./useAccordionItemContext";

export * as Accordion from "./Accordion.namespace";
```

- [ ] **Step 3: Build and verify**

Run: `bun --filter @seed-design/react-accordion build`
Expected: `lib/index.js`, `lib/index.cjs`, `lib/index.d.ts` generated without errors.

- [ ] **Step 4: Commit**

```bash
git add packages/react-headless/accordion/src/Accordion.namespace.ts packages/react-headless/accordion/src/index.ts
git commit -m "feat(react-accordion): add barrel exports and namespace"
```

---

## Task 6: useAccordion unit tests

**Files:**
- Create: `packages/react-headless/accordion/src/useAccordion.test.tsx`

- [ ] **Step 1: Write useAccordion.test.tsx**

Create `packages/react-headless/accordion/src/useAccordion.test.tsx`:

```typescript
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import type { ReactElement } from "react";
import * as React from "react";

import {
  useAccordion,
  type UseAccordionMultipleProps,
  type UseAccordionSingleProps,
} from "./useAccordion";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function SingleHarness(
  props: UseAccordionSingleProps & {
    onApi?: (api: ReturnType<typeof useAccordion>) => void;
  },
) {
  const { onApi, ...hookProps } = props;
  const api = useAccordion(hookProps);
  onApi?.(api);
  return (
    <div>
      <button type="button" data-testid="toggle-1" onClick={() => api.toggle("item-1")}>
        toggle 1
      </button>
      <button type="button" data-testid="toggle-2" onClick={() => api.toggle("item-2")}>
        toggle 2
      </button>
      <span data-testid="open-1">{String(api.isOpen("item-1"))}</span>
      <span data-testid="open-2">{String(api.isOpen("item-2"))}</span>
      <span data-testid="disabled">{String(api.disabled)}</span>
      <span data-testid="collapsible">{String(api.collapsible)}</span>
    </div>
  );
}

function MultipleHarness(
  props: UseAccordionMultipleProps & {
    onApi?: (api: ReturnType<typeof useAccordion>) => void;
  },
) {
  const { onApi, ...hookProps } = props;
  const api = useAccordion(hookProps);
  onApi?.(api);
  return (
    <div>
      <button type="button" data-testid="toggle-1" onClick={() => api.toggle("item-1")}>
        toggle 1
      </button>
      <button type="button" data-testid="toggle-2" onClick={() => api.toggle("item-2")}>
        toggle 2
      </button>
      <span data-testid="open-1">{String(api.isOpen("item-1"))}</span>
      <span data-testid="open-2">{String(api.isOpen("item-2"))}</span>
    </div>
  );
}

describe("useAccordion", () => {
  describe("single mode", () => {
    it("initializes with defaultValue", () => {
      const { getByTestId } = setUp(<SingleHarness type="single" defaultValue="item-1" />);
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("false");
    });

    it("opens one item on toggle and closes the previously open one", async () => {
      const { getByTestId, user } = setUp(<SingleHarness type="single" />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("false");

      await user.click(getByTestId("toggle-2"));
      expect(getByTestId("open-1")).toHaveTextContent("false");
      expect(getByTestId("open-2")).toHaveTextContent("true");
    });

    it("closes the open item when collapsible=true (default) and re-clicked", async () => {
      const { getByTestId, user } = setUp(<SingleHarness type="single" defaultValue="item-1" />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("false");
    });

    it("keeps the open item when collapsible=false and re-clicked", async () => {
      const { getByTestId, user } = setUp(
        <SingleHarness type="single" defaultValue="item-1" collapsible={false} />,
      );
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("true");
    });

    it("is controlled when value prop is provided", async () => {
      const handleChange = mock<(value: string) => void>(() => {});
      const { getByTestId, user, rerender } = setUp(
        <SingleHarness type="single" value="" onValueChange={handleChange} />,
      );
      await user.click(getByTestId("toggle-1"));
      expect(handleChange).toHaveBeenCalledWith("item-1");

      rerender(<SingleHarness type="single" value="item-1" onValueChange={handleChange} />);
      expect(getByTestId("open-1")).toHaveTextContent("true");
    });

    it("exposes collapsible=true by default", () => {
      const { getByTestId } = setUp(<SingleHarness type="single" />);
      expect(getByTestId("collapsible")).toHaveTextContent("true");
    });
  });

  describe("multiple mode", () => {
    it("initializes with defaultValue array", () => {
      const { getByTestId } = setUp(<MultipleHarness defaultValue={["item-1", "item-2"]} />);
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("true");
    });

    it("toggles items independently", async () => {
      const { getByTestId, user } = setUp(<MultipleHarness />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("true");

      await user.click(getByTestId("toggle-2"));
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("true");
    });

    it("removes from array on re-click", async () => {
      const { getByTestId, user } = setUp(<MultipleHarness defaultValue={["item-1"]} />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("false");
    });

    it("calls onValueChange with new array", async () => {
      const handleChange = mock<(value: string[]) => void>(() => {});
      const { getByTestId, user } = setUp(
        <MultipleHarness value={[]} onValueChange={handleChange} />,
      );
      await user.click(getByTestId("toggle-1"));
      expect(handleChange).toHaveBeenCalledWith(["item-1"]);
    });
  });

  describe("disabled", () => {
    it("exposes disabled=true when prop is true", () => {
      const { getByTestId } = setUp(<SingleHarness type="single" disabled={true} />);
      expect(getByTestId("disabled")).toHaveTextContent("true");
    });

    it("defaults disabled to false", () => {
      const { getByTestId } = setUp(<SingleHarness type="single" />);
      expect(getByTestId("disabled")).toHaveTextContent("false");
    });
  });
});
```

- [ ] **Step 2: Run tests**

Run: `bun test packages/react-headless/accordion/src/useAccordion.test.tsx`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add packages/react-headless/accordion/src/useAccordion.test.tsx
git commit -m "test(react-accordion): add useAccordion unit tests"
```

---

## Task 7: Accordion integration tests (keyboard nav + ARIA)

**Files:**
- Create: `packages/react-headless/accordion/src/Accordion.test.tsx`

- [ ] **Step 1: Write Accordion.test.tsx**

Create `packages/react-headless/accordion/src/Accordion.test.tsx`:

```typescript
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, describe, expect, it } from "bun:test";
import type { ReactElement } from "react";

import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
  type AccordionRootProps,
} from "./Accordion";

// ResizeObserver mock required by underlying @seed-design/react-collapsible
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function ThreeItemAccordion(props: Partial<AccordionRootProps> = {}) {
  return (
    <AccordionRoot {...(props as AccordionRootProps)}>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Trigger 1</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Trigger 2</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Trigger 3</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

describe("Accordion", () => {
  const originalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = ResizeObserver;

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  describe("structure", () => {
    it("renders Root, Header, Trigger, Content", () => {
      const { getByText, getAllByRole } = setUp(<ThreeItemAccordion />);
      expect(getByText("Trigger 1")).toBeInTheDocument();
      expect(getAllByRole("heading", { level: 3 })).toHaveLength(3);
    });
  });

  describe("ARIA", () => {
    it("links trigger id to content via aria-labelledby", () => {
      const { getByText } = setUp(<ThreeItemAccordion defaultValue={["item-1"]} />);
      const trigger = getByText("Trigger 1");
      const content = getByText("Content 1");
      const triggerId = trigger.getAttribute("id");
      expect(triggerId).toBeTruthy();
      expect(content.getAttribute("aria-labelledby")).toBe(triggerId);
    });

    it("links trigger aria-controls to content id", () => {
      const { getByText } = setUp(<ThreeItemAccordion defaultValue={["item-1"]} />);
      const trigger = getByText("Trigger 1");
      const content = getByText("Content 1");
      const contentId = content.getAttribute("id");
      expect(contentId).toBeTruthy();
      expect(trigger.getAttribute("aria-controls")).toBe(contentId);
    });

    it("sets role=region on content", () => {
      const { getByText } = setUp(<ThreeItemAccordion defaultValue={["item-1"]} />);
      expect(getByText("Content 1")).toHaveAttribute("role", "region");
    });

    it("aria-expanded reflects open state", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger = getByText("Trigger 1");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("click interaction", () => {
    it("toggles open state on trigger click", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion type="single" />);
      const trigger = getByText("Trigger 1");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("keyboard navigation", () => {
    it("moves focus with ArrowDown (wraps around)", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger1 = getByText("Trigger 1");
      const trigger2 = getByText("Trigger 2");
      const trigger3 = getByText("Trigger 3");

      trigger1.focus();
      await user.keyboard("{ArrowDown}");
      expect(trigger2).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(trigger3).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(trigger1).toHaveFocus();
    });

    it("moves focus with ArrowUp (wraps around)", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger1 = getByText("Trigger 1");
      const trigger3 = getByText("Trigger 3");

      trigger1.focus();
      await user.keyboard("{ArrowUp}");
      expect(trigger3).toHaveFocus();
    });

    it("jumps to first/last with Home/End", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger1 = getByText("Trigger 1");
      const trigger2 = getByText("Trigger 2");
      const trigger3 = getByText("Trigger 3");

      trigger2.focus();
      await user.keyboard("{End}");
      expect(trigger3).toHaveFocus();

      await user.keyboard("{Home}");
      expect(trigger1).toHaveFocus();
    });
  });

  describe("data attributes", () => {
    it("sets data-accordion-trigger on trigger", () => {
      const { getByText } = setUp(<ThreeItemAccordion />);
      expect(getByText("Trigger 1")).toHaveAttribute("data-accordion-trigger");
    });

    it("sets data-state=open when item is open", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger = getByText("Trigger 1");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("data-state", "open");
    });
  });
});
```

- [ ] **Step 2: Run tests**

Run: `bun test packages/react-headless/accordion/src/Accordion.test.tsx`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add packages/react-headless/accordion/src/Accordion.test.tsx
git commit -m "test(react-accordion): add Accordion integration tests (keyboard, ARIA)"
```

---

## Task 8: Add `header` slot to rootage + qvism

**Files:**
- Modify: `packages/rootage/components/accordion.yaml`
- Modify (generated): `packages/qvism-preset/src/vars/component/accordion.mjs` + `.d.ts`
- Modify (generated): `packages/css/vars/component/accordion.mjs` + `.d.ts`
- Modify: `packages/qvism-preset/src/recipes/accordion.ts`
- Modify (generated): `packages/css/recipes/accordion.*`

- [ ] **Step 1: Add header slot to accordion.yaml**

In `packages/rootage/components/accordion.yaml`, locate the `slots:` section. Add `header:` as an empty slot (no properties; just reset styles in recipe):

```yaml
    slots:
      root:
        # ...existing properties
      item:
        # ...existing properties
      header: {}
      trigger:
        # ...existing properties
      # ...rest unchanged
```

- [ ] **Step 2: Run rootage:generate**

Run: `bun rootage:generate`
Expected: `packages/qvism-preset/src/vars/component/accordion.mjs` and `packages/css/vars/component/accordion.mjs` regenerated with `header` slot.

- [ ] **Step 3: Add header slot to recipe**

In `packages/qvism-preset/src/recipes/accordion.ts`:

1. Add `"header"` to the `slots` array.
2. Add `header` base styles (minimal reset so `<h3>` inherits from parent):

```typescript
const accordion = defineSlotRecipe({
  name: "accordion",
  slots: [
    "root",
    "item",
    "header",
    "trigger",
    "prefix",
    "body",
    "title",
    "description",
    "suffixIcon",
    "content",
    "contentInner",
  ],
  base: {
    // ...existing slots
    header: {
      // Reset default h3 styles so the trigger button is the visible element
      margin: 0,
      padding: 0,
      font: "inherit",
      display: "flex",
    },
    // ...rest unchanged
  },
  // ...
});
```

- [ ] **Step 4: Run qvism:generate**

Run: `bun qvism:generate`
Expected: `packages/css/recipes/accordion.*` regenerated with `header` class.

- [ ] **Step 5: Verify build**

Run: `bun --filter @seed-design/css build`
Expected: no build errors.

- [ ] **Step 6: Commit**

```bash
git add packages/rootage/components/accordion.yaml packages/qvism-preset/src/vars/component/accordion.* packages/css/vars/component/accordion.* packages/qvism-preset/src/recipes/accordion.ts packages/css/recipes/accordion.*
git commit -m "feat(accordion): add header slot for semantic heading wrapper"
```

---

## Task 9: Shrink packages/react/Accordion to styled wrapper

**Files:**
- Modify: `packages/react/src/components/Accordion/Accordion.tsx`
- Delete: `packages/react/src/components/Accordion/AccordionContext.tsx`
- Delete: `packages/react/src/components/Accordion/useAccordion.ts`
- Modify: `packages/react/src/components/Accordion/Accordion.namespace.ts`
- Modify: `packages/react/src/components/Accordion/index.ts`
- Modify: `packages/react/package.json`

- [ ] **Step 1: Add @seed-design/react-accordion dependency**

In `packages/react/package.json`, add to `dependencies`:

```json
{
  "dependencies": {
    "@seed-design/react-accordion": "0.1.0",
    // ...other deps
  }
}
```

Run: `bun install`

- [ ] **Step 2: Rewrite packages/react/src/components/Accordion/Accordion.tsx**

Replace the entire file with:

```typescript
"use client";

import { accordion } from "@seed-design/css/recipes/accordion";
import { dataAttr } from "@seed-design/dom-utils";
import { Accordion as AccordionPrimitive } from "@seed-design/react-accordion";
import { useAccordionItemContext } from "@seed-design/react-accordion";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { forwardRef } from "react";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(accordion);

const useAccordionItemStateProps = () => {
  const ctx = useAccordionItemContext();
  return {
    stateProps: {
      "data-disabled": dataAttr(ctx.disabled),
    } as React.HTMLAttributes<HTMLElement>,
  };
};

const withStateProps = createWithStateProps([useAccordionItemStateProps]);

////////////////////////////////////////////////////////////////////////////////////

export type AccordionRootProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

export const AccordionRoot = withProvider<HTMLDivElement, AccordionRootProps>(
  AccordionPrimitive.Root,
  "root",
);
AccordionRoot.displayName = "Accordion.Root";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

export const AccordionItem = withContext<HTMLDivElement, AccordionItemProps>(
  AccordionPrimitive.Item,
  "item",
);
AccordionItem.displayName = "Accordion.Item";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionHeaderProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header> {}

export const AccordionHeader = withContext<HTMLHeadingElement, AccordionHeaderProps>(
  AccordionPrimitive.Header,
  "header",
);
AccordionHeader.displayName = "Accordion.Header";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {}

export const AccordionTrigger = withContext<HTMLButtonElement, AccordionTriggerProps>(
  AccordionPrimitive.Trigger,
  "trigger",
);
AccordionTrigger.displayName = "Accordion.Trigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {}

export const AccordionContent = withContext<HTMLDivElement, AccordionContentProps>(
  AccordionPrimitive.Content,
  "content",
);
AccordionContent.displayName = "Accordion.Content";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentInnerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContentInner = withContext<HTMLDivElement, AccordionContentInnerProps>(
  Primitive.div,
  "contentInner",
);
AccordionContentInner.displayName = "Accordion.ContentInner";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AccordionBody = withContext<HTMLDivElement, AccordionBodyProps>(Primitive.div, "body");
AccordionBody.displayName = "Accordion.Body";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AccordionTitle = withContext<HTMLSpanElement, AccordionTitleProps>(
  withStateProps(Primitive.span),
  "title",
);
AccordionTitle.displayName = "Accordion.Title";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AccordionDescription = withContext<HTMLSpanElement, AccordionDescriptionProps>(
  withStateProps(Primitive.span),
  "description",
);
AccordionDescription.displayName = "Accordion.Description";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionPrefixProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionPrefix = withContext<HTMLDivElement, AccordionPrefixProps>(
  withStateProps(Primitive.div),
  "prefix",
);
AccordionPrefix.displayName = "Accordion.Prefix";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionSuffixIconProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionSuffixIcon = withContext<HTMLDivElement, AccordionSuffixIconProps>(
  withStateProps(Primitive.div),
  "suffixIcon",
);
AccordionSuffixIcon.displayName = "Accordion.SuffixIcon";
```

- [ ] **Step 3: Delete obsolete files**

```bash
rm packages/react/src/components/Accordion/AccordionContext.tsx
rm packages/react/src/components/Accordion/useAccordion.ts
```

- [ ] **Step 4: Update namespace export to include Header**

Rewrite `packages/react/src/components/Accordion/Accordion.namespace.ts`:

```typescript
export {
  AccordionRoot as Root,
  AccordionItem as Item,
  AccordionHeader as Header,
  AccordionTrigger as Trigger,
  AccordionContent as Content,
  AccordionContentInner as ContentInner,
  AccordionBody as Body,
  AccordionTitle as Title,
  AccordionDescription as Description,
  AccordionPrefix as Prefix,
  AccordionSuffixIcon as SuffixIcon,
  type AccordionRootProps as RootProps,
  type AccordionItemProps as ItemProps,
  type AccordionHeaderProps as HeaderProps,
  type AccordionTriggerProps as TriggerProps,
  type AccordionContentProps as ContentProps,
  type AccordionContentInnerProps as ContentInnerProps,
  type AccordionBodyProps as BodyProps,
  type AccordionTitleProps as TitleProps,
  type AccordionDescriptionProps as DescriptionProps,
  type AccordionPrefixProps as PrefixProps,
  type AccordionSuffixIconProps as SuffixIconProps,
} from "./Accordion";
```

- [ ] **Step 5: Update index.ts to include Header + remove deleted exports**

Rewrite `packages/react/src/components/Accordion/index.ts`:

```typescript
export * from "./Accordion";
export * as Accordion from "./Accordion.namespace";
```

(Previous exports of `useAccordion`, `AccordionContext` are no longer needed — they're now in `@seed-design/react-accordion`.)

- [ ] **Step 6: Build and verify**

Run: `bun packages:build`
Expected: no build errors, `@seed-design/react` uses `@seed-design/react-accordion`.

- [ ] **Step 7: Commit**

```bash
git add packages/react/package.json packages/react/src/components/Accordion/ bun.lock
git commit -m "refactor(accordion): shrink react layer to styled wrapper over headless"
```

---

## Task 10: Update snippet to auto-wrap AccordionHeader

**Files:**
- Modify: `docs/registry/ui/accordion.tsx`
- Modify: `examples/stackflow-spa/src/seed-design/ui/accordion.tsx`

- [ ] **Step 1: Update docs/registry/ui/accordion.tsx**

The snippet must auto-wrap Trigger in AccordionHeader so the sample APIs (without `Accordion.Header` in examples) still render `<h3>` wrappers.

In `docs/registry/ui/accordion.tsx`, locate the `AccordionTrigger` snippet definition and wrap in `<SeedAccordion.Header>`:

```typescript
import {
  Accordion as SeedAccordion,
  type AccordionTriggerProps as SeedAccordionTriggerProps,
} from "@seed-design/react";
// ...existing imports

export interface AccordionTriggerProps extends SeedAccordionTriggerProps {
  prefix?: React.ReactNode;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ prefix, children, ...props }, ref) => (
    <SeedAccordion.Header>
      <SeedAccordion.Trigger ref={ref} {...props}>
        {prefix && <SeedAccordion.Prefix>{prefix}</SeedAccordion.Prefix>}
        <SeedAccordion.Body>{children}</SeedAccordion.Body>
        <SeedAccordion.SuffixIcon>
          <IconChevronDownSmallLine />
        </SeedAccordion.SuffixIcon>
      </SeedAccordion.Trigger>
    </SeedAccordion.Header>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";
```

- [ ] **Step 2: Mirror change in examples/stackflow-spa**

Apply identical change to `examples/stackflow-spa/src/seed-design/ui/accordion.tsx`.

- [ ] **Step 3: Build docs + run docs tests**

Run: `bun docs:test`
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add docs/registry/ui/accordion.tsx examples/stackflow-spa/src/seed-design/ui/accordion.tsx
git commit -m "refactor(accordion-snippet): auto-wrap Trigger in AccordionHeader"
```

---

## Task 11: Update changeset

**Files:**
- Modify: `.changeset/velvety-tinkering-key.md`

- [ ] **Step 1: Add @seed-design/react-accordion to changeset**

Update `.changeset/velvety-tinkering-key.md` by adding the new package to the frontmatter:

```markdown
---
"@seed-design/react": minor
"@seed-design/react-accordion": minor
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
---

`Accordion` 컴포넌트를 추가합니다.

여러 개의 관련 콘텐츠 섹션을 수직으로 나열하고, 각 섹션을 펼치거나 접어 정보를 탐색할 수 있는 컴포넌트입니다.

- `type="single" | "multiple"`로 한 번에 하나/여러 항목 확장 가능
- `variant="inline" | "separated"` 지원 (기본값: `inline`)
- `size="medium" | "large"` 지원 (기본값: `medium`)
- WAI-ARIA Accordion Pattern 준수 (키보드 `Enter`/`Space`/`ArrowUp`/`ArrowDown`/`Home`/`End`)
- 접근성을 위해 `AccordionHeader`(`<h3>`) 래퍼가 자동 적용됩니다.

### Headless 패키지 분리

`@seed-design/react-accordion` 패키지가 새로 추가되었습니다. 스타일 없이 상태 관리와 접근성 로직만 필요한 경우 직접 사용할 수 있습니다:

\`\`\`tsx
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@seed-design/react-accordion";
\`\`\`

### 사용 예시

\`\`\`tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionTitle,
  AccordionDescription,
  AccordionContent,
} from "seed-design/ui/accordion";

<Accordion type="single" defaultValue="item-1" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>
      <AccordionTitle>자주 묻는 질문 1</AccordionTitle>
    </AccordionTrigger>
    <AccordionContent>답변 내용</AccordionContent>
  </AccordionItem>
</Accordion>
\`\`\`
```

- [ ] **Step 2: Commit**

```bash
git add .changeset/velvety-tinkering-key.md
git commit -m "chore(changeset): add react-accordion minor to accordion release"
```

---

## Task 12: Final verification (full build + tests + push)

- [ ] **Step 1: Run full build**

Run: `bun packages:build`
Expected: all packages build successfully.

- [ ] **Step 2: Run all tests**

Run: `bun test:all`
Expected: all tests pass (including new useAccordion.test.tsx and Accordion.test.tsx).

- [ ] **Step 3: Run docs tests**

Run: `bun docs:test`
Expected: all tests pass.

- [ ] **Step 4: Verify `as` cast count**

Run: `grep -rn " as " packages/react-headless/accordion/src/ | grep -v ".test.tsx" | grep -v "as const"`
Expected: only 1 match (DOM cast `event.target as HTMLElement` in Accordion.tsx keyboard handler, which is a legitimate DOM narrowing, not a props cast).

- [ ] **Step 5: Verify AccordionTriggerProps uses ButtonHTMLAttributes**

Run: `grep "ButtonHTMLAttributes" packages/react-headless/accordion/src/Accordion.tsx`
Expected: `export interface AccordionTriggerProps extends PrimitiveProps, React.ButtonHTMLAttributes<HTMLButtonElement>`

- [ ] **Step 6: Push**

```bash
git push
```

Expected: CI triggers, all checks pass.

---

## Self-Review

### Spec coverage

| Spec Goal | Task |
|-----------|------|
| 1. `@seed-design/react-accordion` 신규 패키지 생성 | Tasks 1-5 |
| 2. `packages/react/src/components/Accordion/` styled wrapper 축소 | Task 9 |
| 3. Type guard predicate로 `as` 완전 제거 | Task 2 (hook), Task 4 (Impl split) |
| 4. `AccordionTriggerProps`를 `ButtonHTMLAttributes` | Task 4 (line in AccordionTriggerProps) |
| 5. useAccordion + Accordion 테스트 추가 | Tasks 6-7 |
| 6. 사용자 public API 변경 없음 (Header 자동 감쌈) | Task 10 |
| 7. `header` slot 추가 | Task 8 |
| 8. Changeset 업데이트 | Task 11 |
| 9. WAI-ARIA JSDoc for Header/Trigger | Task 4 |

### Placeholder scan

- No `TBD`, `TODO`, `fill in details` found.
- All tasks have concrete code blocks and exact commands.
- No "similar to Task N" placeholders — all code repeated where needed.

### Type consistency

- `UseAccordionSingleProps`, `UseAccordionMultipleProps`, `UseAccordionProps`, `UseAccordionReturn` defined in Task 2, used consistently in Tasks 3-5.
- `AccordionSingleRootProps`, `AccordionMultipleRootProps`, `AccordionRootProps` defined in Task 4, referenced in Tasks 5 (exports) + 9 (react wrapper).
- `AccordionTriggerProps` extends `ButtonHTMLAttributes<HTMLButtonElement>` in Task 4 line, inherited in Task 9 via `React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>`.
- `isSingleProps` type guard used consistently in Task 2.
- `UseAccordionContext`, `UseAccordionItemContext` defined in Task 3, consumed in Task 4 and Task 9.
