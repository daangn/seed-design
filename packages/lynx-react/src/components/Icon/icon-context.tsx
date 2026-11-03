import * as React from "@lynx-js/react";
import { isValidElement, type DependencyList } from "@lynx-js/react";
export type IconSlotName = "icon" | "prefixIcon" | "suffixIcon";

////////////////////////////////////////////////////////////////////////////////////

interface IconSlotContextValue {
  classNames?: Partial<Record<IconSlotName, string>>;
  deps?: DependencyList;
}

export const IconSlotContext = /* @__PURE__ */ React.createContext<IconSlotContextValue | null>(
  null,
);

interface IconRequiredContextValue {
  register: () => void;
  unregister: () => void;
}

export const IconRequiredContext =
  /* @__PURE__ */ React.createContext<IconRequiredContextValue | null>(null);

export function IconRequired({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const registeredCountRef = React.useRef(0);
  const parentContext = React.useContext(IconRequiredContext);

  const register = React.useCallback(() => {
    registeredCountRef.current += 1;

    if (process.env.NODE_ENV !== "production" && registeredCountRef.current > 1) {
      throw new Error(
        "Icon-only Component must render only one <Icon /> under children. Check if you are rendering multiple <Icon />.",
      );
    }
  }, []);

  const unregister = React.useCallback(() => {
    registeredCountRef.current = Math.max(0, registeredCountRef.current - 1);
  }, []);

  React.useLayoutEffect(() => {
    if (!enabled) return;

    if (process.env.NODE_ENV !== "production") {
      if (parentContext) {
        throw new Error(
          "Icon-only Component must not be nested within another Icon-Only. Check if you are using Icon-Only inside another Icon-Only.",
        );
      }
      if (registeredCountRef.current === 0) {
        throw new Error(
          "Icon-only Component must render <Icon /> as a child. Check if you are using raw icon element instead of <Icon icon={} />.",
        );
      }
    }
  }, [enabled, parentContext]);

  const value = React.useMemo<IconRequiredContextValue | null>(() => {
    if (!enabled) return parentContext ?? null;
    return { register, unregister };
  }, [enabled, parentContext, register, unregister]);

  return <IconRequiredContext.Provider value={value}>{children}</IconRequiredContext.Provider>;
}

export function IconSlotProvider({
  value,
  children,
}: {
  value: IconSlotContextValue;
  children: React.ReactNode;
}) {
  return <IconSlotContext.Provider value={value}>{children}</IconSlotContext.Provider>;
}

////////////////////////////////////////////////////////////////////////////////////

export const iconSlotMarker = Symbol.for("@seed-design/lynx-react/icon-slot");

interface IconSlotComponent {
  [iconSlotMarker]?: IconSlotName;
}

export function getIconSlotName(node: React.ReactNode): IconSlotName | null {
  if (!isValidElement(node)) return null;

  return ((node.type as IconSlotComponent)[iconSlotMarker] ?? null) as IconSlotName | null;
}
