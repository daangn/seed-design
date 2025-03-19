import clsx from "clsx";
import { createContext, forwardRef, useContext } from "react";

type Recipe<Props extends Record<string, string | boolean | undefined>> = ((
  props?: Props,
) => string) & {
  splitVariantProps: <T extends Props>(props: T) => [Props, Omit<T, keyof Props>];
};

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

  const withContext = <T, P>(
    Component: React.ElementType<any>,
    options?: {
      defaultProps?: Partial<P>;
    },
  ): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>> => {
    const { defaultProps } = options ?? {};

    const StyledComponent = forwardRef<any, any>((innerProps, ref) => {
      const props = { ...(defaultProps ?? {}), ...useProps(), ...innerProps } as Props &
        React.HTMLAttributes<HTMLElement>;
      const [variantProps, otherProps] = recipe.splitVariantProps(props);
      const className = recipe(variantProps); // TODO: should we memoize this?

      return <Component ref={ref} {...otherProps} className={clsx(className, props.className)} />;
    });

    StyledComponent.displayName = (Component as any).displayName || (Component as any).name;
    return StyledComponent as any;
  };

  function withPropsProvider<P>(): React.Provider<Partial<P>> {
    return PropsProvider as any;
  }

  return {
    PropsProvider,
    useProps,
    withContext,
    withPropsProvider,
  };
}
