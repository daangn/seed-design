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
 *
 * 아티팩트가 아는 리소스 경로를 인자로 받는다. 테스트는 합성 목록으로 핸들러를 만들어
 * 실제 컴포넌트 id에 묶이지 않게 한다.
 */
export function createComponentSpecBlockHandler(resourcePaths: Iterable<string>): LLMHandler {
  const known = new Set(resourcePaths);

  return {
    names: ["ComponentSpecBlock"],
    render: (_node, { attr }) => {
      const id = attr("id");
      if (!id) return undefined;

      // An id with no resource behind it is a typo in the page. Keeping the tag puts it
      // where a reader of the output will see it.
      const path = `/components/${id}.json`;
      return known.has(path) ? `Component spec (JSON): /rootage${path}` : undefined;
    },
  };
}

export const componentSpecBlockHandler = createComponentSpecBlockHandler(
  index.resources.map((resource) => resource.path),
);
