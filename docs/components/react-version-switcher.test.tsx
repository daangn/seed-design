import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReactVersionSwitcher } from "./react-version-switcher";

afterEach(() => mock.restore());

describe("ReactVersionSwitcher", () => {
  it("shows the ordered versions and marks only v3 as current", async () => {
    const open = spyOn(window, "open").mockImplementation(() => null);
    render(<ReactVersionSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: "v3.0 (latest)" }));
    const items = await screen.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "v3.0 (latest)",
      "v2.0",
      "v1.2",
      "v1.1",
      "v1.0",
      "v0 (legacy)",
    ]);
    expect(items.filter((item) => item.getAttribute("aria-current") === "true")).toEqual([
      items[0],
    ]);
    fireEvent.click(items[0]!);
    expect(open).not.toHaveBeenCalled();
  });

  it.each([
    ["v2.0", "https://v2.seed-design.io/react"],
    ["v0 (legacy)", "https://v0.seed-design.io"],
  ])("opens %s in a separate tab", async (label, url) => {
    const open = spyOn(window, "open").mockImplementation(() => null);
    render(<ReactVersionSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: "v3.0 (latest)" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: label }));
    expect(open).toHaveBeenCalledWith(url, "_blank", "noopener,noreferrer");
  });
});
