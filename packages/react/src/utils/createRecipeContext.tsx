import clsx from "clsx";
import { createContext, forwardRef, useContext } from "react";

type Recipe<
  Props extends Record<string, string | boolean | undefined>,
  ClassName extends string,
> = ((props?: Props) => ClassName) & {
  splitVariantProps: <T extends Props>(props: T) => [Props, Omit<T, keyof Props>];
};

export function createRecipeContext<
  Props extends Record<string, string | boolean | undefined>,
  ClassName extends string,
>(recipe: Recipe<Props, ClassName>) {
  const ClassNameContext = createContext<ClassName | null>(null);
  const PropsContext = createContext<Props | null>(null);

  const ClassNameProvider = ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: ClassName;
  }) => {
    return <ClassNameContext.Provider value={value}>{children}</ClassNameContext.Provider>;
  };

  const PropsProvider = ({ children, value }: { children: React.ReactNode; value: Props }) => {
    return <PropsContext.Provider value={value}>{children}</PropsContext.Provider>;
  };

  function useClassName() {
    const context = useContext(ClassNameContext);
    if (context === null) {
      throw new Error(
        "useClassName must be used within a ClassNameProvider. Did you forget to wrap your component in a ClassNameProvider?",
      );
    }
    return context;
  }

  function useProps() {
    return useContext(PropsContext);
  }

  const withRootProvider = <P,>(
    Component: React.ElementType<any>,
    options?: {
      defaultProps?: Partial<P>;
    },
  ): React.ForwardRefExoticComponent<React.PropsWithoutRef<P>> => {
    const { defaultProps } = options ?? {};

    const StyledComponent = (innerProps: any) => {
      const props = { ...(defaultProps ?? {}), ...useProps(), ...innerProps } as Props &
        React.HTMLAttributes<HTMLElement>;
      const [variantProps, otherProps] = recipe.splitVariantProps(props);
      const className = recipe(variantProps);

      return (
        <ClassNameProvider value={className}>
          <Component {...otherProps} className={clsx(className, props.className)} />
        </ClassNameProvider>
      );
    };

    StyledComponent.displayName = (Component as any).displayName || (Component as any).name;
    return StyledComponent as any;
  };

  const withProvider = <T, P>(
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
      const className = recipe(variantProps);

      return <Component ref={ref} {...otherProps} className={clsx(className, props.className)} />;
    });

    StyledComponent.displayName = (Component as any).displayName || (Component as any).name;
    return StyledComponent as any;
  };

  const withContext = <T, P>(
    Component: React.ElementType<any>,
  ): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>> => {
    const StyledComponent = forwardRef<any, React.HTMLAttributes<HTMLElement>>((props, ref) => {
      const className = useClassName();

      return <Component ref={ref} {...props} className={clsx(className, props.className)} />;
    });

    StyledComponent.displayName = (Component as any).displayName || (Component as any).name;
    return StyledComponent as any;
  };

  return {
    ClassNameProvider,
    PropsProvider,
    useClassName,
    useProps,
    withRootProvider,
    withProvider,
    withContext,
  };
}
