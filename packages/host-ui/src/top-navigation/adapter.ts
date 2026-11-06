/**
 * Turns bar declarations into host updates, and routes the host's clicks back to the `onClick` of
 * the button that was on screen. Knows nothing of screens or stackflow: a bar's owner is an opaque
 * string the caller passes.
 */

import type { TopNavigationHost, TopNavigationHostBar } from "./host";

/** A SEED icon. The host draws its own copy of `name` when it has one, and `fallbackURL` otherwise. */
export interface TopNavigationIcon {
  name: `icon_${string}`;
  fallbackURL: string;
}

export interface TopNavigationButton {
  side: "leading" | "trailing" | "pinned";
  icon?: TopNavigationIcon;
  text?: string;
  /** Accessible name of an icon button. */
  label?: string;
  style?: "plain" | "prominent";
  /** `true` is a dot; a string is drawn inside the badge as it is, so a count is written `"3"`. */
  badge?: true | string;
  enabled?: boolean;
  onClick: () => void;
  /** Like a React `key`: only needed when a conditional button would shift the ones after it. */
  identity?: string;
}

export interface TopNavigationBar {
  title?: string;
  subtitle?: string;
  /** Colour of the title and subtitle. `default`, like leaving it out, follows the device's appearance. */
  titleColor?: "light" | "dark" | "default";
  buttons: TopNavigationButton[];
}

/** What an overlay does to its owner's buttons while it is open. */
export type TopNavigationButtonsOverride = "hidden" | "disabled";

// Badge, `enabled` and colour are states of the same button, so they stay out of its look.
const lookOf = (button: TopNavigationButton) =>
  `${button.side}|${button.icon?.name ?? button.text ?? ""}|${button.style ?? "plain"}`;

/** Where a button sits in its bar: its `identity`, or its index within its `side`. */
function withSlots(buttons: TopNavigationButton[]) {
  const counts = new Map<TopNavigationButton["side"], number>();

  return buttons.map((button) => {
    const index = counts.get(button.side) ?? 0;
    counts.set(button.side, index + 1);

    return { button, slot: button.identity ? `#${button.identity}` : `${button.side}:${index}` };
  });
}

export function createTopNavigationAdapter(host: TopNavigationHost) {
  // Keeps request ids from colliding with those of a document loaded before a reload.
  const session = Date.now().toString(36);
  let requestCount = 0;
  let keyCount = 0;

  const declarations = new Map<string, TopNavigationBar>();
  const overrides = new Map<string, TopNavigationButtonsOverride[]>();
  const requests = new Map<string, { owner: string; slotByKey: Map<string, string> }>();
  const keyBySlot = new Map<string, string>();
  // The buttons the host last confirmed. A rejected update leaves the host's bar as it was, so
  // this stays too.
  let shown: { key: string; look: string }[] = [];
  let lastOwner: string | null = null;
  let sent: string | null = null;
  let confirmed: string | null = null;

  /**
   * A slot keeps its key. A new slot takes the key of an on-screen button that looks the same, so
   * the host can treat it as the same button, or else gets a fresh one. No key appears twice in
   * one bar.
   */
  function assignKeys(owner: string, buttons: TopNavigationButton[]) {
    const slotted = withSlots(buttons);
    const used = new Set<string>();

    // Reserve every kept key first, so a key inherited by look cannot take one a later slot keeps.
    const kept = slotted.map(({ slot }) => {
      const key = keyBySlot.get(`${owner}/${slot}`);
      if (!key || used.has(key)) return null;

      used.add(key);
      return key;
    });

    return slotted.map(({ button, slot }, index) => {
      const key =
        kept[index] ??
        shown.find((item) => item.look === lookOf(button) && !used.has(item.key))?.key ??
        `k${++keyCount}`;

      used.add(key);
      keyBySlot.set(`${owner}/${slot}`, key);
      return { button, slot, key };
    });
  }

  // A click on a bar that is no longer the last one sent still runs: it was the bar on screen.
  host.onButtonClick(({ id, key }) => {
    const request = requests.get(id);
    if (!request) return;

    const slot = request.slotByKey.get(key);

    withSlots(declarations.get(request.owner)?.buttons ?? [])
      .find((item) => item.slot === slot)
      ?.button.onClick();
  });

  function resolve(owner: string) {
    const bar = declarations.get(owner);
    const override = overrides.get(owner)?.at(-1);
    if (!bar || !override) return bar;

    return {
      ...bar,
      buttons:
        override === "hidden" ? [] : bar.buttons.map((button) => ({ ...button, enabled: false })),
    };
  }

  async function apply(owner: string) {
    const bar = resolve(owner);
    if (!bar) return;

    const buttons = assignKeys(owner, bar.buttons);
    const update: TopNavigationHostBar = {
      ...(bar.title !== undefined && { title: bar.title }),
      ...(bar.subtitle !== undefined && { subtitle: bar.subtitle }),
      ...(bar.titleColor !== undefined && { titleColor: bar.titleColor }),
      buttons: buttons.map(({ button: { onClick: _, identity: __, ...rest }, key }) => ({
        ...rest,
        key,
      })),
    };

    // A repeat would restart whatever the host animates for the first one.
    const signature = JSON.stringify([owner, update]);
    if (signature === sent) return;

    sent = signature;
    lastOwner = owner;

    const requestId = `${session}-${++requestCount}`;

    requests.set(requestId, {
      owner,
      slotByKey: new Map(buttons.map(({ key, slot }) => [key, slot])),
    });

    try {
      await host.update(requestId, update, { animated: true });
      shown = buttons.map(({ button, key }) => ({ key, look: lookOf(button) }));
      confirmed = signature;
    } catch {
      if (sent === signature) sent = confirmed;
    }
  }

  return {
    /**
     * Call on every render of the owner, so clicks reach the latest `onClick`. Sends again when the
     * owner holds the bar and the declaration changed, including while an overlay holds it on the
     * owner's behalf.
     */
    declare(owner: string, bar: TopNavigationBar) {
      // `onClick` is new on every render; serialising drops it.
      const changed = JSON.stringify(declarations.get(owner)) !== JSON.stringify(bar);

      declarations.set(owner, bar);
      if (changed && lastOwner === owner) apply(owner);
    },

    /** Sends the owner's declaration with its latest override. Skipped when it repeats the last one. */
    apply,

    /** Hides or disables the owner's buttons until the returned function runs. */
    override(owner: string, override: TopNavigationButtonsOverride) {
      overrides.set(owner, [...(overrides.get(owner) ?? []), override]);
      if (lastOwner === owner) apply(owner);

      return () => {
        const remaining = [...(overrides.get(owner) ?? [])];
        remaining.splice(remaining.lastIndexOf(override), 1);

        if (remaining.length > 0) overrides.set(owner, remaining);
        else overrides.delete(owner);

        // StrictMode releases an effect and sets it up again at once. Sending the released bar
        // right away would restart the host's animation; deferred, the re-applied override matches
        // what was sent and nothing goes out.
        queueMicrotask(() => {
          if (lastOwner === owner) apply(owner);
        });
      };
    },

    /** Forgets everything about an owner that left the stack. */
    release(owner: string) {
      declarations.delete(owner);
      overrides.delete(owner);
      for (const slot of keyBySlot.keys()) if (slot.startsWith(`${owner}/`)) keyBySlot.delete(slot);
      for (const [id, request] of requests) if (request.owner === owner) requests.delete(id);
    },
  };
}

export type TopNavigationAdapter = ReturnType<typeof createTopNavigationAdapter>;
