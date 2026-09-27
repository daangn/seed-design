import { expect, test } from "@playwright/test";

test.skip(({ browserName }) => browserName === "webkit", "WebKit's Tab skips buttons");

test("Shift+Tab leaves the menu on the previous button inside AppScreen", async ({ page }) => {
  await page.goto("/menu", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "Small", exact: true });
  await trigger.click();
  await expect(page.getByRole("menu")).toBeVisible();

  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Shift+Tab");

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("button", { name: "Medium", exact: true })).toBeFocused();
});

test("Shift+Tab leaves the select on the previous trigger inside AppScreen", async ({ page }) => {
  await page.goto("/select", { waitUntil: "networkidle" });
  const trigger = page.getByRole("combobox", { name: "과일 medium", exact: true });
  await trigger.click();
  await expect(page.getByRole("listbox")).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Shift+Tab");

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("combobox", { name: "과일 large", exact: true })).toBeFocused();
});
