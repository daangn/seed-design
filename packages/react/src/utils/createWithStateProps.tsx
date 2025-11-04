import { forwardRef } from "react";

type AtLeastOne<T> = [T, ...T[]];

type ContextHook = (prop?: {
  strict?: boolean;
}) => { stateProps: React.HTMLAttributes<HTMLElement> } | null;

type ContextConfig = ContextHook | { useContext: ContextHook; strict?: boolean };

export function createWithStateProps(useContexts: AtLeastOne<ContextConfig>) {
  return function withStateProps<P, R>(Component: React.ComponentType<P & React.RefAttributes<R>>) {
    const Node = forwardRef<R, P>((props, ref) => {
      const stateProps = {};

      for (const contextConfig of useContexts) {
        if (typeof contextConfig === "function") {
          Object.assign(stateProps, contextConfig({ strict: true })?.stateProps);
        } else {
          const { useContext, strict = false } = contextConfig;
          Object.assign(stateProps, useContext({ strict })?.stateProps);
        }
      }

      // @ts-ignore
      return <Component ref={ref} {...stateProps} {...props} />;
    });

    Node.displayName = Component.displayName || Component.name;

    return Node;
  };
}
