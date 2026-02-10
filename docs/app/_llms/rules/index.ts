import { codeBlockTabsRule } from "./codeblock-tabs-rule";
import { componentExampleRule } from "./component-example-rule";
import type { Rule } from "./types";

export const activeRules: Rule[] = [componentExampleRule, codeBlockTabsRule];

export { codeBlockTabsRule, componentExampleRule };
