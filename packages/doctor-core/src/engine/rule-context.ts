import { Project, type Node, type SourceFile } from "ts-morph";

import type { ScannedFile } from "../types";

/**
 * 한 번의 실행에서 공유되는 in-memory ts-morph 프로젝트.
 * 디스크를 전혀 건드리지 않으며, 파일당 한 번만 파싱해 룰들이 AST를 공유한다.
 */
export function createSourceFileStore() {
  const project = new Project({ useInMemoryFileSystem: true });
  const cache = new Map<string, SourceFile>();

  return {
    /** lazy 파싱 접근자를 만든다. 실제 파싱은 첫 호출 시점에 일어난다. */
    createAccessor(file: ScannedFile): () => SourceFile {
      return () => {
        const cached = cache.get(file.path);
        if (cached) return cached;

        const sourceFile = project.createSourceFile(file.path, file.content);
        cache.set(file.path, sourceFile);
        return sourceFile;
      };
    },
  };
}

/** AST 노드의 1-based 라인/컬럼 위치. 룰에서 finding 좌표를 만들 때 사용한다. */
export function getNodePosition(node: Node): { line: number; column: number } {
  return {
    line: node.getStartLineNumber(),
    column: node.getStart() - node.getStartLinePos() + 1,
  };
}
