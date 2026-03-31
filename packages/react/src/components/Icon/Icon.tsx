import { Slot } from "@radix-ui/react-slot";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { createContext, forwardRef, useCallback, useContext, useMemo, useRef } from "react";
import { handleColor, handleDimension, type StyleProps } from "../../utils/styled";

export interface PrefixIconProps {
  svg: React.ReactNode;
}

export const PrefixIcon = forwardRef<SVGSVGElement, PrefixIconProps>(
  ({ svg, ...otherProps }, ref) => {
    return (
      <Slot
        ref={ref as React.ForwardedRef<HTMLElement>}
        aria-hidden
        className="seed-prefix-icon"
        {...otherProps}
      >
        {svg}
      </Slot>
    );
  },
);

export interface SuffixIconProps {
  svg: React.ReactNode;
}

export const SuffixIcon = forwardRef<SVGSVGElement, SuffixIconProps>(
  ({ svg, ...otherProps }, ref) => {
    return (
      <Slot
        ref={ref as React.ForwardedRef<HTMLElement>}
        aria-hidden
        className="seed-suffix-icon"
        {...otherProps}
      >
        {svg}
      </Slot>
    );
  },
);

const IconContext = createContext<{ register: () => void; unregister: () => void } | null>(null);

export const IconRequired = ({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) => {
  const registeredRef = useRef(false);
  const parentContext = useContext(IconContext);

  const register = useCallback(() => {
    // @ts-ignore
    if (process.env.NODE_ENV !== "production") {
      if (registeredRef.current) {
        throw new Error(
          "Icon-only Component must render only one <Icon /> under children. Check if you are rendering multiple <Icon />.",
        );
      }
    }
    registeredRef.current = true;
  }, []);

  const unregister = useCallback(() => {
    registeredRef.current = false;
  }, []);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== "production") {
      if (parentContext) {
        throw new Error(
          "Icon-only Component must not be nested within another Icon-Only. Check if you are using Icon-Only inside another Icon-Only.",
        );
      }
      if (!registeredRef.current) {
        throw new Error(
          "Icon-only Component must render <Icon /> as a child. Check if you are using raw svg icon instead of <Icon svg={} />.",
        );
      }
    }
  }, [parentContext, enabled]);

  const providerValue = useMemo(() => {
    if (!enabled) {
      // If not enabled, return parent context if exists
      if (parentContext) {
        return parentContext;
      }
      // If not enabled and no parent context, return null
      return null;
    }

    // If enabled, return register and unregister functions to detect <Icon /> count
    return { register, unregister };
  }, [enabled, parentContext, register, unregister]);

  return <IconContext.Provider value={providerValue}>{children}</IconContext.Provider>;
};

export interface IconProps {
  svg: React.ReactNode;

  size?: StyleProps["height"];

  color?: StyleProps["color"];
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ svg, size, color, ...otherProps }, ref) => {
    const context = useContext(IconContext);

    useLayoutEffect(() => {
      context?.register();
      return () => {
        context?.unregister();
      };
    }, [context]);

    const sizeValue = handleDimension(size);
    const colorValue = handleColor(color);

    return (
      <Slot
        ref={ref as React.ForwardedRef<HTMLElement>}
        aria-hidden
        className="seed-icon"
        style={
          {
            "--seed-icon-size": sizeValue,
            "--seed-icon-color": colorValue,
          } as React.CSSProperties
        }
        {...otherProps}
      >
        {svg}
      </Slot>
    );
  },
);

export function withIconRequired<P extends {}, R>(
  Component: React.ComponentType<P & React.RefAttributes<R>>,
  enabledPredicate: (props: React.PropsWithoutRef<P>) => boolean,
) {
  const Node = forwardRef<R, P>((props, ref) => {
    const enabled = enabledPredicate(props);
    return (
      <IconRequired enabled={enabled}>
        {/* @ts-ignore */}
        <Component ref={ref} {...props} />
      </IconRequired>
    );
  });

  Node.displayName = Component.displayName || Component.name;

  return Node;
}
