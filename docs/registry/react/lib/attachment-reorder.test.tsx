import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import type * as React from "react";

const sortableRef = mock((_element: Element | null) => {});
const sortableHandleRef = mock((_element: Element | null) => {});

mock.module("@dnd-kit/react/sortable", () => ({
  useSortable: () => ({
    ref: sortableRef,
    handleRef: sortableHandleRef,
    isDragging: false,
  }),
}));

const { useAttachmentItemReorder } = await import("./attachment-reorder");

function ReorderItem({ forwardedRef }: { forwardedRef: React.Ref<HTMLLIElement> }) {
  const { itemRef } = useAttachmentItemReorder({
    id: "attachment",
    index: 0,
    name: "attachment.png",
    label: "attachment.png 순서 변경",
    disabled: false,
    forwardedRef,
  });

  return (
    <li ref={itemRef} data-testid="item">
      <button type="button" data-attachment-reorder-handle="">
        순서 변경
      </button>
    </li>
  );
}

beforeEach(() => {
  sortableRef.mockClear();
  sortableHandleRef.mockClear();
});

describe("useAttachmentItemReorder", () => {
  it("forwarded callback ref가 반환한 cleanup을 실행한다", () => {
    const cleanup = mock(() => {});
    const forwardedRef = mock((_item: HTMLLIElement | null) => cleanup);
    const { getByTestId, unmount } = render(<ReorderItem forwardedRef={forwardedRef} />);

    const item = getByTestId("item");
    const handle = item.querySelector("button");

    expect(forwardedRef).toHaveBeenCalledWith(item);
    expect(sortableRef).toHaveBeenCalledWith(item);
    expect(sortableHandleRef).toHaveBeenCalledWith(handle);

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(forwardedRef).toHaveBeenCalledTimes(1);
    expect(sortableRef).toHaveBeenLastCalledWith(null);
    expect(sortableHandleRef).toHaveBeenLastCalledWith(null);
  });

  it("cleanup을 반환하지 않는 callback ref에는 기존처럼 null을 전달한다", () => {
    const forwardedRef = mock((_item: HTMLLIElement | null) => {});
    const { unmount } = render(<ReorderItem forwardedRef={forwardedRef} />);

    unmount();

    expect(forwardedRef).toHaveBeenLastCalledWith(null);
    expect(sortableRef).toHaveBeenLastCalledWith(null);
    expect(sortableHandleRef).toHaveBeenLastCalledWith(null);
  });
});
