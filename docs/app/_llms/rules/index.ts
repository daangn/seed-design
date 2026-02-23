import { codeBlockTabsRule } from "./codeblock-tabs-rule";
import { componentExampleRule } from "./component-example-rule";
import { typeTableRule } from "./type-table-rule";
import { tokenReferenceRule } from "./token-reference-rule";
import type { Rule } from "./types";

export const activeRules: Rule[] = [
  componentExampleRule,
  codeBlockTabsRule,
  typeTableRule,
  tokenReferenceRule,
];

export { codeBlockTabsRule, componentExampleRule, typeTableRule, tokenReferenceRule };
