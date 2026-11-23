import * as React from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
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

// 빈 화면을 hydrate한 뒤 mount해야 mount commit이 hydration에 합쳐지지 않는다.
async function mount() {
  const view = render(<view />, { enableMainThread: true, enableBackgroundThread: true });
  const commits = await measureCommits(() => view.rerender(<Example />));
  return { view, commits };
}

async function rerenderWithSameProps() {
  const { view } = await mount();
  return measureCommits(() => view.rerender(<Example />));
}

describe("FieldButton commits", () => {
  it("commits once on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    expect(await rerenderWithSameProps()).toMatchObject({ total: 1, nonEmpty: 0 });
  });

  it("commits clearing the value", async () => {
    const { view } = await mount();
    const clear = view.container.querySelector(".seed-field-button__clearButton");
    if (!clear) throw new Error("Missing clear button");
    const commits = await measureCommits(() => fireEvent.tap(clear));
    expect(view.container.querySelector(".seed-field-button__placeholder")).not.toBeNull();
    expect(commits).toMatchObject({ total: 1, nonEmpty: 1 });
  });
});
