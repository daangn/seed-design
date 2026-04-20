import clsx from "clsx";
import { createContext, forwardRef, useContext } from "@lynx-js/react";
import type * as React from "react";

type SlotRecipe<
  Props extends Record<string, string | boolean | undefined>,
  Classnames extends Record<string, string>,
> = ((props?: Props) => Classnames) & {
  splitVariantProps: <T extends Props>(props: T) => [Props, Omit<T, keyof Props>];
};

/**
 * 복합 슬롯 recipe용 context 유틸.
 *
 * 웹 `@seed-design/react`의 `createSlotRecipeContext`를 Lynx 런타임 제약에 맞춰 포팅했다:
 * - `{...otherProps}` spread 시 `children`이 포함되면 Lynx `commitPatchUpdate`가
 *   circular reference 에러를 발생시키므로 `children`을 분리해 JSX children으로 전달.
 * - `forwardRef`에 null ref가 넘어오면 Lynx `applyRef`가 에러를 던지므로
 *   `ref`가 truthy일 때만 Component로 전달. (`withProvider`, `withContext` 한정)
 */
export function createSlotRecipeContext<
  Props extends Record<string, string | boolean | undefined>,
  Classnames extends Record<string, string>,
>(recipe: SlotRecipe<Props, Classnames>) {
  const ClassNamesContext = createContext<Classnames | null>(null);
  const PropsContext = createContext<Props | null>(null);

  const ClassNamesProvider = ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: Classnames;
  }) => {
    return <ClassNamesContext.Provider value={value}>{children}</ClassNamesContext.Provider>;
  };

  const PropsProvider = ({ children, value }: { children: React.ReactNode; value: Props }) => {
    return <PropsContext.Provider value={value}>{children}</PropsContext.Provider>;
  };

  function useClassNames(): Classnames {
    const context = useContext(ClassNamesContext);
    if (context === null) {
      throw new Error(
        "useClassNames must be used within a ClassNamesProvider. Did you forget to wrap your component in a ClassNamesProvider?",
      );
    }
    return context;
  }

  function useProps() {
    return useContext(PropsContext);
  }

  const withRootProvider = <P extends object>(
    Component: React.ElementType,
    options?: {
      defaultProps?: Partial<P>;
    },
  ): React.FunctionComponent<P> => {
    const { defaultProps } = options ?? {};

    const StyledComponent = (innerProps: Record<string, unknown>) => {
      const mergedProps = {
        ...(defaultProps ?? {}),
        ...(useProps() ?? {}),
        ...innerProps,
      } as Props & { children?: React.ReactNode };
      const [variantProps, otherProps] = recipe.splitVariantProps(mergedProps);
      const classNames = recipe(variantProps);
      const { children, ...nativeProps } = otherProps as {
        children?: React.ReactNode;
      } & Record<string, unknown>;

      return (
        <ClassNamesProvider value={classNames}>
          <Component {...nativeProps}>{children}</Component>
        </ClassNamesProvider>
      );
    };

    const componentMeta = Component as { displayName?: string; name?: string };
    StyledComponent.displayName = componentMeta.displayName ?? componentMeta.name ?? "";

    return StyledComponent as React.FunctionComponent<P>;
  };

  const withProvider = <T, P extends object>(
    Component: React.ElementType,
    slot: keyof Classnames,
    options?: {
      defaultProps?: Partial<P>;
    },
  ): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>> => {
    const { defaultProps } = options ?? {};

    const StyledComponent = forwardRef<unknown, Record<string, unknown>>((innerProps, ref) => {
      const mergedProps = {
        ...(defaultProps ?? {}),
        ...(useProps() ?? {}),
        ...innerProps,
      } as Props & { className?: string; children?: React.ReactNode };
      const [variantProps, otherProps] = recipe.splitVariantProps(mergedProps);
      const classNames = recipe(variantProps);
      const className = classNames[slot];
      const { children, ...nativeProps } = otherProps as {
        children?: React.ReactNode;
      } & Record<string, unknown>;

      return (
        <ClassNamesProvider value={classNames}>
          <Component
            {...(ref ? { ref } : {})}
            {...nativeProps}
            className={clsx(className, mergedProps.className)}
          >
            {children}
          </Component>
        </ClassNamesProvider>
      );
    });

    const componentMeta = Component as { displayName?: string; name?: string };
    StyledComponent.displayName = componentMeta.displayName ?? componentMeta.name ?? "";

    return StyledComponent as React.ForwardRefExoticComponent<
      React.PropsWithoutRef<P> & React.RefAttributes<T>
    >;
  };

  const withContext = <T, P extends object>(
    Component: React.ElementType,
    slot?: keyof Classnames,
  ): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>> => {
    const StyledComponent = forwardRef<unknown, Record<string, unknown>>((innerProps, ref) => {
      const classNames = useClassNames();
      const slotClassName = slot !== undefined ? classNames[slot] : undefined;
      const { children, className, ...nativeProps } = innerProps as {
        children?: React.ReactNode;
        className?: string;
      } & Record<string, unknown>;

      return (
        <Component
          {...(ref ? { ref } : {})}
          {...nativeProps}
          className={clsx(slotClassName, className)}
        >
          {children}
        </Component>
      );
    });

    const componentMeta = Component as { displayName?: string; name?: string };
    StyledComponent.displayName = componentMeta.displayName ?? componentMeta.name ?? "";

    return StyledComponent as React.ForwardRefExoticComponent<
      React.PropsWithoutRef<P> & React.RefAttributes<T>
    >;
  };

  return {
    ClassNamesProvider,
    PropsProvider,
    useClassNames,
    useProps,
    withRootProvider,
    withProvider,
    withContext,
  };
}
