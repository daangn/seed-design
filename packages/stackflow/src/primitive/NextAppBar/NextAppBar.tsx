import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { useNextAppBar } from "./useNextAppBar";
import { NextAppBarProvider, useNextAppBarContext } from "./useNextAppBarContext";

export interface NextAppBarRootProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const NextAppBarRoot = forwardRef<HTMLDivElement, NextAppBarRootProps>((props, ref) => {
  const api = useNextAppBar();

  return (
    <NextAppBarProvider value={api}>
      <Primitive.div ref={composeRefs(api.refs.root, ref)} {...mergeProps(api.rootProps, props)} />
    </NextAppBarProvider>
  );
});
NextAppBarRoot.displayName = "NextAppBarRoot";

export interface NextAppBarLeftProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const NextAppBarLeft = forwardRef<HTMLDivElement, NextAppBarLeftProps>((props, ref) => {
  const { refs } = useNextAppBarContext();

  return <Primitive.div ref={composeRefs(refs.left, ref)} {...props} />;
});
NextAppBarLeft.displayName = "NextAppBarLeft";

export interface NextAppBarRightProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NextAppBarRight = forwardRef<HTMLDivElement, NextAppBarRightProps>((props, ref) => {
  const { refs } = useNextAppBarContext();

  return <Primitive.div ref={composeRefs(refs.right, ref)} {...props} />;
});
NextAppBarRight.displayName = "NextAppBarRight";

export interface NextAppBarMainProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const NextAppBarMain = forwardRef<HTMLDivElement, NextAppBarMainProps>((props, ref) => {
  return <Primitive.div ref={ref} {...props} />;
});
NextAppBarMain.displayName = "NextAppBarMain";
