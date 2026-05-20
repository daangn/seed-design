export type SafeAreaEdge = "top" | "bottom";

type SafeAreaValue = number | string | null | undefined;

interface LynxGlobalProps {
  safeAreaInsets?: Partial<Record<SafeAreaEdge, SafeAreaValue>>;
  safeAreaInsetTop?: SafeAreaValue;
  safeAreaInsetBottom?: SafeAreaValue;
}

interface LynxGlobal {
  lynx?: {
    __globalProps?: LynxGlobalProps;
  };
}

const flatSafeAreaProp: Record<SafeAreaEdge, "safeAreaInsetTop" | "safeAreaInsetBottom"> = {
  top: "safeAreaInsetTop",
  bottom: "safeAreaInsetBottom",
};

function getGlobalProps() {
  return (globalThis as LynxGlobal).lynx?.__globalProps;
}

function normalizeSafeAreaValue(value: SafeAreaValue): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? `${value}px` : undefined;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const numericValue = Number(trimmedValue);

  if (Number.isFinite(numericValue)) {
    return numericValue > 0 ? `${numericValue}px` : undefined;
  }

  if (/^0(?:\.0+)?(?:px|rpx|rem|em|vh|vw|%)?$/.test(trimmedValue)) {
    return undefined;
  }

  return trimmedValue;
}

function getGlobalSafeAreaInset(edge: SafeAreaEdge): string | undefined {
  const globalProps = getGlobalProps();

  return (
    normalizeSafeAreaValue(globalProps?.safeAreaInsets?.[edge]) ??
    normalizeSafeAreaValue(globalProps?.[flatSafeAreaProp[edge]])
  );
}

function normalizeBaseValue(base: string | number | undefined): string | undefined {
  if (base == null) {
    return undefined;
  }

  if (typeof base === "number") {
    return base === 0 ? undefined : `${base}px`;
  }

  const trimmedBase = base.trim();

  if (!trimmedBase || trimmedBase === "0" || trimmedBase === "0px") {
    return undefined;
  }

  return trimmedBase;
}

export function getSafeAreaInset(edge: SafeAreaEdge): string {
  return getGlobalSafeAreaInset(edge) ?? `env(safe-area-inset-${edge})`;
}

export function getSafeAreaPadding(edge: SafeAreaEdge, base?: string | number): string {
  const inset = getSafeAreaInset(edge);
  const baseValue = normalizeBaseValue(base);

  if (!baseValue) {
    return inset;
  }

  return `calc(${baseValue} + ${inset})`;
}
