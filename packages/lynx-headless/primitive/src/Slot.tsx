/**
 * Lynx-compatible Slot component.
 * Referenced from @radix-ui/react-slot, adapted for Lynx environment.
 */
import {
  type ReactNode,
  type HTMLAttributes,
  forwardRef,
  isValidElement,
  cloneElement,
  Children,
} from "react";
import { composeRefs } from "./composeRefs";

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export const Slot = forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (isValidElement(children)) {
    const childRef = getElementRef(children);
    const mergedProps = mergeProps(slotProps, children.props as Record<string, unknown>);

    return cloneElement(children, {
      ...mergedProps,
      ref: forwardedRef ? composeRefs(forwardedRef, childRef as React.Ref<HTMLElement>) : childRef,
    } as Record<string, unknown>);
  }

  if (Children.count(children) > 1) {
    Children.only(null);
  }

  return null;
});

Slot.displayName = "Slot";

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
): Record<string, unknown> {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    // Event handlers: chain both (child first, then slot)
    const isHandler = /^on[A-Z]/.test(propName) || /^bind/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          const result = (childPropValue as (...a: unknown[]) => unknown)(...args);
          (slotPropValue as (...a: unknown[]) => unknown)(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = {
        ...(slotPropValue as Record<string, unknown>),
        ...(childPropValue as Record<string, unknown>),
      };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

function getElementRef(element: React.ReactElement): unknown {
  // Handle React 19+ ref access
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element as unknown as { ref: unknown }).ref;
  }

  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element.props as Record<string, unknown>)["ref"];
  }

  return (
    (element.props as Record<string, unknown>)["ref"] ||
    (element as unknown as { ref: unknown }).ref
  );
}
