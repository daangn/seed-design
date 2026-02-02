import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import type { ReactElement } from "react";
import React from "react";

import { TextFieldRoot, TextFieldInput } from "./TextField";
import {
  FieldRoot,
  FieldCharacterCount,
  FieldLabel,
  FieldFooter,
  FieldHeader,
} from "../Field/Field";
import { useTextFieldWithGraphemes } from "./useTextFieldWithGraphemes";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

interface TextFieldWithGraphemesProps {
  maxGraphemeCount?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (values: {
    value: string;
    graphemes: string[];
    slicedValue: string;
    slicedGraphemes: string[];
  }) => void;
}

const TextFieldWithGraphemes = (props: TextFieldWithGraphemesProps) => {
  const { textFieldRootProps, counterProps } = useTextFieldWithGraphemes(props);

  return (
    <FieldRoot>
      <FieldHeader>
        <FieldLabel>Text Field</FieldLabel>
      </FieldHeader>
      <TextFieldRoot {...textFieldRootProps}>
        <TextFieldInput data-testid="input" />
      </TextFieldRoot>
      <FieldFooter>
        <FieldCharacterCount {...counterProps} data-testid="counter" />
      </FieldFooter>
    </FieldRoot>
  );
};

describe("useTextFieldWithGraphemes", () => {
  describe("basic functionality", () => {
    it("should render with empty default value", () => {
      const { getByTestId } = setUp(<TextFieldWithGraphemes />);
      const input = getByTestId("input");

      expect(input).toHaveValue("");
    });

    it("should render with provided default value", () => {
      const { getByTestId } = setUp(<TextFieldWithGraphemes defaultValue="Hello" />);
      const input = getByTestId("input");

      expect(input).toHaveValue("Hello");
    });

    it("should handle typing in uncontrolled mode", async () => {
      const { getByTestId, user } = setUp(<TextFieldWithGraphemes />);
      const input = getByTestId("input");

      await user.type(input, "test");
      expect(input).toHaveValue("test");
    });

    it("should handle controlled mode", async () => {
      function ControlledComponent() {
        const [value, setValue] = React.useState("initial");
        return (
          <TextFieldWithGraphemes value={value} onValueChange={({ value }) => setValue(value)} />
        );
      }

      const { getByTestId, user } = setUp(<ControlledComponent />);
      const input = getByTestId("input");

      expect(input).toHaveValue("initial");

      await user.clear(input);
      await user.type(input, "new");

      expect(input).toHaveValue("new");
    });

    it("should track grapheme count with counter", async () => {
      const { getByTestId, user } = setUp(<TextFieldWithGraphemes maxGraphemeCount={20} />);
      const input = getByTestId("input");
      const counter = getByTestId("counter");

      expect(counter).toHaveTextContent("0/20");

      await user.type(input, "Hello");
      expect(counter).toHaveTextContent("5/20");

      await user.type(input, " 👨‍👩‍👧‍👦");
      expect(counter).toHaveTextContent("7/20");
    });
  });

  describe("counter functionality", () => {
    it("should show the right character count with defaultValue", () => {
      const { getByTestId } = setUp(
        <TextFieldWithGraphemes maxGraphemeCount={10} defaultValue="Hello" />,
      );
      const counter = getByTestId("counter");

      expect(counter).toBeInTheDocument();
      expect(counter).toHaveTextContent("5/10");
    });

    it("should update counter as user types", async () => {
      const { getByTestId, user } = setUp(<TextFieldWithGraphemes maxGraphemeCount={10} />);
      const input = getByTestId("input");
      const counter = getByTestId("counter");

      expect(counter).toHaveTextContent("0/10");

      await user.type(input, "Test");
      expect(counter).toHaveTextContent("4/10");

      await user.clear(input);
      expect(counter).toHaveTextContent("0/10");
    });

    it("should handle maxGraphemes of 0", () => {
      const { getByTestId } = setUp(
        <TextFieldWithGraphemes maxGraphemeCount={0} defaultValue="Test" />,
      );
      const counter = getByTestId("counter");

      expect(counter).toHaveTextContent("4/0");
    });
  });

  describe("onValueChange callback", () => {
    type ValueChangeParams = {
      value: string;
      graphemes: string[];
      slicedValue: string;
      slicedGraphemes: string[];
    };

    it("should call onValueChange with correct parameters", async () => {
      const handleValueChange = mock<(params: ValueChangeParams) => void>(() => {});
      const { getByTestId, user } = setUp(
        <TextFieldWithGraphemes onValueChange={handleValueChange} />,
      );
      const input = getByTestId("input");

      await user.type(input, "H");
      expect(handleValueChange).toHaveBeenLastCalledWith({
        value: "H",
        graphemes: ["H"],
        slicedValue: "H",
        slicedGraphemes: ["H"],
      });

      await user.type(input, "i");
      expect(handleValueChange).toHaveBeenLastCalledWith({
        value: "Hi",
        graphemes: ["H", "i"],
        slicedValue: "Hi",
        slicedGraphemes: ["H", "i"],
      });
    });

    it("should provide sliced values when maxGraphemes is set", async () => {
      const handleValueChange = mock<(params: ValueChangeParams) => void>(() => {});
      const { getByTestId, user } = setUp(
        <TextFieldWithGraphemes maxGraphemeCount={3} onValueChange={handleValueChange} />,
      );
      const input = getByTestId("input");

      await user.type(input, "Hello");

      const lastCall = handleValueChange.mock.calls[handleValueChange.mock.calls.length - 1]?.[0];
      if (!lastCall) throw new Error("Expected lastCall to be defined");

      expect(lastCall.value).toBe("Hello");
      expect(lastCall.graphemes).toEqual(["H", "e", "l", "l", "o"]);
      expect(lastCall.slicedValue).toBe("Hel");
      expect(lastCall.slicedGraphemes).toEqual(["H", "e", "l"]);
    });

    it("should handle empty string", async () => {
      const handleValueChange = mock(() => {});
      const { getByTestId, user } = setUp(
        <TextFieldWithGraphemes defaultValue="Test" onValueChange={handleValueChange} />,
      );
      const input = getByTestId("input");

      await user.clear(input);

      expect(handleValueChange).toHaveBeenLastCalledWith({
        value: "",
        graphemes: [],
        slicedValue: "",
        slicedGraphemes: [],
      });
    });

    it("should be called in both controlled and uncontrolled modes", async () => {
      const handleUncontrolled = mock<(params: ValueChangeParams) => void>(() => {});
      const handleControlled = mock<(params: ValueChangeParams) => void>(() => {});

      function TestBothModes() {
        const [controlledValue, setControlledValue] = React.useState("controlled");

        return (
          <>
            <TextFieldWithGraphemes
              defaultValue="uncontrolled"
              onValueChange={handleUncontrolled}
            />
            <TextFieldWithGraphemes
              value={controlledValue}
              onValueChange={(values) => {
                handleControlled(values);
                setControlledValue(values.value);
              }}
            />
          </>
        );
      }

      const { getAllByTestId, user } = setUp(<TestBothModes />);
      const [uncontrolledInput, controlledInput] = getAllByTestId("input");

      await user.type(uncontrolledInput, "!");
      await user.type(controlledInput, "!");

      expect(handleUncontrolled).toHaveBeenCalled();
      expect(handleControlled).toHaveBeenCalled();
    });
  });

  describe("controlled vs uncontrolled", () => {
    it("should maintain internal state in uncontrolled mode", async () => {
      const { getByTestId, user } = setUp(<TextFieldWithGraphemes defaultValue="initial" />);
      const input = getByTestId("input");

      expect(input).toHaveValue("initial");

      await user.clear(input);
      await user.type(input, "changed");
      expect(input).toHaveValue("changed");
    });

    it("should not update without onValueChange in controlled mode", async () => {
      const { getByTestId, user } = setUp(<TextFieldWithGraphemes value="fixed" />);
      const input = getByTestId("input");

      expect(input).toHaveValue("fixed");

      await user.type(input, "test");
      expect(input).toHaveValue("fixed");
    });
  });

  describe("edge cases", () => {
    it("should handle very long text", () => {
      const longText = "a".repeat(1000);
      const { getByTestId } = setUp(
        <TextFieldWithGraphemes defaultValue={longText} maxGraphemeCount={2000} />,
      );
      const counter = getByTestId("counter");

      expect(counter).toHaveTextContent("1000/2000");
    });

    it("should handle special unicode characters", () => {
      const { getByTestId } = setUp(
        <TextFieldWithGraphemes defaultValue="👫🏼é🏳️‍🌈" maxGraphemeCount={2} />,
      );
      const counter = getByTestId("counter");

      // 3 graphemes: family emoji, rainbow flag, é
      expect(counter).toHaveTextContent("3/2");
    });

    it("should call onValueChange even when value doesn't change in controlled mode", async () => {
      const handleValueChange = mock(() => {});
      const { getByTestId, user } = setUp(
        <TextFieldWithGraphemes value="fixed" onValueChange={handleValueChange} />,
      );
      const input = getByTestId("input");

      await user.type(input, "test");

      expect(handleValueChange).toHaveBeenCalled();
      expect(input).toHaveValue("fixed");
    });
  });
});
