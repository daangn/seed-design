import { badgeRule } from "./badge-rule";
import { changelogPageRule } from "./changelog-page-rule";
import { codeBlockTabsRule } from "./codeblock-tabs-rule";
import { componentExampleRule } from "./component-example-rule";
import { componentGridRule } from "./component-grid-rule";
import { progressBoardRule } from "./progress-board-rule";
import { typeTableRule } from "./type-table-rule";
import { tokenReferenceRule } from "./token-reference-rule";
import { componentSpecBlockRule } from "./component-spec-block-rule";
import { iconLibraryRule } from "./icon-library-rule";
import type { AnyRule } from "./types";

export const activeRules: AnyRule[] = [
  badgeRule,
  componentExampleRule,
  codeBlockTabsRule,
  typeTableRule,
  tokenReferenceRule,
  progressBoardRule,
  iconLibraryRule,
  componentGridRule,
  componentSpecBlockRule,
  changelogPageRule,
];

export {
  badgeRule,
  changelogPageRule,
  codeBlockTabsRule,
  componentExampleRule,
  componentGridRule,
  typeTableRule,
  tokenReferenceRule,
  componentSpecBlockRule,
  progressBoardRule,
  iconLibraryRule,
};
