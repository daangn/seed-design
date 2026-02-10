import { codeBlockTabsRule } from "./codeblock-tabs-rule";
import { componentExampleRule } from "./component-example-rule";
import { typeTableRule } from "./type-table-rule";
import type { Rule } from "./types";

export const activeRules: Rule[] = [componentExampleRule, codeBlockTabsRule, typeTableRule];

export { codeBlockTabsRule, componentExampleRule, typeTableRule };
