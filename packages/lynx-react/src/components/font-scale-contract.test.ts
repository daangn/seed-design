import {
  actionButton,
  checkbox,
  radio,
  switch as switchVars,
  tagGroup,
  tagGroupItem,
} from "@seed-design/lynx-css/vars/component";
import { describe, expect, it } from "vitest";

function expectDynamicTextTokens(style: { fontSize?: string; lineHeight?: string }) {
  expect(style.fontSize).toMatch(/^var\(--seed-font-size-t\d+\)$/);
  expect(style.lineHeight).toMatch(/^var\(--seed-line-height-t\d+\)$/);
}

function expectNonTextSizeToken(value: string | undefined) {
  expect(value).toBeDefined();
  expect(value).not.toContain("font-size");
  expect(value).not.toContain("line-height");
  expect(value).not.toContain("sp");
}

describe("font scale contract", () => {
  it("keeps component labels on dynamic sp-backed typography tokens", () => {
    expectDynamicTextTokens(actionButton.sizeMediumLayoutWithText.enabled.label);
    expectDynamicTextTokens(checkbox.sizeMedium.enabled.label);
    expectDynamicTextTokens(radio.sizeMedium.enabled.label);
    expectDynamicTextTokens(switchVars.size24.enabled.label);
    expectDynamicTextTokens(tagGroup.sizeT3.enabled.separator);
    expectDynamicTextTokens(tagGroupItem.sizeT3.enabled.label);
  });

  it("keeps icon and spacing sizes off typography tokens", () => {
    expectNonTextSizeToken(actionButton.sizeMediumLayoutWithText.enabled.prefixIcon.size);
    expectNonTextSizeToken(actionButton.sizeMediumLayoutIconOnly.enabled.icon.size);
    expectNonTextSizeToken(tagGroupItem.sizeT3.enabled.icon.size);
    expectNonTextSizeToken(checkbox.base.enabled.root.gap);
    expectNonTextSizeToken(radio.base.enabled.root.gap);
    expectNonTextSizeToken(switchVars.size24.enabled.root.gap);
  });
});
