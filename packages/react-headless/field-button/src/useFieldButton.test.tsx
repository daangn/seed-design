import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";

import type { ReactElement } from "react";

import {
  FieldButtonButton,
  FieldButtonClearButton,
  FieldButtonDescription,
  FieldButtonErrorMessage,
  FieldButtonHiddenInput,
  FieldButtonRoot,
  type FieldButtonRootProps,
} from "./FieldButton";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function FieldButton(props: FieldButtonRootProps) {
  return (
    <FieldButtonRoot {...props}>
      <FieldButtonButton>Click me</FieldButtonButton>
      <FieldButtonClearButton>Clear</FieldButtonClearButton>
      <FieldButtonDescription>Description text</FieldButtonDescription>
      <FieldButtonErrorMessage>Error message</FieldButtonErrorMessage>
      {props.values?.map((_, index) => (
        <FieldButtonHiddenInput key={index} valueIndex={index} />
      ))}
    </FieldButtonRoot>
  );
}

describe("useFieldButton", () => {
  it("should render the field button correctly", () => {
    const { getByRole } = setUp(<FieldButton />);
    const button = getByRole("button", { name: "Click me" });

    expect(button).toBeInTheDocument();
  });

  it("should render with initial values", () => {
    const { container } = setUp(<FieldButton values={["value1", "value2"]} />);
    const hiddenInputs = container.querySelectorAll('input[type="hidden"]');

    expect(hiddenInputs).toHaveLength(2);
    expect(hiddenInputs[0]).toHaveValue("value1");
    expect(hiddenInputs[1]).toHaveValue("value2");
  });

  it("should have hover state when pointer moves over root", async () => {
    const { container, user } = setUp(<FieldButton />);
    const root = container.firstElementChild;

    if (!root) throw new Error("root not found");

    await user.hover(root);
    expect(root).toHaveAttribute("data-hover");

    await user.unhover(root);
    expect(root).not.toHaveAttribute("data-hover");
  });

  it("should have active state when button is pressed", () => {
    const { getByRole } = setUp(<FieldButton />);
    const button = getByRole("button", { name: "Click me" });

    fireEvent.pointerDown(button);
    expect(button).toHaveAttribute("data-active");

    fireEvent.pointerUp(button);
    expect(button).not.toHaveAttribute("data-active");
  });

  it("should have focus state when button is focused", async () => {
    const { getByRole, user } = setUp(<FieldButton />);
    const button = getByRole("button", { name: "Click me" });

    await user.tab();
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("data-focus");
    expect(button).toHaveAttribute("data-focus-visible");

    await user.click(document.body);
    expect(button).not.toHaveFocus();
    expect(button).not.toHaveAttribute("data-focus");
    expect(button).not.toHaveAttribute("data-focus-visible");
  });

  it("should have disabled state when disabled prop is true", () => {
    const { getByRole } = setUp(<FieldButton disabled />);
    const button = getByRole("button", { name: "Click me" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-disabled");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("should have readOnly state when readOnly prop is true", () => {
    const { getByRole } = setUp(<FieldButton readOnly />);
    const button = getByRole("button", { name: "Click me" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-readonly");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("should have invalid state when invalid prop is true", () => {
    const { getByRole } = setUp(<FieldButton invalid />);
    const button = getByRole("button", { name: "Click me" });

    expect(button).toHaveAttribute("data-invalid");
  });

  it("should have aria-describedby with description id", () => {
    const { getByRole, getByText } = setUp(<FieldButton />);
    const button = getByRole("button", { name: "Click me" });
    const description = getByText("Description text");

    expect(button).toHaveAttribute("aria-describedby");
    const describedBy = button.getAttribute("aria-describedby");
    expect(describedBy).toContain(description.id);
  });

  it("should have aria-describedby with error message id ", () => {
    const { getByRole, getByText } = setUp(<FieldButton />);
    const button = getByRole("button", { name: "Click me" });
    const errorMessage = getByText("Error message");

    expect(button).toHaveAttribute("aria-describedby");
    const describedBy = button.getAttribute("aria-describedby");
    expect(describedBy).toContain(errorMessage.id);
  });

  it("should have aria-live on error message", () => {
    const { getByText } = setUp(<FieldButton />);
    const errorMessage = getByText("Error message");

    expect(errorMessage).toHaveAttribute("aria-live", "polite");
  });

  it("should use custom name for hidden inputs", () => {
    const { container } = setUp(<FieldButton name="custom-name" values={["value1"]} />);
    const hiddenInput = container.querySelector('input[type="hidden"]');

    expect(hiddenInput).toHaveAttribute("name", "custom-name");
  });

  it("should clear active state when pointer leaves", () => {
    const { getByRole, container } = setUp(<FieldButton />);
    const button = getByRole("button", { name: "Click me" });
    const root = container.firstElementChild;

    if (!root) throw new Error("root not found");

    fireEvent.pointerDown(button);
    expect(button).toHaveAttribute("data-active");

    fireEvent.pointerLeave(root);
    expect(button).not.toHaveAttribute("data-active");
  });

  it("should not disable hidden inputs when readOnly (unlike disabled)", () => {
    const { container } = setUp(<FieldButton readOnly values={["value1", "value2"]} />);
    const hiddenInputs = container.querySelectorAll('input[type="hidden"]');

    expect(hiddenInputs).toHaveLength(2);
    expect(hiddenInputs[0]).not.toBeDisabled();
    expect(hiddenInputs[1]).not.toBeDisabled();
    expect(hiddenInputs[0]).toHaveValue("value1");
    expect(hiddenInputs[1]).toHaveValue("value2");
  });

  it("should disable hidden inputs when disabled", () => {
    const { container } = setUp(<FieldButton disabled values={["value1", "value2"]} />);
    const hiddenInputs = container.querySelectorAll('input[type="hidden"]');

    expect(hiddenInputs).toHaveLength(2);
    expect(hiddenInputs[0]).toBeDisabled();
    expect(hiddenInputs[1]).toBeDisabled();
  });

  it("should render without description and errorMessage", () => {
    function MinimalFieldButton(props: FieldButtonRootProps) {
      return (
        <FieldButtonRoot {...props}>
          <FieldButtonButton>Click me</FieldButtonButton>
          {props.values?.map((_, index) => (
            <FieldButtonHiddenInput key={index} valueIndex={index} />
          ))}
        </FieldButtonRoot>
      );
    }

    const { getByRole } = setUp(<MinimalFieldButton />);
    const button = getByRole("button", { name: "Click me" });

    expect(button).not.toHaveAttribute("aria-describedby");
  });

  it("should only include rendered elements in aria-describedby", () => {
    function FieldButtonWithDescription(props: FieldButtonRootProps) {
      return (
        <FieldButtonRoot {...props}>
          <FieldButtonButton>Click me</FieldButtonButton>
          <FieldButtonDescription>Description text</FieldButtonDescription>
          {props.values?.map((_, index) => (
            <FieldButtonHiddenInput key={index} valueIndex={index} />
          ))}
        </FieldButtonRoot>
      );
    }

    const { getByRole, getByText } = setUp(<FieldButtonWithDescription />);
    const button = getByRole("button", { name: "Click me" });
    const description = getByText("Description text");

    const describedBy = button.getAttribute("aria-describedby");
    expect(describedBy).toBe(description.id);
  });

  describe("clear button", () => {
    it("should call onValuesChange when clear button is clicked", async () => {
      const handleValuesChange = mock(() => {});
      const { getByRole, user } = setUp(
        <FieldButton values={["value1"]} onValuesChange={handleValuesChange} />,
      );
      const clearButton = getByRole("button", { name: "Clear" });

      await user.click(clearButton);
      expect(handleValuesChange).toHaveBeenCalledWith([]);
    });

    it("should hide clear button when disabled", async () => {
      const handleValuesChange = mock(() => {});
      const { getByText, user } = setUp(
        <FieldButton disabled values={["value1"]} onValuesChange={handleValuesChange} />,
      );
      const clearButton = getByText("Clear");

      expect(clearButton).toHaveAttribute("hidden");

      await user.click(clearButton);
      expect(handleValuesChange).not.toHaveBeenCalled();
    });

    it("should hide clear button when readOnly", async () => {
      const handleValuesChange = mock(() => {});
      const { getByText, user } = setUp(
        <FieldButton readOnly values={["value1"]} onValuesChange={handleValuesChange} />,
      );
      const clearButton = getByText("Clear");

      expect(clearButton).toHaveAttribute("hidden");

      await user.click(clearButton);
      expect(handleValuesChange).not.toHaveBeenCalled();
    });

    it("should not have active state when clear button is pressed", () => {
      const { getByRole } = setUp(<FieldButton />);
      const button = getByRole("button", { name: "Click me" });
      const clearButton = getByRole("button", { name: "Clear" });

      fireEvent.pointerDown(clearButton);
      expect(button).not.toHaveAttribute("data-active");

      fireEvent.pointerUp(clearButton);
      expect(button).not.toHaveAttribute("data-active");
    });
  });
});
