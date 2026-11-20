import * as React from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { measureCommits, usesPreact10 } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import type { LynxIconElementProps } from "../../types";
import * as FieldButton from "./FieldButton.namespace";

const TestIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => (
  <image {...props} {...(ref ? { "main-thread:ref": ref } : {})} src="clear.png" />
));
TestIcon.displayName = "TestIcon";

// Root는 값을 소유하지 않으므로 소비자처럼 state로 values를 갖는다.
function Example() {
  const [values, setValues] = React.useState(["판교동"]);
  return (
    <FieldButton.Root values={values} onValuesChange={setValues}>
      <FieldButton.Button accessibility-label="지역 선택" />
      {values.length > 0 ? (
        <FieldButton.Value>{values.join(", ")}</FieldButton.Value>
      ) : (
        <FieldButton.Placeholder>지역을 선택하세요</FieldButton.Placeholder>
      )}
      <FieldButton.ClearButton icon={<TestIcon />} accessibility-label="지우기" />
    </FieldButton.Root>
  );
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("FieldButton commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  // Preact 10에서는 같은 props로 rerender할 때마다 ClearButton 요소의 spread(useScaleFeedback worklet·합성
  // `main-thread:ref`)와 아이콘의 `main-thread:binduiappear` worklet을 새 실행 id로 다시 보낸다(FieldButton.tsx
  // FieldButtonClearButton, hooks/useIconColor.ts). 원인은 확인하지 못했다. 현재: Preact 10은 1회 중 patch 있는
  // commit 1회, 0.126 이상은 빈 commit 1회.
  (usesPreact10 ? it.fails : it)(
    "sends only empty commits when rerendered with the same props",
    async () => {
      const { view } = await mount();
      const commits = await measureCommits(() => view.rerender(<Example />));
      expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
    },
  );

  it("commits clearing the value", async () => {
    const { view } = await mount();
    const clear = view.container.querySelector(".seed-field-button__clearButton");
    if (!clear) throw new Error("Missing clear button");
    const commits = await measureCommits(() => fireEvent.tap(clear));
    expect(view.container.querySelector(".seed-field-button__placeholder")).not.toBeNull();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });
});
