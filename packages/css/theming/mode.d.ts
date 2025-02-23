export declare const ColorModeValues: readonly ["system", "light-only", "dark-only"];
export declare const DefaultColorModeValue: "system";
export type ColorMode = (typeof ColorModeValues)[number];
export declare function isValidColorMode(mode: any): mode is ColorMode;
