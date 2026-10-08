import "@testing-library/jest-dom";
import { createRef, Fragment } from "@lynx-js/react";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, it } from "vitest";

import { MannerTemp, MannerTempEmote } from "./MannerTemp";

const L1_ASSET = "b63c9b3c-410c-4cf5-ba83-d787a03c3c57";
const L10_ASSET = "6cc410ac-3a55-4542-b49f-53551db74c4d";

function hasRef(element: Element | null | undefined) {
  return Array.from(element?.attributes ?? []).some(({ name }) => name.startsWith("react-ref-"));
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("MannerTemp", () => {
  it("renders the label and emote with the selected level", () => {
    render(
      <MannerTemp className="custom-manner-temp" level="l6">
        40°C
        <MannerTempEmote />
      </MannerTemp>,
    );

    const root = getRenderedRoot();
    const { getByText } = getQueriesForElement(root);
    const mannerTempRoot = root.querySelector(".seed-manner-temp__root");
    const label = getByText("40°C");
    const emote = root.querySelector(".seed-manner-temp__emote");

    expect(mannerTempRoot).toHaveClass("custom-manner-temp");
    expect(mannerTempRoot).toHaveClass("seed-manner-temp__root--level_l6");
    expect(label).toHaveClass("seed-manner-temp__label");
    expect(label).toHaveClass("seed-manner-temp__label--level_l6");
    expect(emote).toHaveAttribute(
      "src",
      expect.stringContaining("bf8f9b4d-c72e-4bf2-a094-460d3ad1b11f"),
    );
  });

  it("renders the label before the emote and lets the emote override the root level", () => {
    render(
      <MannerTemp level="l3">
        <MannerTempEmote level="l9" />
        36.5°C
      </MannerTemp>,
    );

    const root = getRenderedRoot();
    const mannerTempRoot = root.querySelector(".seed-manner-temp__root");
    const label = mannerTempRoot?.querySelector("text");
    const emote = mannerTempRoot?.querySelector("image");

    expect(label?.textContent).toBe("36.5°C");
    expect(label?.querySelector("image")).toBeNull();
    expect(label?.compareDocumentPosition(emote as Node)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(emote).toHaveClass("seed-manner-temp__emote--level_l9");
    expect(emote).toHaveAttribute(
      "src",
      expect.stringContaining("61f6c297-11da-4d72-ba90-20cd69c09c22"),
    );
    expect(emote).toHaveAttribute("accessibility-elements-hidden", "true");
  });

  it("defaults to l1 and lets the emote inherit the root level", () => {
    render(
      <MannerTemp>
        12.5°C
        <MannerTempEmote />
      </MannerTemp>,
    );

    const root = getRenderedRoot();
    const mannerTempRoot = root.querySelector(".seed-manner-temp__root");
    const emote = root.querySelector("image");

    expect(mannerTempRoot).toHaveClass("seed-manner-temp__root--level_l1");
    expect(emote).toHaveClass("seed-manner-temp__emote--level_l1");
    expect(emote).toHaveAttribute("src", expect.stringContaining(L1_ASSET));
  });

  it("connects refs, className, and style to the root view and emote image", () => {
    const rootRef = createRef<NodesRef>();
    const emoteRef = createRef<NodesRef>();

    render(
      <MannerTemp ref={rootRef} level="l10" style={{ marginTop: "4px" }}>
        80°C
        <MannerTempEmote ref={emoteRef} className="custom-emote" style={{ marginLeft: "2px" }} />
      </MannerTemp>,
    );

    const root = getRenderedRoot();
    const mannerTempRoot = root.querySelector("view");
    const emote = root.querySelector("image");

    expect(rootRef.current).not.toBeNull();
    expect(emoteRef.current).not.toBeNull();
    expect(hasRef(mannerTempRoot)).toBe(true);
    expect(hasRef(emote)).toBe(true);
    expect(mannerTempRoot).toHaveStyle({ marginTop: "4px" });
    expect(emote).toHaveClass("seed-manner-temp__emote", "custom-emote");
    expect(emote).toHaveStyle({ marginLeft: "2px" });
    expect(emote).toHaveAttribute("src", expect.stringContaining(L10_ASSET));
    expect(emote).toHaveAttribute("mode", "aspectFit");
  });

  it("lets native image props override emote defaults", () => {
    render(
      <MannerTemp>
        36.5°C
        <MannerTempEmote
          src="https://example.com/custom.webp"
          mode="aspectFill"
          accessibility-elements-hidden={false}
        />
      </MannerTemp>,
    );

    const emote = getRenderedRoot().querySelector("image");
    expect(emote).toHaveAttribute("src", "https://example.com/custom.webp");
    expect(emote).toHaveAttribute("mode", "aspectFill");
    expect(emote).toHaveAttribute("accessibility-elements-hidden", "false");
  });

  it("classifies emotes inside Fragments and keeps label order across mixed children", () => {
    const showEmote = true;

    render(
      <MannerTemp level="l6">
        <Fragment>
          {false && <MannerTempEmote />}
          {36}
          <Fragment key="nested">
            {showEmote && <MannerTempEmote />}
            .5
          </Fragment>
        </Fragment>
        °C
      </MannerTemp>,
    );

    const root = getRenderedRoot();
    const mannerTempRoot = root.querySelector(".seed-manner-temp__root");
    const label = mannerTempRoot?.querySelector("text");
    const emotes = mannerTempRoot?.querySelectorAll("image");

    expect(label?.textContent).toBe("36.5°C");
    expect(label?.querySelector("image")).toBeNull();
    expect(emotes).toHaveLength(1);
    expect(label?.compareDocumentPosition(emotes?.[0] as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders only the label when no emote is given", () => {
    render(<MannerTemp level="l3">36.5°C</MannerTemp>);

    const root = getRenderedRoot();

    expect(root.querySelector("text")?.textContent).toBe("36.5°C");
    expect(root.querySelector("image")).toBeNull();
  });
});
