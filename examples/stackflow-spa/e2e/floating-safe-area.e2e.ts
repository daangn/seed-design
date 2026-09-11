import { expect, test, type Page } from "@playwright/test";

test.use({ viewport: { width: 800, height: 800 } });

async function setInsets(page: Page, top: number, bottom: number) {
  await page.getByTestId("positioner").evaluate(
    (element, insets) => {
      element.style.setProperty("--seed-safe-area-top", `${insets.top}px`);
      element.style.setProperty("--seed-safe-area-bottom", `${insets.bottom}px`);
      window.dispatchEvent(new Event("resize"));
    },
    { top, bottom },
  );
}

async function bounds(page: Page) {
  return page.getByTestId("positioner").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, height: rect.height };
  });
}

for (const kind of ["menu", "navigation-menu", "floating"]) {
  test(`${kind}: shift follows safe area and restores overflowPadding after resize`, async ({
    page,
  }) => {
    await page.goto(`/e2e/fixtures/safe-area.html?kind=${kind}&scenario=shift`);
    await expect.poll(async () => (await bounds(page)).top).toBe(16);
    await setInsets(page, 80, 96);
    await expect.poll(async () => (await bounds(page)).top).toBe(80);
    await setInsets(page, 0, 0);
    await expect.poll(async () => (await bounds(page)).top).toBe(16);
  });

  test(`${kind}: flips when the safe area leaves insufficient space above`, async ({ page }) => {
    await page.goto(`/e2e/fixtures/safe-area.html?kind=${kind}&scenario=flip`);
    await expect.poll(async () => (await bounds(page)).bottom).toBeLessThanOrEqual(160);
    await setInsets(page, 80, 96);
    await expect.poll(async () => (await bounds(page)).top).toBeGreaterThanOrEqual(184);
  });
}

for (const kind of ["menu", "navigation-menu"]) {
  test(`${kind}: available height excludes the bottom safe area`, async ({ page }) => {
    await page.goto(`/e2e/fixtures/safe-area.html?kind=${kind}&scenario=size`);
    await expect.poll(async () => (await bounds(page)).bottom).toBe(784);
    await setInsets(page, 80, 96);
    await expect.poll(async () => (await bounds(page)).bottom).toBe(704);
    await expect.poll(async () => (await bounds(page)).height).toBe(512);
  });
}
