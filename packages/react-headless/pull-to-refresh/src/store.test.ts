import { describe, expect, it, mock } from "bun:test";

import { Store } from "./store";

describe("Store", () => {
  it("exposes the initial state", () => {
    const store = new Store({ count: 0, label: "a" });

    expect(store.getState()).toEqual({ count: 0, label: "a" });
  });

  it("merges a partial update into the current state", () => {
    const store = new Store({ count: 0, label: "a" });

    store.setState({ count: 1 });

    expect(store.getState()).toEqual({ count: 1, label: "a" });
  });

  it("creates a new state object on every update", () => {
    const store = new Store({ count: 0 });
    const snapshot = store.getState();

    store.setState({ count: 1 });

    expect(store.getState()).not.toBe(snapshot);
    expect(snapshot).toEqual({ count: 0 });
  });

  it("notifies every subscriber on each update", () => {
    const store = new Store({ count: 0 });
    const first = mock(() => {});
    const second = mock(() => {});
    store.subscribe(first);
    store.subscribe(second);

    store.setState({ count: 1 });
    store.setState({ count: 2 });

    expect(first).toHaveBeenCalledTimes(2);
    expect(second).toHaveBeenCalledTimes(2);
  });

  it("notifies subscribers even when the update changes nothing", () => {
    const store = new Store({ count: 0 });
    const listener = mock(() => {});
    store.subscribe(listener);

    store.setState({});

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("stops notifying once the returned unsubscribe runs", () => {
    const store = new Store({ count: 0 });
    const listener = mock(() => {});
    const unsubscribe = store.subscribe(listener);

    store.setState({ count: 1 });
    unsubscribe();
    store.setState({ count: 2 });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getState()).toEqual({ count: 2 });
  });

  it("keeps a listener registered only once when subscribed twice", () => {
    const store = new Store({ count: 0 });
    const listener = mock(() => {});
    store.subscribe(listener);
    store.subscribe(listener);

    store.setState({ count: 1 });

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
