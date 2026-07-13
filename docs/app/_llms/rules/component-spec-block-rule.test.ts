import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert } from "../test-utils";
import { componentSpecBlockRule } from "./component-spec-block-rule";

const normalize = (input: string) =>
  normalizeForAssert(normalizeLLMBodyWithRules(input, [componentSpecBlockRule]));

describe("componentSpecBlockRule", () => {
  it("replaces spec block with rootage json url", () => {
    expect(
      normalize(`# Control Chip

<ComponentSpecBlock id="control-chip" />`),
    ).toMatchInlineSnapshot(`
      "# Control Chip

      Component spec (JSON): /rootage/components/control-chip.json"
    `);
  });

  it("ignores variants prop", () => {
    expect(
      normalize(`# Action Button

<ComponentSpecBlock id="action-button" variants={["variant=brandSolid", "size=medium"]} />`),
    ).toMatchInlineSnapshot(`
      "# Action Button

      Component spec (JSON): /rootage/components/action-button.json"
    `);
  });

  it("keeps original node for unknown spec id", () => {
    expect(
      normalize(`# Unknown

<ComponentSpecBlock id="does-not-exist" />`),
    ).toMatchInlineSnapshot(`
      "# Unknown

      <ComponentSpecBlock id="does-not-exist" />"
    `);
  });
});
