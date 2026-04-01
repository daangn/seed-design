import { describe, expect, it, mock, beforeEach } from "bun:test";
import {
  addLayer,
  removeLayer,
  addBranch,
  removeBranch,
  isTopMost,
  isInNestedLayer,
  isInBranch,
  isBelowPointerBlockingLayer,
  getPointerEventsEnabled,
  type LayerStackContextValue,
  type Layer,
} from "./layer-stack";

function createCtx(): LayerStackContextValue {
  return { layers: [], branches: [], recentlyRemoved: new Set() };
}

function createNode(id = "node"): HTMLElement {
  const el = document.createElement("div");
  el.setAttribute("data-testid", id);
  document.body.appendChild(el);
  return el;
}

function createLayer(node: HTMLElement, overrides: Partial<Omit<Layer, "node">> = {}): Layer {
  return {
    node,
    dismiss: mock(() => {}),
    ...overrides,
  };
}

describe("layer-stack", () => {
  let ctx: LayerStackContextValue;

  beforeEach(() => {
    ctx = createCtx();
    document.body.innerHTML = "";
  });
  describe("addLayer", () => {
    it("adds a layer to the stack", () => {
      const node = createNode();
      addLayer(ctx, createLayer(node));
      expect(ctx.layers).toHaveLength(1);
      expect(ctx.layers[0].node).toBe(node);
    });

    it("preserves insertion order", () => {
      const a = createNode("a");
      const b = createNode("b");
      addLayer(ctx, createLayer(a));
      addLayer(ctx, createLayer(b));
      expect(ctx.layers[0].node).toBe(a);
      expect(ctx.layers[1].node).toBe(b);
    });
  });

  describe("removeLayer", () => {
    it("removes the specified layer", () => {
      const node = createNode();
      addLayer(ctx, createLayer(node));
      removeLayer(ctx, node);
      expect(ctx.layers).toHaveLength(0);
    });

    it("does nothing for unknown nodes", () => {
      const node = createNode();
      removeLayer(ctx, node);
      expect(ctx.layers).toHaveLength(0);
    });

    it("dismisses nested layers when a lower layer is removed", () => {
      const a = createNode("a");
      const b = createNode("b");
      const c = createNode("c");
      const dismissB = mock(() => {});
      const dismissC = mock(() => {});

      addLayer(ctx, createLayer(a));
      addLayer(ctx, createLayer(b, { dismiss: dismissB }));
      addLayer(ctx, createLayer(c, { dismiss: dismissC }));

      removeLayer(ctx, a);

      expect(dismissB).toHaveBeenCalledTimes(1);
      expect(dismissC).toHaveBeenCalledTimes(1);
      expect(ctx.layers).toHaveLength(2); // b and c remain (their own remove is called by their dismiss)
    });

    it("adds node to recentlyRemoved", () => {
      const node = createNode();
      addLayer(ctx, createLayer(node));
      removeLayer(ctx, node);
      expect(ctx.recentlyRemoved.has(node)).toBe(true);
    });

    it("clears recentlyRemoved after microtask", async () => {
      const node = createNode();
      addLayer(ctx, createLayer(node));
      removeLayer(ctx, node);
      expect(ctx.recentlyRemoved.has(node)).toBe(true);
      await new Promise((r) => queueMicrotask(r));
      expect(ctx.recentlyRemoved.has(node)).toBe(false);
    });
  });
  describe("isTopMost", () => {
    it("returns true for the last layer", () => {
      const a = createNode("a");
      const b = createNode("b");
      addLayer(ctx, createLayer(a));
      addLayer(ctx, createLayer(b));
      expect(isTopMost(ctx, b)).toBe(true);
      expect(isTopMost(ctx, a)).toBe(false);
    });

    it("returns false for empty stack", () => {
      const node = createNode();
      expect(isTopMost(ctx, node)).toBe(false);
    });
  });

  describe("isInNestedLayer", () => {
    it("returns true when target is inside a nested layer", () => {
      const dialog = createNode("dialog");
      const menu = createNode("menu");
      const menuChild = document.createElement("span");
      menu.appendChild(menuChild);

      addLayer(ctx, createLayer(dialog));
      addLayer(ctx, createLayer(menu, {}));

      expect(isInNestedLayer(ctx, dialog, menuChild)).toBe(true);
    });

    it("returns false when target is not in any nested layer", () => {
      const dialog = createNode("dialog");
      const outside = createNode("outside");

      addLayer(ctx, createLayer(dialog));

      expect(isInNestedLayer(ctx, dialog, outside)).toBe(false);
    });

    it("returns true when recentlyRemoved is non-empty (cascading prevention)", () => {
      const dialog = createNode("dialog");
      const menu = createNode("menu");

      addLayer(ctx, createLayer(dialog));
      addLayer(ctx, createLayer(menu, {}));

      // Simulate removal — recentlyRemoved is populated
      removeLayer(ctx, menu);

      // Even though menu is removed, target is treated as "inside"
      expect(isInNestedLayer(ctx, dialog, document.body)).toBe(true);
    });
  });
  describe("branches", () => {
    it("isInBranch returns true for targets inside a branch", () => {
      const branch = createNode("branch");
      const child = document.createElement("span");
      branch.appendChild(child);

      addBranch(ctx, branch);
      expect(isInBranch(ctx, child)).toBe(true);
    });

    it("isInBranch returns false for targets outside branches", () => {
      const branch = createNode("branch");
      const outside = createNode("outside");

      addBranch(ctx, branch);
      expect(isInBranch(ctx, outside)).toBe(false);
    });

    it("removeBranch removes the branch", () => {
      const branch = createNode("branch");
      addBranch(ctx, branch);
      removeBranch(ctx, branch);
      expect(ctx.branches).toHaveLength(0);
    });
  });
  describe("pointer blocking", () => {
    it("isBelowPointerBlockingLayer returns false when no blocking layers", () => {
      const node = createNode();
      addLayer(ctx, createLayer(node));
      expect(isBelowPointerBlockingLayer(ctx, node)).toBe(false);
    });

    it("isBelowPointerBlockingLayer returns true when below a blocking layer", () => {
      const dialog = createNode("dialog");
      const menu = createNode("menu");
      addLayer(ctx, createLayer(dialog, { blockPointerEvents: true }));
      addLayer(ctx, createLayer(menu, { blockPointerEvents: true }));
      expect(isBelowPointerBlockingLayer(ctx, dialog)).toBe(true);
      expect(isBelowPointerBlockingLayer(ctx, menu)).toBe(false);
    });

    it("getPointerEventsEnabled returns true when no blocking layers", () => {
      const node = createNode();
      addLayer(ctx, createLayer(node));
      expect(getPointerEventsEnabled(ctx, node)).toBe(true);
    });

    it("getPointerEventsEnabled returns false for layers below the highest blocking layer", () => {
      const dialog = createNode("dialog");
      const menu = createNode("menu");
      addLayer(ctx, createLayer(dialog, { blockPointerEvents: true }));
      addLayer(ctx, createLayer(menu, { blockPointerEvents: true }));
      expect(getPointerEventsEnabled(ctx, dialog)).toBe(false);
      expect(getPointerEventsEnabled(ctx, menu)).toBe(true);
    });
  });
});
