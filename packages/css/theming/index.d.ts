import type { ColorMode } from "./mode";
export type { ColorMode };
export declare const generateThemingScript: ({
  mode,
  fontScaling,
}: {
  mode?: ColorMode;
  fontScaling?: boolean;
}) => string;
