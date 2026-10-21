import type { SeedPluginOptions } from "@seed-design/stackflow";
import { isIos } from "../platform";

export const theme: SeedPluginOptions["theme"] = isIos ? "cupertino" : "android";
