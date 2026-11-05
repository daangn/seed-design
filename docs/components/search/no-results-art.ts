/**
 * "당근이" no-results kaomoji. The head/middle lines are shared across all variants;
 * only the face's expression changes. Copied byte-exact from the Figma source — every
 * space is load-bearing: the extra space on the RIGHT of the face makes it read as looking
 * left. Never reflow, reindent, or reformat these strings.
 *
 * The face is split into left frame / expression / right frame so the expression can render
 * one size larger than the frame (see no-results.tsx). The split stays byte-exact: for each
 * face, `left + expr + right` equals the original single string, so the spacing is unchanged.
 * Each piece is rendered separately with its own SEED type token in no-results.tsx.
 */
export const NO_RESULTS_HEAD = "   ∩ ∩";
export const NO_RESULTS_MIDDLE = "  oOo";
export const NO_RESULTS_FACES = [
  { left: "₍ ", expr: "•ᴥ•", right: "   ₎ ;;" },
  { left: "₍ ", expr: "-ᴥ-", right: "   ₎ . ." },
  { left: "₍ ", expr: "@ᴥ@", right: "   ₎ ?" },
] as const;
