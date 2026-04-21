import clsx from "clsx";
import { createContext, forwardRef, useContext } from "@lynx-js/react";
import type * as React from "react";

type Recipe<Props extends Record<string, string | boolean | undefined>> = ((
  props?: Props,
) => string) & {
  splitVariantProps: <T extends Props>(props: T) => [Props, Omit<T, keyof Props>];
};

/**
 * 단일 슬롯 recipe용 context 유틸.
 *
 * 웹 `@seed-design/react`의 `createRecipeContext`를 Lynx 런타임 제약에 맞춰 포팅했다:
 * - `{...otherProps}` spread 시 `children`이 포함되면 Lynx `commitPatchUpdate`가
 *   circular reference 에러를 발생시키므로 `children`을 분리해 JSX children으로 전달.
 * - `forwardRef`에 null ref가 넘어오면 Lynx `applyRef`가 에러를 던지므로
 *   `ref`가 truthy일 때만 Component로 전달.
 */
export function createRecipeContext<Props extends Record<string, string | boolean | undefined>>(
  recipe: Recipe<Props>,
) {
  const PropsContext = createContext<Props | null>(null);

  const PropsProvider = ({ children, value }: { children: React.ReactNode; value: Props }) => {
    return <PropsContext.Provider value={value}>{children}</PropsContext.Provider>;
  };

  function useProps() {
    return useContext(PropsContext);
  }

  const withContext = <T, P extends object>(
    Component: React.ElementType,
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
      const className = recipe(variantProps);
      const { children, ...nativeProps } = otherProps as {
        children?: React.ReactNode;
      } & Record<string, unknown>;

      return (
        <Component
          {...(ref ? { ref } : {})}
          {...nativeProps}
          className={clsx(className, mergedProps.className)}
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
    PropsProvider,
    useProps,
    withContext,
  };
}
