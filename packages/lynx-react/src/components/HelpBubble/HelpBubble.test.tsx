import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { ActionButton } from "../ActionButton";
import { HelpBubbleRoot, HelpBubbleTrigger } from "./HelpBubble";

describe("HelpBubble trigger", () => {
  it("owns the accessible name and expanded state instead of exposing its nested button twice", () => {
    const { container } = render(
      <HelpBubbleRoot>
        <HelpBubbleTrigger id="help-trigger">
          <ActionButton>열기</ActionButton>
        </HelpBubbleTrigger>
      </HelpBubbleRoot>,
    );
    const trigger = container.querySelector("#help-trigger");

    expect(trigger).toHaveAttribute("accessibility-label", "열기");
    expect(trigger).toHaveAttribute("accessibility-value", "collapsed");
    expect(trigger).toHaveAttribute("flatten", "false");
    expect(trigger?.querySelector(".seed-action-button__root")).toHaveAttribute(
      "accessibility-element",
      "false",
    );
    fireEvent.tap(trigger!);
    expect(trigger).toHaveAttribute("accessibility-value", "expanded");
  });

  it("preserves the consumer's name and native overrides", () => {
    const { container } = render(
      <HelpBubbleRoot>
        <HelpBubbleTrigger id="help-trigger" accessibility-label="도움말" flatten={true}>
          <ActionButton>열기</ActionButton>
        </HelpBubbleTrigger>
      </HelpBubbleRoot>,
    );

    expect(container.querySelector("#help-trigger")).toHaveAttribute(
      "accessibility-label",
      "도움말",
    );
    expect(container.querySelector("#help-trigger")).toHaveAttribute("flatten", "true");
  });
});
