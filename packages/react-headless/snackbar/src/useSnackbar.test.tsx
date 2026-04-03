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

      act(() => {
        snackbarApi.create(createSnackbar("First"));
      });
      expect(screen.getByText("First")).toBeInTheDocument();

      act(() => {
        snackbarApi.create(createSnackbar("Second"));
      });
      expect(screen.queryByText("First")).not.toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("should call onClose of replaced snackbar", () => {
      const onClose = mock(() => {});
      setUp();

      act(() => {
        snackbarApi.create(createSnackbar("First", { onClose }));
      });

      act(() => {
        snackbarApi.create(createSnackbar("Second"));
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should clear queue on replacement", () => {
      setUp({ strategy: "queued" });

      // Queue up 3 snackbars in queued mode
      act(() => snackbarApi.create(createSnackbar("First")));
      act(() => {
        snackbarApi.create(createSnackbar("Queued A", { strategy: "queued" }));
        snackbarApi.create(createSnackbar("Queued B", { strategy: "queued" }));
      });

      expect(screen.getByText("First")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(2);

      // Immediate snackbar clears queue and replaces
      act(() => {
        snackbarApi.create(createSnackbar("Urgent", { strategy: "immediate" }));
      });

      expect(screen.getByText("Urgent")).toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(0);
    });

    it("should restart timeout after replacement", () => {
      setUp();

      act(() => {
        snackbarApi.create(createSnackbar("First", { timeout: 1000, removeDelay: 100 }));
      });

      // Advance 800ms (not yet dismissed)
      act(() => jest.advanceTimersByTime(800));
      expect(screen.getByText("First")).toBeInTheDocument();

      // Replace with new snackbar (timeout resets)
      act(() => {
        snackbarApi.create(createSnackbar("Second", { timeout: 1000, removeDelay: 100 }));
      });

      // Advance 800ms again — Second should still be visible (fresh timeout)
      act(() => jest.advanceTimersByTime(800));
      expect(screen.getByText("Second")).toBeInTheDocument();

      // Advance remaining 200ms + removeDelay → gone
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
    it("should allow per-snackbar queued override in immediate provider", () => {
      setUp(); // default: immediate

      act(() => snackbarApi.create(createSnackbar("First", { timeout: 1000, removeDelay: 100 })));
      act(() => snackbarApi.create(createSnackbar("Queued", { strategy: "queued" })));

      // First is showing, Queued is waiting in queue
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.queryByText("Queued")).not.toBeInTheDocument();
      expect(snackbarApi.queue.length).toBe(1);

      // Dismiss first → queued one shows
      act(() => jest.advanceTimersByTime(1000));
      act(() => jest.advanceTimersByTime(100));

      expect(screen.getByText("Queued")).toBeInTheDocument();
    });

    it("should allow per-snackbar immediate override in queued provider", () => {
      setUp({ strategy: "queued" });

      act(() => {
        snackbarApi.create(createSnackbar("First"));
      });
      expect(screen.getByText("First")).toBeInTheDocument();

      act(() => {
        snackbarApi.create(createSnackbar("Urgent", { strategy: "immediate" }));
      });

      expect(screen.queryByText("First")).not.toBeInTheDocument();
      expect(screen.getByText("Urgent")).toBeInTheDocument();
    });
  });
});
