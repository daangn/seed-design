import { expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { VariantTable } from "./variant-table";

test("VariantTable excludes the same scaffolding for Kapture and Chromatic, but not components", () => {
  const { container } = render(
    <VariantTable
      variantMap={{ size: ["small", "large"], tone: ["neutral", "brand"] }}
      Component={() => <button type="button">Component under test</button>}
    />,
  );
  const chromatic = [...container.querySelectorAll('[data-chromatic="ignore"]')];
  const kapture = [...container.querySelectorAll('[data-kapture="ignore"]')];

  expect(kapture).toEqual(chromatic);
  expect(kapture).toHaveLength(10); // Header, eight variant cells, and combination count.
  expect(container.querySelector("thead")?.getAttribute("data-kapture")).toBe("ignore");
  expect(container.querySelectorAll('tbody td[data-kapture="ignore"]')).toHaveLength(8);
  const components = [...container.querySelectorAll("tbody button")];
  expect(components).toHaveLength(4);
  for (const component of components) {
    expect(component.closest('[data-kapture="ignore"], [data-chromatic="ignore"]')).toBeNull();
  }
});
