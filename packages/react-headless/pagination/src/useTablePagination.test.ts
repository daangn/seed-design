import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, mock } from "bun:test";
import type { MouseEvent } from "react";
import { useTablePagination } from "./useTablePagination";

afterEach(cleanup);

const clickEvent = { defaultPrevented: false } as MouseEvent<HTMLButtonElement>;

describe("useTablePagination", () => {
  it("known 모드에서 기본 값, 범위, 선택 옵션을 계산한다", () => {
    const { result } = renderHook(() => useTablePagination({ totalItems: 95 }));

    expect(result.current.value).toEqual({ page: 1, pageSize: 10 });
    expect(result.current.isTotalKnown).toBe(true);
    expect(result.current.totalItems).toBe(95);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.range).toEqual({ start: 1, end: 10 });
    expect(result.current.pageSizeOptions).toEqual([10, 25, 50]);
    expect(result.current.pageRangeOptions).toHaveLength(10);
    expect(result.current.pageRangeOptions.at(-1)).toEqual({ page: 10, start: 91, end: 95 });
  });

  it("known 모드의 페이지 이동 사유를 원자적 값과 함께 제공한다", async () => {
    const onValueChange = mock(() => {});
    const { result } = renderHook(() =>
      useTablePagination({
        totalItems: 100,
        defaultValue: { page: 3, pageSize: 10 },
        onValueChange,
      }),
    );

    act(() => result.current.goToPreviousPage());
    await waitFor(() => expect(result.current.page).toBe(2));
    expect(onValueChange).toHaveBeenLastCalledWith(
      { page: 2, pageSize: 10 },
      { reason: "previous", previousValue: { page: 3, pageSize: 10 } },
    );

    act(() => result.current.goToNextPage());
    await waitFor(() => expect(result.current.page).toBe(3));
    expect(onValueChange).toHaveBeenLastCalledWith(
      { page: 3, pageSize: 10 },
      { reason: "next", previousValue: { page: 2, pageSize: 10 } },
    );

    act(() => result.current.goToPage(8));
    await waitFor(() => expect(result.current.page).toBe(8));
    expect(onValueChange).toHaveBeenLastCalledWith(
      { page: 8, pageSize: 10 },
      { reason: "page-range", previousValue: { page: 3, pageSize: 10 } },
    );
  });

  it("pageSize 변경은 page 1로 원자적으로 이동한다", async () => {
    const onValueChange = mock(() => {});
    const { result } = renderHook(() =>
      useTablePagination({
        totalItems: 100,
        defaultValue: { page: 3, pageSize: 10 },
        onValueChange,
      }),
    );

    act(() => result.current.setPageSize(25));

    await waitFor(() => expect(result.current.value).toEqual({ page: 1, pageSize: 25 }));
    expect(onValueChange).toHaveBeenCalledWith(
      { page: 1, pageSize: 25 },
      { reason: "page-size", previousValue: { page: 3, pageSize: 10 } },
    );
    expect(result.current.range).toEqual({ start: 1, end: 25 });
  });

  it("현재 page와 pageSize를 사용자 옵션에 자동 포함하고 정렬한다", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        totalItems: 100,
        value: { page: 3, pageSize: 10 },
        pageOptions: [5, 1, 99],
        pageSizeOptions: [50, 25],
      }),
    );

    expect(result.current.pageRangeOptions.map((option) => option.page)).toEqual([1, 3, 5]);
    expect(result.current.pageSizeOptions).toEqual([10, 25, 50]);
  });

  it("페이지가 매우 많으면 pageOptions로 렌더링할 범위를 제한하도록 안내한다", () => {
    expect(() => renderHook(() => useTablePagination({ totalItems: 100_010 }))).toThrow(
      /pageOptions/,
    );

    const { result } = renderHook(() =>
      useTablePagination({
        totalItems: Number.MAX_SAFE_INTEGER,
        value: { page: 123_456, pageSize: 10 },
        pageOptions: [1, 123_456],
      }),
    );

    expect(result.current.pageRangeOptions.map((option) => option.page)).toEqual([1, 123_456]);
  });

  it("known total이 0이면 page 1과 0-0 범위를 canonical 값으로 반환한다", () => {
    const { result } = renderHook(() =>
      useTablePagination({ totalItems: 0, value: { page: 5, pageSize: 10 } }),
    );

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.range).toEqual({ start: 0, end: 0 });
    expect(result.current.pageRangeOptions).toEqual([{ page: 1, start: 0, end: 0 }]);
    expect(result.current.pageRangeSelectDisabled).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("known total 감소로 벗어난 페이지를 clamp하고 constraint를 한 번 알린다", async () => {
    const onValueChange = mock(() => {});
    const { result, rerender } = renderHook(
      ({ totalItems }) =>
        useTablePagination({
          totalItems,
          defaultValue: { page: 10, pageSize: 10 },
          onValueChange,
        }),
      { initialProps: { totalItems: 100 } },
    );

    rerender({ totalItems: 15 });
    expect(result.current.value).toEqual({ page: 2, pageSize: 10 });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
    expect(onValueChange).toHaveBeenCalledWith(
      { page: 2, pageSize: 10 },
      { reason: "constraint", previousValue: { page: 10, pageSize: 10 } },
    );

    rerender({ totalItems: 15 });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("제어 페이지가 범위를 벗어나면 보정된 값을 렌더링하고 constraint를 한 번 알린다", async () => {
    const onValueChange = mock(() => {});
    const { result, rerender } = renderHook(
      ({ marker }) => {
        void marker;
        return useTablePagination({
          totalItems: 25,
          value: { page: 99, pageSize: 10 },
          onValueChange,
        });
      },
      { initialProps: { marker: 0 } },
    );

    expect(result.current.value).toEqual({ page: 3, pageSize: 10 });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
    expect(onValueChange).toHaveBeenCalledWith(
      { page: 3, pageSize: 10 },
      { reason: "constraint", previousValue: { page: 99, pageSize: 10 } },
    );

    rerender({ marker: 1 });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("unknown 모드에서 서버의 이동 가능 여부와 fallback 범위를 사용한다", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        value: { page: 3, pageSize: 10 },
        hasPreviousPage: true,
        hasNextPage: false,
      }),
    );

    expect(result.current.isTotalKnown).toBe(false);
    expect(result.current.totalItems).toBeUndefined();
    expect(result.current.totalPages).toBeUndefined();
    expect(result.current.range).toEqual({ start: 21, end: 30 });
    expect(result.current.pageRangeOptions).toEqual([]);
    expect(result.current.pageRangeSelectDisabled).toBe(true);
    expect(result.current.hasPreviousPage).toBe(true);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("unknown currentPageItemCount로 마지막 범위를 계산하고 0이면 0-0을 반환한다", () => {
    const { result, rerender } = renderHook(
      ({ count }) =>
        useTablePagination({
          value: { page: 3, pageSize: 10 },
          hasPreviousPage: true,
          hasNextPage: false,
          currentPageItemCount: count,
        }),
      { initialProps: { count: 3 } },
    );

    expect(result.current.range).toEqual({ start: 21, end: 23 });
    rerender({ count: 0 });
    expect(result.current.range).toEqual({ start: 0, end: 0 });
  });

  it("unknown 모드도 이전/다음 변경 사유를 전달한다", () => {
    const onValueChange = mock(() => {});
    const { result } = renderHook(() =>
      useTablePagination({
        value: { page: 3, pageSize: 10 },
        hasPreviousPage: true,
        hasNextPage: true,
        onValueChange,
      }),
    );

    act(() => result.current.previousButtonProps.onClick?.(clickEvent));
    expect(onValueChange).toHaveBeenLastCalledWith(
      { page: 2, pageSize: 10 },
      { reason: "previous", previousValue: { page: 3, pageSize: 10 } },
    );
    act(() => result.current.nextButtonProps.onClick?.(clickEvent));
    expect(onValueChange).toHaveBeenLastCalledWith(
      { page: 4, pageSize: 10 },
      { reason: "next", previousValue: { page: 3, pageSize: 10 } },
    );
  });

  it("disabled이면 모든 변경 action과 버튼을 막는다", () => {
    const onValueChange = mock(() => {});
    const { result } = renderHook(() =>
      useTablePagination({
        totalItems: 100,
        value: { page: 3, pageSize: 10 },
        disabled: true,
        onValueChange,
      }),
    );

    expect(result.current.previousButtonProps.disabled).toBe(true);
    expect(result.current.nextButtonProps.disabled).toBe(true);
    expect(result.current.pageRangeSelectDisabled).toBe(true);
    act(() => {
      result.current.goToPage(5);
      result.current.goToPreviousPage();
      result.current.goToNextPage();
      result.current.setPageSize(25);
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("제어 값은 고정하고 변경 요청만 전달한다", () => {
    const onValueChange = mock(() => {});
    const { result } = renderHook(() =>
      useTablePagination({
        totalItems: 100,
        value: { page: 3, pageSize: 10 },
        onValueChange,
      }),
    );

    act(() => result.current.goToNextPage());
    expect(result.current.value).toEqual({ page: 3, pageSize: 10 });
    expect(onValueChange).toHaveBeenCalledWith(
      { page: 4, pageSize: 10 },
      { reason: "next", previousValue: { page: 3, pageSize: 10 } },
    );
  });

  it("구조적으로 잘못된 숫자와 중복 옵션을 거부한다", () => {
    expect(() => renderHook(() => useTablePagination({ totalItems: -1 }))).toThrow(RangeError);
    expect(() =>
      renderHook(() => useTablePagination({ totalItems: 10, value: { page: 1.5, pageSize: 10 } })),
    ).toThrow(RangeError);
    expect(() =>
      renderHook(() => useTablePagination({ totalItems: 10, pageOptions: [1, 1] })),
    ).toThrow(RangeError);
    expect(() =>
      renderHook(() => useTablePagination({ totalItems: 10, pageSizeOptions: [10, 10] })),
    ).toThrow(RangeError);
    expect(() =>
      renderHook(() => useTablePagination({ totalItems: 10, pageOptions: Array(2) })),
    ).toThrow(RangeError);
    expect(() =>
      renderHook(() => useTablePagination({ totalItems: 10, pageSizeOptions: Array(2) })),
    ).toThrow(RangeError);
    expect(() =>
      renderHook(() =>
        useTablePagination({
          hasPreviousPage: false,
          hasNextPage: false,
          currentPageItemCount: 11,
        }),
      ),
    ).toThrow(RangeError);
  });

  it("unknown 범위가 safe integer를 벗어나면 오류를 던진다", () => {
    expect(() =>
      renderHook(() =>
        useTablePagination({
          value: { page: Number.MAX_SAFE_INTEGER, pageSize: 2 },
          hasPreviousPage: true,
          hasNextPage: true,
        }),
      ),
    ).toThrow(/안전한 정수/);
  });
});
