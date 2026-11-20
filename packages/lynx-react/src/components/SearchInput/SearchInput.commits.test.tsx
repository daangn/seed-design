import { act, createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as SearchInput from "./SearchInput.namespace";

beforeEach(() => {
  // Testing Library NodesRef의 미구현 invoke(setValue·focus)를 기기처럼 아무 일도 하지 않게 둔다.
  const selectorQuery = lynx.createSelectorQuery() as unknown as {
    selectUniqueID(uniqueId: number): NodesRef;
  };
  const nodesRefPrototype = Object.getPrototypeOf(selectorQuery.selectUniqueID(0));
  vi.spyOn(nodesRefPrototype, "invoke").mockImplementation(() => ({ exec: () => {} }));
});

function Example({ defaultValue }: { defaultValue?: string }) {
  return (
    <SearchInput.Root defaultValue={defaultValue}>
      <SearchInput.Input accessibility-label="검색" />
      <SearchInput.ClearButton accessibility-label="지우기" />
    </SearchInput.Root>
  );
}

async function mount(defaultValue?: string) {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example defaultValue={defaultValue} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
  });
  return { view, commits };
}

describe("SearchInput commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount("당근");
    const commits = await measureCommits(() => view.rerender(<Example defaultValue="당근" />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits typing the first character", async () => {
    const { view } = await mount();
    const input = view.container.querySelector("input");
    if (!input) throw new Error("Missing input");
    const init = {
      eventType: "bindEvent",
      eventName: "input",
      detail: { value: "당", selectionStart: 1, selectionEnd: 1 },
    };
    const event = createEvent("bindEvent:input", input, init);
    Object.assign(event, init);
    // fireEvent는 `<input>`처럼 HTML 이름과 같은 Lynx 요소를 받지 않아 직접 dispatch한다.
    const commits = await measureCommits(() => act(() => void input.dispatchEvent(event)));
    expect(view.container.querySelector(".seed-search-input__clearButton")).not.toBeNull();
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 3, nonEmpty: 1 } : { total: 1, nonEmpty: 1 },
    );
  });

  it("commits clearing", async () => {
    const { view } = await mount("당근");
    const clearButton = view.container.querySelector(".seed-search-input__clearButton");
    if (!clearButton) throw new Error("Missing clear button");
    const commits = await measureCommits(() => fireEvent.tap(clearButton));
    expect(view.container.querySelector(".seed-search-input__clearButton")).toBeNull();
    expect(commits).toMatchObject(
      usesPreact10 ? { total: 3, nonEmpty: 1 } : { total: 1, nonEmpty: 1 },
    );
  });
});
