import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  FileUpload,
  FileUploadItemProvider,
  useFileUploadContext,
  useFileUploadItem,
  type FileEntry,
  type NativeFile,
  type UseFileUploadContext,
  type UseFileUploadProps,
} from "./index.js";

function element(selector: string) {
  const node = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}

function file(name: string, type = "text/plain", size = 10, previewUrl?: string): NativeFile {
  return { uri: `fixture://${name}`, name, type, size, ...(previewUrl ? { previewUrl } : {}) };
}

function entry(id: string, nativeFile: NativeFile): FileEntry {
  return { id, file: nativeFile, status: "success" };
}

async function flush() {
  await act(async () => {
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, 0);
    await promise;
  });
}

function Item({ fileEntry }: { fileEntry: FileEntry }) {
  const item = useFileUploadItem(fileEntry);
  return (
    <FileUploadItemProvider value={item}>
      <view className={`item item-${fileEntry.id}`}>
        <FileUpload.ItemImage className="image" />
        <FileUpload.ItemName className="name" />
        <FileUpload.ItemSize className="size" />
        <FileUpload.ItemBackdrop className="backdrop" status="error">
          {(current) => <text>{current.status}</text>}
        </FileUpload.ItemBackdrop>
        <FileUpload.ItemRemoveButton className={`remove-${fileEntry.id}`} />
      </view>
    </FileUploadItemProvider>
  );
}

function Upload(props: UseFileUploadProps & { onApi?: (api: UseFileUploadContext) => void }) {
  const { onApi, ...rootProps } = props;
  return (
    <FileUpload.Root className="root" {...rootProps}>
      <FileUpload.Trigger className="trigger" accessibility-label="파일 선택" />
      <FileUpload.Context>
        {(api) => {
          onApi?.(api);
          return api.acceptedFileEntries.map((current) => (
            <Item key={current.id} fileEntry={current} />
          ));
        }}
      </FileUpload.Context>
    </FileUpload.Root>
  );
}

function names() {
  return Array.from(elementTree.root?.querySelectorAll(".name") ?? []).map((n) => n.textContent);
}

describe("FileUpload picker", () => {
  it("adds validated files from an async picker and reports rejections", async () => {
    const onFileAccept = vi.fn();
    const onFileReject = vi.fn();
    render(
      <Upload
        maxFiles={3}
        accept={[".txt", "image/*"]}
        maxFileSize={100}
        minFileSize={2}
        validate={(f) => (f.name.startsWith("bad") ? ["CUSTOM"] : null)}
        defaultAcceptedFileEntries={[entry("kept", file("kept.txt"))]}
        onSelectFiles={() =>
          Promise.resolve([
            file("a.txt"),
            file("photo.png", "image/png"),
            file("doc.pdf", "application/pdf"),
            file("large.txt", "text/plain", 101),
            file("tiny.txt", "text/plain", 1),
            file("bad.txt"),
            file("overflow.txt"),
          ])
        }
        onFileAccept={onFileAccept}
        onFileReject={onFileReject}
      />,
    );

    fireEvent.tap(element(".trigger"));
    expect(names()).toEqual(["kept.txt"]);
    await flush();

    expect(names()).toEqual(["kept.txt", "a.txt", "photo.png"]);
    expect(onFileAccept.mock.calls[0][0].map((e: FileEntry) => [e.file.name, e.status])).toEqual([
      ["a.txt", "pending"],
      ["photo.png", "pending"],
    ]);
    expect(
      onFileReject.mock.calls[0][0].map((r: { file: NativeFile; errors: string[] }) => [
        r.file.name,
        r.errors,
      ]),
    ).toEqual([
      ["doc.pdf", ["TOO_MANY_FILES", "INVALID_TYPE"]],
      ["large.txt", ["TOO_MANY_FILES", "FILE_TOO_LARGE"]],
      ["tiny.txt", ["TOO_MANY_FILES", "FILE_TOO_SMALL"]],
      ["bad.txt", ["TOO_MANY_FILES", "CUSTOM"]],
      ["overflow.txt", ["TOO_MANY_FILES"]],
    ]);
    expect(element(".trigger")).toHaveAttribute("accessibility-traits", "disabled");
    expect(element(".root")).toHaveAttribute("data-disabled", "true");
  });

  it("keeps entries when the picker throws, rejects, or is cancelled", async () => {
    const onSelectError = vi.fn();
    const results: Array<() => NativeFile[] | Promise<NativeFile[]>> = [
      () => {
        throw new Error("sync");
      },
      () => Promise.reject(new Error("async")),
      () => [],
    ];
    render(
      <Upload
        maxFiles={3}
        defaultAcceptedFileEntries={[entry("kept", file("kept.txt"))]}
        onSelectFiles={() => results.shift()?.() ?? []}
        onSelectError={onSelectError}
      />,
    );

    for (let i = 0; i < 3; i += 1) {
      fireEvent.tap(element(".trigger"));
      await flush();
    }

    expect(onSelectError.mock.calls.map(([error]) => (error as Error).message)).toEqual([
      "sync",
      "async",
    ]);
    expect(names()).toEqual(["kept.txt"]);
  });

  it("ignores a stale request and results that arrive after unmount", async () => {
    const pending: Array<PromiseWithResolvers<NativeFile[]>> = [];
    const onSelectError = vi.fn();
    const { unmount } = render(
      <Upload
        maxFiles={3}
        onSelectFiles={() => {
          const request = Promise.withResolvers<NativeFile[]>();
          pending.push(request);
          return request.promise;
        }}
        onSelectError={onSelectError}
      />,
    );

    fireEvent.tap(element(".trigger"));
    fireEvent.tap(element(".trigger"));
    pending[0].resolve([file("stale.txt")]);
    pending[1].resolve([file("latest.txt")]);
    await flush();
    expect(names()).toEqual(["latest.txt"]);

    fireEvent.tap(element(".trigger"));
    unmount();
    pending[2].reject(new Error("late"));
    await flush();
    expect(onSelectError).not.toHaveBeenCalled();
  });

  it("clamps maxFiles to 1 and replaces the entry in single mode", () => {
    let api: UseFileUploadContext | undefined;
    const onFileReject = vi.fn();
    render(
      <Upload
        maxFiles={0}
        onFileReject={onFileReject}
        onApi={(value) => {
          api = value;
        }}
      />,
    );

    expect(api?.maxFiles).toBe(1);
    expect(api?.multiple).toBe(false);
    act(() => api?.setFileEntries([file("a.txt"), file("b.txt")]));
    expect(names()).toEqual(["a.txt"]);
    expect(onFileReject.mock.calls[0][0][0].errors).toEqual(["TOO_MANY_FILES"]);
  });
});

describe("FileUpload guards", () => {
  const entries = () => [
    entry("a", file("a.txt")),
    entry("b", file("b.txt")),
    entry("c", file("c.txt")),
  ];

  it("updates status regardless of disabled and readOnly", () => {
    let api: UseFileUploadContext | undefined;
    render(
      <Upload
        disabled
        readOnly
        maxFiles={3}
        defaultAcceptedFileEntries={entries()}
        onApi={(value) => {
          api = value;
        }}
      />,
    );

    act(() => api?.updateFileEntryStatus("b", { status: "error" }));
    expect(element(".item-b .backdrop")).toHaveTextContent("error");
  });

  it("blocks remove and clear only when readOnly", () => {
    let api: UseFileUploadContext | undefined;
    const { rerender } = render(
      <Upload
        readOnly
        maxFiles={3}
        defaultAcceptedFileEntries={entries()}
        onApi={(value) => {
          api = value;
        }}
      />,
    );

    expect(element(".remove-a")).toHaveAttribute("accessibility-traits", "disabled");
    fireEvent.tap(element(".remove-a"));
    act(() => api?.clearFileEntries());
    expect(names()).toEqual(["a.txt", "b.txt", "c.txt"]);

    rerender(
      <Upload
        disabled
        maxFiles={3}
        defaultAcceptedFileEntries={entries()}
        onApi={(value) => {
          api = value;
        }}
      />,
    );
    fireEvent.tap(element(".remove-a"));
    expect(names()).toEqual(["b.txt", "c.txt"]);
    act(() => api?.clearFileEntries());
    expect(names()).toEqual([]);
  });

  it("reorders only valid, distinct indices while editable", () => {
    let api: UseFileUploadContext | undefined;
    const onChange = vi.fn();
    const props = {
      maxFiles: 3,
      defaultAcceptedFileEntries: entries(),
      onAcceptedFileEntriesChange: onChange,
      onApi: (value: UseFileUploadContext) => {
        api = value;
      },
    };
    const { rerender } = render(<Upload {...props} disabled />);
    act(() => api?.reorderFileEntry(0, 2));
    rerender(<Upload {...props} readOnly />);
    act(() => api?.reorderFileEntry(0, 2));
    rerender(<Upload {...props} />);
    act(() => {
      api?.reorderFileEntry(1, 1);
      api?.reorderFileEntry(-1, 0);
      api?.reorderFileEntry(0, 3);
    });
    expect(onChange).not.toHaveBeenCalled();

    act(() => api?.reorderFileEntry(0, 2));
    expect(names()).toEqual(["b.txt", "c.txt", "a.txt"]);
  });
});

describe("FileUpload items", () => {
  it("previews images from previewUrl, falling back to uri, only for image accept", () => {
    render(
      <Upload
        accept="image/*"
        maxFiles={3}
        defaultAcceptedFileEntries={[
          entry("p", file("p.png", "image/png", 2048, "preview://p")),
          entry("u", file("u.png", "image/png", 0)),
        ]}
      />,
    );

    expect(element(".item-p .image")).toHaveAttribute("src", "preview://p");
    expect(element(".item-p .image")).toHaveAttribute("accessibility-label", "p.png");
    expect(element(".item-u .image")).toHaveAttribute("src", "fixture://u.png");
    expect(element(".item-p .size")).toHaveTextContent("2 KB");
    expect(element(".item-u .size")).toHaveTextContent("0 B");
  });

  it("does not render previews outside image accept", () => {
    render(
      <Upload maxFiles={3} defaultAcceptedFileEntries={[entry("p", file("p.png", "image/png"))]} />,
    );

    expect(elementTree.root?.querySelector(".image")).toBeNull();
  });
});

describe("useFileUploadContext", () => {
  it("throws outside FileUploadRoot unless strict is false", () => {
    function Strict() {
      useFileUploadContext();
      return null;
    }
    function Optional() {
      return (
        <text className="optional">{useFileUploadContext({ strict: false }) ? "y" : "n"}</text>
      );
    }
    expect(() => render(<Strict />)).toThrow(/useFileUploadContext must be used within/);
    render(<Optional />);
    expect(element(".optional")).toHaveTextContent("n");
  });
});
