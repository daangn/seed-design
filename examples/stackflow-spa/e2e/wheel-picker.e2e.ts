import { expect, test } from "@playwright/test";

interface OutlineSample {
  alpha: number;
  color: string;
}

type InstrumentedColumn = HTMLElement & {
  outlineObserver?: MutationObserver;
  outlineSamples?: OutlineSample[];
};

test("외부 값 변경 시 선택 항목에 outline 색상이 나타나지 않는다", async ({ page }) => {
  await page.goto("/wheel-picker");

  const dayColumn = page.getByRole("spinbutton", { name: "일" });
  await expect(dayColumn).toBeVisible();

  await dayColumn.evaluate((element: InstrumentedColumn) => {
    element.outlineSamples = [];

    const sampleSelectedItem = () => {
      const selectedItem = element.querySelector<HTMLElement>(
        '[aria-selected="true"], [data-selected]',
      );
      if (!selectedItem) return;

      const color = getComputedStyle(selectedItem).outlineColor;
      const components = color.match(/[\d.]+/g)?.map(Number) ?? [];
      const alpha = components.length === 4 ? components[3] : 1;

      element.outlineSamples?.push({ alpha, color });
    };

    element.outlineObserver = new MutationObserver(() => {
      sampleSelectedItem();
      requestAnimationFrame(sampleSelectedItem);
      setTimeout(sampleSelectedItem, 50);
    });
    element.outlineObserver.observe(element, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-selected", "data-selected"],
    });
  });

  await page.getByRole("button", { name: "다음 날로 변경" }).click();

  await expect
    .poll(() =>
      dayColumn.evaluate((element: InstrumentedColumn) => element.outlineSamples?.length ?? 0),
    )
    .toBeGreaterThanOrEqual(3);

  const samples = await dayColumn.evaluate((element: InstrumentedColumn) => {
    element.outlineObserver?.disconnect();
    return element.outlineSamples ?? [];
  });

  expect(
    Math.max(...samples.map(({ alpha }) => alpha)),
    `관찰한 outline 색상: ${samples.map(({ color }) => color).join(", ")}`,
  ).toBe(0);
});
