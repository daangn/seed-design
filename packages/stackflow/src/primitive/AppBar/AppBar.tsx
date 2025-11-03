import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { useAppBar, type UseAppBarProps } from "./useAppBar";
import { AppBarProvider, useAppBarContext } from "./useAppBarContext";

export interface AppBarRootProps
  extends PrimitiveProps,
    UseAppBarProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AppBarRoot = forwardRef<HTMLDivElement, AppBarRootProps>((props, ref) => {
  const { ...otherProps } = props;
  const api = useAppBar({});

  return (
    <AppBarProvider value={api}>
      <Primitive.div
        ref={composeRefs(api.refs.root, ref)}
        {...mergeProps(api.rootProps, otherProps)}
      />
    </AppBarProvider>
  );
});
AppBarRoot.displayName = "AppBarRoot";

export interface AppBarLeftProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AppBarLeft = forwardRef<HTMLDivElement, AppBarLeftProps>((props, ref) => {
  const { refs, stateProps } = useAppBarContext();

  return <Primitive.div ref={composeRefs(refs.left, ref)} {...mergeProps(stateProps, props)} />;
});
AppBarLeft.displayName = "AppBarLeft";

export interface AppBarRightProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AppBarRight = forwardRef<HTMLDivElement, AppBarRightProps>((props, ref) => {
  const { refs, stateProps } = useAppBarContext();

  return <Primitive.div ref={composeRefs(refs.right, ref)} {...mergeProps(stateProps, props)} />;
});
AppBarRight.displayName = "AppBarRight";

export interface AppBarMainProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AppBarMain = forwardRef<HTMLDivElement, AppBarMainProps>((props, ref) => {
  const { stateProps } = useAppBarContext();

  return <Primitive.div ref={ref} {...mergeProps(stateProps, props)} />;
});
