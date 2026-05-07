import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import type { ReactElement } from "react";

import { Field } from "@seed-design/react-field";
import { AttachmentInputRoot, AttachmentInputHiddenInput } from "./AttachmentInput";

function setUp(jsx: ReactElement) {
  return render(jsx);
}

describe("AttachmentInput", () => {
  describe("props merging", () => {
    describe("AttachmentInputHiddenInput", () => {
      it("should merge props from AttachmentInputRoot", () => {
        const { getByTestId } = setUp(
          <AttachmentInputRoot name="attachment">
            <AttachmentInputHiddenInput data-testid="hidden-input" />
          </AttachmentInputRoot>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("name")).toBe("attachment");
        expect(input.getAttribute("type")).toBe("file");
      });

      it("should merge props from Field context", () => {
        const { getByTestId } = setUp(
          <Field.Root required invalid disabled name="field-attachment">
            <AttachmentInputRoot>
              <AttachmentInputHiddenInput data-testid="hidden-input" />
            </AttachmentInputRoot>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("name")).toBe("field-attachment");
        expect(input.getAttribute("aria-required")).toBe("true");
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(input).toBeDisabled();
      });

      it("should prioritize direct props over context props", () => {
        const { getByTestId } = setUp(
          <Field.Root name="field-name">
            <AttachmentInputRoot>
              <AttachmentInputHiddenInput name="direct-name" data-testid="hidden-input" />
            </AttachmentInputRoot>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("name")).toBe("direct-name");
      });

      it("should get id from Field context", () => {
        const { getByTestId } = setUp(
          <Field.Root>
            <AttachmentInputRoot>
              <AttachmentInputHiddenInput data-testid="hidden-input" />
            </AttachmentInputRoot>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("id")).toBeTruthy();
        expect(input.getAttribute("id")).toContain("field:");
      });

      it("should have no id without Field context", () => {
        const { getByTestId } = setUp(
          <AttachmentInputRoot>
            <AttachmentInputHiddenInput data-testid="hidden-input" />
          </AttachmentInputRoot>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("id")).toBeNull();
      });

      it("should connect aria-describedby when Field has Description", () => {
        const { getByTestId } = setUp(
          <Field.Root>
            <AttachmentInputRoot>
              <AttachmentInputHiddenInput data-testid="hidden-input" />
            </AttachmentInputRoot>
            <Field.Description>Upload your files</Field.Description>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("aria-describedby")).toBeTruthy();
      });

      it("should connect aria-describedby when Field has ErrorMessage", () => {
        const { getByTestId } = setUp(
          <Field.Root invalid>
            <AttachmentInputRoot>
              <AttachmentInputHiddenInput data-testid="hidden-input" />
            </AttachmentInputRoot>
            <Field.ErrorMessage>File too large</Field.ErrorMessage>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("aria-describedby")).toBeTruthy();
      });
    });

    describe("Complex prop merging scenarios", () => {
      it("should handle nested Field and AttachmentInput contexts", () => {
        const { getByTestId } = setUp(
          <Field.Root required name="attachment" invalid>
            <Field.Label>Attachment</Field.Label>
            <AttachmentInputRoot>
              <AttachmentInputHiddenInput data-testid="hidden-input" />
            </AttachmentInputRoot>
            <Field.Description>Max 10MB</Field.Description>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("name")).toBe("attachment");
        expect(input.getAttribute("aria-required")).toBe("true");
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(input.getAttribute("aria-describedby")).toBeTruthy();
      });

      it("should let Field disabled override AttachmentInput enabled", () => {
        const { getByTestId } = setUp(
          <Field.Root disabled>
            <AttachmentInputRoot>
              <AttachmentInputHiddenInput data-testid="hidden-input" />
            </AttachmentInputRoot>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input).toBeDisabled();
      });
    });
  });
});
