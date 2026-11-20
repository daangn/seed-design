import { render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as RadioGroup from "../RadioGroup/RadioGroup.namespace";
import * as RadioGroupField from "./RadioGroupField.namespace";

// 선택 commit은 RadioGroupField.Root로 감싼 RadioGroup.commits.test.tsx가 센다.
function Example() {
  return (
    <RadioGroupField.Root defaultValue="0" accessibility-label="과일">
      <RadioGroupField.Header>
        <RadioGroupField.Label>
          과일
          <RadioGroupField.RequiredIndicator />
        </RadioGroupField.Label>
      </RadioGroupField.Header>
      <RadioGroup.Root>
        {["0", "1"].map((value) => (
          <RadioGroup.Item key={value} value={value} accessibility-label={`항목 ${value}`}>
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>{`항목 ${value}`}</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
      <RadioGroupField.Footer>
        <RadioGroupField.Description>하나를 고르세요</RadioGroupField.Description>
      </RadioGroupField.Footer>
    </RadioGroupField.Root>
  );
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("RadioGroupField commits", () => {
  it("does not commit after hydration on mount", async () => {
    const { commits } = await mount();
    expect(commits).toMatchObject({ total: 0, nonEmpty: 0 });
  });

  it("sends only empty commits when rerendered with the same props", async () => {
    const { view } = await mount();
    const commits = await measureCommits(() => view.rerender(<Example />));
    expect(commits).toMatchObject({ total: 1, nonEmpty: 0 });
  });
});
