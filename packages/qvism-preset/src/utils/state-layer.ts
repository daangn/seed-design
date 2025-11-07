/**
 * State Layer utilities for Material Design state layer pattern.
 * State layer is a semi-transparent overlay between container and content.
 *
 * @see https://m3.material.io/foundations/interaction/states/state-layers
 */

/**
 * Creates base state layer structure using ::before pseudo-element.
 * This should be used once in base styles to define the structural properties.
 */
export function baseStateLayer(styles?: Record<string, any>): Record<string, any> {
  return {
    "&::before": {
      content: "''",
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      zIndex: -1,
      pointerEvents: "none",
      ...styles,
    },
  };
}

/**
 * Changes state layer styles (typically background) without repeating structure.
 * Use this in variants and state modifiers to avoid CSS duplication.
 *
 * @param styles - CSS properties to apply to ::before (typically background)
 * @returns Object with &::before selector containing only the specified styles
 *
 * @example
 * ```ts
 * // In variants
 * root: {
 *   ...stateLayer({ background: "transparent" })
 * }
 *
 * // In state modifiers
 * [pseudo(active)]: {
 *   ...stateLayer({ background: vars.pressed.color })
 * }
 * ```
 */
export function stateLayer(styles: Record<string, any>): Record<string, any> {
  return {
    "&::before": styles,
  };
}
