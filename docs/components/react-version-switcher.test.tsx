import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { getReactVersions, ReactVersionSwitcher } from "./react-version-switcher";

afterEach(() => mock.restore());

describe("ReactVersionSwitcher", () => {
  it("includes a future archive itself without exposing it in the latest menu", () => {
    expect(getReactVersions("3.0")[1]).toEqual({
      label: "3.0",
      url: "https://seed-design.io/react/3.0",
    });
    expect(getReactVersions("").some((version) => version.label === "3.0")).toBe(false);
    expect(getReactVersions("2.0").filter((version) => version.label === "2.0")).toHaveLength(1);
  });

  it("shows the ordered versions and marks only latest as current", async () => {
    const open = spyOn(window, "open").mockImplementation(() => null);
    render(<ReactVersionSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: "latest" }));
    const items = await screen.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(["latest", "2.0", "1.2", "1.1", "1.0"]);
    expect(items.filter((item) => item.getAttribute("aria-current") === "true")).toEqual([
      items[0],
    ]);
    fireEvent.click(items[0]!);
    expect(open).not.toHaveBeenCalled();
  });

  it.each([
    ["2.0", "https://seed-design.io/react/2.0"],
    ["1.2", "https://v1-2.seed-design.io/react"],
  ])("opens %s in a separate tab", async (label, url) => {
    const open = spyOn(window, "open").mockImplementation(() => null);
    render(<ReactVersionSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: "latest" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: label }));
    expect(open).toHaveBeenCalledWith(url, "_blank", "noopener,noreferrer");
  });
});
