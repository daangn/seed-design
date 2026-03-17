import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import type { ReactElement } from "react";

import { Field } from "@seed-design/react-field";
import { FileUploadRoot, FileUploadHiddenInput } from "./FileUpload";

function setUp(jsx: ReactElement) {
  return render(jsx);
}

describe("FileUpload", () => {
  describe("props merging", () => {
    describe("FileUploadHiddenInput", () => {
      it("should merge props from FileUploadRoot", () => {
        const { getByTestId } = setUp(
          <FileUploadRoot name="attachment">
            <FileUploadHiddenInput data-testid="hidden-input" />
          </FileUploadRoot>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("name")).toBe("attachment");
        expect(input.getAttribute("type")).toBe("file");
      });

      it("should merge props from Field context", () => {
        const { getByTestId } = setUp(
          <Field.Root required invalid disabled name="field-attachment">
            <FileUploadRoot>
              <FileUploadHiddenInput data-testid="hidden-input" />
            </FileUploadRoot>
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
            <FileUploadRoot>
              <FileUploadHiddenInput name="direct-name" data-testid="hidden-input" />
            </FileUploadRoot>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("name")).toBe("direct-name");
      });

      it("should get id from Field context", () => {
        const { getByTestId } = setUp(
          <Field.Root>
            <FileUploadRoot>
              <FileUploadHiddenInput data-testid="hidden-input" />
            </FileUploadRoot>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("id")).toBeTruthy();
        expect(input.getAttribute("id")).toContain("field:");
      });

      it("should have no id without Field context", () => {
        const { getByTestId } = setUp(
          <FileUploadRoot>
            <FileUploadHiddenInput data-testid="hidden-input" />
          </FileUploadRoot>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("id")).toBeNull();
      });

      it("should connect aria-describedby when Field has Description", () => {
        const { getByTestId } = setUp(
          <Field.Root>
            <FileUploadRoot>
              <FileUploadHiddenInput data-testid="hidden-input" />
            </FileUploadRoot>
            <Field.Description>Upload your files</Field.Description>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("aria-describedby")).toBeTruthy();
      });

      it("should connect aria-describedby when Field has ErrorMessage", () => {
        const { getByTestId } = setUp(
          <Field.Root invalid>
            <FileUploadRoot>
              <FileUploadHiddenInput data-testid="hidden-input" />
            </FileUploadRoot>
            <Field.ErrorMessage>File too large</Field.ErrorMessage>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("aria-describedby")).toBeTruthy();
      });
    });

    describe("Complex prop merging scenarios", () => {
      it("should handle nested Field and FileUpload contexts", () => {
        const { getByTestId } = setUp(
          <Field.Root required name="attachment" invalid>
            <Field.Label>Attachment</Field.Label>
            <FileUploadRoot>
              <FileUploadHiddenInput data-testid="hidden-input" />
            </FileUploadRoot>
            <Field.Description>Max 10MB</Field.Description>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input.getAttribute("name")).toBe("attachment");
        expect(input.getAttribute("aria-required")).toBe("true");
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(input.getAttribute("aria-describedby")).toBeTruthy();
      });

      it("should let Field disabled override FileUpload enabled", () => {
        const { getByTestId } = setUp(
          <Field.Root disabled>
            <FileUploadRoot>
              <FileUploadHiddenInput data-testid="hidden-input" />
            </FileUploadRoot>
          </Field.Root>,
        );

        const input = getByTestId("hidden-input") as HTMLInputElement;
        expect(input).toBeDisabled();
      });
    });
  });
});
