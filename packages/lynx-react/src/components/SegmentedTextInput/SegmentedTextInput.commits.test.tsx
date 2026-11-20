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

async function mount(count: number) {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example count={count} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
  });
  return { view, commits };
}

describe("SegmentedTextInput commits", () => {
  it.each([2, 6])("does not commit after hydration when %i segments mount", async (count) => {
    const { commits } = await mount(count);
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount(2);
    const commits = await measureCommits(() => view.rerender(<Example count={2} />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  // 한 Segment에 입력해도 Root의 값 context가 바뀌어 모든 Segment가 다시 렌더되고, Segment마다 commit이 하나씩 생긴다
  // (lynx-react-headless/segmented-text-input/src/SegmentedTextInput.tsx
  // SegmentedTextInputProvider의 api). context 구독으로 다시 렌더되는 Segment마다 ReactLynx가 commit을 따로 보내는 것으로
  // 보인다. 현재: 2개 3회·6개 7회, patch 있는 commit은 둘 다 1회. Preact 10도 같다.
  it.fails("does not scale typing commits with the segment count", async () => {
    const type = async (count: number) => {
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
      expect(view.container.querySelectorAll(".seed-segmented-text-input__filledDot")).toHaveLength(
        1,
      );
      view.unmount();
      return commits;
    };
    const few = await type(2);
    const many = await type(6);
    expect(many.total).toBe(few.total);
  });
});
