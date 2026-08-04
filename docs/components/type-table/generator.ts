import { createGenerator, type Generator } from "fumadocs-typescript";

const baseGenerator = createGenerator();

// remarkAutoTypeTable은 문서 내 모든 테이블을 Promise.all로 병렬 생성하는데, 그러면
// ts-morph 프로젝트에 소스 파일이 추가·해석되는 순서가 실행마다 달라져 union 멤버와
// 엔트리 순서가 흔들린다. generate-package-docs.ts가 산출물을 git에 커밋하므로
// (실행마다 가짜 diff 발생) 호출을 직렬화해 순서를 결정적으로 고정한다.
let chain: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task);
  chain = run.catch(() => undefined);
  return run;
}

async function filteredGenerateDocumentation(
  ...args: Parameters<Generator["generateDocumentation"]>
): ReturnType<Generator["generateDocumentation"]> {
  const [file, name, options = {}] = args;

  const output = await baseGenerator.generateDocumentation(file, name, {
    ...options,
    transform(entry, type, symbol) {
      options.transform?.call(this, entry, type, symbol);
      const src = symbol.getDeclarations()?.[0].getSourceFile().getFilePath();
      if (src?.includes("node_modules")) {
        entry.tags.push({ name: "external", text: src ?? "" });
      }
    },
  });

  return output.map((item) => ({
    ...item,
    entries: item.entries
      .filter((e) => e.tags.every((t) => t.name !== "external"))
      .map((e) => ({
        ...e,
        // fumadocs-typescript's getSimpleForm resolves type aliases into their
        // full union members, making simplifiedType longer than type.
        // Use type (which preserves aliases via UseAliasDefinedOutsideCurrentScope)
        // for both collapsed and expanded views until upstream is fixed.
        // See: https://github.com/fuma-nama/fumadocs/packages/typescript/src/lib/get-simple-form.ts
        simplifiedType: e.type,
      })),
  }));
}

/**
 * Generator that filters out types originating from node_modules.
 *
 * This is the only reason SEED forked the type-table plugin from fumadocs.
 * By wrapping generateDocumentation, we can use fumadocs' remarkAutoTypeTable
 * directly while still excluding external types (e.g. React internal props).
 *
 * generateTypeTable calls `this.generateDocumentation` internally,
 * so we need a proper object with method references (not spread copy)
 * for `this` binding to work correctly.
 */
export const filteredTypeTableGenerator: Generator = {
  generateDocumentation: filteredGenerateDocumentation,
  generateTypeTable(props, options) {
    return enqueue(() => baseGenerator.generateTypeTable.call(this, props, options));
  },
};
