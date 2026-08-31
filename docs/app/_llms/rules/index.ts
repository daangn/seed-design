import { availableSinceRule } from "./available-since-rule";
import { badgeRule } from "./badge-rule";
import { changelogPageRule } from "./changelog-page-rule";
import { codeBlockTabsRule } from "./codeblock-tabs-rule";
import { componentExampleRule } from "./component-example-rule";
import { progressBoardRule } from "./progress-board-rule";
import { typeTableRule } from "./type-table-rule";
import { tokenReferenceRule } from "./token-reference-rule";
import { componentSpecBlockRule } from "./component-spec-block-rule";
import { iconLibraryRule } from "./icon-library-rule";
import { lynxComponentExampleRule } from "./lynx-component-example-rule";
import type { AnyRule } from "./types";

export const activeRules: AnyRule[] = [
  availableSinceRule,
  badgeRule,
  componentExampleRule,
  lynxComponentExampleRule,
  codeBlockTabsRule,
  typeTableRule,
  tokenReferenceRule,
  progressBoardRule,
  iconLibraryRule,
  componentSpecBlockRule,
  changelogPageRule,
];

export {
  availableSinceRule,
  badgeRule,
  changelogPageRule,
  codeBlockTabsRule,
  componentExampleRule,
  typeTableRule,
  tokenReferenceRule,
  componentSpecBlockRule,
  progressBoardRule,
  iconLibraryRule,
  lynxComponentExampleRule,
};
