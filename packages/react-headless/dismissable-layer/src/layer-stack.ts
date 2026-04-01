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

  // Dismiss nested layers
  const nested = ctx.layers.slice(index + 1);
  for (const layer of nested) {
    layer.dismiss({ dismissedParent: node });
  }

  ctx.layers.splice(index, 1);
  notifyLayerChange();
}

export function addBranch(ctx: LayerStackContextValue, node: HTMLElement) {
  ctx.branches.push(node);
}

export function removeBranch(ctx: LayerStackContextValue, node: HTMLElement) {
  const index = ctx.branches.indexOf(node);
  if (index >= 0) ctx.branches.splice(index, 1);
}
