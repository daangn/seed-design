import type { NextAppScreenProps } from "seed-design/ui/next-app-screen";
import { isIos } from "../platform";

export const theme: NonNullable<NextAppScreenProps["theme"]> = isIos ? "cupertino" : "android";
