import { act, createEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as Field from "../Field/Field.namespace";
import * as TextField from "./TextField.namespace";

beforeEach(() => {
  // TextField.test.tsx와 같이 Testing Library NodesRef의 미구현 invoke를 기기처럼 아무 일도 하지 않게 둔다.
  const selectorQuery = lynx.createSelectorQuery() as unknown as {
    selectUniqueID(uniqueId: number): NodesRef;
  };
  const nodesRefPrototype = Object.getPrototypeOf(selectorQuery.selectUniqueID(0));
  vi.spyOn(nodesRefPrototype, "invoke").mockImplementation(() => ({ exec: () => {} }));
});

const onValueChange = vi.fn();

function Example() {
  return (
    <Field.Root>
      <Field.Header>
        <Field.Label>이름</Field.Label>
      </Field.Header>
      <TextField.Root onValueChange={onValueChange}>
        <TextField.Input placeholder="이름을 입력하세요" />
        <TextField.SuffixText>님</TextField.SuffixText>
      </TextField.Root>
      <Field.Footer>
        <Field.Description>설명</Field.Description>
      </Field.Footer>
    </Field.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example />));
  return { view, commits };
}

describe("TextField commits", () => {
  it("commits once on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits typing a character", async () => {
    const { view } = await mount();
    const input = view.container.querySelector("input");
    if (!input) throw new Error("Missing input");
    const init = {
      eventType: "bindEvent",
      eventName: "input",
      detail: { value: "가", selectionStart: 1, selectionEnd: 1, isComposing: false },
    };
    const event = createEvent("bindEvent:input", input, init);
    Object.assign(event, init);
    // fireEvent는 `<input>`처럼 HTML 이름과 같은 Lynx 요소를 받지 않아 직접 dispatch한다.
    const commits = await measureCommits(() => act(() => void input.dispatchEvent(event)));
    expect(onValueChange).toHaveBeenLastCalledWith("가");
    // 비제어 값 state만 바뀌고 화면에 드러나는 값이 없어 빈 commit 하나다.
    expect(commits).toMatchObject({ total: 2, nonEmpty: 0 });
  });
});
