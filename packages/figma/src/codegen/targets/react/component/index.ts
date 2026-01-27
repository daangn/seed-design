import type { ComponentHandler } from "@/codegen/core";
import type { NormalizedInstanceNode } from "@/normalizer";
import type { ComponentHandlerDeps } from "./deps.interface";

import * as archivedHandlers from "./handlers/archive";
import * as currentHandlers from "./handlers";

export type { ComponentHandlerDeps };
export type UnboundComponentHandler<T extends NormalizedInstanceNode["componentProperties"]> = (
  deps: ComponentHandlerDeps,
) => ComponentHandler<T>;

export function bindComponentHandler<T extends NormalizedInstanceNode["componentProperties"]>(
  unbound: UnboundComponentHandler<T>,
  deps: ComponentHandlerDeps,
): ComponentHandler<T> {
  return unbound(deps);
}

// biome-ignore lint/suspicious/noExplicitAny: handlers have different component property types
export const unboundSeedComponentHandlers: Array<UnboundComponentHandler<any>> = [
  ...Object.values(archivedHandlers),
  ...Object.values(currentHandlers),
];
