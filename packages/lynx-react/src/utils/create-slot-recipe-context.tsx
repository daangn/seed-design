import { createContext, forwardRef, useContext, type ReactNode, type Ref } from "@lynx-js/react";
import type { CSSProperties } from "react";
import clsx from "clsx";

type SlotRecipe<
  Props extends Record<string, string | boolean | undefined>,
  Classnames extends Record<string, string>,
> = ((props?: Props) => Classnames) & {
  splitVariantProps: <T extends Props>(props: T) => [Props, Omit<T, keyof Props>];
};

/**
 * Lynx compound 컴포넌트에서 slot recipe의 classNames를 Root→children 트리로 배포하기 위한
 * 공용 유틸. `@seed-design/react`의 `createSlotRecipeContext`를 Lynx 런타임에 맞게 포팅했다.
 *
 * 기본 사용법 (lynx-ui 등 React 함수 컴포넌트 래핑):
 * ```tsx
 * const { ClassNamesProvider, withContext } = createSlotRecipeContext(bottomSheet);
 * export const BottomSheetBackdrop = withContext(SheetBackdrop, "backdrop");
 * ```
 *
 * 네이티브 `<view>`/`<text>` intrinsic 슬롯은 `withContext`를 **쓰면 안 된다**.
 * `withContext("view", ...)`는 `React.createElement(Component, ...)`로 컴파일되어
 * Lynx 컴파일러의 리터럴 `<view>` 정적 분석을 우회하고 `BackgroundSnapshot not found`
 * 런타임 에러를 유발한다. 대신 `withViewContext` / `withTextContext`를 사용한다:
 * ```tsx
 * export const BottomSheetHeader = withViewContext("header");
 * export const BottomSheetTitle = withTextContext("title");
 * ```
 * 이 팩토리들은 리터럴 JSX로 `<view>` / `<text>`를 emit하므로 컴파일러 정적 분석을 통과한다.
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

  /**
   * React 함수 컴포넌트 래핑용. lynx-ui 등 외부 컴포넌트를 감싸 slot className만 자동 주입한다.
   *
   * 네이티브 `<view>`/`<text>` intrinsic에는 사용하지 않는다 — `withViewContext` /
   * `withTextContext`를 쓸 것.
   */
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

  /**
   * 네이티브 `<view>` 슬롯 전용. 리터럴 JSX로 `<view>`를 emit해 Lynx 컴파일러의
   * `BackgroundSnapshot` 정적 분석을 통과한다.
   *
   * `withContext("view", ...)`는 `React.createElement(Component, ...)`로 컴파일되어
   * 이 분석을 우회하므로 런타임 에러가 발생한다.
   */
  const withViewContext = (slot: keyof Classnames) => {
    const StyledComponent = forwardRef<unknown, NativeSlotProps>((props, ref) => {
      const { children, className, style } = props;
      const classNames = useClassNames();

      return (
        <view
          {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
          className={clsx(classNames[slot], className)}
          style={style}
        >
          {children}
        </view>
      );
    });
    StyledComponent.displayName = `Slot(view:${String(slot)})`;
    return StyledComponent;
  };

  /**
   * 네이티브 `<text>` 슬롯 전용. 리터럴 JSX로 `<text>`를 emit해 Lynx 컴파일러의
   * `BackgroundSnapshot` 정적 분석을 통과한다.
   */
  const withTextContext = (slot: keyof Classnames) => {
    const StyledComponent = forwardRef<unknown, NativeSlotProps>((props, ref) => {
      const { children, className, style } = props;
      const classNames = useClassNames();

      return (
        <text
          {...(ref ? { ref: ref as Ref<SVGTextElement> } : {})}
          className={clsx(classNames[slot], className)}
          style={style}
        >
          {children}
        </text>
      );
    });
    StyledComponent.displayName = `Slot(text:${String(slot)})`;
    return StyledComponent;
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

/**
 * `withViewContext` / `withTextContext`로 생성된 네이티브 slot 컴포넌트의 공통 props 타입.
 * 다른 compound 컴포넌트들이 slot props를 extend할 때 재사용할 수 있다.
 */
export interface NativeSlotProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
