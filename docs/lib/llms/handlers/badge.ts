import type { LLMHandler } from "../types";

/**
 * `<Badge>직접 판단 필요</Badge>` marks emphasis visually, which llms.txt cannot carry,
 * so it becomes `[직접 판단 필요]`. Works from either position: `phrasing()` serializes
 * the children the same way whether the tag sits in a sentence or on its own line.
 */
export const badgeHandler: LLMHandler = {
  names: ["Badge"],
  // A badge with no label is decoration only (icon-only or empty) — nothing to say.
  remove: (node) => node.children.length === 0,
  render: (_node, { phrasing }) => {
    const label = phrasing().trim();
    return label ? `[${label}]` : undefined;
  },
};
