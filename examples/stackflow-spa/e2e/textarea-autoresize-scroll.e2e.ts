import { type Locator, expect, test } from "@playwright/test";

// AppScreen scrolls a layer element rather than the document, so take whichever
// ancestor actually scrolls.
function scrollContainerTop(textarea: Locator, scrollTo?: "bottom") {
  return textarea.evaluate((element, target) => {
    let container: Element | null = element.parentElement;
    while (
      container &&
      !(
        container.scrollHeight > container.clientHeight &&
        /auto|scroll/.test(getComputedStyle(container).overflowY)
      )
    ) {
      container = container.parentElement;
    }
    const scroller = container ?? document.scrollingElement!;
    if (target === "bottom") scroller.scrollTop = scroller.scrollHeight;
    return scroller.scrollTop;
  }, scrollTo);
}

test("autoresize textarea를 편집해도 스크롤 위치가 유지된다", async ({ page }) => {
  await page.goto("/e2e/textarea-autoresize-scroll");
  const textarea = page.getByTestId("autoresize-textarea");
  await expect(textarea).toBeVisible();

  // The caret sits mid-textarea, on screen both before and after a jump. A caret
  // pushed off screen gets revealed after the edit, which can undo the jump.
  await textarea.evaluate((element: HTMLTextAreaElement) => {
    element.focus();
    const end = element.value.split("\n").slice(0, 20).join("\n").length;
    element.setSelectionRange(end, end);
  });
  await expect(textarea).toBeFocused();

  // Focusing can scroll the caret into view, so fix the scroll position afterwards.
  const scrollTop = await scrollContainerTop(textarea, "bottom");
  expect(scrollTop).toBeGreaterThan(0);
  // Chromium's scroll anchoring hides the jump while an element above the
  // textarea is on screen as the anchor; editing happens with the textarea on top.
  await expect(textarea).toBeInViewport();

  await page.keyboard.press("Backspace");
  await expect(textarea).toHaveValue(/\n20번째 \n/);
  expect(await scrollContainerTop(textarea)).toBeCloseTo(scrollTop, 0);

  await page.keyboard.type("줄");
  await expect(textarea).toHaveValue(/\n20번째 줄\n/);
  expect(await scrollContainerTop(textarea)).toBeCloseTo(scrollTop, 0);
});
