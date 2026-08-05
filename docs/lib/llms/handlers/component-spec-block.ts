// Keep the import attribute. Handlers are pulled in by `app/source.tsx`, and the paths
// that reach it outside the bundler resolve this as a Node ESM JSON import, which throws
// `ERR_IMPORT_ATTRIBUTE_MISSING` without it. Nothing in the test suite catches that.
import index from "@seed-design/rootage-artifacts/index.json" with { type: "json" };
import type { LLMHandler } from "../types";

/**
 * `<ComponentSpecBlock id="action-button" />` renders a spec table on screen; llms.txt
 * links the JSON the table is built from instead. Transcribing the table here needs the
 * spec files off disk, which the bundled build cannot reach, and the JSON is the source
 * of truth either way. `variants` only narrows what the on-screen table shows, so the
 * link ignores it.
 */
export const componentSpecBlockHandler: LLMHandler = {
  names: ["ComponentSpecBlock"],
  render: (_node, { attr }) => {
    const id = attr("id");
    if (!id) return undefined;

    // An id with no resource behind it is a typo in the page. Keeping the tag puts it
    // where a reader of the output will see it.
    const path = `/components/${id}.json`;
    return index.resources.some((resource) => resource.path === path)
      ? `Component spec (JSON): /rootage${path}`
      : undefined;
  },
};
