import "@testing-library/jest-dom";
import { runOnBackground, useState } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { FieldButton, useFieldButtonButton, useFieldButtonContext } from "./index.js";

function query(className: string) {
  return elementTree.root?.querySelector<HTMLElement>(`.${className}`) ?? null;
}

function get(className: string) {
  const node = query(className);
  if (!node) throw new Error(`Missing .${className}`);
  return node;
}

function event(className: string, name: string) {
  fireEvent(get(className), new Event(`bindEvent:${name}`));
}

function PressedButton(props: { bindtap?: () => void }) {
  const { pressed, buttonProps } = useFieldButtonButton(props);
  return (
    <view className="button" {...buttonProps}>
      <text>{`pressed=${pressed}`}</text>
    </view>
  );
}

function Selection() {
  const [values, setValues] = useState(["판교동"]);
  return (
    <FieldButton.Root values={values} onValuesChange={setValues}>
      <PressedButton />
      <ValueText />
      <FieldButton.ClearButton className="clear" accessibility-label="지우기" />
    </FieldButton.Root>
  );
}

function ValueText() {
  const { values } = useFieldButtonContext();
  return <text className="value">{values.length ? values.join(",") : "empty"}</text>;
}

describe("FieldButton", () => {
  it("runs the Button tap once and restores the pressed state", () => {
    const onTap = vi.fn();
    render(
      <FieldButton.Root>
        <PressedButton bindtap={onTap} />
      </FieldButton.Root>,
    );

    expect(get("button")).toHaveAttribute("accessibility-traits", "button");
    event("button", "touchstart");
    expect(get("button")).toHaveTextContent("pressed=true");
    event("button", "touchend");
    event("button", "tap");

    expect(onTap).toHaveBeenCalledTimes(1);
    expect(get("button")).toHaveTextContent("pressed=false");
  });

  it.each([
    ["disabled", { disabled: true }],
    ["readOnly", { readOnly: true }],
  ])("blocks Button taps and hides ClearButton when %s", (_, state) => {
    const onTap = vi.fn();
    const onClear = vi.fn();
    const onValuesChange = vi.fn();
    render(
      <FieldButton.Root {...state} values={["판교동"]} onValuesChange={onValuesChange}>
        <PressedButton bindtap={onTap} />
        <FieldButton.ClearButton className="clear" bindtap={onClear} />
      </FieldButton.Root>,
    );

    event("button", "touchstart");
    expect(get("button")).toHaveTextContent("pressed=false");
    event("button", "tap");

    expect(onTap).not.toHaveBeenCalled();
    expect(get("button")).toHaveAttribute("accessibility-traits", "disabled");
    expect(query("clear")).toBeNull();
    expect(onClear).not.toHaveBeenCalled();
    expect(onValuesChange).not.toHaveBeenCalled();
  });

  it("requests empty values after the consumer Clear tap without pressing the Button", () => {
    const calls: string[] = [];
    render(
      <FieldButton.Root
        values={["판교동"]}
        onValuesChange={(values) => calls.push(`values:${values.length}`)}
      >
        <PressedButton bindtap={() => calls.push("button")} />
        <FieldButton.ClearButton className="clear" bindtap={() => calls.push("clear")} />
      </FieldButton.Root>,
    );

    event("clear", "touchstart");
    expect(get("button")).toHaveTextContent("pressed=false");
    event("clear", "touchend");
    event("clear", "tap");

    expect(calls).toEqual(["clear", "values:0"]);
  });

  it("shows only the consumer-owned values", () => {
    render(<Selection />);
    expect(get("value")).toHaveTextContent("판교동");

    event("clear", "tap");
    expect(get("value")).toHaveTextContent("empty");
  });

  it("keeps controlled values when the consumer ignores the clear request", () => {
    const onValuesChange = vi.fn();
    render(
      <FieldButton.Root values={["판교동"]} onValuesChange={onValuesChange}>
        <ValueText />
        <FieldButton.ClearButton className="clear" />
      </FieldButton.Root>,
    );

    event("clear", "tap");

    expect(onValuesChange).toHaveBeenCalledWith([]);
    expect(get("value")).toHaveTextContent("판교동");
  });

  it("bridges Main Thread presses while preserving the consumer Main Thread handler", async () => {
    function Example({ report }: { report: () => void }) {
      function handleTouch() {
        "main thread";
        runOnBackground(report)();
      }
      const { pressed, buttonProps } = useFieldButtonButton({
        "main-thread:bindtouchstart": handleTouch,
      });
      return (
        <view className="button" {...buttonProps}>
          <text>{`pressed=${pressed}`}</text>
        </view>
      );
    }
    const report = vi.fn();
    render(
      <FieldButton.Root>
        <Example report={report} />
      </FieldButton.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();

    fireEvent.touchstart(get("button"), {});
    await waitSchedule();

    expect(report).toHaveBeenCalledTimes(1);
    expect(get("button")).toHaveTextContent("pressed=true");
  });

  it.each([
    ["Button", <FieldButton.Button key="button" />],
    ["ClearButton", <FieldButton.ClearButton key="clear" />],
    ["Description", <FieldButton.Description key="description" />],
    ["ErrorMessage", <FieldButton.ErrorMessage key="error" />],
  ])("throws when %s is rendered outside Root", (_, element) => {
    expect(() => render(element)).toThrow();
  });

  it("returns null outside Root for non-strict context consumers", () => {
    function Optional() {
      const context = useFieldButtonContext({ strict: false });
      return <text className="optional">{context === null ? "none" : "root"}</text>;
    }
    render(<Optional />);
    expect(get("optional")).toHaveTextContent("none");
  });
});
