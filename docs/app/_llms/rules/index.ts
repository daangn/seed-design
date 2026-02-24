import { codeBlockTabsRule } from "./codeblock-tabs-rule";
import { componentExampleRule } from "./component-example-rule";
import { platformStatusRule } from "./platform-status-rule";
import { typeTableRule } from "./type-table-rule";
import { tokenReferenceRule } from "./token-reference-rule";
import { componentSpecBlockRule } from "./component-spec-block-rule";
import type { Rule } from "./types";

export const activeRules: Rule[] = [
  componentExampleRule,
  codeBlockTabsRule,
  typeTableRule,
  tokenReferenceRule,
  platformStatusRule,
  componentSpecBlockRule,
];

export {
  codeBlockTabsRule,
  componentExampleRule,
  typeTableRule,
  tokenReferenceRule,
  componentSpecBlockRule,
  platformStatusRule,
};
