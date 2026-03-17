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
  FileUploadItemName,
  FileUploadItemSize,
  FileUploadItemRemoveButton,
  FileUploadContext,
  type FileUploadRootProps,
} from "./FileUpload";
import { FileUploadItemProvider } from "./useFileUploadContext";

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
            acceptedFiles.map((fileWithStatus, index) => (
              <FileUploadItemProvider key={index} value={fileWithStatus}>
                <li data-testid={`item-${index}`}>
                  <FileUploadItemName />
                  <FileUploadItemSize formatBytes={(bytes) => `${bytes} bytes`} />
                  <FileUploadItemRemoveButton data-testid={`delete-${index}`}>
                    Delete
                  </FileUploadItemRemoveButton>
                </li>
              </FileUploadItemProvider>
            ))
          }
        </FileUploadContext>
      </ul>
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
      const onAcceptedFilesChange = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload onAcceptedFilesChange={onAcceptedFilesChange} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("test.txt", 1024, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file, details: { status: "pending" } },
        ]);
      });
    });

    it("should call onAcceptedFilesChange with cumulative files", async () => {
      const onAcceptedFilesChange = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload maxFiles={5} onAcceptedFilesChange={onAcceptedFilesChange} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("file1.txt", 100, "text/plain");
      const file2 = createMockFile("file2.txt", 200, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file: file1, details: { status: "pending" } },
          { file: file2, details: { status: "pending" } },
        ]);
      });

      const file3 = createMockFile("file3.txt", 300, "text/plain");

      fireEvent.change(input, { target: { files: [file3] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file: file1, details: { status: "pending" } },
          { file: file2, details: { status: "pending" } },
          { file: file3, details: { status: "pending" } },
        ]);
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
  });

  describe("file deletion", () => {
    it("should delete file when delete trigger is clicked", async () => {
      const { getByTestId, queryByTestId, user } = setUp(<BasicFileUpload />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("test.txt", 1024, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(getByTestId("item-0")).toBeDefined();
      });

      const deleteButton = getByTestId("delete-0");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(queryByTestId("item-0")).toBeNull();
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

    it("should disable trigger and input when maxFiles is reached", async () => {
      const { getByTestId, getByText } = setUp(<BasicFileUpload maxFiles={2} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("a.txt", 100, "text/plain");
      const file2 = createMockFile("b.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        const trigger = getByText("Choose files") as HTMLButtonElement;
        expect(trigger.disabled).toBe(true);
        expect(input.disabled).toBe(true);
      });
    });

    it("should have data-disabled on dropzone when maxFiles is reached", async () => {
      const { getByTestId } = setUp(<BasicFileUpload maxFiles={1} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("a.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const dropzone = getByTestId("dropzone");
        expect(dropzone.getAttribute("data-disabled")).toBe("");
      });
    });

    it("should re-enable trigger after removing a file when maxFiles was reached", async () => {
      const { getByTestId, getByText } = setUp(<BasicFileUpload maxFiles={1} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("a.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const trigger = getByText("Choose files") as HTMLButtonElement;
        expect(trigger.disabled).toBe(true);
      });

      const deleteButton = getByTestId("delete-0");
      await userEvent.click(deleteButton);

      await waitFor(() => {
        const trigger = getByText("Choose files") as HTMLButtonElement;
        expect(trigger.disabled).toBe(false);
      });
    });

    it("should not accept dropped files when maxFiles is reached", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(<BasicFileUpload maxFiles={1} onFileReject={onFileReject} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("a.txt", 100, "text/plain");
      fireEvent.change(input, { target: { files: [file1] } });

      await waitFor(() => {
        expect(getByTestId("item-0")).toBeDefined();
      });

      const dropzone = getByTestId("dropzone");
      const file2 = createMockFile("b.txt", 100, "text/plain");
      fireEvent.drop(dropzone, {
        dataTransfer: { files: [file2] },
      });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalledWith({
          files: [{ file: file2, errors: ["TOO_MANY_FILES"] }],
        });
      });
    });
  });

  describe("status change", () => {
    it("should call onAcceptedFilesChange when file status changes", async () => {
      const onAcceptedFilesChange = mock(() => {});

      const StatusChangeUpload = () => {
        return (
          <FileUploadRoot onAcceptedFilesChange={onAcceptedFilesChange}>
            <FileUploadHiddenInput data-testid="hidden-input" />
            <FileUploadContext>
              {({ acceptedFiles, updateFileStatus }) => (
                <>
                  <ul>
                    {acceptedFiles.map((fileWithStatus, index) => (
                      <FileUploadItemProvider
                        key={`${fileWithStatus.file.name}-${index}`}
                        value={fileWithStatus}
                      >
                        <li data-testid={`file-${index}`}>
                          <FileUploadItemName />
                        </li>
                      </FileUploadItemProvider>
                    ))}
                  </ul>
                  <button
                    type="button"
                    data-testid="start-upload"
                    onClick={() => {
                      for (const { file } of acceptedFiles) {
                        updateFileStatus(file, { status: "uploading", progress: 50 });
                      }
                    }}
                  >
                    Start Upload
                  </button>
                </>
              )}
            </FileUploadContext>
          </FileUploadRoot>
        );
      };

      const { getByTestId, user } = setUp(<StatusChangeUpload />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("test.txt", 1024, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file, details: { status: "pending" } },
        ]);
      });

      await user.click(getByTestId("start-upload"));

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file, details: { status: "uploading", progress: 50 } },
        ]);
      });
    });
  });

  describe("updateFileStatus", () => {
    it("should update a file's status", async () => {
      const onAcceptedFilesChange = mock(() => {});
      const UpdateStatusUpload = () => (
        <FileUploadRoot onAcceptedFilesChange={onAcceptedFilesChange}>
          <FileUploadHiddenInput data-testid="hidden-input" />
          <FileUploadContext>
            {({ acceptedFiles, updateFileStatus }) => (
              <>
                <ul>
                  {acceptedFiles.map((f, i) => (
                    <li key={i} data-testid={`file-${i}`}>
                      {f.file.name} - {f.details.status}
                      {"progress" in f.details && `-${f.details.progress}`}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-testid="update-status"
                  onClick={() => {
                    for (const { file } of acceptedFiles) {
                      updateFileStatus(file, { status: "uploading", progress: 50 });
                    }
                  }}
                >
                  Update
                </button>
              </>
            )}
          </FileUploadContext>
        </FileUploadRoot>
      );

      const { getByTestId } = setUp(<UpdateStatusUpload />);
      const input = getByTestId("hidden-input") as HTMLInputElement;
      fireEvent.change(input, {
        target: { files: [createMockFile("a.txt", 100, "text/plain")] },
      });

      await waitFor(() => expect(getByTestId("file-0")).toBeDefined());

      fireEvent.click(getByTestId("update-status"));

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toContain("uploading");
        expect(getByTestId("file-0").textContent).toContain("50");
      });
    });

    it("should only update the targeted file", async () => {
      const UpdateOneUpload = () => (
        <FileUploadRoot maxFiles={3}>
          <FileUploadHiddenInput data-testid="hidden-input" />
          <FileUploadContext>
            {({ acceptedFiles, updateFileStatus }) => (
              <>
                <ul>
                  {acceptedFiles.map((f, i) => (
                    <li key={i} data-testid={`file-${i}`}>
                      {f.file.name} - {f.details.status}
                    </li>
                  ))}
                </ul>
                {acceptedFiles.length > 0 && (
                  <button
                    type="button"
                    data-testid="update-first"
                    onClick={() => updateFileStatus(acceptedFiles[0].file, { status: "success" })}
                  >
                    Update First
                  </button>
                )}
              </>
            )}
          </FileUploadContext>
        </FileUploadRoot>
      );

      const { getByTestId } = setUp(<UpdateOneUpload />);
      const input = getByTestId("hidden-input") as HTMLInputElement;
      fireEvent.change(input, {
        target: {
          files: [
            createMockFile("a.txt", 100, "text/plain"),
            createMockFile("b.txt", 200, "text/plain"),
          ],
        },
      });

      await waitFor(() => expect(getByTestId("file-1")).toBeDefined());

      fireEvent.click(getByTestId("update-first"));

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toContain("success");
        expect(getByTestId("file-1").textContent).toContain("pending");
      });
    });
  });

  describe("removeFile", () => {
    it("should remove a specific file", async () => {
      const onAcceptedFilesChange = mock(() => {});
      const RemoveUpload = () => (
        <FileUploadRoot maxFiles={3} onAcceptedFilesChange={onAcceptedFilesChange}>
          <FileUploadHiddenInput data-testid="hidden-input" />
          <FileUploadContext>
            {({ acceptedFiles, removeFile }) => (
              <ul>
                {acceptedFiles.map((f, i) => (
                  <li key={i} data-testid={`file-${i}`}>
                    {f.file.name}
                    <button
                      type="button"
                      data-testid={`remove-${i}`}
                      onClick={() => removeFile(f.file)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </FileUploadContext>
        </FileUploadRoot>
      );

      const { getByTestId, queryByTestId } = setUp(<RemoveUpload />);
      const input = getByTestId("hidden-input") as HTMLInputElement;
      fireEvent.change(input, {
        target: {
          files: [
            createMockFile("a.txt", 100, "text/plain"),
            createMockFile("b.txt", 200, "text/plain"),
          ],
        },
      });

      await waitFor(() => expect(getByTestId("file-1")).toBeDefined());

      fireEvent.click(getByTestId("remove-0"));

      await waitFor(() => {
        expect(getByTestId("file-0").textContent).toContain("b.txt");
        expect(queryByTestId("file-1")).toBeNull();
      });
    });
  });

  describe("clearFiles", () => {
    it("should remove all files", async () => {
      const ClearUpload = () => (
        <FileUploadRoot maxFiles={3}>
          <FileUploadHiddenInput data-testid="hidden-input" />
          <FileUploadContext>
            {({ acceptedFiles, clearFiles }) => (
              <>
                <ul>
                  {acceptedFiles.map((f, i) => (
                    <li key={i} data-testid={`file-${i}`}>
                      {f.file.name}
                    </li>
                  ))}
                </ul>
                <button type="button" data-testid="clear" onClick={clearFiles}>
                  Clear
                </button>
              </>
            )}
          </FileUploadContext>
        </FileUploadRoot>
      );

      const { getByTestId, queryByTestId } = setUp(<ClearUpload />);
      const input = getByTestId("hidden-input") as HTMLInputElement;
      fireEvent.change(input, {
        target: {
          files: [
            createMockFile("a.txt", 100, "text/plain"),
            createMockFile("b.txt", 200, "text/plain"),
          ],
        },
      });

      await waitFor(() => expect(getByTestId("file-1")).toBeDefined());

      fireEvent.click(getByTestId("clear"));

      await waitFor(() => {
        expect(queryByTestId("file-0")).toBeNull();
      });
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

    it("should reflect external acceptedFiles changes on rerender", () => {
      const file1 = createMockFile("first.txt", 512, "text/plain");
      const file2 = createMockFile("second.txt", 512, "text/plain");

      const { getByText, queryByText, rerender } = setUp(
        <BasicFileUpload
          acceptedFiles={[{ file: file1, details: { status: "pending" as const } }]}
        />,
      );

      expect(getByText("first.txt")).toBeDefined();
      expect(queryByText("second.txt")).toBeNull();

      rerender(
        <BasicFileUpload
          acceptedFiles={[{ file: file2, details: { status: "pending" as const } }]}
        />,
      );

      expect(queryByText("first.txt")).toBeNull();
      expect(getByText("second.txt")).toBeDefined();
    });

    it("should call onAcceptedFilesChange when removing a file in controlled mode", async () => {
      const file = createMockFile("controlled.txt", 512, "text/plain");
      const filesWithStatus = [{ file, details: { status: "pending" as const } }];
      const onAcceptedFilesChange = mock(() => {});

      const { getByTestId } = setUp(
        <BasicFileUpload
          acceptedFiles={filesWithStatus}
          onAcceptedFilesChange={onAcceptedFilesChange}
        />,
      );

      const deleteButton = getByTestId("delete-0");
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([]);
      });
    });

    it("should call onAcceptedFilesChange when adding files in controlled mode", async () => {
      const onAcceptedFilesChange = mock(() => {});

      const { getByTestId } = setUp(
        <BasicFileUpload
          maxFiles={3}
          acceptedFiles={[]}
          onAcceptedFilesChange={onAcceptedFilesChange}
        />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const newFile = createMockFile("new.txt", 512, "text/plain");

      fireEvent.change(input, { target: { files: [newFile] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file: newFile, details: { status: "pending" } },
        ]);
      });
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
      const customValidate = mock((file: File): string[] | null => {
        if (file.name.includes("invalid")) {
          return ["CUSTOM"];
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
      const onAcceptedFilesChange = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload onAcceptedFilesChange={onAcceptedFilesChange} />,
      );
      const dropzone = getByTestId("dropzone");

      const file = createMockFile("dropped.txt", 1024, "text/plain");

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file, details: { status: "pending" } },
        ]);
      });
    });
  });

  describe("form integration", () => {
    it("should have aria-required when required", () => {
      const { getByTestId } = setUp(<BasicFileUpload required />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.getAttribute("aria-required")).toBe("true");
    });

    it("should not have aria-required when not required", () => {
      const { getByTestId } = setUp(<BasicFileUpload />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.getAttribute("aria-required")).toBeNull();
    });

    it("should have name attribute when name is provided", () => {
      const { getByTestId } = setUp(<BasicFileUpload name="attachment" />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.getAttribute("name")).toBe("attachment");
    });

    it("should have disabled attribute when disabled", () => {
      const { getByTestId } = setUp(<BasicFileUpload disabled />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.disabled).toBe(true);
    });

    it("should not generate an id on the hidden input", () => {
      const { getByTestId } = setUp(<BasicFileUpload />);
      const input = getByTestId("hidden-input") as HTMLInputElement;

      expect(input.getAttribute("id")).toBeNull();
    });
  });

  describe("duplicate file names", () => {
    // Uses index-based keys to avoid React key collision with same file names
    const DuplicateFileUpload = React.forwardRef<HTMLInputElement, FileUploadRootProps>(
      (props, ref) => {
        return (
          <FileUploadRoot {...props}>
            <FileUploadTrigger>Choose files</FileUploadTrigger>
            <ul data-testid="item-group">
              <FileUploadContext>
                {({ acceptedFiles }) =>
                  acceptedFiles.map((fileWithStatus, index) => (
                    <FileUploadItemProvider key={index} value={fileWithStatus}>
                      <li data-testid={`item-${index}`}>
                        <FileUploadItemName />
                        <FileUploadItemRemoveButton data-testid={`delete-${index}`}>
                          Delete
                        </FileUploadItemRemoveButton>
                      </li>
                    </FileUploadItemProvider>
                  ))
                }
              </FileUploadContext>
            </ul>
            <FileUploadHiddenInput ref={ref} data-testid="hidden-input" />
          </FileUploadRoot>
        );
      },
    );

    it("should accept multiple files with the same name", async () => {
      const { getByTestId, getAllByText } = setUp(<DuplicateFileUpload maxFiles={3} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("photo.png", 1024, "image/png");
      const file2 = createMockFile("photo.png", 2048, "image/png");
      const file3 = createMockFile("photo.png", 4096, "image/png");

      fireEvent.change(input, { target: { files: [file1, file2, file3] } });

      await waitFor(() => {
        expect(getAllByText("photo.png")).toHaveLength(3);
        expect(getByTestId("item-0")).toBeDefined();
        expect(getByTestId("item-1")).toBeDefined();
        expect(getByTestId("item-2")).toBeDefined();
      });
    });

    it("should delete only the targeted file among duplicates", async () => {
      const { getByTestId, getAllByText, user } = setUp(<DuplicateFileUpload maxFiles={3} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("photo.png", 1024, "image/png");
      const file2 = createMockFile("photo.png", 2048, "image/png");
      const file3 = createMockFile("photo.png", 4096, "image/png");

      fireEvent.change(input, { target: { files: [file1, file2, file3] } });

      await waitFor(() => {
        expect(getAllByText("photo.png")).toHaveLength(3);
      });

      // Delete the middle file (index 1)
      await user.click(getByTestId("delete-1"));

      await waitFor(() => {
        expect(getAllByText("photo.png")).toHaveLength(2);
      });
    });

    it("should delete all duplicate files one by one", async () => {
      const { getByTestId, queryAllByText, user } = setUp(<DuplicateFileUpload maxFiles={3} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("photo.png", 1024, "image/png");
      const file2 = createMockFile("photo.png", 2048, "image/png");

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(queryAllByText("photo.png")).toHaveLength(2);
      });

      // Delete first item
      await user.click(getByTestId("delete-0"));

      await waitFor(() => {
        expect(queryAllByText("photo.png")).toHaveLength(1);
      });

      // Delete remaining item
      await user.click(getByTestId("delete-0"));

      await waitFor(() => {
        expect(queryAllByText("photo.png")).toHaveLength(0);
      });
    });
  });

  describe("duplicate file names", () => {
    it("should accept multiple files with the same name", async () => {
      const { getByTestId, getAllByText } = setUp(<BasicFileUpload maxFiles={3} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("photo.png", 1024, "image/png");
      const file2 = createMockFile("photo.png", 2048, "image/png");
      const file3 = createMockFile("photo.png", 4096, "image/png");

      fireEvent.change(input, { target: { files: [file1, file2, file3] } });

      await waitFor(() => {
        expect(getAllByText("photo.png")).toHaveLength(3);
      });
    });

    it("should delete only the targeted file among duplicates", async () => {
      const { getByTestId, getAllByText, user } = setUp(<BasicFileUpload maxFiles={3} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("photo.png", 1024, "image/png");
      const file2 = createMockFile("photo.png", 2048, "image/png");
      const file3 = createMockFile("photo.png", 4096, "image/png");

      fireEvent.change(input, { target: { files: [file1, file2, file3] } });

      await waitFor(() => {
        expect(getAllByText("photo.png")).toHaveLength(3);
      });

      // Delete the middle file (index 1)
      await user.click(getByTestId("delete-1"));

      await waitFor(() => {
        expect(getAllByText("photo.png")).toHaveLength(2);
      });
    });

    it("should delete all duplicate files one by one", async () => {
      const { getByTestId, queryAllByText, user } = setUp(<BasicFileUpload maxFiles={3} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("photo.png", 1024, "image/png");
      const file2 = createMockFile("photo.png", 2048, "image/png");

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(queryAllByText("photo.png")).toHaveLength(2);
      });

      await user.click(getByTestId("delete-0"));

      await waitFor(() => {
        expect(queryAllByText("photo.png")).toHaveLength(1);
      });

      await user.click(getByTestId("delete-0"));

      await waitFor(() => {
        expect(queryAllByText("photo.png")).toHaveLength(0);
      });
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

  describe("onFileReject details", () => {
    it("should include FILE_TOO_LARGE error code", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload maxFileSize={1024} onFileReject={onFileReject} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("big.txt", 2048, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalledWith({
          files: [{ file, errors: ["FILE_TOO_LARGE"] }],
        });
      });
    });

    it("should include FILE_TOO_SMALL error code", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload minFileSize={1024} onFileReject={onFileReject} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("tiny.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalledWith({
          files: [{ file, errors: ["FILE_TOO_SMALL"] }],
        });
      });
    });

    it("should include INVALID_TYPE error code", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload accept="image/*" onFileReject={onFileReject} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("doc.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalledWith({
          files: [{ file, errors: ["INVALID_TYPE"] }],
        });
      });
    });

    it("should include TOO_MANY_FILES error code for excess files", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(<BasicFileUpload maxFiles={1} onFileReject={onFileReject} />);

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("a.txt", 100, "text/plain");
      const file2 = createMockFile("b.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalledWith({
          files: [{ file: file2, errors: ["TOO_MANY_FILES"] }],
        });
      });
    });

    it("should include multiple error codes for same file", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload accept="image/*" maxFileSize={500} onFileReject={onFileReject} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("big.txt", 1024, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalledWith({
          files: [{ file, errors: ["INVALID_TYPE", "FILE_TOO_LARGE"] }],
        });
      });
    });

    it("should include custom error code from validate", async () => {
      const onFileReject = mock(() => {});
      const validate = (file: File) => (file.name.startsWith("bad") ? ["CUSTOM_ERROR"] : null);

      const { getByTestId } = setUp(
        <BasicFileUpload validate={validate} onFileReject={onFileReject} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("bad-file.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalledWith({
          files: [{ file, errors: ["CUSTOM_ERROR"] }],
        });
      });
    });

    it("should reject invalid files on drop", async () => {
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload accept="image/*" onFileReject={onFileReject} />,
      );

      const dropzone = getByTestId("dropzone");
      const file = createMockFile("doc.txt", 100, "text/plain");

      fireEvent.drop(dropzone, {
        dataTransfer: { files: [file] },
      });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalledWith({
          files: [{ file, errors: ["INVALID_TYPE"] }],
        });
      });
    });
  });

  describe("onAcceptedFilesChange on removal", () => {
    it("should call onAcceptedFilesChange with empty array when last file is removed", async () => {
      const onAcceptedFilesChange = mock(() => {});
      const { getByTestId, user } = setUp(
        <BasicFileUpload onAcceptedFilesChange={onAcceptedFilesChange} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file = createMockFile("test.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file, details: { status: "pending" } },
        ]);
      });

      onAcceptedFilesChange.mockClear();
      await user.click(getByTestId("delete-0"));

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([]);
      });
    });

    it("should call onAcceptedFilesChange with remaining files after removal", async () => {
      const onAcceptedFilesChange = mock(() => {});
      const { getByTestId, user } = setUp(
        <BasicFileUpload maxFiles={3} onAcceptedFilesChange={onAcceptedFilesChange} />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("a.txt", 100, "text/plain");
      const file2 = createMockFile("b.txt", 200, "text/plain");
      const file3 = createMockFile("c.txt", 300, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2, file3] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file: file1, details: { status: "pending" } },
          { file: file2, details: { status: "pending" } },
          { file: file3, details: { status: "pending" } },
        ]);
      });

      onAcceptedFilesChange.mockClear();
      await user.click(getByTestId("delete-1"));

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file: file1, details: { status: "pending" } },
          { file: file3, details: { status: "pending" } },
        ]);
      });
    });
  });

  describe("both callbacks", () => {
    it("should call both callbacks when batch has valid and invalid files", async () => {
      const onAcceptedFilesChange = mock(() => {});
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload
          maxFiles={5}
          accept="image/*"
          onAcceptedFilesChange={onAcceptedFilesChange}
          onFileReject={onFileReject}
        />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const validFile = createMockFile("photo.png", 100, "image/png");
      const invalidFile = createMockFile("doc.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [validFile, invalidFile] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file: validFile, details: { status: "pending" } },
        ]);
        expect(onFileReject).toHaveBeenCalledWith({
          files: [{ file: invalidFile, errors: ["INVALID_TYPE"] }],
        });
      });
    });

    it("should partially accept and reject when maxFiles is reached mid-batch", async () => {
      const onAcceptedFilesChange = mock(() => {});
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload
          maxFiles={3}
          onAcceptedFilesChange={onAcceptedFilesChange}
          onFileReject={onFileReject}
        />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("a.txt", 100, "text/plain");
      const file2 = createMockFile("b.txt", 100, "text/plain");

      // first batch: add 2 files
      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file: file1, details: { status: "pending" } },
          { file: file2, details: { status: "pending" } },
        ]);
      });

      onAcceptedFilesChange.mockClear();
      onFileReject.mockClear();

      const file3 = createMockFile("c.txt", 100, "text/plain");
      const file4 = createMockFile("d.txt", 100, "text/plain");
      const file5 = createMockFile("e.txt", 100, "text/plain");

      // second batch: add 3 more, but only 1 slot remaining
      fireEvent.change(input, { target: { files: [file3, file4, file5] } });

      await waitFor(() => {
        expect(onAcceptedFilesChange).toHaveBeenCalledWith([
          { file: file1, details: { status: "pending" } },
          { file: file2, details: { status: "pending" } },
          { file: file3, details: { status: "pending" } },
        ]);
        expect(onFileReject).toHaveBeenCalledWith({
          files: [
            { file: file4, errors: ["TOO_MANY_FILES"] },
            { file: file5, errors: ["TOO_MANY_FILES"] },
          ],
        });
      });
    });

    it("should only call onFileReject when all files in batch are invalid", async () => {
      const onAcceptedFilesChange = mock(() => {});
      const onFileReject = mock(() => {});
      const { getByTestId } = setUp(
        <BasicFileUpload
          maxFiles={5}
          accept="image/*"
          onAcceptedFilesChange={onAcceptedFilesChange}
          onFileReject={onFileReject}
        />,
      );

      const input = getByTestId("hidden-input") as HTMLInputElement;
      const file1 = createMockFile("a.txt", 100, "text/plain");
      const file2 = createMockFile("b.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2] } });

      await waitFor(() => {
        expect(onFileReject).toHaveBeenCalledWith({
          files: [
            { file: file1, errors: ["INVALID_TYPE"] },
            { file: file2, errors: ["INVALID_TYPE"] },
          ],
        });
      });

      // onAcceptedFilesChange is still called (via setAcceptedFiles) but with
      // the same files as before (empty array spread), not with new accepted files
      expect(onAcceptedFilesChange).not.toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ file: file1 })]),
      );
    });
  });
});
