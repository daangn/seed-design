import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, mock } from "bun:test";
import { createElement, StrictMode, type MouseEvent, type PropsWithChildren } from "react";
import { usePagination, type PaginationItem } from "./usePagination";

afterEach(cleanup);

function simplify(items: readonly PaginationItem[]) {
  return items.map((item) => (item.type === "page" ? item.page : item.side));
}

const clickEvent = { defaultPrevented: false } as MouseEvent<HTMLButtonElement>;

function StrictModeWrapper({ children }: PropsWithChildren) {
  return createElement(StrictMode, null, children);
}

describe("usePagination", () => {
  it("1부터 시작하며 전체 페이지가 예산 안에 있으면 모두 반환한다", () => {
    const { result } = renderHook(() => usePagination({ totalPages: 5 }));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(5);
    expect(simplify(result.current.items)).toEqual([1, 2, 3, 4, 5]);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.hasNextPage).toBe(true);
  });

  it("전체 페이지가 0이면 page 1을 canonical 값으로 유지하고 항목을 비운다", () => {
    const { result } = renderHook(() => usePagination({ page: 9, totalPages: 0 }));

    expect(result.current.page).toBe(1);
    expect(result.current.items).toEqual([]);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("전체 페이지가 1이면 첫 페이지만 반환하고 이동을 막는다", () => {
    const { result } = renderHook(() => usePagination({ totalPages: 1 }));

    expect(result.current.page).toBe(1);
    expect(simplify(result.current.items)).toEqual([1]);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("visibleItemCount 9에서 navigation 슬롯을 고정한 페이지 배열을 반환한다", () => {
    const { result, rerender } = renderHook(
      ({ page }) => usePagination({ page, totalPages: 10, visibleItemCount: 9 }),
      { initialProps: { page: 1 } },
    );

    expect(simplify(result.current.items)).toEqual([1, 2, 3, 4, 5, "end", 10]);
    rerender({ page: 2 });
    expect(simplify(result.current.items)).toEqual([1, 2, 3, 4, 5, "end", 10]);
    rerender({ page: 4 });
    expect(simplify(result.current.items)).toEqual([1, 2, 3, 4, 5, "end", 10]);
    rerender({ page: 5 });
    expect(simplify(result.current.items)).toEqual([1, "start", 4, 5, 6, "end", 10]);
    rerender({ page: 7 });
    expect(simplify(result.current.items)).toEqual([1, "start", 6, 7, 8, 9, 10]);
    rerender({ page: 10 });
    expect(simplify(result.current.items)).toEqual([1, "start", 6, 7, 8, 9, 10]);
  });

  it("visibleItemCount 7에서 인접 페이지를 선택할 수 있는 5개 페이지 슬롯을 반환한다", () => {
    const { result, rerender } = renderHook(
      ({ page }) => usePagination({ page, totalPages: 10, visibleItemCount: 7 }),
      { initialProps: { page: 1 } },
    );

    expect(simplify(result.current.items)).toEqual([1, 2, 3, 4, "end"]);
    rerender({ page: 2 });
    expect(simplify(result.current.items)).toEqual([1, 2, 3, 4, "end"]);
    rerender({ page: 3 });
    expect(simplify(result.current.items)).toEqual([1, 2, 3, 4, "end"]);
    rerender({ page: 4 });
    expect(simplify(result.current.items)).toEqual(["start", 3, 4, 5, "end"]);
    rerender({ page: 5 });
    expect(simplify(result.current.items)).toEqual(["start", 4, 5, 6, "end"]);
    rerender({ page: 7 });
    expect(simplify(result.current.items)).toEqual(["start", 6, 7, 8, "end"]);
    rerender({ page: 8 });
    expect(simplify(result.current.items)).toEqual(["start", 7, 8, 9, 10]);
    rerender({ page: 10 });
    expect(simplify(result.current.items)).toEqual(["start", 7, 8, 9, 10]);
  });

  it("비제어 페이지 이동과 변경 사유를 함께 제공한다", async () => {
    const onPageChange = mock(() => {});
    const { result } = renderHook(() =>
      usePagination({ defaultPage: 3, totalPages: 10, onPageChange }),
    );

    act(() => result.current.goToPreviousPage());
    await waitFor(() => expect(result.current.page).toBe(2));
    expect(onPageChange).toHaveBeenLastCalledWith(2, {
      reason: "previous",
      previousPage: 3,
    });

    act(() => result.current.goToNextPage());
    await waitFor(() => expect(result.current.page).toBe(3));
    expect(onPageChange).toHaveBeenLastCalledWith(3, { reason: "next", previousPage: 2 });

    act(() => result.current.goToPage(8));
    await waitFor(() => expect(result.current.page).toBe(8));
    expect(onPageChange).toHaveBeenLastCalledWith(8, {
      reason: "page-item",
      previousPage: 3,
    });
  });

  it("제어 상태에서는 값을 고정하고 변경 요청만 전달한다", () => {
    const onPageChange = mock(() => {});
    const { result } = renderHook(() => usePagination({ page: 4, totalPages: 10, onPageChange }));

    act(() => result.current.goToNextPage());

    expect(result.current.page).toBe(4);
    expect(onPageChange).toHaveBeenCalledWith(5, { reason: "next", previousPage: 4 });
  });

  it("현재 페이지 버튼은 포커스 가능하고 클릭해도 변경하지 않는다", () => {
    const onPageChange = mock(() => {});
    const { result } = renderHook(() => usePagination({ page: 4, totalPages: 10, onPageChange }));
    const props = result.current.getPageButtonProps(4);

    expect(props.disabled).toBe(false);
    expect(props["aria-current"]).toBe("page");
    expect(props["data-selected"]).toBe("");
    act(() => props.onClick?.(clickEvent));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("버튼 prop과 action은 같은 이동 계약을 사용한다", () => {
    const onPageChange = mock(() => {});
    const { result } = renderHook(() => usePagination({ page: 4, totalPages: 10, onPageChange }));

    act(() => result.current.getPageButtonProps(7).onClick?.(clickEvent));
    expect(onPageChange).toHaveBeenCalledWith(7, {
      reason: "page-item",
      previousPage: 4,
    });
  });

  it("경계와 disabled 상태에서 이동을 막고 버튼 상태를 제공한다", () => {
    const onPageChange = mock(() => {});
    const { result } = renderHook(() =>
      usePagination({ page: 1, totalPages: 10, disabled: true, onPageChange }),
    );

    expect(result.current.previousButtonProps.disabled).toBe(true);
    expect(result.current.nextButtonProps.disabled).toBe(true);
    expect(result.current.getPageButtonProps(2).disabled).toBe(true);
    act(() => {
      result.current.goToNextPage();
      result.current.goToPage(3);
      result.current.nextButtonProps.onClick?.(clickEvent);
    });
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("범위를 벗어난 입력 페이지를 clamp하고 constraint를 한 번 알린다", async () => {
    const onPageChange = mock(() => {});
    const { result, rerender } = renderHook(
      ({ marker }) => {
        void marker;
        return usePagination({ page: 99, totalPages: 10, onPageChange });
      },
      { initialProps: { marker: 0 } },
    );

    expect(result.current.page).toBe(10);
    await waitFor(() => expect(onPageChange).toHaveBeenCalledTimes(1));
    expect(onPageChange).toHaveBeenCalledWith(10, {
      reason: "constraint",
      previousPage: 99,
    });

    rerender({ marker: 1 });
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("비제어 초기 페이지도 clamp하고 Strict Mode에서 constraint를 한 번 알린다", async () => {
    const onPageChange = mock(() => {});
    const { result } = renderHook(
      () => usePagination({ defaultPage: 99, totalPages: 10, onPageChange }),
      { wrapper: StrictModeWrapper },
    );

    expect(result.current.page).toBe(10);
    await waitFor(() => expect(onPageChange).toHaveBeenCalledTimes(1));
    expect(onPageChange).toHaveBeenCalledWith(10, {
      reason: "constraint",
      previousPage: 99,
    });
  });

  it("action에 전달한 범위 밖 페이지는 이동 가능한 경계로 clamp한다", () => {
    const onPageChange = mock(() => {});
    const { result } = renderHook(() => usePagination({ page: 4, totalPages: 10, onPageChange }));

    act(() => result.current.goToPage(99));
    expect(onPageChange).toHaveBeenCalledWith(10, {
      reason: "page-item",
      previousPage: 4,
    });
  });

  it("구조적으로 잘못된 숫자를 거부한다", () => {
    expect(() => renderHook(() => usePagination({ totalPages: -1 }))).toThrow(RangeError);
    expect(() => renderHook(() => usePagination({ totalPages: 1.5 }))).toThrow(RangeError);
    expect(() =>
      renderHook(() => usePagination({ totalPages: 10, visibleItemCount: 8 as 7 })),
    ).toThrow(RangeError);
    expect(() => renderHook(() => usePagination({ page: Number.NaN, totalPages: 10 }))).toThrow(
      RangeError,
    );
  });
});
