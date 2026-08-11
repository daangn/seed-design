import { fileURLToPath } from "node:url";
import type { DocGenerator, RemarkDocGenOptions } from "fumadocs-docgen";
import type { Code } from "mdast";
import { defineMdastPlugin, type MdastNode, type MdastVisitorContext } from "satteri";

const DOC_GEN_META_PATTERN = /doc-gen:(.+)/;

/**
 * `fumadocs-docgen`의 generator를 Satteri MDAST 방문자에서 실행합니다.
 *
 * 공식 `remarkDocGen`은 unified transformer라 Satteri 파이프라인에 직접 넣을 수 없습니다.
 * generator 계약은 유지하고, 코드 블록 탐색과 노드 교체만 Satteri API로 수행합니다.
 */
export function remarkDocGen({ generators = [] }: RemarkDocGenOptions = {}) {
  const generatorWithFileHook = generators.find((generator) => generator.onFile);
  if (generatorWithFileHook) {
    throw new Error(
      `[remark-doc-gen] Satteri adapter does not support the onFile hook: ${generatorWithFileHook.name}`,
    );
  }

  return defineMdastPlugin({
    name: "remark-doc-gen",
    async code(node, context) {
      if (node.lang !== "json" || !node.meta) return;

      const name = DOC_GEN_META_PATTERN.exec(node.meta)?.[1];
      if (!name) return;

      const generator = generators.find((candidate) => candidate.name === name);
      if (!generator) return;

      const filePath = context.fileURL ? fileURLToPath(context.fileURL) : "";
      const result = await generator.run(JSON.parse(node.value), {
        cwd: process.cwd(),
        path: filePath,
        node: node as Code,
      });
      if (!result) return;

      replaceWithGeneratedNodes(node, result, context);
    },
  });
}

function replaceWithGeneratedNodes(
  node: Readonly<Code>,
  result: Awaited<ReturnType<DocGenerator["run"]>>,
  context: MdastVisitorContext,
): void {
  if (!result) return;

  const generated = (Array.isArray(result) ? result : [result]) as MdastNode[];
  const parent = context.parent(node);
  const index = context.indexOf(node);
  const [first, ...rest] = generated;
  if (!first) {
    context.removeNode(node);
    return;
  }

  context.replaceNode(node, first);

  if (parent && index !== undefined && rest.length > 0) {
    context.insertChildAt(parent, index + 1, rest);
  }
}
