import { describe, expect, it, mock } from "bun:test";
import {
  HostUIProvider,
  type TopNavigationHost,
  type TopNavigationHostBar,
} from "@seed-design/host-ui";
import { act } from "@testing-library/react";
import { useActions } from "@stackflow/react";
import { useState, type ReactNode } from "react";
import {
  type NextAppScreenAppBar,
  useActivityAppBar,
  useActivityOverlayButtons,
  useResolvedAppBar,
  useTopNavigationButtons,
} from "../src";
import { poll, renderStack } from "./harness";

function createHost() {
  const listeners = new Set<Parameters<TopNavigationHost["onButtonClick"]>[0]>();
  const requests: { id: string; bar: TopNavigationHostBar }[] = [];

  const host: TopNavigationHost = {
    async update(id, bar) {
      requests.push({ id, bar });
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
    click: (key: string) => {
      const { id } = last();
      for (const listener of listeners) listener({ id, key });
    },
  };
}

function Screen({
  appBar,
  children,
}: {
  appBar: NextAppScreenAppBar | null;
  children?: ReactNode;
}) {
  useActivityAppBar(useResolvedAppBar(appBar));

  return <div>{children}</div>;
}

const edit = mock();

const BACK = {
  name: "icon_chevron_left_line",
  fallbackURL: "https://example.com/back.png",
} as const;

function Detail() {
  const { pop } = useActions();

  return (
    <Screen
      appBar={{
        title: "Detail",
        titleColor: "dark",
        leading: [{ icon: BACK, label: "Back", onClick: () => pop() }],
      }}
    />
  );
}

const activities = {
  Home: () => <Screen appBar={{ title: "Home", trailing: [{ text: "Edit", onClick: edit }] }} />,
  Detail,
  Bare: () => <Screen appBar={null} />,
  Sheet: function Sheet() {
    useActivityOverlayButtons("hidden");
    return null;
  },
  InScreenSheet: function InScreenSheet() {
    const [open, setOpen] = useState(false);

    useTopNavigationButtons(open ? "disabled" : null);

    return (
      <Screen appBar={{ title: "In-screen", trailing: [{ text: "Edit", onClick: edit }] }}>
        <button type="button" onClick={() => setOpen(true)}>
          open
        </button>
      </Screen>
    );
  },
};

function renderWithHost(initialActivity: keyof typeof activities) {
  const fake = createHost();
  const stack = renderStack({
    activities,
    initialActivity,
    wrapper: ({ children }) => (
      <HostUIProvider topNavigation={fake.host}>{children}</HostUIProvider>
    ),
  });

  return { ...fake, ...stack };
}

const buttonsOf = (bar: TopNavigationHostBar) => bar.buttons.map(({ key: _, ...rest }) => rest);

const keyOf = (bar: TopNavigationHostBar, side: TopNavigationHostBar["buttons"][number]["side"]) =>
  bar.buttons.find((button) => button.side === side)?.key ?? "";

describe("top navigation", () => {
  it("sends the screen's bar as declared", async () => {
    const { last } = renderWithHost("Home");

    await poll(() => expect(last().bar.title).toBe("Home"));

    expect(buttonsOf(last().bar)).toEqual([{ side: "trailing", text: "Edit" }]);
  });

  it("runs the button's onClick when the host reports a click", async () => {
    const { last, click } = renderWithHost("Home");
    edit.mockClear();

    await poll(() => expect(last().bar.title).toBe("Home"));
    click(keyOf(last().bar, "trailing"));

    expect(edit).toHaveBeenCalledTimes(1);
  });

  it("sends a pushed screen's title colour and the back button it declares", async () => {
    const { last, push, click } = renderWithHost("Home");

    await poll(() => expect(last().bar.title).toBe("Home"));
    await push("Detail");
    await poll(() => expect(last().bar.title).toBe("Detail"));

    expect(last().bar.titleColor).toBe("dark");
    expect(last().bar.buttons).toEqual([
      { key: expect.any(String), side: "leading", icon: BACK, label: "Back" },
    ]);

    await act(async () => click(keyOf(last().bar, "leading")));

    await poll(() => expect(last().bar.title).toBe("Home"));
  });

  it("sends an empty bar for a screen without one", async () => {
    const { last, push } = renderWithHost("Home");

    await poll(() => expect(last().bar.title).toBe("Home"));
    await push("Bare");

    await poll(() => expect(last().bar).toEqual({ buttons: [] }));
  });

  it("hides the buttons of the screen below while an overlay activity is active", async () => {
    const { last, push, pop } = renderWithHost("Home");

    await poll(() => expect(last().bar.title).toBe("Home"));
    const shown = last().bar.buttons;

    await push("Sheet");
    await poll(() => expect(last().bar).toEqual({ title: "Home", buttons: [] }));

    await pop();
    await poll(() => expect(last().bar.buttons).toEqual(shown));
  });

  it("disables the screen's buttons while an in-screen overlay is open", async () => {
    const { last, getByText } = renderWithHost("InScreenSheet");

    await poll(() => expect(last().bar.title).toBe("In-screen"));
    await act(async () => getByText("open").click());

    await poll(() =>
      expect(buttonsOf(last().bar)).toEqual([{ side: "trailing", text: "Edit", enabled: false }]),
    );
  });
});
