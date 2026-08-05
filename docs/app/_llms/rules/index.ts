import { componentGridRule } from "./component-grid-rule";
import { iconLibraryRule } from "./icon-library-rule";
import type { AnyRule } from "./types";

export const activeRules: AnyRule[] = [iconLibraryRule, componentGridRule];

export { componentGridRule, iconLibraryRule };
