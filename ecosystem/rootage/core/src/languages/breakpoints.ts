import type { AST } from "../parser";

export const BREAKPOINT_COLLECTION = "viewport-width";

export interface Breakpoint {
  id: string;
  /** px */
  minWidth: number;
}

/**
 * Reads the `viewport-width` collection as breakpoints, smallest first.
 * The first mode is the base and must start at 0, so every width falls in exactly one mode.
 */
export function getBreakpoints(collections: AST.TokenCollectionDeclaration[]): Breakpoint[] {
  const collection = collections.find(({ name }) => name === BREAKPOINT_COLLECTION);

  if (!collection) {
    throw new Error(`Token collection "${BREAKPOINT_COLLECTION}" is not defined`);
  }

  const breakpoints = collection.modes.map(({ id, minWidth }) => {
    if (minWidth === undefined) {
      throw new Error(`Mode "${id}" in "${BREAKPOINT_COLLECTION}" has no minWidth`);
    }

    return { id, minWidth };
  });

  if (breakpoints[0]?.minWidth !== 0) {
    throw new Error(`The first mode in "${BREAKPOINT_COLLECTION}" must have minWidth 0`);
  }

  breakpoints.forEach((breakpoint, i) => {
    const prev = breakpoints[i - 1];

    if (prev && breakpoint.minWidth <= prev.minWidth) {
      throw new Error(
        `Modes in "${BREAKPOINT_COLLECTION}" must be in ascending minWidth order: "${prev.id}" (${prev.minWidth}) comes before "${breakpoint.id}" (${breakpoint.minWidth})`,
      );
    }
  });

  return breakpoints;
}

/** Breakpoints that need a media query; the base mode applies without one. */
export function getNonBaseBreakpoints(breakpoints: Breakpoint[]): Breakpoint[] {
  return breakpoints.slice(1);
}

const toKey = (id: string) => (/^[A-Za-z_$][\w$]*$/.test(id) ? id : JSON.stringify(id));

const banner = `// Generated from the "${BREAKPOINT_COLLECTION}" collection of @seed-design/rootage-artifacts. Do not edit.\n`;

export function getBreakpointsMjs(breakpoints: Breakpoint[]): string {
  const names = breakpoints.map(({ id }) => JSON.stringify(id)).join(", ");
  const values = breakpoints.map(({ id, minWidth }) => `  ${toKey(id)}: ${minWidth},`);
  const mediaQueries = getNonBaseBreakpoints(breakpoints).map(
    ({ id, minWidth }) => `  ${toKey(id)}: "(min-width: ${minWidth}px)",`,
  );

  return `${banner}
// Ascending order from smallest to largest breakpoint
export const breakpointNames = [${names}];

export const breakpoints = {
${values.join("\n")}
};

export const mediaQueries = {
${mediaQueries.join("\n")}
};
`;
}

export function getBreakpointsDts(breakpoints: Breakpoint[]): string {
  const names = breakpoints.map(({ id }) => JSON.stringify(id)).join(", ");
  const base = JSON.stringify(breakpoints[0]!.id);

  return `${banner}
export declare const breakpointNames: readonly [${names}];

export type Breakpoint = (typeof breakpointNames)[number];

export declare const breakpoints: Record<Breakpoint, number>;

export declare const mediaQueries: Record<Exclude<Breakpoint, ${base}>, string>;
`;
}
