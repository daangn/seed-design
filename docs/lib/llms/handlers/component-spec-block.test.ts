import { describe, expect, it } from "bun:test";
import { renderWithHandler } from "../render-test-utils";
import { componentSpecBlockHandler } from "./component-spec-block";

const render = (mdx: string) => renderWithHandler(componentSpecBlockHandler, mdx);

describe("componentSpecBlock handler", () => {
  it("replaces the spec block with the rootage JSON url", async () => {
    const actual = await render('# Control Chip\n\n<ComponentSpecBlock id="control-chip" />');

    expect(actual).toBe(
      "# Control Chip\n\nComponent spec (JSON): /rootage/components/control-chip.json",
    );
  });

  it("ignores every prop but id", async () => {
    const actual = await render(
      '<ComponentSpecBlock\n  id="typography"\n  headingComponent="h4"\n  variants={["textStyle=screenTitle"]}\n/>',
    );

    expect(actual).toBe("Component spec (JSON): /rootage/components/typography.json");
  });

  it("keeps the tag for an id with no spec behind it", async () => {
    const actual = await render('# Unknown\n\n<ComponentSpecBlock id="does-not-exist" />');

    expect(actual).toBe('# Unknown\n\n<ComponentSpecBlock id="does-not-exist" />');
  });

  it("keeps the tag when id is missing", async () => {
    expect(await render("<ComponentSpecBlock />")).toBe("<ComponentSpecBlock />");
  });

  // The kept tag is fumadocs' own rewrite of the source, which flattens an expression
  // attribute into a string one — `id={componentId}` comes back quoted.
  it("keeps the tag when id is an expression rather than a string", async () => {
    expect(await render("<ComponentSpecBlock id={componentId} />")).toBe(
      '<ComponentSpecBlock id="componentId" />',
    );
  });

  it("leaves the url unescaped", async () => {
    expect(await render('<ComponentSpecBlock id="action-button" />')).toBe(
      "Component spec (JSON): /rootage/components/action-button.json",
    );
  });

  it("leaves other JSX alone", async () => {
    expect(await render("<Callout>유지됩니다</Callout>")).toContain("<Callout>");
  });
});
