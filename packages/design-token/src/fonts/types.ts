export type FontToken = (
  | '$system'
);

export type FontScheme = Record<FontToken, string>;

export type FontTheme = {

  /**
   * Font tokens are already defined in its semantic
   * At least yet.
   */
  scheme: FontScheme,
};
