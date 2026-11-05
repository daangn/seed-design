import * as React from "@lynx-js/react";
import { act, render } from "@lynx-js/react/testing-library";
import { expect, it, vi } from "vitest";
import * as Tabs from "./Tabs.namespace.js";
import { useTabsList } from "./useTabsList.js";

const measure = vi.hoisted(() =>
  vi.fn(async () => ({
    start: 16,
    end: 16,
    viewportStart: 84,
    viewportEnd: 0,
  })),
);

vi.mock("@lynx-js/react", async (importOriginal) => ({
  ...(await importOriginal<typeof React>()),
  runOnMainThread: () => measure,
}));

it("remeasures changed inset expressions without looping on inline hook options", async () => {
  function List({ start, end }: { start: string; end: string }) {
    // Direct hook consumers commonly create options during each render.
    const api = useTabsList({ viewportInsets: { start, end } });
    return <scroll-view {...api.listProps} />;
  }
  function Subject({ reversed = false }: { reversed?: boolean }) {
    return (
      <Tabs.Root>
        <List start={reversed ? "0px" : "84px"} end={reversed ? "84px" : "0px"} />
      </Tabs.Root>
    );
  }
  const { rerender } = render(<Subject />);
  await act(async () => {
    await Promise.resolve();
  });
  expect(measure).toHaveBeenCalledTimes(1);

  await act(async () => {
    rerender(<Subject reversed />);
    await Promise.resolve();
  });
  expect(measure).toHaveBeenCalledTimes(2);

  await act(async () => {
    rerender(<Subject reversed />);
    await Promise.resolve();
  });
  expect(measure).toHaveBeenCalledTimes(2);
});
