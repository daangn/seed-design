import { componentGridRule } from "./component-grid-rule";
import { tokenReferenceRule } from "./token-reference-rule";
import { iconLibraryRule } from "./icon-library-rule";
import type { AnyRule } from "./types";

export const activeRules: AnyRule[] = [tokenReferenceRule, iconLibraryRule, componentGridRule];

export { componentGridRule, tokenReferenceRule, iconLibraryRule };
