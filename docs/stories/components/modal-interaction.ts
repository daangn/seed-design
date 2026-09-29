import { expect, userEvent, waitFor, within } from "storybook/test";

export async function verifyModalInteraction({ canvasElement }: { canvasElement: HTMLElement }) {
  const doc = canvasElement.ownerDocument;
  const page = within(doc.body);
  const trigger = page.getByRole("button", { name: "Open modal" });
  await userEvent.click(trigger);
  const dialog = await page.findByRole("dialog");
  await waitFor(() => {
    expect(dialog.contains(doc.activeElement)).toBe(true);
    expect(doc.documentElement.style.overflow).toBe("hidden");
  });
  // 양방향으로 마지막/첫 번째 탭 정지점을 넘어도 모달 안에 머무는지 확인한다.
  const tabStops = within(dialog).getAllByRole("button").length;
  for (const shift of [false, true]) {
    for (let index = 0; index <= tabStops; index++) {
      await userEvent.tab({ shift });
      expect(dialog.contains(doc.activeElement)).toBe(true);
    }
  }
  await userEvent.keyboard("{Escape}");
  await waitFor(() => {
    expect(dialog).not.toBeVisible();
    expect(doc.documentElement.style.overflow).not.toBe("hidden");
    expect(doc.activeElement).toBe(trigger);
  });
  await userEvent.click(trigger);
  await waitFor(() => expect(page.getByRole("dialog")).toBeVisible());
}
