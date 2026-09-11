import { expect, test } from "@playwright/test";

test("Shift+Tab leaves the popover on the previous button inside AppScreen", async ({ page }) => {
  await page.goto("/popover", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "가운데 trigger", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "경계 테스트" })).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Shift+Tab");

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("button", { name: "이전 버튼", exact: true })).toBeFocused();
});

test("Tab closes with focusOut and preserves focus outside the popover", async ({ page }) => {
  await page.goto("/popover", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "바깥 popover", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "바깥 레이어", exact: true })).toBeFocused();

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "안쪽 popover", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("outer close · focusOut", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "바깥 클릭 무시", exact: true })).toBeFocused();
});
