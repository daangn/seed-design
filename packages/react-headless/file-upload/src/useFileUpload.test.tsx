import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";

import type { ReactElement } from "react";
import * as React from "react";

import {
  FileUploadRoot,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadHiddenInput,
  FileUploadItem,
  FileUploadItemName,
  FileUploadItemSizeText,
  FileUploadItemDeleteTrigger,
  FileUploadClearTrigger,
  FileUploadContext,
  type FileUploadRootProps,
} from "./FileUpload";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function createMockFile(name: string, size: number, type: string): File {
  const content = new Array(size).fill("a").join("");

  return new File([content], name, { type });
}

const BasicFileUpload = React.forwardRef<HTMLInputElement, FileUploadRootProps>((props, ref) => {
  return (
    <FileUploadRoot {...props}>
      <FileUploadTrigger>Choose files</FileUploadTrigger>
      <FileUploadDropzone data-testid="dropzone">
        <span>Drop files here</span>
      </FileUploadDropzone>
      <ul data-testid="item-group">
        <FileUploadContext>
          {({ acceptedFiles }) =>
            acceptedFiles.map(({ file }) => (
              <FileUploadItem key={file.name} file={file} data-testid={`item-${file.name}`}>
                <FileUploadItemName />
                <FileUploadItemSizeText formatBytes={(bytes) => `${bytes} bytes`} />
                <FileUploadItemDeleteTrigger data-testid={`delete-${file.name}`}>
                  Delete
                </FileUploadItemDeleteTrigger>
              </FileUploadItem>
            ))
          }
        </FileUploadContext>
      </ul>
      <FileUploadClearTrigger data-testid="clear-trigger">Clear all</FileUploadClearTrigger>
      <FileUploadHiddenInput ref={ref} data-testid="hidden-input" />
    </FileUploadRoot>
  );
});

describe("useFileUpload", () => {
  describe("basic rendering", () => {
    it("should render the file upload correctly", () => {
      const { getByText, getByTestId } = setUp(<BasicFileUpload />);

      expect(getByText("Choose files")).toBeDefined();
      expect(getByTestId("dropzone")).toBeDefined();
      expect(getByTestId("hidden-input")).toBeDefined();
    });

    it("should have hidden input with correct attributes", () => {
      const { getByTestId } = setUp(<BasicFileUpload name="files" />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.type).toBe("file");
      expect(input.name).toBe("files");
      expect(input.tabIndex).toBe(-1);
    });

    it("should render with multiple attribute when maxFiles > 1", () => {
      const { getByTestId } = setUp(<BasicFileUpload maxFiles={5} />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.multiple).toBe(true);
    });

    it("should render with accept attribute", () => {
      const { getByTestId } = setUp(<BasicFileUpload accept="image/*" />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.accept).toBe("image/*");
    });

    it("should render with accept array attribute", () => {
      const { getByTestId } = setUp(<BasicFileUpload accept={["image/*", ".pdf"]} />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.accept).toBe("image/*,.pdf");
    });
  });

  describe("file selection via trigger", () => {
    it("should open file picker when trigger is clicked", async () => {
      const { getByText, getByTestId, user } = setUp(<BasicFileUpload />);
      const trigger = getByText("Choose files");
      const input = getByTestId("hidden-input") as HTMLInputElement;

      const clickSpy = mock(() => {});
      input.click = clickSpy;

      await user.click(trigger);

      expect(clickSpy).toHaveBeenCalled();
    });

    it("should not open file picker when disabled", async () => {
      const { getByText, getByTestId, user } = setUp(<BasicFileUpload disabled />);
      const trigger = getByText("Choose files");
      const input = getByTestId("hidden-input") as HTMLInputElement;

      const clickSpy = mock(() => {});
      input.click = clickSpy;

      await user.click(trigger);

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe("file change handling", () => {
    it("should accept files via input change", async () => {
      const onFileAccept = mock(() => {});
      const { getByTestId } = setUp(<BasicFileUpload onFileAccept={onFileAccept} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("test.txt", 1024, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onFileAccept).toHaveBeenCalledWith({ files: [file] });
      });
    });

    it("should display accepted files", async () => {
      const { getByTestId, getByText } = setUp(<BasicFileUpload />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("test.txt", 1024, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(getByText("test.txt")).toBeDefined();
      });
    });

    it("should display file size", async () => {
      const { getByTestId, getByText } = setUp(<BasicFileUpload />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("test.txt", 1024, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(getByText("1024 bytes")).toBeDefined();
      });
    });

    it("should call onFileChange callback", async () => {
      const onFileChange = mock(() => {});
      const { getByTestId } = setUp(<BasicFileUpload onFileChange={onFileChange} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("test.txt", 1024, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onFileChange).toHaveBeenCalledWith({
          acceptedFiles: [file],
          rejectedFiles: [],
        });
      });
    });
  });

  describe("file deletion", () => {
    it("should delete file when delete trigger is clicked", async () => {
      const { getByTestId, queryByTestId, user } = setUp(<BasicFileUpload />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("test.txt", 1024, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(getByTestId("item-test.txt")).toBeDefined();
      });

      const deleteButton = getByTestId("delete-test.txt");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(queryByTestId("item-test.txt")).toBeNull();
      });
    });

    it("should clear all files when clear trigger is clicked", async () => {
      const { getByTestId, queryByTestId, user } = setUp(<BasicFileUpload maxFiles={5} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("test1.txt", 1024, "text/plain");
      const file2 = createMockFile("test2.txt", 2048, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(getByTestId("item-test1.txt")).toBeDefined();
        expect(getByTestId("item-test2.txt")).toBeDefined();
      });

      const clearButton = getByTestId("clear-trigger");
      await user.click(clearButton);

      await waitFor(() => {
        expect(queryByTestId("item-test1.txt")).toBeNull();
        expect(queryByTestId("item-test2.txt")).toBeNull();
      });
    });
  });

  describe("disabled state", () => {
    it("should have data-disabled attribute when disabled", () => {
      const { getByTestId } = setUp(<BasicFileUpload disabled />);

      const dropzone = getByTestId("dropzone");
      expect(dropzone.getAttribute("data-disabled")).toBe("");
    });

    it("should disable trigger when disabled", () => {
      const { getByText } = setUp(<BasicFileUpload disabled />);
      const trigger = getByText("Choose files") as HTMLButtonElement;

      expect(trigger.disabled).toBe(true);
    });

    it("should disable hidden input when disabled", () => {
      const { getByTestId } = setUp(<BasicFileUpload disabled />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.disabled).toBe(true);
    });
  });

  describe("controlled mode", () => {
    it("should work with controlled acceptedFiles", () => {
      const file = createMockFile("controlled.txt", 512, "text/plain");
      const filesWithStatus = [{ file, details: { status: "pending" as const } }];
      const { getByText } = setUp(<BasicFileUpload acceptedFiles={filesWithStatus} />);

      expect(getByText("controlled.txt")).toBeDefined();
    });

    it("should work with defaultAcceptedFiles", () => {
      const file = createMockFile("default.txt", 512, "text/plain");
      const filesWithStatus = [{ file, details: { status: "pending" as const } }];
      const { getByText } = setUp(<BasicFileUpload defaultAcceptedFiles={filesWithStatus} />);

      expect(getByText("default.txt")).toBeDefined();
    });
  });

  describe("validation", () => {
    it("should reject files exceeding maxFileSize", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload maxFileSize={1024} onFileReject={onFileReject} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const largeFile = createMockFile("large.txt", 2048, "text/plain");

      fireEvent.change(input, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalled();
      });
    });

    it("should reject files below minFileSize", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload minFileSize={1024} onFileReject={onFileReject} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const smallFile = createMockFile("small.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [smallFile] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalled();
      });
    });

    it("should reject files exceeding maxFiles limit", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(<BasicFileUpload maxFiles={1} onFileReject={onFileReject} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("file1.txt", 100, "text/plain");
      const file2 = createMockFile("file2.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalled();
      });
    });

    it("should reject files with invalid type", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload accept="image/*" onFileReject={onFileReject} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const textFile = createMockFile("document.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [textFile] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalled();
      });
    });

    it("should call custom validate function", async () => {
      const customValidate = mock((file) => {
        if (file.name.includes("invalid")) {
          return [{ code: "CUSTOM" as const, message: "Invalid filename" }];
        }
        return null;
      });

      const { getByTestId } = setUp(<BasicFileUpload validate={customValidate} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("invalid-file.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(customValidate).toHaveBeenCalledWith(file);
      });
    });
  });

  describe("drag and drop", () => {
    it("should set dragging state on dragover", async () => {
      const { getByTestId } = setUp(<BasicFileUpload />);
      const dropzone = getByTestId("dropzone");

      fireEvent.dragOver(dropzone);

      await waitFor(() => {
        expect(dropzone.getAttribute("data-dragging")).toBe("");
      });
    });

    it("should clear dragging state on dragleave", async () => {
      const { getByTestId } = setUp(<BasicFileUpload />);
      const dropzone = getByTestId("dropzone");

      fireEvent.dragOver(dropzone);
      fireEvent.dragLeave(dropzone);

      await waitFor(() => {
        expect(dropzone.getAttribute("data-dragging")).toBeNull();
      });
    });

    it("should accept dropped files", async () => {
      const onFileAccept = mock(() => {});
      const { getByTestId } = setUp(<BasicFileUpload onFileAccept={onFileAccept} />);
      const dropzone = getByTestId("dropzone");

      const file = createMockFile("dropped.txt", 1024, "text/plain");

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(onFileAccept).toHaveBeenCalledWith({ files: [file] });
      });
    });

    it("should not accept drop when allowDrop is false", async () => {
      const onFileAccept = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload allowDrop={false} onFileAccept={onFileAccept} />,
      );
      const dropzone = getByTestId("dropzone");

      const file = createMockFile("dropped.txt", 1024, "text/plain");

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(onFileAccept).not.toHaveBeenCalled();
      });
    });
  });

  describe("focus state", () => {
    it("should set focus state on input focus", async () => {
      const { getByTestId } = setUp(<BasicFileUpload />);
      const input = getByTestId("hidden-input");
      const dropzone = getByTestId("dropzone");

      fireEvent.focus(input);

      await waitFor(() => {
        expect(dropzone.getAttribute("data-focus")).toBe("");
      });
    });

    it("should clear focus state on input blur", async () => {
      const { getByTestId } = setUp(<BasicFileUpload />);
      const input = getByTestId("hidden-input");
      const dropzone = getByTestId("dropzone");

      fireEvent.focus(input);
      fireEvent.blur(input);

      await waitFor(() => {
        expect(dropzone.getAttribute("data-focus")).toBeNull();
      });
    });
  });

  describe("form integration", () => {
    it("should have required attribute when required", () => {
      const { getByTestId } = setUp(<BasicFileUpload required />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.required).toBe(true);
    });
  });

  describe("reorder files", () => {
    // Helper component that exposes reorderFiles for testing
    const ReorderTestComponent = () => {
      return (
        <FileUploadRoot maxFiles={5}>
          <FileUploadHiddenInput data-testid="hidden-input" />
          <FileUploadContext>
            {({ acceptedFiles, reorderFiles }) => (
              <>
                <ul data-testid="file-list">
                  {acceptedFiles.map(({ file }, index: number) => (
                    <li key={file.name} data-testid={`file-${index}`}>
                      {file.name}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-testid="reorder-0-to-2"
                  onClick={() => reorderFiles(0, 2)}
                >
                  Move first to third
                </button>
                <button
                  type="button"
                  data-testid="reorder-2-to-0"
                  onClick={() => reorderFiles(2, 0)}
                >
                  Move third to first
                </button>
                <button
                  type="button"
                  data-testid="reorder-invalid"
                  onClick={() => reorderFiles(-1, 10)}
                >
                  Invalid reorder
                </button>
              </>
            )}
          </FileUploadContext>
        </FileUploadRoot>
      );
    };

    it("should reorder files from index 0 to index 2", async () => {
      const { getByTestId, user } = setUp(<ReorderTestComponent />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("file1.txt", 100, "text/plain");
      const file2 = createMockFile("file2.txt", 200, "text/plain");
      const file3 = createMockFile("file3.txt", 300, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2, file3] } });

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toBe("file1.txt");
        expect(getByTestId("file-1").textContent).toBe("file2.txt");
        expect(getByTestId("file-2").textContent).toBe("file3.txt");
      });

      await user.click(getByTestId("reorder-0-to-2"));

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toBe("file2.txt");
        expect(getByTestId("file-1").textContent).toBe("file3.txt");
        expect(getByTestId("file-2").textContent).toBe("file1.txt");
      });
    });

    it("should reorder files from index 2 to index 0", async () => {
      const { getByTestId, user } = setUp(<ReorderTestComponent />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("file1.txt", 100, "text/plain");
      const file2 = createMockFile("file2.txt", 200, "text/plain");
      const file3 = createMockFile("file3.txt", 300, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2, file3] } });

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toBe("file1.txt");
      });

      await user.click(getByTestId("reorder-2-to-0"));

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toBe("file3.txt");
        expect(getByTestId("file-1").textContent).toBe("file1.txt");
        expect(getByTestId("file-2").textContent).toBe("file2.txt");
      });
    });

    it("should not change order with invalid indices", async () => {
      const { getByTestId, user } = setUp(<ReorderTestComponent />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("file1.txt", 100, "text/plain");
      const file2 = createMockFile("file2.txt", 200, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toBe("file1.txt");
        expect(getByTestId("file-1").textContent).toBe("file2.txt");
      });

      await user.click(getByTestId("reorder-invalid"));

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toBe("file1.txt");
        expect(getByTestId("file-1").textContent).toBe("file2.txt");
      });
    });

    it("should not reorder when disabled", async () => {
      const file1 = createMockFile("file1.txt", 100, "text/plain");
      const file2 = createMockFile("file2.txt", 200, "text/plain");
      const filesWithStatus = [
        { file: file1, details: { status: "pending" as const } },
        { file: file2, details: { status: "pending" as const } },
      ];

      const DisabledReorderComponent = () => {
        return (
          <FileUploadRoot maxFiles={5} disabled defaultAcceptedFiles={filesWithStatus}>
            <FileUploadContext>
              {({ acceptedFiles, reorderFiles }) => (
                <>
                  <ul data-testid="file-list">
                    {acceptedFiles.map(({ file }, index) => (
                      <li key={file.name} data-testid={`file-${index}`}>
                        {file.name}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    data-testid="reorder-btn"
                    onClick={() => reorderFiles(0, 1)}
                  >
                    Reorder
                  </button>
                </>
              )}
            </FileUploadContext>
          </FileUploadRoot>
        );
      };

      const { getByTestId, user } = setUp(<DisabledReorderComponent />);

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toBe("file1.txt");
        expect(getByTestId("file-1").textContent).toBe("file2.txt");
      });

      await user.click(getByTestId("reorder-btn"));

      // Should remain unchanged because disabled
      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toBe("file1.txt");
        expect(getByTestId("file-1").textContent).toBe("file2.txt");
      });
    });
  });
});
