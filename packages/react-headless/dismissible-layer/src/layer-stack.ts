"use client";

import { createContext, useContext } from "react";

export interface CascadeDismissDetail {
  /** The layer node that was removed, causing this cascade dismiss. */
  dismissedParent: HTMLElement;
}

export interface Layer {
  node: HTMLElement;
  dismiss: (detail: CascadeDismissDetail) => void;
  blockPointerEvents?: boolean;
  /**
   * The parent layer's node. Used to determine cascade-dismiss scope.
   * Only layers whose parentNode matches the removed layer's node will be
   * cascade-dismissed. Layers without a parentNode are top-level and never
   * cascade-dismissed by sibling layer removal.
   */
  parentNode?: HTMLElement | null;
}

export interface LayerStackContextValue {
  layers: Layer[];
  branches: HTMLElement[];
  recentlyRemoved: Set<HTMLElement>;
}

const LAYER_UPDATE_EVENT = "seed:dismissible-update";

/**
 * Shared layer stack context. No Provider needed — all consumers share the same
 * default value (mutable arrays/sets). This mirrors Radix's DismissibleLayerContext
 * pattern, with the option to scope via Provider if needed.
 */
export const LayerStackContext = createContext<LayerStackContextValue>({
  layers: [],
  branches: [],
  recentlyRemoved: new Set(),
});

export function useLayerStackContext() {
  return useContext(LayerStackContext);
}

export function isTopMost(ctx: LayerStackContextValue, node: HTMLElement): boolean {
  return ctx.layers.at(-1)?.node === node;
}

function contains(parent: HTMLElement | null, child: EventTarget | null): boolean {
  if (!parent || !child) return false;
  if (!(child instanceof Node)) return false;
  return parent.contains(child);
}

export function isInNestedLayer(
  ctx: LayerStackContextValue,
  node: HTMLElement,
  target: EventTarget | null,
): boolean {
  const index = ctx.layers.findIndex((l) => l.node === node);
  if (index === -1) return false;

  const nested = ctx.layers.slice(index + 1);
  if (nested.some((layer) => contains(layer.node, target))) return true;

  // During layer removal, treat all focus events as "inside" to prevent
  // cascading dismissals from focus transitions (Zag pattern).
  if (ctx.recentlyRemoved.size > 0) return true;

  return false;
}

export function isInBranch(ctx: LayerStackContextValue, target: EventTarget | null): boolean {
  return ctx.branches.some((branch) => contains(branch, target));
}

export function isBelowPointerBlockingLayer(
  ctx: LayerStackContextValue,
  node: HTMLElement,
): boolean {
  const index = ctx.layers.findIndex((l) => l.node === node);
  const blockingLayers = ctx.layers.filter((l) => l.blockPointerEvents);
  const highestBlocking = blockingLayers.at(-1);
  if (!highestBlocking) return false;

  const highestBlockingIndex = ctx.layers.indexOf(highestBlocking);
  return index < highestBlockingIndex;
}

export function getPointerEventsEnabled(ctx: LayerStackContextValue, node: HTMLElement): boolean {
  const hasBlocking = ctx.layers.some((l) => l.blockPointerEvents);
  if (!hasBlocking) return true;

  const index = ctx.layers.findIndex((l) => l.node === node);
  const blockingLayers = ctx.layers.filter((l) => l.blockPointerEvents);
  const highestBlocking = blockingLayers.at(-1);
  if (!highestBlocking) return true;

  const highestBlockingIndex = ctx.layers.indexOf(highestBlocking);
  return index >= highestBlockingIndex;
}

export function notifyLayerChange() {
  document.dispatchEvent(new CustomEvent(LAYER_UPDATE_EVENT));
}

export { LAYER_UPDATE_EVENT };

export function addLayer(ctx: LayerStackContextValue, layer: Layer) {
  // Guard against double-registration (e.g., React strict mode re-running effects).
  const existing = ctx.layers.findIndex((l) => l.node === layer.node);
  if (existing >= 0) ctx.layers.splice(existing, 1);

  ctx.layers.push(layer);
  notifyLayerChange();
}

export function removeLayer(ctx: LayerStackContextValue, node: HTMLElement) {
  const index = ctx.layers.findIndex((l) => l.node === node);
  if (index < 0) return;

  // Track recently removed to handle focus race conditions during cleanup.
  // This prevents parent layers from incorrectly dismissing when focus
  // moves from a closing nested layer.
  ctx.recentlyRemoved.add(node);
  queueMicrotask(() => ctx.recentlyRemoved.delete(node));

  // Cascade-dismiss only layers that declare this node as their parent.
  // This prevents sibling layers (independent menus, dialogs, etc.) from
  // being incorrectly dismissed when an unrelated layer closes.
  // Transitive children are handled by their own removeLayer calls.
  const children = ctx.layers.filter((l) => l.parentNode === node);
  for (const child of children) {
    child.dismiss({ dismissedParent: node });
  }

  // Re-compute index: cascade-dismiss may have recursively removed layers,
  // shifting the target's position in the array. In React, parents mount
  // before children so children are always at higher indices — but this is
  // a pure data structure with no React dependency, so we defend against
  // arbitrary insertion order.
  const freshIndex = ctx.layers.findIndex((l) => l.node === node);
  if (freshIndex >= 0) ctx.layers.splice(freshIndex, 1);
  notifyLayerChange();
}

/**
 * React context that propagates a parent dismissible layer's node down the
 * React tree (including through portals). Nested dismissible layers read this
 * to register as children of the parent, enabling correct cascade-dismiss
 * behavior without affecting unrelated sibling layers.
 *
 * Follows the same pattern as base-ui's FloatingNodeContext.
 */
export const DismissibleParentContext = createContext<HTMLElement | null>(null);

export function useDismissibleParentNode() {
  return useContext(DismissibleParentContext);
}

export function addBranch(ctx: LayerStackContextValue, node: HTMLElement) {
  ctx.branches.push(node);
}

export function removeBranch(ctx: LayerStackContextValue, node: HTMLElement) {
  const index = ctx.branches.indexOf(node);
  if (index >= 0) ctx.branches.splice(index, 1);
}
