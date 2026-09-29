import { render } from "@testing-library/react";
import { expect, test } from "bun:test";
import { useLayoutEffect } from "react";
import { SeedThemeBoundary } from "./decorator";

test("applies theme and scale before child layout measurement, including parameter changes", () => {
  const measured: string[][] = [];
  function Probe() {
    useLayoutEffect(() => {
      measured.push([
        document.documentElement.dataset.seedColorMode ?? "",
        document.documentElement.style.getPropertyValue("--base-font-size"),
      ]);
    }, []);
    return <div>Measured</div>;
  }
  const view = render(
    <SeedThemeBoundary theme="dark" fontScale="Extra Small">
      <Probe />
    </SeedThemeBoundary>,
  );
  expect(measured).toEqual([["dark-only", "14px"]]);
  view.rerender(
    <SeedThemeBoundary theme="light" fontScale="Extra Extra Extra Large">
      <Probe />
    </SeedThemeBoundary>,
  );
  expect(measured).toEqual([
    ["dark-only", "14px"],
    ["light-only", "23px"],
  ]);
  view.rerender(
    <SeedThemeBoundary theme="light">
      <Probe />
    </SeedThemeBoundary>,
  );
  expect(measured.at(-1)).toEqual(["light-only", ""]);
});
