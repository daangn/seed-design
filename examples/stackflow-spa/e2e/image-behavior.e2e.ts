import { type Locator, expect, test } from "@playwright/test";

const HELD_IMAGE_URL = "http://e2e.invalid/held.png";
const LAZY_IMAGE_URL = "http://e2e.invalid/lazy.png";
const PNG_1X1 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

async function expectOnTop(overlay: Locator) {
  await overlay.scrollIntoViewIfNeeded();
  const box = await overlay.boundingBox();
  if (!box) throw new Error("overlay의 레이아웃이 필요합니다.");

  const isOnTop = await overlay.evaluate((element, bounds) => {
    const hit = element.ownerDocument.elementFromPoint(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    return hit !== null && element.contains(hit);
  }, box);

  expect(isOnTop).toBe(true);
}

test.describe("ImageFrame 이미지 동작", () => {
  test("lazy 이미지는 뷰포트 밖 레이아웃을 유지하고 진입 후 로드된다", async ({ page }) => {
    await page.route(LAZY_IMAGE_URL, (route) =>
      route.fulfill({ contentType: "image/png", body: Buffer.from(PNG_1X1, "base64") }),
    );
    await page.goto("/e2e/image-behavior");

    const image = page
      .getByTestId("lazy-image-frame")
      .getByRole("img", { name: "Lazy E2E fixture" });
    await expect(image).toBeAttached();
    await expect(image).toHaveAttribute("data-loading-state", "loading");
    await expect(image).not.toHaveAttribute("hidden", /.*/);
    await expect(image).toHaveCSS("display", "block");
    expect(await image.evaluate((element: HTMLImageElement) => element.complete)).toBe(false);

    await image.scrollIntoViewIfNeeded();

    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
      .toBeGreaterThan(0);
    await expect(image).toHaveAttribute("data-loading-state", "loaded");
  });

  test("보류된 이미지는 fallback과 겹친 레이아웃을 유지하고 interaction을 가로채지 않는다", async ({
    page,
  }) => {
    await page.route(HELD_IMAGE_URL, () => {});
    const heldImageRequest = page.waitForRequest(HELD_IMAGE_URL);
    await page.goto("/e2e/image-behavior", { waitUntil: "domcontentloaded" });
    await heldImageRequest;

    const root = page.getByTestId("held-image-frame");
    const image = root.getByRole("img", { name: "Held E2E fixture" });
    const fallback = root.getByTestId("held-image-fallback");

    await expect(image).toHaveAttribute("data-loading-state", "loading");
    await expect(image).not.toHaveAttribute("hidden", /.*/);
    await expect(image).toHaveCSS("display", "block");

    const imageBox = await image.boundingBox();
    const fallbackBox = await fallback.boundingBox();
    if (!imageBox || !fallbackBox) throw new Error("이미지와 fallback의 레이아웃이 필요합니다.");
    expect(Math.abs(imageBox.x - fallbackBox.x)).toBeLessThan(1);
    expect(Math.abs(imageBox.y - fallbackBox.y)).toBeLessThan(1);
    expect(Math.abs(imageBox.width - fallbackBox.width)).toBeLessThan(1);
    expect(Math.abs(imageBox.height - fallbackBox.height)).toBeLessThan(1);

    await expectOnTop(fallback);
    await fallback.click();
    await expect(fallback).toHaveAttribute("aria-pressed", "true");
  });

  test("이미지 요청 실패 시 이미지는 숨고 fallback이 프레임을 채운다", async ({ page }) => {
    await page.route(HELD_IMAGE_URL, (route) => route.abort());
    await page.goto("/e2e/image-behavior");

    const root = page.getByTestId("held-image-frame");
    const image = root.getByRole("img", { name: "Held E2E fixture", includeHidden: true });
    const fallback = root.getByTestId("held-image-fallback");

    await expect(image).toHaveAttribute("data-loading-state", "error");
    await expect(image).toHaveAttribute("hidden", /.*/);
    await expect(image).toHaveCSS("display", "none");
    await expect(fallback).toBeVisible();

    const fallbackBox = await fallback.boundingBox();
    if (!fallbackBox) throw new Error("fallback의 레이아웃이 필요합니다.");
    expect(fallbackBox.width).toBeGreaterThan(0);
    expect(fallbackBox.height).toBeGreaterThan(0);
  });

  test("ImageFrame overlay는 로드된 이미지 위에서 hit-test된다", async ({ page }) => {
    await page.goto("/e2e/image-behavior");

    const overlays = ["badge", "icon", "indicator", "reaction"];
    for (const overlay of overlays) {
      const root = page.getByTestId(`overlay-${overlay}-frame`);
      await expect(root.getByRole("img", { name: `${overlay} overlay fixture` })).toHaveAttribute(
        "data-loading-state",
        "loaded",
      );
      await expectOnTop(root.getByTestId(`overlay-${overlay}`));
    }
  });
});
