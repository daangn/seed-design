import type * as React from "react";
import { createContext, useContext } from "@lynx-js/react";

type SlotRecipe<
  Props extends Record<string, unknown>,
  Classnames extends Record<string, string>,
> = ((props?: Props) => Classnames) & {
  splitVariantProps: <T extends Props>(props: T) => [Props, Omit<T, keyof Props>];
};

/**
 * Lynx-specific note: we deliberately do not ship a `withContext` HOC.
 * Wrapping a native `<view>` / `<text>` in an extra `forwardRef` +
 * `createElement` layer triggers `BackgroundSnapshot not found` (same failure
 * mode as `@seed-design/lynx-primitive`'s `Primitive.view`). Leaf slots must be
 * written by hand with `React.forwardRef` + inline JSX, reading classes via
 * `useClassNames()`.
 */
export function createSlotRecipeContext<
  Props extends Record<string, unknown>,
  Classnames extends Record<string, string>,
>(_recipe: SlotRecipe<Props, Classnames>) {
  const ClassNamesContext = createContext<Classnames | null>(null);
  const PropsContext = createContext<Props | null>(null);

  function ClassNamesProvider({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: Classnames;
  }) {
    return <ClassNamesContext.Provider value={value}>{children}</ClassNamesContext.Provider>;
  }

  function PropsProvider({ children, value }: { children: React.ReactNode; value: Props }) {
    return <PropsContext.Provider value={value}>{children}</PropsContext.Provider>;
  }

  function useClassNames() {
    const ctx = useContext(ClassNamesContext);
    if (!ctx) {
      throw new Error("useClassNames must be used within a ClassNamesProvider");
    }
    return ctx;
  }

  function useProps() {
    return useContext(PropsContext);
  }

  return { ClassNamesProvider, PropsProvider, useClassNames, useProps };
}
