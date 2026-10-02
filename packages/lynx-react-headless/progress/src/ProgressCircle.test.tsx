import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";
import { ProgressCircle, type ProgressCircleRootProps, useProgressCircleContext } from "./index.js";

function root() {
  const node = elementTree.root?.querySelector<HTMLElement>(".progress");
  if (!node) throw new Error("Missing ProgressCircle root");
  return node;
}

function State() {
  const { indeterminate, percent } = useProgressCircleContext();
  return <text>{`indeterminate=${indeterminate} percent=${percent}`}</text>;
}

function renderProgress(props: ProgressCircleRootProps) {
  render(
    <ProgressCircle.Root className="progress" {...props}>
      <ProgressCircle.Track />
      <ProgressCircle.Range>
        <State />
      </ProgressCircle.Range>
    </ProgressCircle.Root>,
  );
}

describe("ProgressCircle.Root", () => {
  it("treats a numeric value as determinate with a default 0–100 range", () => {
    renderProgress({ value: 40 });

    expect(root()).toHaveAttribute("accessibility-element", "true");
    expect(root()).toHaveAttribute("accessibility-role-description", "progressbar");
    expect(root()).toHaveAttribute("accessibility-value", "minimum 0, maximum 100, current 40");
    expect(root()).toHaveTextContent("indeterminate=false percent=40");
  });

  it("uses the default for whichever bound is omitted", () => {
    renderProgress({ minValue: 0, value: 0.5 });

    expect(root()).toHaveAttribute("accessibility-value", "minimum 0, maximum 100, current 0.5");
    expect(root()).toHaveTextContent("percent=0.5");
  });

  it("is indeterminate without a value even when bounds are given", () => {
    renderProgress({ minValue: 0, maxValue: 1 });

    expect(root()).toHaveAttribute("accessibility-value", "indeterminate");
    expect(root()).toHaveTextContent("indeterminate=true percent=-1");
  });

  it.each([
    [{ minValue: 5, maxValue: 5, value: 5 }, 0],
    [{ minValue: 0, maxValue: 1, value: -0.5 }, 0],
    [{ minValue: 0, maxValue: 1, value: 2 }, 100],
  ])("keeps percent within 0–100 for %o", (props, percent) => {
    renderProgress(props);

    expect(root()).toHaveTextContent(`percent=${percent}`);
  });

  it("announces the raw value outside the range", () => {
    renderProgress({ minValue: 0, maxValue: 1, value: 2 });

    expect(root()).toHaveAttribute("accessibility-value", "minimum 0, maximum 1, current 2");
  });

  it("lets explicit accessibility props replace the defaults", () => {
    renderProgress({
      value: 40,
      "accessibility-element": false,
      "accessibility-role-description": "custom progress",
      "accessibility-value": "40 percent complete",
    });

    expect(root()).toHaveAttribute("accessibility-element", "false");
    expect(root()).toHaveAttribute("accessibility-role-description", "custom progress");
    expect(root()).toHaveAttribute("accessibility-value", "40 percent complete");
  });
});

describe("ProgressCircle parts", () => {
  it.each([
    ["Track", () => <ProgressCircle.Track />],
    ["Range", () => <ProgressCircle.Range />],
  ])("%s requires a Root", (_name, ui) => {
    expect(() => render(ui())).toThrow();
  });
});
