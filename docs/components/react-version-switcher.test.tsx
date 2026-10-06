import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { getReactVersions, ReactVersionSwitcher } from "./react-version-switcher";

afterEach(() => mock.restore());

describe("ReactVersionSwitcher", () => {
  it("includes a future archive itself without exposing it in the latest menu", () => {
    expect(getReactVersions("v3")[1]).toEqual({
      label: "v3",
      url: "https://seed-design.io/react/v3",
    });
    expect(getReactVersions("").some((version) => version.label === "v3")).toBe(false);
    expect(getReactVersions("v2").filter((version) => version.label === "v2")).toHaveLength(1);
  });

  it("shows the ordered versions and marks only latest as current", async () => {
    const open = spyOn(window, "open").mockImplementation(() => null);
    render(<ReactVersionSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: "latest (v3)" }));
    const items = await screen.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "latest (v3)",
      "v2",
      "v1.2",
      "v1.1",
      "v1.0",
    ]);
    expect(items.filter((item) => item.getAttribute("aria-current") === "true")).toEqual([
      items[0],
    ]);
    fireEvent.click(items[0]!);
    expect(open).not.toHaveBeenCalled();
  });

  it.each([
    ["v2", "https://seed-design.io/react/v2"],
    ["v1.2", "https://seed-design.io/react/v1.2"],
    ["v1.1", "https://seed-design.io/react/v1.1"],
    ["v1.0", "https://seed-design.io/react/v1.0"],
  ])("opens %s in a separate tab", async (label, url) => {
    const open = spyOn(window, "open").mockImplementation(() => null);
    render(<ReactVersionSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: "latest (v3)" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: label }));
    expect(open).toHaveBeenCalledWith(url, "_blank", "noopener,noreferrer");
  });
});
