import { expect, test } from "@playwright/test";

test.use({ screenshot: "on" });

test("스와이프백 시작 시 입력 포커스를 해제하고 취소해도 다시 포커스하지 않는다", async ({
  page,
}) => {
  await page.goto("/swipe-back-keyboard");
  await page.getByRole("button", { name: "입력 화면 한 장 더 열기" }).click();
  const input = page.getByRole("textbox", { name: "검색어" }).last();
  await input.tap();
  await input.fill("당근 검색");
  await expect(input).toBeFocused();
  const initialX = await input.evaluate((element) => element.getBoundingClientRect().x);

  // Hit-test the actual left edge. Keep the finger down while asserting focus:
  // a blur caused only by popping/unmounting the screen must not pass this test.
  const target = await page.evaluateHandle(() => document.elementFromPoint(5, 300)!);
  const touch = { identifier: 1, clientX: 5, clientY: 300 };
  await target.evaluate((element, point) => {
    const finger = { ...point, target: element };
    element.dispatchEvent(
      Object.assign(new Event("touchstart", { bubbles: true }), {
        touches: [finger],
        changedTouches: [finger],
      }),
    );
  }, touch);
  await expect(input).not.toBeFocused();
  await expect(input).toBeVisible();

  await target.evaluate(async (element, point) => {
    // Velocity is measured on touchmove, so wait before moving as well.
    await new Promise((resolve) => setTimeout(resolve, 100));
    const finger = { ...point, clientX: 25, target: element };
    element.dispatchEvent(
      Object.assign(new Event("touchmove", { bubbles: true }), {
        touches: [finger],
        changedTouches: [finger],
      }),
    );
  }, touch);
  await expect
    .poll(() => input.evaluate((element) => element.getBoundingClientRect().x))
    .toBeGreaterThan(initialX + 10);
  await target.evaluate((element, point) => {
    const finger = { ...point, clientX: 25, target: element };
    element.dispatchEvent(
      Object.assign(new Event("touchend", { bubbles: true }), {
        touches: [],
        changedTouches: [finger],
      }),
    );
  }, touch);
  await expect
    .poll(() => input.evaluate((element) => element.getBoundingClientRect().x))
    .toBeCloseTo(initialX, 0);
  await expect(input).toBeVisible();
  await expect(input).toHaveValue("당근 검색");
  await expect(input).not.toBeFocused();
});
