import { createContext, forwardRef, useContext } from "@lynx-js/react";
import clsx from "clsx";

export interface NativeSlotProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

type SlotRecipe<
  Props extends Record<string, string | boolean | undefined>,
  Classnames extends Record<string, string>,
> = ((props?: Props) => Classnames) & {
  splitVariantProps: <T extends Props>(props: T) => [Props, Omit<T, keyof Props>];
};

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

  function useClassNames() {
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

  const withRootProvider = <P,>(
    Component: React.ElementType<any>,
    options?: {
      defaultProps?: Partial<P>;
    },
  ): React.ForwardRefExoticComponent<React.PropsWithoutRef<P>> => {
    const { defaultProps } = options ?? {};

    const StyledComponent = (innerProps: any) => {
      const props = { ...(defaultProps ?? {}), ...useProps(), ...innerProps } as Props &
        Record<string, unknown>;
      const [variantProps, otherProps] = recipe.splitVariantProps(props);
      const classNames = recipe(variantProps);

      return (
        <ClassNamesProvider value={classNames}>
          <Component {...otherProps} />
        </ClassNamesProvider>
      );
    };

    // @ts-expect-error — assigning displayName to a plain function component
    StyledComponent.displayName = Component.displayName || Component.name;

    return StyledComponent as any;
  };

  const withProvider = <T, P>(
    Component: React.ElementType<any>,
    slot: keyof Classnames,
    options?: {
      defaultProps?: Partial<P>;
    },
  ): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>> => {
    const { defaultProps } = options ?? {};

    const StyledComponent = forwardRef<any, any>((innerProps, ref) => {
      const props: any = { ...(defaultProps ?? {}), ...useProps(), ...innerProps };
      const [variantProps, otherProps] = recipe.splitVariantProps(props as Props);
      const classNames = recipe(variantProps);
      const slotClassName: string | undefined = classNames[slot];
      const userClassName: string | undefined = props["className"];

      return (
        <ClassNamesProvider value={classNames}>
          <Component
            {...(ref ? { ref } : {})}
            {...otherProps}
            className={clsx(slotClassName, userClassName)}
          />
        </ClassNamesProvider>
      );
    });

    StyledComponent.displayName = (Component as any).displayName || (Component as any).name;

    return StyledComponent as any;
  };

  const withContext = <T, P>(
    Component: React.ElementType<any>,
    slot?: keyof Classnames,
    options?: {
      defaultProps?: Partial<P>;
    },
  ): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>> => {
    const { defaultProps } = options ?? {};

    const StyledComponent = forwardRef<any, any>((innerProps, ref) => {
      const props: any = { ...(defaultProps ?? {}), ...innerProps };
      const classNames = useClassNames();
      const slotClassName: string | undefined = slot ? classNames[slot] : undefined;
      const userClassName: string | undefined = props["className"];

      return (
        <Component
          {...(ref ? { ref } : {})}
          {...props}
          className={clsx(slotClassName, userClassName)}
        />
      );
    });

    StyledComponent.displayName = (Component as any).displayName || (Component as any).name;
    return StyledComponent as any;
  };

  const withViewContext = (slot: keyof Classnames) => {
    const Slot = forwardRef<unknown, NativeSlotProps>((props, ref) => {
      const { children, className, style, ...rest } = props as NativeSlotProps &
        Record<string, unknown>;
      const classNames = useClassNames();
      const slotClassName: string | undefined = classNames[slot];
      return (
        <view
          {...(ref ? { ref: ref as any } : {})}
          {...rest}
          className={clsx(slotClassName, className)}
          style={style}
        >
          {children}
        </view>
      );
    });
    Slot.displayName = `SlotView(${String(slot)})`;
    return Slot;
  };

  const withTextContext = (slot: keyof Classnames) => {
    const Slot = forwardRef<unknown, NativeSlotProps>((props, ref) => {
      const { children, className, style, ...rest } = props as NativeSlotProps &
        Record<string, unknown>;
      const classNames = useClassNames();
      const slotClassName: string | undefined = classNames[slot];
      return (
        <text
          {...(ref ? { ref: ref as any } : {})}
          {...rest}
          className={clsx(slotClassName, className)}
          style={style}
        >
          {children}
        </text>
      );
    });
    Slot.displayName = `SlotText(${String(slot)})`;
    return Slot;
  };

  return {
    ClassNamesProvider,
    PropsProvider,
    useClassNames,
    useProps,
    withRootProvider,
    withProvider,
    withContext,
    withViewContext,
    withTextContext,
  };
}
