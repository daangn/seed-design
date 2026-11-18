import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { createArchivePaths } from "@/lib/docs-archive";
import { DocsVersionSwitcher, getDocsVersions } from "./docs-version-switcher";

afterEach(() => mock.restore());

function labels(platform: "react" | "lynx", channel: string) {
  const { versions, current } = getDocsVersions(platform, createArchivePaths(channel));
  return { versions: versions.map((version) => version.label), current: current.label };
}

describe("getDocsVersions", () => {
  it.each([
    ["react", "", "latest (v3)"],
    ["react", "react/v2", "v2"],
    ["react", "react/v1.1", "v1.1"],
    ["react", "lynx/v0", "latest (v3)"],
    ["lynx", "", "latest (v1)"],
    ["lynx", "lynx/v0", "v0"],
    ["lynx", "react/v2", "latest (v1)"],
  ] as const)("marks the %s version of channel %p as %p", (platform, channel, current) => {
    expect(labels(platform, channel)).toEqual({
      versions:
        platform === "react"
          ? ["latest (v3)", "v2", "v1.2", "v1.1", "v1.0"]
          : ["latest (v1)", "v0"],
      current,
    });
  });

  it.each([
    ["react", "react/v3", ["latest (v3)", "v3", "v2", "v1.2", "v1.1", "v1.0"]],
    ["lynx", "lynx/v1", ["latest (v1)", "v1", "v0"]],
  ] as const)("lets an unlisted %s archive %p identify itself", (platform, channel, versions) => {
    const version = channel.split("/")[1];
    const result = getDocsVersions(platform, createArchivePaths(channel));
    expect(result.versions.map((item) => item.label)).toEqual([...versions]);
    expect(result.current).toEqual({
      label: version,
      url: `https://seed-design.io/${platform}/${version}`,
    });
  });
});

describe("DocsVersionSwitcher", () => {
  it.each([
    ["react", ["latest (v3)", "v2", "v1.2", "v1.1", "v1.0"]],
    ["lynx", ["latest (v1)", "v0"]],
  ] as const)("shows the ordered %s versions and marks only latest as current", async (platform, expected) => {
    const open = spyOn(window, "open").mockImplementation(() => null);
    render(<DocsVersionSwitcher platform={platform} />);
    fireEvent.click(screen.getByRole("button", { name: expected[0] }));
    const items = await screen.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([...expected]);
    expect(items.filter((item) => item.getAttribute("aria-current") === "true")).toEqual([
      items[0],
    ]);
    fireEvent.click(items[0]!);
    expect(open).not.toHaveBeenCalled();
  });

  it.each([
    ["react", "latest (v3)", "v2", "https://seed-design.io/react/v2"],
    ["react", "latest (v3)", "v1.2", "https://seed-design.io/react/v1.2"],
    ["react", "latest (v3)", "v1.1", "https://seed-design.io/react/v1.1"],
    ["react", "latest (v3)", "v1.0", "https://seed-design.io/react/v1.0"],
    ["lynx", "latest (v1)", "v0", "https://seed-design.io/lynx/v0"],
  ] as const)("opens %s %s → %s in a separate tab", async (platform, trigger, label, url) => {
    const open = spyOn(window, "open").mockImplementation(() => null);
    render(<DocsVersionSwitcher platform={platform} />);
    fireEvent.click(screen.getByRole("button", { name: trigger }));
    fireEvent.click(await screen.findByRole("menuitem", { name: label }));
    expect(open).toHaveBeenCalledWith(url, "_blank", "noopener,noreferrer");
  });
});
