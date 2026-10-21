import type { AppScreenProps } from "seed-design/ui/app-screen";

export const theme: NonNullable<AppScreenProps["theme"]> = /iphone|ipad|ipod/i.test(
  window.navigator.userAgent.toLowerCase(),
)
  ? "cupertino"
  : "android";
