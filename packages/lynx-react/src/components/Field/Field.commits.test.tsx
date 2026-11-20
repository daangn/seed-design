import { render } from "@lynx-js/react/testing-library";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { describe, expect, it } from "vitest";

import * as Field from "./Field.namespace";

function Example() {
  return (
    <Field.Root required>
      <Field.Header>
        <Field.Label>
          제목
          <Field.RequiredIndicator />
        </Field.Label>
      </Field.Header>
      <Field.Footer>
        <Field.Description>설명</Field.Description>
        <Field.CharacterCount current={3} max={10} />
      </Field.Footer>
    </Field.Root>
  );
}

async function mount() {
  let view!: ReturnType<typeof render>;
  const commits = await measureCommits(() => {
    view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
  });
  return { view, commits };
}

describe("Field commits", () => {
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
