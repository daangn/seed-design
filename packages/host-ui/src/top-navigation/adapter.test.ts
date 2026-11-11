import { describe, expect, it, mock } from "bun:test";
import { createTopNavigationAdapter, type TopNavigationButton } from "./adapter";
import type { TopNavigationHost, TopNavigationHostBar } from "./host";

function createHost() {
  const listeners = new Set<Parameters<TopNavigationHost["onButtonClick"]>[0]>();
  const requests: { id: string; bar: TopNavigationHostBar }[] = [];
  let rejectNext = false;

  const host: TopNavigationHost = {
    async update(id, bar) {
      requests.push({ id, bar });
      if (!rejectNext) return;

      rejectNext = false;
      throw new Error("rejected");
    },
    onButtonClick(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  const last = () => {
    const request = requests.at(-1);
    if (!request) throw new Error("nothing sent");

    return request;
  };

  return {
    host,
    requests,
    last,
    rejectNext: () => {
      rejectNext = true;
    },
    keys: (request = last()) => request.bar.buttons.map(({ key }) => key),
    click: (id: string, key: string) => {
      for (const listener of listeners) listener({ id, key });
    },
  };
}

const button = (overrides: Partial<TopNavigationButton> = {}): TopNavigationButton => ({
  side: "trailing",
  text: "Edit",
  onClick: () => {},
  ...overrides,
});

// `apply` resolves after the host answers; the adapter records the shown buttons only then.
const settle = () => new Promise((resolve) => setTimeout(resolve));

describe("createTopNavigationAdapter", () => {
  it("sends the title, its colour and buttons without their handlers", async () => {
    const { host, last } = createHost();
    const adapter = createTopNavigationAdapter(host);
    const back = {
      name: "icon_chevron_left_line",
      fallbackURL: "https://example.com/back.png",
    } as const;

    adapter.declare("a", {
      title: "Title",
      subtitle: "Subtitle",
      titleColor: "light",
      buttons: [
        button({ side: "leading", icon: back, text: undefined, label: "Back", identity: "back" }),
        button({ badge: "3" }),
        button({ side: "pinned", text: "Done", style: "prominent", badge: true, enabled: false }),
      ],
    });
    await adapter.apply("a");

    expect(last().bar).toEqual({
      title: "Title",
      subtitle: "Subtitle",
      titleColor: "light",
      buttons: [
        { key: "k1", side: "leading", icon: back, label: "Back" },
        { key: "k2", side: "trailing", text: "Edit", badge: "3" },
        {
          key: "k3",
          side: "pinned",
          text: "Done",
          style: "prominent",
          badge: true,
          enabled: false,
        },
      ],
    });
  });

  it("gives a button that looks like one on screen its key, and runs the new owner's onClick", async () => {
    const { host, keys, last, click } = createHost();
    const adapter = createTopNavigationAdapter(host);
    const first = mock();
    const second = mock();

    adapter.declare("a", { buttons: [button({ onClick: first })] });
    await adapter.apply("a");
    const before = keys();

    adapter.declare("b", { buttons: [button({ onClick: second })] });
    await adapter.apply("b");

    expect(keys()).toEqual(before);

    click(last().id, keys()[0] ?? "");

    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });

  it("keeps a button's key when its icon changes, and runs the latest onClick", async () => {
    const { host, keys, last, click } = createHost();
    const adapter = createTopNavigationAdapter(host);
    const stale = mock();
    const latest = mock();

    const heart = (name: `icon_${string}`) => ({
      name,
      fallbackURL: `https://example.com/${name}.png`,
    });

    adapter.declare("a", { buttons: [button({ icon: heart("icon_heart_line"), onClick: stale })] });
    await adapter.apply("a");
    const before = keys();

    adapter.declare("a", {
      buttons: [button({ icon: heart("icon_heart_fill"), onClick: latest })],
    });
    await settle();

    expect(keys()).toEqual(before);

    click(last().id, keys()[0] ?? "");

    expect(latest).toHaveBeenCalledTimes(1);
    expect(stale).not.toHaveBeenCalled();
  });

  it("routes a click after a failed request to the bar the host kept", async () => {
    const { host, keys, requests, rejectNext, click } = createHost();
    const adapter = createTopNavigationAdapter(host);
    const kept = mock();
    const rejected = mock();

    adapter.declare("a", { buttons: [button({ onClick: kept })] });
    await adapter.apply("a");
    const [applied] = requests;

    rejectNext();
    adapter.declare("b", { buttons: [button({ text: "Share", onClick: rejected })] });
    await adapter.apply("b");

    if (!applied) throw new Error("nothing sent");
    click(applied.id, keys(applied)[0] ?? "");

    expect(kept).toHaveBeenCalledTimes(1);
    expect(rejected).not.toHaveBeenCalled();
  });

  it("sends a request again after it failed", async () => {
    const { host, requests, rejectNext } = createHost();
    const adapter = createTopNavigationAdapter(host);

    adapter.declare("a", { buttons: [button()] });
    rejectNext();
    await adapter.apply("a");
    await adapter.apply("a");

    expect(requests).toHaveLength(2);
  });

  it("does not send the same bar twice", async () => {
    const { host, requests } = createHost();
    const adapter = createTopNavigationAdapter(host);

    adapter.declare("a", { title: "Title", buttons: [button()] });
    await adapter.apply("a");
    await adapter.apply("a");
    adapter.declare("a", { title: "Title", buttons: [button({ onClick: () => {} })] });
    await settle();

    expect(requests).toHaveLength(1);
  });

  it("sends a changed declaration only while its owner holds the bar", async () => {
    const { host, requests, last } = createHost();
    const adapter = createTopNavigationAdapter(host);

    adapter.declare("a", { title: "A", buttons: [] });
    adapter.declare("b", { title: "B", buttons: [] });
    await adapter.apply("b");

    adapter.declare("a", { title: "A changed", buttons: [] });
    await settle();

    expect(requests).toHaveLength(1);

    adapter.declare("b", { title: "B changed", buttons: [] });
    await settle();

    expect(last().bar.title).toBe("B changed");
  });

  it("lets a conditional button without an identity take the key of the one before it", async () => {
    const { host, keys } = createHost();
    const adapter = createTopNavigationAdapter(host);

    adapter.declare("a", { buttons: [button({ text: "Share" }), button()] });
    await adapter.apply("a");
    const [shareKey, editKey] = keys();

    adapter.declare("a", { buttons: [button()] });
    await settle();

    expect(keys()).toEqual([shareKey ?? ""]);
    expect(keys()).not.toContain(editKey);
  });

  it("keeps a conditional button's key when it has an identity", async () => {
    const { host, keys, last, click } = createHost();
    const adapter = createTopNavigationAdapter(host);
    const edit = mock();

    adapter.declare("a", {
      buttons: [
        button({ text: "Share", identity: "share" }),
        button({ identity: "edit", onClick: edit }),
      ],
    });
    await adapter.apply("a");
    const [_, editKey] = keys();

    adapter.declare("a", { buttons: [button({ identity: "edit", onClick: edit })] });
    await settle();

    expect(keys()).toEqual([editKey ?? ""]);

    click(last().id, editKey ?? "");

    expect(edit).toHaveBeenCalledTimes(1);
  });

  it("never gives one key to two buttons of a bar", async () => {
    const { host, keys } = createHost();
    const adapter = createTopNavigationAdapter(host);

    adapter.declare("a", { buttons: [button()] });
    await adapter.apply("a");

    adapter.declare("b", { buttons: [button(), button()] });
    await adapter.apply("b");

    expect(new Set(keys()).size).toBe(2);
  });

  describe("override", () => {
    it("disables the owner's buttons and still routes clicks to the owner", async () => {
      const { host, keys, last, click } = createHost();
      const adapter = createTopNavigationAdapter(host);
      const edit = mock();

      adapter.declare("a", { buttons: [button({ onClick: edit })] });
      await adapter.apply("a");
      const before = keys();

      adapter.override("a", "disabled");
      await settle();

      expect(last().bar.buttons).toEqual([
        { key: before[0] ?? "", side: "trailing", text: "Edit", enabled: false },
      ]);

      click(last().id, before[0] ?? "");

      expect(edit).toHaveBeenCalledTimes(1);
    });

    it("hides the owner's buttons and brings them back with their keys", async () => {
      const { host, keys } = createHost();
      const adapter = createTopNavigationAdapter(host);

      adapter.declare("a", { buttons: [button(), button({ text: "Share" })] });
      await adapter.apply("a");
      const before = keys();

      const release = adapter.override("a", "hidden");
      await settle();

      expect(keys()).toEqual([]);

      release();
      await settle();

      expect(keys()).toEqual(before);
    });

    it("keeps the owner's later declarations under the override", async () => {
      const { host, last } = createHost();
      const adapter = createTopNavigationAdapter(host);

      adapter.declare("a", { title: "Before", buttons: [button()] });
      await adapter.apply("a");
      adapter.override("a", "hidden");

      adapter.declare("a", { title: "After", buttons: [button()] });
      await settle();

      expect(last().bar).toEqual({ title: "After", buttons: [] });
    });

    it("sends nothing when an override is released and set again at once", async () => {
      const { host, requests } = createHost();
      const adapter = createTopNavigationAdapter(host);

      adapter.declare("a", { buttons: [button()] });
      await adapter.apply("a");
      adapter.override("a", "hidden")();
      adapter.override("a", "hidden");
      await settle();

      expect(requests).toHaveLength(2);
    });

    it("does not send for an owner that does not hold the bar", async () => {
      const { host, requests } = createHost();
      const adapter = createTopNavigationAdapter(host);

      adapter.declare("a", { buttons: [button()] });
      adapter.declare("b", { buttons: [] });
      await adapter.apply("b");

      adapter.override("a", "hidden");
      await settle();

      expect(requests).toHaveLength(1);
    });
  });

  it("drops a released owner's buttons, so a late click runs nothing", async () => {
    const { host, keys, last, click } = createHost();
    const adapter = createTopNavigationAdapter(host);
    const edit = mock();

    adapter.declare("a", { buttons: [button({ onClick: edit })] });
    await adapter.apply("a");

    adapter.release("a");
    click(last().id, keys()[0] ?? "");

    expect(edit).not.toHaveBeenCalled();
  });
});
