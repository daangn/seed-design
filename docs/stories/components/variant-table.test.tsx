import { expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { VariantTable } from "./variant-table";

test.each([
  { size: ["small", "large"], tone: ["neutral", "brand"] },
  { size: ["small", "medium", "large"] },
  {},
])("VariantTable ignores scaffolding but preserves every component (%j)", (variantMap) => {
  const { container } = render(
    <VariantTable
      variantMap={variantMap}
      Component={() => <button type="button">Component under test</button>}
    />,
  );
  const chromatic = [...container.querySelectorAll('[data-chromatic="ignore"]')];
  const kapture = [...container.querySelectorAll('[data-kapture="ignore"]')];

  expect(kapture).toEqual(chromatic);
  expect(container.querySelector("thead")?.getAttribute("data-kapture")).toBe("ignore");
  const rows = [...container.querySelectorAll("tbody tr")];
  const combinations = Object.values(variantMap).reduce(
    (count, values) => count * values.length,
    1,
  );
  expect(rows).toHaveLength(combinations);
  for (const row of rows) {
    const cells = [...row.querySelectorAll("td")];
    expect(cells).toHaveLength(Object.keys(variantMap).length + 1);
    for (const cell of cells) {
      if (cell.querySelector("button")) {
        expect(cell.closest('[data-kapture="ignore"], [data-chromatic="ignore"]')).toBeNull();
      } else {
        expect(cell.closest('[data-kapture="ignore"]')).not.toBeNull();
      }
    }
  }
  const components = [...container.querySelectorAll("tbody button")];
  expect(components).toHaveLength(combinations);
  for (const component of components) {
    expect(component.closest('[data-kapture="ignore"], [data-chromatic="ignore"]')).toBeNull();
  }
  const summary = [...container.querySelectorAll("div")].find(
    (element) => element.textContent === `총 ${combinations}개의 조합이 있습니다.`,
  );
  expect(summary?.getAttribute("data-kapture")).toBe("ignore");
});
