import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, jest, mock } from "bun:test";

import {
  SnackbarRegion,
  SnackbarRenderer,
  SnackbarRoot,
  SnackbarRootProvider,
  type SnackbarRootProviderProps,
} from "./Snackbar";
import { useSnackbarContext, type UseSnackbarContext } from "./useSnackbarContext";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const originalResizeObserver = window.ResizeObserver;
window.ResizeObserver = ResizeObserver;

afterAll(() => {
  window.ResizeObserver = originalResizeObserver;
});

let snackbarApi: UseSnackbarContext;

function SnackbarControls() {
  const api = useSnackbarContext();
  snackbarApi = api;

  return (
    <div>
      <SnackbarRegion>
        {api.currentSnackbar && (
          <SnackbarRoot>
            <SnackbarRenderer />
          </SnackbarRoot>
        )}
      </SnackbarRegion>
    </div>
  );
}

function setUp(providerProps: Omit<SnackbarRootProviderProps, "children"> = {}) {
  return {
    user: userEvent.setup({ advanceTimers: (ms) => jest.advanceTimersByTime(ms) }),
    ...render(
      <SnackbarRootProvider {...providerProps}>
        <SnackbarControls />
      </SnackbarRootProvider>,
    ),
  };
}

function createSnackbar(message: string, options: Record<string, unknown> = {}) {
  return {
    render: () => <span>{message}</span>,
    timeout: 5000,
    removeDelay: 200,
    ...options,
  };
}

describe("useSnackbar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("common", () => {
    it("should display a single snackbar", () => {
      setUp();

      act(() => {
        snackbarApi.create(createSnackbar("Hello"));
      });

      expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    it("should auto-dismiss after timeout", () => {
      setUp();

      act(() => {
        snackbarApi.create(createSnackbar("Auto dismiss", { timeout: 1000, removeDelay: 100 }));
      });

      expect(screen.getByText("Auto dismiss")).toBeInTheDocument();

      // timeout fires → dismissing state
      act(() => jest.advanceTimersByTime(1000));
      // removeDelay fires → inactive state
      act(() => jest.advanceTimersByTime(100));

      expect(screen.queryByText("Auto dismiss")).not.toBeInTheDocument();
    });

    it("should dismiss on dismiss() call", () => {
      setUp();

      act(() => {
        snackbarApi.create(createSnackbar("Dismiss me", { removeDelay: 100 }));
      });

      expect(screen.getByText("Dismiss me")).toBeInTheDocument();

      act(() => snackbarApi.dismiss());
      act(() => jest.advanceTimersByTime(100));

      expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
    });
  });

  describe("immediate (default)", () => {
    it("should replace current snackbar with new one", () => {
      setUp();

      act(() => snackbarApi.create(createSnackbar("First", { removeDelay: 100 })));
      expect(screen.getByText("First")).toBeInTheDocument();

      act(() => snackbarApi.create(createSnackbar("Second")));

      // First is in dismissing state (exit animation)
      // Advance removeDelay to complete exit, then new one enters
      act(() => jest.advanceTimersByTime(100));

      expect(screen.queryByText("First")).not.toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("should call onClose of replaced snackbar", () => {
      const onClose = mock(() => {});
      setUp();

      act(() => snackbarApi.create(createSnackbar("First", { onClose, removeDelay: 100 })));

      act(() => snackbarApi.create(createSnackbar("Second")));

      // onClose fires during dismissing → inactive transition
      act(() => jest.advanceTimersByTime(100));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should clear queue on replacement", () => {
      setUp({ strategy: "queued" });

      // Queue up 3 snackbars in queued mode
      act(() => snackbarApi.create(createSnackbar("First", { removeDelay: 100 })));
      act(() => {
        snackbarApi.create(createSnackbar("Queued A", { strategy: "queued" }));
        snackbarApi.create(createSnackbar("Queued B", { strategy: "queued" }));
      });

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(2);

      // Immediate snackbar clears queue, triggers dismiss of First
      act(() => snackbarApi.create(createSnackbar("Urgent", { strategy: "immediate" })));

      // Advance removeDelay for First to exit, then Urgent enters
      act(() => jest.advanceTimersByTime(100));

      expect(screen.getByText("Urgent")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(0);
    });

    it("should restart timeout after replacement", () => {
      setUp();

      act(() => snackbarApi.create(createSnackbar("First", { timeout: 1000, removeDelay: 100 })));

      // Advance 800ms (not yet dismissed)
      act(() => jest.advanceTimersByTime(800));
      expect(screen.getByText("First")).toBeInTheDocument();

      // Replace: triggers dismiss of First
      act(() => snackbarApi.create(createSnackbar("Second", { timeout: 1000, removeDelay: 100 })));

      // Advance 100ms removeDelay for First exit → Second enters with fresh timeout
      act(() => jest.advanceTimersByTime(100));
      expect(screen.getByText("Second")).toBeInTheDocument();

      // Advance 800ms — Second should still be visible (fresh timeout = 1000ms)
      act(() => jest.advanceTimersByTime(800));
      expect(screen.getByText("Second")).toBeInTheDocument();

      // Advance remaining 200ms → dismissing, then 100ms removeDelay → gone
      act(() => jest.advanceTimersByTime(200));
      act(() => jest.advanceTimersByTime(100));
      expect(screen.queryByText("Second")).not.toBeInTheDocument();
    });
  });

  describe("queued", () => {
    it("should queue snackbars when strategy is queued", () => {
      setUp({ strategy: "queued" });

      act(() => snackbarApi.create(createSnackbar("First", { timeout: 1000, removeDelay: 100 })));
      act(() => snackbarApi.create(createSnackbar("Second")));

      // First is showing, Second is in queue
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.queryByText("Second")).not.toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(1);

      // Dismiss first → second shows
      act(() => jest.advanceTimersByTime(1000));
      act(() => jest.advanceTimersByTime(100));

      expect(screen.queryByText("First")).not.toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });
  });

  describe("per-snackbar strategy override", () => {
    it("should mix queued and immediate overrides in immediate provider", () => {
      setUp(); // default: immediate

      // 1. First shows immediately
      act(() => snackbarApi.create(createSnackbar("First", { timeout: 1000, removeDelay: 100 })));
      expect(screen.getByText("First")).toBeInTheDocument();

      // 2. Queued-A waits in queue
      act(() =>
        snackbarApi.create(
          createSnackbar("Queued-A", { strategy: "queued", timeout: 1000, removeDelay: 100 }),
        ),
      );
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(1);

      // 3. Queued-B also waits in queue
      act(() =>
        snackbarApi.create(
          createSnackbar("Queued-B", { strategy: "queued", timeout: 1000, removeDelay: 100 }),
        ),
      );
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(2);

      // 4. Urgent replaces First: dismiss First, queue only Urgent
      act(() => snackbarApi.create(createSnackbar("Urgent", { timeout: 1000, removeDelay: 100 })));

      // First exit animation
      act(() => jest.advanceTimersByTime(100));

      expect(screen.queryByText("First")).not.toBeInTheDocument();
      expect(screen.getByText("Urgent")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(0);

      // 5. After Urgent times out, nothing left
      act(() => jest.advanceTimersByTime(1000));
      act(() => jest.advanceTimersByTime(100));
      expect(screen.queryByText("Urgent")).not.toBeInTheDocument();
    });

    it("should mix queued and immediate overrides in queued provider", () => {
      setUp({ strategy: "queued" }); // default: queued

      // 1. First shows (queued default, but nothing active → shows immediately)
      act(() => snackbarApi.create(createSnackbar("First", { timeout: 1000, removeDelay: 100 })));
      expect(screen.getByText("First")).toBeInTheDocument();

      // 2. Second queues behind First
      act(() => snackbarApi.create(createSnackbar("Second", { timeout: 1000, removeDelay: 100 })));
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(1);

      // 3. Third queues behind Second
      act(() => snackbarApi.create(createSnackbar("Third", { timeout: 1000, removeDelay: 100 })));
      expect(snackbarApi.queue.length).toBe(2);

      // 4. Urgent with immediate override: dismiss First, queue only Urgent
      act(() =>
        snackbarApi.create(
          createSnackbar("Urgent", { strategy: "immediate", timeout: 1000, removeDelay: 100 }),
        ),
      );

      // First exit animation
      act(() => jest.advanceTimersByTime(100));

      expect(screen.queryByText("First")).not.toBeInTheDocument();
      expect(screen.getByText("Urgent")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(0);

      // 5. While Urgent is showing, queue a new one (default queued)
      act(() =>
        snackbarApi.create(createSnackbar("After-Urgent", { timeout: 1000, removeDelay: 100 })),
      );
      expect(screen.getByText("Urgent")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(1);

      // 6. Urgent times out → After-Urgent shows from queue
      act(() => jest.advanceTimersByTime(1000));
      act(() => jest.advanceTimersByTime(100));
      expect(screen.queryByText("Urgent")).not.toBeInTheDocument();
      expect(screen.getByText("After-Urgent")).toBeInTheDocument();
    });
  });
});
