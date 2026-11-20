import { act, createEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as SegmentedTextInput from "./SegmentedTextInput.namespace";

beforeEach(() => {
  // Testing Library NodesRef의 미구현 invoke(focus·setValue)를 기기처럼 아무 일도 하지 않게 둔다.
  const selectorQuery = lynx.createSelectorQuery() as unknown as {
    selectUniqueID(uniqueId: number): NodesRef;
  };
  const nodesRefPrototype = Object.getPrototypeOf(selectorQuery.selectUniqueID(0));
  vi.spyOn(nodesRefPrototype, "invoke").mockImplementation(() => ({ exec: () => {} }));
});

function Example({ count }: { count: number }) {
  return (
    <SegmentedTextInput.Root>
      {Array.from({ length: count }, (_, index) => `번호 ${index + 1}`).map((label, index) => (
        <SegmentedTextInput.Segment
          key={label}
          accessibility-label={label}
          length={4}
          masked={index > 0}
        />
      ))}
    </SegmentedTextInput.Root>
  );
}

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount(count: number) {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example count={count} />));
  return { view, commits };
}

// 두 번째 Segment에 한 글자를 입력한다.
async function type(count: number) {
  const { view } = await mount(count);
  const input = view.container.querySelectorAll("input")[1];
  if (!input) throw new Error("Missing input");
  const init = {
    eventType: "bindEvent",
    eventName: "input",
    detail: { value: "1", selectionStart: 1, selectionEnd: 1, isComposing: false },
  };
  const event = createEvent("bindEvent:input", input, init);
  Object.assign(event, init);
  // fireEvent는 `<input>`처럼 HTML 이름과 같은 Lynx 요소를 받지 않아 직접 dispatch한다.
  const commits = await measureCommits(() => act(() => void input.dispatchEvent(event)));
  expect(view.container.querySelectorAll(".seed-segmented-text-input__filledDot")).toHaveLength(1);
  view.unmount();
  return commits;
}

describe("SegmentedTextInput commits", () => {
  it.each([2, 6])("commits once when %i segments mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => view.rerender(<Example count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // 입력 commit이 Segment 수에 비례하는 것으로 보인다. 같은 vnode를 다시 렌더링하지 않고 건너뛰어, Root의 값
  // context를 구독한 Segment마다 commit이 따로 생긴다(lynx-react-headless/segmented-text-input/src/SegmentedTextInput.tsx
  // SegmentedTextInputProvider의 api → SegmentedTextInput.tsx SegmentedTextInputInputSegment).
  it.fails("does not scale typing commits with the segment count", async () => {
    const few = await type(2);
    const many = await type(6);
    expect(many.total).toBe(few.total);
    expect(few).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("currently scales typing commits with the segment count", async () => {
    expect(await type(2)).toMatchObject({ total: 3, nonEmpty: 1 });
    expect(await type(6)).toMatchObject({ total: 7, nonEmpty: 1 });
  });
});
