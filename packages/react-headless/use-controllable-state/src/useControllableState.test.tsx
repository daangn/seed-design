import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { screen, cleanup, render, waitFor } from "@testing-library/react";
import { useControllableState } from "./useControllableState";
import { afterEach, describe, it, expect, afterAll, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("useControllableState", () => {
  afterEach(cleanup);

  // Tests ported from radix-ui/primitives (https://github.com/radix-ui/primitives)
  // Used under the MIT License: https://opensource.org/licenses/MIT
  describe("Radix UI Original Tests", () => {
    describe("given a controlled value", () => {
      it("should initially use the controlled value", () => {
        render(<ControlledComponent />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("aria-checked", "false");
      });

      it("should update the value when set internally", async () => {
        render(<ControlledComponent />);
        const checkbox = screen.getByRole("checkbox");
        userEvent.click(checkbox);
        await waitFor(() => {
          expect(checkbox).toHaveAttribute("aria-checked", "true");
        });
      });

      it("should update the value when set externally", async () => {
        render(<ControlledComponent defaultChecked />);
        const checkbox = screen.getByRole("checkbox");
        const clearButton = screen.getByText("Clear value");
        userEvent.click(clearButton);
        await waitFor(() => {
          expect(checkbox).toHaveAttribute("aria-checked", "false");
        });
      });
    });

    describe("given a default value", () => {
      it("should initially use the default value", () => {
        render(<UncontrolledComponent defaultChecked />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("aria-checked", "true");
      });

      it("should update the value", async () => {
        render(<UncontrolledComponent defaultChecked />);
        const checkbox = screen.getByRole("checkbox");
        userEvent.click(checkbox);
        await waitFor(() => {
          expect(checkbox).toHaveAttribute("aria-checked", "false");
        });
      });
    });

    describe("switching between controlled and uncontrolled", () => {
      const consoleMock = vi.spyOn(console, "warn").mockImplementation(() => void 0);
      afterAll(() => {
        consoleMock.mockReset();
      });

      describe("controlled to uncontrolled", () => {
        it("should warn", async () => {
          render(<UnstableComponent defaultChecked />);
          const clearButton = screen.getByText("Clear value");
          userEvent.click(clearButton);
          await waitFor(() => {
            expect(consoleMock).toHaveBeenLastCalledWith(
              "Checkbox is changing from controlled to uncontrolled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.",
            );
          });
        });
      });

      describe("uncontrolled to controlled", () => {
        it("should warn", async () => {
          render(<UnstableComponent />);
          const checkbox = screen.getByRole("checkbox");
          userEvent.click(checkbox);
          await waitFor(() => {
            expect(consoleMock).toHaveBeenLastCalledWith(
              "Checkbox is changing from uncontrolled to controlled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.",
            );
          });
        });
      });
    });
  });

  describe("meta parameter", () => {
    describe("controlled mode", () => {
      it("should pass meta to onChange", async () => {
        const onChange = vi.fn();
        render(<ControlledToggleWithMeta onChange={onChange} />);
        const button = screen.getByRole("button", { name: "toggle with meta" });
        await userEvent.click(button);
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(true, "trigger");
        });
      });

      it("should pass undefined meta when not provided", async () => {
        const onChange = vi.fn();
        render(<ControlledToggleWithMeta onChange={onChange} />);
        const button = screen.getByRole("button", { name: "toggle without meta" });
        await userEvent.click(button);
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(true, undefined);
        });
      });

      it("should pass different meta on consecutive calls", async () => {
        const onChange = vi.fn();
        render(<ControlledToggleWithMeta onChange={onChange} />);
        const withMeta = screen.getByRole("button", { name: "toggle with meta" });
        const withoutMeta = screen.getByRole("button", { name: "toggle without meta" });
        const close = screen.getByRole("button", { name: "close" });
        const withUpdater = screen.getByRole("button", { name: "toggle with updater" });

        await userEvent.click(withMeta);
        await userEvent.click(close);
        await userEvent.click(withoutMeta);
        await userEvent.click(withUpdater);
        await userEvent.click(withUpdater);
        await userEvent.click(close);
        await userEvent.click(withMeta);

        await waitFor(() => {
          expect(onChange).toHaveBeenNthCalledWith(1, true, "trigger");
          expect(onChange).toHaveBeenNthCalledWith(2, false, "closeButton");
          expect(onChange).toHaveBeenNthCalledWith(3, true, undefined);
          expect(onChange).toHaveBeenNthCalledWith(4, false, "updater");
          expect(onChange).toHaveBeenNthCalledWith(5, true, "updater");
          expect(onChange).toHaveBeenNthCalledWith(6, false, "closeButton");
          expect(onChange).toHaveBeenNthCalledWith(7, true, "trigger");
        });
      });

      it("should not call onChange when value is the same", async () => {
        const onChange = vi.fn();
        render(<ControlledToggleWithMeta onChange={onChange} defaultValue={true} />);
        const withMeta = screen.getByRole("button", { name: "toggle with meta" });
        await userEvent.click(withMeta);
        await userEvent.click(withMeta);
        expect(onChange).toHaveBeenCalledTimes(0);
      });
    });

    describe("uncontrolled mode", () => {
      it("should pass meta to onChange", async () => {
        const onChange = vi.fn();
        render(<UncontrolledToggleWithMeta onChange={onChange} />);
        const button = screen.getByRole("button", { name: "toggle with meta" });
        await userEvent.click(button);
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(true, "trigger");
        });
      });

      it("should pass undefined meta when not provided", async () => {
        const onChange = vi.fn();
        render(<UncontrolledToggleWithMeta onChange={onChange} />);
        const button = screen.getByRole("button", { name: "toggle without meta" });
        await userEvent.click(button);
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith(true, undefined);
        });
      });

      it("should pass different meta on consecutive calls", async () => {
        const onChange = vi.fn();
        render(<UncontrolledToggleWithMeta onChange={onChange} />);
        const withMeta = screen.getByRole("button", { name: "toggle with meta" });
        const withoutMeta = screen.getByRole("button", { name: "toggle without meta" });
        const close = screen.getByRole("button", { name: "close" });
        const withUpdater = screen.getByRole("button", { name: "toggle with updater" });

        await userEvent.click(withMeta);
        await userEvent.click(close);
        await userEvent.click(withoutMeta);
        await userEvent.click(withUpdater);
        await userEvent.click(withUpdater);
        await userEvent.click(close);
        await userEvent.click(withMeta);

        await waitFor(() => {
          expect(onChange).toHaveBeenNthCalledWith(1, true, "trigger");
          expect(onChange).toHaveBeenNthCalledWith(2, false, "closeButton");
          expect(onChange).toHaveBeenNthCalledWith(3, true, undefined);
          expect(onChange).toHaveBeenNthCalledWith(4, false, "updater");
          expect(onChange).toHaveBeenNthCalledWith(5, true, "updater");
          expect(onChange).toHaveBeenNthCalledWith(6, false, "closeButton");
          expect(onChange).toHaveBeenNthCalledWith(7, true, "trigger");
        });
      });
    });
  });
});

// Test components for meta parameter tests
function ControlledToggleWithMeta({
  onChange,
  defaultValue = false,
}: {
  onChange: (value: boolean, meta?: string) => void;
  defaultValue?: boolean;
}) {
  const [value, setValue] = React.useState(defaultValue);
  const [, setValueWithMeta] = useControllableState<boolean, string>({
    prop: value,
    defaultProp: false,
    onChange: (newValue, meta) => {
      setValue(newValue);
      onChange(newValue, meta);
    },
  });

  return (
    <div>
      <button type="button" onClick={() => setValueWithMeta(true, "trigger")}>
        toggle with meta
      </button>
      <button type="button" onClick={() => setValueWithMeta(true)}>
        toggle without meta
      </button>
      <button type="button" onClick={() => setValueWithMeta(false, "closeButton")}>
        close
      </button>
      <button type="button" onClick={() => setValueWithMeta((prev) => !prev, "updater")}>
        toggle with updater
      </button>
    </div>
  );
}

function UncontrolledToggleWithMeta({
  onChange,
}: {
  onChange: (value: boolean, meta?: string) => void;
}) {
  const [, setValue] = useControllableState<boolean, string>({
    defaultProp: false,
    onChange,
  });

  return (
    <div>
      <button type="button" onClick={() => setValue(true, "trigger")}>
        toggle with meta
      </button>
      <button type="button" onClick={() => setValue(true)}>
        toggle without meta
      </button>
      <button type="button" onClick={() => setValue(false, "closeButton")}>
        close
      </button>
      <button type="button" onClick={() => setValue((prev) => !prev, "updater")}>
        toggle with updater
      </button>
    </div>
  );
}

function ControlledComponent({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = React.useState(defaultChecked ?? false);
  return (
    <div>
      <Checkbox checked={checked} onChange={setChecked} />
      <button type="button" onClick={() => setChecked(false)}>
        Clear value
      </button>
    </div>
  );
}

function UncontrolledComponent({ defaultChecked }: { defaultChecked?: boolean }) {
  return <Checkbox defaultChecked={defaultChecked} />;
}

function UnstableComponent({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div>
      <Checkbox checked={checked} onChange={setChecked} />
      <button type="button" onClick={() => setChecked(undefined)}>
        Clear value
      </button>
    </div>
  );
}

function Checkbox(props: {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const [checked, setChecked] = useControllableState({
    defaultProp: props.defaultChecked ?? false,
    prop: props.checked,
    onChange: props.onChange,
    caller: "Checkbox",
  });

  return (
    // biome-ignore lint/a11y/useSemanticElements: test
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onKeyDown={(e) => void (e.key === "Enter" && e.preventDefault())}
      onClick={() => setChecked((c) => !c)}
    />
  );
}
