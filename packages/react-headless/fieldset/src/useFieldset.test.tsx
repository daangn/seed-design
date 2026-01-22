import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { forwardRef, type ReactElement, type ReactNode } from "react";

import {
  FieldsetDescription,
  FieldsetErrorMessage,
  FieldsetLabel,
  FieldsetRoot,
  type FieldsetRootProps,
} from "./Fieldset";
import { getDescriptionId, getErrorMessageId, getLabelId } from "./dom";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

interface TestFieldsetProps extends FieldsetRootProps {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
}

const Fieldset = forwardRef<HTMLDivElement, TestFieldsetProps>(
  ({ label, description, errorMessage, ...rootProps }, ref) => {
    return (
      <FieldsetRoot data-testid="fieldset-root" {...rootProps} ref={ref}>
        {label && <FieldsetLabel data-testid="fieldset-label">{label}</FieldsetLabel>}
        <div data-testid="fieldset-content">Content</div>
        {description && (
          <FieldsetDescription data-testid="fieldset-description">
            {description}
          </FieldsetDescription>
        )}
        {errorMessage && (
          <FieldsetErrorMessage data-testid="fieldset-error-message">
            {errorMessage}
          </FieldsetErrorMessage>
        )}
      </FieldsetRoot>
    );
  },
);
Fieldset.displayName = "Fieldset";

describe("Fieldset components", () => {
  describe("basic rendering", () => {
    it("should render without crashing", () => {
      const { getByTestId } = setUp(<Fieldset />);
      expect(getByTestId("fieldset-root")).toBeInTheDocument();
    });

    it("should render label, description, and error message", () => {
      const { getByTestId } = setUp(
        <Fieldset label="Label" description="Description" errorMessage="Error" />,
      );

      expect(getByTestId("fieldset-label")).toHaveTextContent("Label");
      expect(getByTestId("fieldset-description")).toHaveTextContent("Description");
      expect(getByTestId("fieldset-error-message")).toHaveTextContent("Error");
    });
  });

  describe("ID generation", () => {
    it("should generate unique id for label", () => {
      const { getByTestId } = setUp(<Fieldset label="Label" />);

      const label = getByTestId("fieldset-label");
      expect(label.id).toMatch(/^fieldset:.+:label$/);
    });
  });

  describe("aria attributes", () => {
    it("should have role=group on root", () => {
      const { getByTestId } = setUp(<Fieldset />);

      const root = getByTestId("fieldset-root");
      expect(root).toHaveAttribute("role", "group");
    });

    it("should set aria-labelledby when label is rendered", () => {
      const { getByTestId } = setUp(<Fieldset label="Label" />);

      const root = getByTestId("fieldset-root");
      const label = getByTestId("fieldset-label");

      expect(root).toHaveAttribute("aria-labelledby", label.id);
    });

    it("should not set aria-labelledby when label is not rendered", () => {
      const { getByTestId } = setUp(<Fieldset />);

      const root = getByTestId("fieldset-root");
      expect(root).not.toHaveAttribute("aria-labelledby");
    });

    it("should set aria-describedby with description id when description is rendered", () => {
      const { getByTestId } = setUp(<Fieldset description="Description" />);

      const root = getByTestId("fieldset-root");
      const description = getByTestId("fieldset-description");

      expect(root).toHaveAttribute("aria-describedby", description.id);
    });

    it("should set aria-describedby with error message id when error is rendered", () => {
      const { getByTestId } = setUp(<Fieldset errorMessage="Error" />);

      const root = getByTestId("fieldset-root");
      const errorMessage = getByTestId("fieldset-error-message");

      expect(root).toHaveAttribute("aria-describedby", errorMessage.id);
    });

    it("should combine description and error in aria-describedby", () => {
      const { getByTestId } = setUp(<Fieldset description="Description" errorMessage="Error" />);

      const root = getByTestId("fieldset-root");
      const description = getByTestId("fieldset-description");
      const errorMessage = getByTestId("fieldset-error-message");

      expect(root).toHaveAttribute("aria-describedby", `${description.id} ${errorMessage.id}`);
    });

    it("should not set aria-describedby when neither description nor error is rendered", () => {
      const { getByTestId } = setUp(<Fieldset label="Label" />);

      const root = getByTestId("fieldset-root");
      expect(root).not.toHaveAttribute("aria-describedby");
    });

    it("should set aria-live on error message", () => {
      const { getByTestId } = setUp(<Fieldset errorMessage="Error" />);

      const errorMessage = getByTestId("fieldset-error-message");
      expect(errorMessage).toHaveAttribute("aria-live", "polite");
    });
  });
});

describe("dom utilities", () => {
  it("getLabelId should return correct format", () => {
    expect(getLabelId("test")).toBe("fieldset:test:label");
  });

  it("getDescriptionId should return correct format", () => {
    expect(getDescriptionId("test")).toBe("fieldset:test:description");
  });

  it("getErrorMessageId should return correct format", () => {
    expect(getErrorMessageId("test")).toBe("fieldset:test:error-message");
  });
});
