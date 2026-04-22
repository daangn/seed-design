import { changelogPageRule } from "./changelog-page-rule";
import { codeBlockTabsRule } from "./codeblock-tabs-rule";
import { componentExampleRule } from "./component-example-rule";
import { componentGridRule } from "./component-grid-rule";
import { platformStatusRule } from "./platform-status-rule";
import { typeTableRule } from "./type-table-rule";
import { tokenReferenceRule } from "./token-reference-rule";
import { componentSpecBlockRule } from "./component-spec-block-rule";
import { iconLibraryRule } from "./icon-library-rule";
import type { Rule } from "./types";

export const activeRules: Rule[] = [
  componentExampleRule,
  codeBlockTabsRule,
  typeTableRule,
  tokenReferenceRule,
  platformStatusRule,
  iconLibraryRule,
  componentGridRule,
  componentSpecBlockRule,
  changelogPageRule,
];

export {
  changelogPageRule,
  codeBlockTabsRule,
  componentExampleRule,
  componentGridRule,
  typeTableRule,
  tokenReferenceRule,
  componentSpecBlockRule,
  platformStatusRule,
  iconLibraryRule,
};
