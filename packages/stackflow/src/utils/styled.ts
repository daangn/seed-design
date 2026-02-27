import type { ScopedColorBg, ScopedColorPalette, ScopedColorBanner } from "@seed-design/css/vars";
import { vars } from "@seed-design/css/vars";

/**
 * A minimal subset of `StyleProps` from `@seed-design/react`.
 * Copied here to avoid package dependency. May be extracted to a shared package later.
 */
export interface BoxBackgroundProps {
  /**
   * Shorthand for `background`.
   */
  bg?: ScopedColorBg | ScopedColorPalette | ScopedColorBanner | (string & {});

  background?: ScopedColorBg | ScopedColorPalette | ScopedColorBanner | (string & {});
}

function handleColor(color: string | undefined) {
  if (!color) {
    return undefined;
  }
  const [type, value] = color.split(".");

  // @ts-expect-error - dynamic access
  return vars.$color[type]?.[value] ?? color;
}

export function useBoxBackgroundProps<T extends BoxBackgroundProps>(
  props: T,
): {
  style: React.CSSProperties;
  restProps: Omit<T, keyof BoxBackgroundProps>;
} {
  const { bg, background, ...restProps } = props;

  return {
    style: {
      "--seed-box-background": handleColor(background ?? bg),
    } as React.CSSProperties,
    restProps: restProps as Omit<T, keyof BoxBackgroundProps>,
  };
}
