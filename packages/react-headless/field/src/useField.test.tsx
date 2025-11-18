import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

import {
  FieldDescription,
  FieldErrorMessage,
  FieldLabel,
  FieldRoot,
  type FieldRootProps,
} from "./Field";
import { useFieldContext } from "./useFieldContext";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const FieldInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {
    const { inputProps, inputAriaAttributes, inputHandlers, stateProps } = useFieldContext();

    return (
      <input
        ref={ref}
        data-testid="field-input"
        {...inputProps}
        {...inputAriaAttributes}
        {...inputHandlers}
        {...stateProps}
        {...props}
      />
    );
  },
);
FieldInput.displayName = "FieldInput";

const _FieldTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => {
    const { inputProps, inputAriaAttributes, inputHandlers, stateProps } = useFieldContext();

    return (
      <textarea
        ref={ref}
        data-testid="field-textarea"
        {...inputProps}
        {...inputAriaAttributes}
        {...inputHandlers}
        {...stateProps}
        {...props}
      />
    );
  },
);
_FieldTextarea.displayName = "FieldTextarea";

interface TestFieldProps extends FieldRootProps {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
}

const Field = forwardRef<HTMLDivElement, TestFieldProps>(
  ({ label, description, errorMessage, children, ...rootProps }, ref) => {
    return (
      <FieldRoot data-testid="field-root" {...rootProps} ref={ref}>
        {label && <FieldLabel data-testid="field-label">{label}</FieldLabel>}
        {children}
        {description && (
          <FieldDescription data-testid="field-description">{description}</FieldDescription>
        )}
        {errorMessage && (
          <FieldErrorMessage data-testid="field-error-message">{errorMessage}</FieldErrorMessage>
        )}
      </FieldRoot>
    );
  },
);
Field.displayName = "Field";

describe("Field components", () => {
  global.CSS = {
    // @ts-expect-error
    supports: (_k, _v) => true,
  };

  describe("basic functionality", () => {
    it("should render as a label element", () => {
      const { getByTestId } = setUp(
        <Field label="Test Label">
          <FieldInput />
        </Field>,
      );

      const label = getByTestId("field-label");

      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe("LABEL");
    });

    it("should render as a span element", () => {
      const { getByTestId } = setUp(
        <Field description="Test Description">
          <FieldInput />
        </Field>,
      );

      const description = getByTestId("field-description");

      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe("SPAN");
    });

    it("should render as a div element", () => {
      const { getByTestId } = setUp(
        <Field errorMessage="Test Error">
          <FieldInput />
        </Field>,
      );

      const errorMessage = getByTestId("field-error-message");

      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.tagName).toBe("DIV");
    });
  });

  describe("props and aria attributes", () => {
    it("should set aria-invalid on input when invalid", () => {
      const { getByTestId } = setUp(
        <Field invalid>
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input");

      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should set aria-required on input when required", () => {
      const { getByTestId } = setUp(
        <Field required>
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input");

      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("should **not** set required on input even when required", () => {
      const { getByTestId } = setUp(
        <Field required>
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input");

      // this is intentional
      expect(input).not.toHaveAttribute("required");
    });

    it("should have htmlFor attribute pointing to input", () => {
      const { getByTestId } = setUp(
        <Field label="Test Label">
          <FieldInput />
        </Field>,
      );
      const label = getByTestId("field-label");
      const input = getByTestId("field-input");

      expect(label).toHaveAttribute("for");
      expect(input).toHaveAttribute("id");
      expect(label.getAttribute("for")).toBe(input.getAttribute("id"));
    });

    it("should connect label to input with aria-labelledby", () => {
      const { getByTestId } = setUp(
        <Field label="Username">
          <FieldInput />
        </Field>,
      );
      const label = getByTestId("field-label");
      const input = getByTestId("field-input");

      expect(label).toHaveAttribute("id");
      expect(input).toHaveAttribute("aria-labelledby", label.getAttribute("id"));
    });

    it("should have correct id for aria-describedby", () => {
      const { getByTestId } = setUp(
        <Field description="Test Description">
          <FieldInput />
        </Field>,
      );
      const description = getByTestId("field-description");
      const input = getByTestId("field-input");

      expect(description).toHaveAttribute("id");
      expect(input).toHaveAttribute("aria-describedby");
      expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(
        description.getAttribute("id"),
      );
    });

    it("should have correct id for aria-describedby", () => {
      const { getByTestId } = setUp(
        <Field errorMessage="Test Error">
          <FieldInput />
        </Field>,
      );

      const errorMessage = getByTestId("field-error-message");
      const input = getByTestId("field-input");

      expect(errorMessage).toHaveAttribute("id");
      expect(input).toHaveAttribute("aria-describedby");
      expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(
        errorMessage.getAttribute("id"),
      );
    });

    it("should combine description and error in aria-describedby", () => {
      const { getByTestId } = setUp(
        <Field description="Enter your username" errorMessage="Username is required">
          <FieldInput />
        </Field>,
      );
      const description = getByTestId("field-description");
      const errorMessage = getByTestId("field-error-message");
      const input = getByTestId("field-input");

      const ariaDescribedBy = input.getAttribute("aria-describedby");
      expect(ariaDescribedBy?.split(" ")).toContain(description.getAttribute("id"));
      expect(ariaDescribedBy?.split(" ")).toContain(errorMessage.getAttribute("id"));
    });

    it("should apply aria attributes only to input element", () => {
      const { getByTestId } = setUp(
        <Field
          required
          invalid
          label="Username"
          description="Enter username"
          errorMessage="Invalid username"
        >
          <FieldInput />
        </Field>,
      );

      const root = getByTestId("field-root");
      const input = getByTestId("field-input");
      const label = getByTestId("field-label");
      const description = getByTestId("field-description");
      const errorMessage = getByTestId("field-error-message");

      expect(input).toHaveAttribute("aria-required", "true");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby");
      expect(input).toHaveAttribute("aria-labelledby");

      [root, label, description, errorMessage].forEach((element) => {
        expect(element).not.toHaveAttribute("aria-required");
        expect(element).not.toHaveAttribute("aria-invalid");
        expect(element).not.toHaveAttribute("aria-describedby");
        expect(element).not.toHaveAttribute("aria-labelledby");
      });
    });
  });

  describe("data attributes", () => {
    it("should have data-disabled when disabled", () => {
      const { getByTestId } = setUp(
        <Field disabled label="Label" description="Desc" errorMessage="Error">
          <FieldInput />
        </Field>,
      );

      const root = getByTestId("field-root");
      const input = getByTestId("field-input");
      const label = getByTestId("field-label");
      const description = getByTestId("field-description");
      const errorMessage = getByTestId("field-error-message");

      [root, input, label, description, errorMessage].forEach((element) => {
        expect(element).toHaveAttribute("data-disabled", "");
      });
    });

    it("should have data-readonly when readOnly", () => {
      const { getByTestId } = setUp(
        <Field readOnly label="Label" description="Desc" errorMessage="Error">
          <FieldInput />
        </Field>,
      );

      const root = getByTestId("field-root");
      const input = getByTestId("field-input");
      const label = getByTestId("field-label");
      const description = getByTestId("field-description");
      const errorMessage = getByTestId("field-error-message");

      [root, input, label, description, errorMessage].forEach((element) => {
        expect(element).toHaveAttribute("data-readonly", "");
      });
    });

    it("should have data-invalid when invalid", () => {
      const { getByTestId } = setUp(
        <Field invalid label="Label" description="Desc" errorMessage="Error">
          <FieldInput />
        </Field>,
      );

      const root = getByTestId("field-root");
      const input = getByTestId("field-input");
      const label = getByTestId("field-label");
      const description = getByTestId("field-description");
      const errorMessage = getByTestId("field-error-message");

      [root, input, label, description, errorMessage].forEach((element) => {
        expect(element).toHaveAttribute("data-invalid", "");
      });
    });

    it("should have data-hover on hover", async () => {
      const { getByTestId, user } = setUp(
        <Field label="Label" description="Desc" errorMessage="Error">
          <FieldInput />
        </Field>,
      );

      const root = getByTestId("field-root");
      const input = getByTestId("field-input");
      const label = getByTestId("field-label");
      const description = getByTestId("field-description");
      const errorMessage = getByTestId("field-error-message");

      [root, input, label, description, errorMessage].forEach((element) => {
        expect(element).not.toHaveAttribute("data-hover");
      });

      await user.hover(input);
      [root, input, label, description, errorMessage].forEach((element) => {
        expect(element).toHaveAttribute("data-hover", "");
      });

      await user.unhover(input);
      [root, input, label, description, errorMessage].forEach((element) => {
        expect(element).not.toHaveAttribute("data-hover");
      });
    });

    it("should have data-active on pointer down", () => {
      const { getByTestId } = setUp(
        <Field label="Label" description="Desc" errorMessage="Error">
          <FieldInput />
        </Field>,
      );

      const root = getByTestId("field-root");
      const input = getByTestId("field-input");
      const label = getByTestId("field-label");
      const description = getByTestId("field-description");
      const errorMessage = getByTestId("field-error-message");

      [root, input, label, description, errorMessage].forEach((element) => {
        expect(element).not.toHaveAttribute("data-active");
      });

      fireEvent.pointerDown(input);
      [root, input, label, description, errorMessage].forEach((element) => {
        expect(element).toHaveAttribute("data-active", "");
      });

      fireEvent.pointerUp(input);
      [root, input, label, description, errorMessage].forEach((element) => {
        expect(element).not.toHaveAttribute("data-active");
      });
    });

    it("should remove data-active and data-hover on pointer leave", async () => {
      const { getByTestId, user } = setUp(
        <Field label="Label" description="Desc" errorMessage="Error">
          <FieldInput />
        </Field>,
      );

      const root = getByTestId("field-root");
      const input = getByTestId("field-input");
      const label = getByTestId("field-label");
      const description = getByTestId("field-description");
      const errorMessage = getByTestId("field-error-message");
      const allElements = [root, input, label, description, errorMessage];

      allElements.forEach((element) => {
        expect(element).not.toHaveAttribute("data-hover");
        expect(element).not.toHaveAttribute("data-active");
      });

      await user.hover(input);
      fireEvent.pointerDown(input);
      allElements.forEach((element) => {
        expect(element).toHaveAttribute("data-hover", "");
        expect(element).toHaveAttribute("data-active", "");
      });

      fireEvent.pointerLeave(input);
      allElements.forEach((element) => {
        expect(element).not.toHaveAttribute("data-hover");
        expect(element).not.toHaveAttribute("data-active");
      });
    });

    it("should have data-focus when input is focused", async () => {
      const { getByTestId, user } = setUp(
        <Field label="Label" description="Desc" errorMessage="Error">
          <FieldInput />
        </Field>,
      );

      const root = getByTestId("field-root");
      const input = getByTestId("field-input");
      const label = getByTestId("field-label");
      const description = getByTestId("field-description");
      const errorMessage = getByTestId("field-error-message");
      const allElements = [root, input, label, description, errorMessage];

      allElements.forEach((element) => {
        expect(element).not.toHaveAttribute("data-focus");
      });

      await user.click(input);
      allElements.forEach((element) => {
        expect(element).toHaveAttribute("data-focus", "");
      });

      await user.tab();
      allElements.forEach((element) => {
        expect(element).not.toHaveAttribute("data-focus");
      });
    });
  });

  describe("disabled state", () => {
    it("should propagate disabled prop to input", () => {
      const { getByTestId } = setUp(
        <Field disabled>
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input");

      expect(input).toBeDisabled();
      expect(input).toHaveAttribute("disabled");
    });

    it("should not allow typing when disabled", async () => {
      const { getByTestId, user } = setUp(
        <Field disabled>
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input") as HTMLInputElement;

      await user.type(input, "test");
      expect(input.value).toBe("");
    });

    it("should still trigger hover state when disabled", async () => {
      const { getByTestId, user } = setUp(
        <Field disabled>
          <FieldInput />
        </Field>,
      );
      const root = getByTestId("field-root");
      const input = getByTestId("field-input");

      expect(root).not.toHaveAttribute("data-hover");
      expect(input).not.toHaveAttribute("data-hover");

      await user.hover(input);
      expect(root).toHaveAttribute("data-hover", "");
      expect(input).toHaveAttribute("data-hover", "");
    });
  });

  describe("readOnly state", () => {
    it("should propagate readOnly prop to input", () => {
      const { getByTestId } = setUp(
        <Field readOnly>
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input");

      expect(input).toHaveAttribute("readonly");
    });

    it("should not allow typing when readOnly", async () => {
      const { getByTestId, user } = setUp(
        <Field readOnly>
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input") as HTMLInputElement;

      await user.type(input, "test");
      expect(input.value).toBe("");
    });

    it("should allow focus when readOnly", async () => {
      const { getByTestId, user } = setUp(
        <Field readOnly>
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input");

      await user.click(input);
      expect(input).toHaveFocus();
    });
  });

  describe("name prop", () => {
    it("should use provided name", () => {
      const { getByTestId } = setUp(
        <Field name="custom-name">
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input");

      expect(input).toHaveAttribute("name", "custom-name");
    });

    it("should generate unique name when not provided", () => {
      const { getAllByTestId } = setUp(
        <>
          <Field>
            <FieldInput />
          </Field>
          <Field>
            <FieldInput />
          </Field>
        </>,
      );
      const inputs = getAllByTestId("field-input");

      expect(inputs[0]).toHaveAttribute("name");
      expect(inputs[1]).toHaveAttribute("name");
      expect(inputs[0].getAttribute("name")).not.toBe(inputs[1].getAttribute("name"));
    });
  });

  describe("focus management", () => {
    it("should handle focus-visible state", async () => {
      const { getByTestId, user } = setUp(
        <Field>
          <FieldInput />
        </Field>,
      );
      const root = getByTestId("field-root");
      const input = getByTestId("field-input");

      await user.tab();
      expect(input).toHaveFocus();
      expect(root).toHaveAttribute("data-focus", "");
      expect(root).toHaveAttribute("data-focus-visible", "");
      expect(input).toHaveAttribute("data-focus", "");
      expect(input).toHaveAttribute("data-focus-visible", "");

      await user.tab();
      expect(root).not.toHaveAttribute("data-focus-visible");
      expect(input).not.toHaveAttribute("data-focus-visible");
    });

    it("should update focus-visible correctly on change event", async () => {
      const { getByTestId, user } = setUp(
        <Field>
          <FieldInput />
        </Field>,
      );
      const input = getByTestId("field-input");
      const root = getByTestId("field-root");

      expect(root).not.toHaveAttribute("data-focus-visible");
      expect(input).not.toHaveAttribute("data-focus-visible");

      await user.tab();
      expect(input).toHaveFocus();
      expect(root).toHaveAttribute("data-focus-visible", "");
      expect(input).toHaveAttribute("data-focus-visible", "");

      await user.type(input, "a");
      expect(root).toHaveAttribute("data-focus-visible", "");
      expect(input).toHaveAttribute("data-focus-visible", "");
    });

    it("should clear focus states on blur", async () => {
      const { getByTestId, user } = setUp(
        <Field>
          <FieldInput />
        </Field>,
      );
      const root = getByTestId("field-root");
      const input = getByTestId("field-input");

      expect(root).not.toHaveAttribute("data-focus");
      expect(root).not.toHaveAttribute("data-focus-visible");
      expect(input).not.toHaveAttribute("data-focus");
      expect(input).not.toHaveAttribute("data-focus-visible");

      await user.tab();
      expect(input).toHaveFocus();
      expect(root).toHaveAttribute("data-focus", "");
      expect(root).toHaveAttribute("data-focus-visible", "");
      expect(input).toHaveAttribute("data-focus", "");
      expect(input).toHaveAttribute("data-focus-visible", "");

      await user.tab();
      expect(input).not.toHaveFocus();
      expect(root).not.toHaveAttribute("data-focus");
      expect(root).not.toHaveAttribute("data-focus-visible");
      expect(input).not.toHaveAttribute("data-focus");
      expect(input).not.toHaveAttribute("data-focus-visible");
    });
  });
});
