import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LynxComponentQRCode } from "./qr-code";

const oldPath = "/__lynx__/app-bar/preview.4f75d929.lynx.bundle";
const newPath = "/__lynx__/app-bar/preview.9df621b8.lynx.bundle";
let fetchSpy: ReturnType<typeof spyOn<typeof globalThis, "fetch">>;
const originalUrl = window.location.href;
beforeEach(() => {
  window.location.href = "https://docs.example.com/lynx/components/app-bar";
});
afterEach(() => {
  fetchSpy?.mockRestore();
  window.location.href = originalUrl;
});

function renderExample() {
  return render(<LynxComponentQRCode name="lynx/app-bar/preview" bundlePath={oldPath} />);
}

describe("LynxComponentQRCode", () => {
  it("only exposes the verified replacement with an update notice", async () => {
    fetchSpy = spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(
        Response.json({
          schemaVersion: 1,
          examples: {
            "lynx/app-bar/preview": {
              web: "/__lynx__/app-bar/preview.12345678.web.bundle",
              lynx: newPath,
            },
          },
        }),
      )
      .mockResolvedValueOnce(new Response());
    renderExample();
    const link = await screen.findByRole("link", { name: "Open In Lynx Explorer" });
    const native = new URL(newPath, window.location.origin);
    native.searchParams.set("fullscreen", "true");
    expect(link.getAttribute("href")).toBe(`lynx://open?url=${encodeURIComponent(native.href)}`);
    expect(screen.getByRole("status").textContent).toContain("예제가 업데이트되어");
    await screen.findByRole("img", { name: "Lynx Explorer 실행 QR 코드" });
  });

  it("hides a broken link and allows retrying after a network error", async () => {
    fetchSpy = spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new TypeError("network offline"))
      .mockResolvedValueOnce(new Response());
    renderExample();
    await screen.findByRole("button", { name: "다시 확인" });
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "다시 확인" }));
    await screen.findByRole("link", { name: "Open In Lynx Explorer" });
    expect(screen.queryByRole("status")).toBeNull();
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
  });
});
