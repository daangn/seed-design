import { afterAll, afterEach, beforeAll, describe, expect, it } from "bun:test";
import { chmod, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DocEntry } from "fumadocs-typescript";
import {
  collectTypeDependencyFiles,
  createCompatibleTypeTableCache,
  createFilteredTypeTableGenerator,
} from "./generator";

const temporaryDirectories: string[] = [];
// GitHub runner에서는 여러 TypeScript project를 동시에 초기화하는 데 5초 이상 걸릴 수 있다.
const CONCURRENT_GENERATOR_TEST_TIMEOUT = 30_000;

type GeneratedDocs = { entries: DocEntry[] }[];

/**
 * fumadocs-typescript는 TypeScript 7 sync API로 tsgo 자식 프로세스와 통신하는데, Bun의
 * child_process는 그 파이프 fd를 주지 않아 Bun에서는 생성이 실패한다. 문서 빌드(Next.js)처럼
 * Node에서 돌리려고 generator를 번들로 만들어 둔다.
 */
let generatorBundle: string;

beforeAll(async () => {
  const outdir = await mkdtemp(join(import.meta.dir, ".generator-bundle-"));
  const result = await Bun.build({
    entrypoints: [join(import.meta.dir, "generator.ts")],
    outdir,
    target: "node",
    packages: "external",
  });
  if (!result.success) throw new AggregateError(result.logs, "generator bundle failed");
  generatorBundle = join(outdir, "generator.js");
});

afterAll(async () => {
  await rm(join(generatorBundle, ".."), { recursive: true, force: true });
});

/** `body`를 Node에서 실행하고 반환값을 받습니다. `body`에서는 `generator`로 generator 모듈을 씁니다. */
async function runInNode<T>(body: string): Promise<T> {
  const script = `import * as generator from ${JSON.stringify(generatorBundle)};
const result = await (async () => {${body}})();
process.stdout.write(JSON.stringify(result));`;
  const child = Bun.spawn(["node", "--input-type=module", "--eval", script], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (exitCode !== 0) throw new Error(stderr);
  return JSON.parse(stdout) as T;
}

const js = (value: unknown) => JSON.stringify(value);

async function createTemporaryDirectory() {
  const directory = await mkdtemp(join(import.meta.dir, ".generator-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

describe("filtered type table generator cache", () => {
  it("없는 경로를 호환성 입력에서 제외한다", async () => {
    const directory = await createTemporaryDirectory();

    expect(collectTypeDependencyFiles(join(directory, "missing"))).toEqual([]);
  });

  it("디렉터리 읽기 권한 오류를 전파한다", async () => {
    const directory = await createTemporaryDirectory();
    const inaccessibleDirectory = join(directory, "inaccessible");
    await mkdir(inaccessibleDirectory);
    await chmod(inaccessibleDirectory, 0o000);

    try {
      let thrown: unknown;
      try {
        collectTypeDependencyFiles(inaccessibleDirectory);
      } catch (error) {
        thrown = error;
      }
      expect((thrown as NodeJS.ErrnoException | undefined)?.code).toBe("EACCES");
    } finally {
      await chmod(inaccessibleDirectory, 0o700);
    }
  });

  it("생성물 디렉터리를 호환성 입력에서 제외한다", async () => {
    const directory = await createTemporaryDirectory();
    await mkdir(join(directory, "src"));
    await writeFile(join(directory, "src", "props.ts"), "export interface Props {}\n");
    for (const skippedDirectory of [
      "node_modules",
      "dist",
      "build",
      "lib",
      "coverage",
      ".cache",
      ".turbo",
      ".next",
    ]) {
      await mkdir(join(directory, skippedDirectory));
      await writeFile(join(directory, skippedDirectory, "generated.ts"), "export {};\n");
    }
    await writeFile(join(directory, ".ultra.cache.json"), "{}\n");

    expect(collectTypeDependencyFiles(directory)).toEqual([join(directory, "src", "props.ts")]);
  });

  it("CI와 generator가 같은 호환성 해시 구현을 사용한다", async () => {
    const action = await readFile(
      join(import.meta.dir, "../../../.github/actions/docs-build-cache/action.yml"),
      "utf8",
    );

    expect(action).toContain("components/type-table/cache-compatibility.ts");
    expect(action).not.toContain("FUMADOCS_COMPATIBILITY_HASH: ${{ hashFiles");
  });

  it("generator transform과 this binding을 유지한 결과를 재사용한다", async () => {
    const directory = await createTemporaryDirectory();
    const sourcePath = join(directory, "props.ts");
    const cacheDirectory = join(directory, "cache");
    await writeFile(
      sourcePath,
      `import type { HTMLAttributes } from "react";

export interface Props extends HTMLAttributes<HTMLDivElement> {
  value: string;
}
`,
    );
    const { cold, warm } = await runInNode<{ cold: GeneratedDocs; warm: GeneratedDocs }>(`
      const g = generator.createFilteredTypeTableGenerator(${js(cacheDirectory)});
      const cold = await g.generateTypeTable({ path: ${js(sourcePath)}, name: "Props" });
      const warm = await g.generateTypeTable({ path: ${js(sourcePath)}, name: "Props" });
      return { cold, warm };
    `);

    expect(warm).toEqual(cold);
    expect(warm[0]?.entries.map((entry) => entry.name)).toEqual(["value"]);
    expect(warm[0]?.entries[0]?.simplifiedType).toBe(warm[0]?.entries[0]?.type);
    expect(await readdir(cacheDirectory)).toHaveLength(1);
  });

  it("호환성 해시가 바뀌면 같은 upstream key를 재사용하지 않는다", async () => {
    const directory = await createTemporaryDirectory();
    const first = createCompatibleTypeTableCache(directory, "first");
    const second = createCompatibleTypeTableCache(directory, "second");

    await first.write("same-key", { value: 1 });
    await second.write("same-key", { value: 2 });

    expect(await first.read("same-key")).toEqual({ value: 1 });
    expect(await second.read("same-key")).toEqual({ value: 2 });
    expect(await readdir(directory)).toHaveLength(2);
  });

  it("현재 호환성 접두사와 다른 이전 cache generation을 정리한다", async () => {
    const directory = await createTemporaryDirectory();
    await writeFile(join(directory, "old-generation-key.json"), "[]");
    await writeFile(join(directory, "keep.txt"), "not a cache entry");

    createFilteredTypeTableGenerator(directory);

    expect(await readdir(directory)).toEqual(["keep.txt"]);
  });

  it(
    "여러 generator가 같은 파일을 동시에 안전하게 기록한다",
    async () => {
      const directory = await createTemporaryDirectory();
      const sourcePath = join(directory, "props.ts");
      const cacheDirectory = join(directory, "cache");
      await writeFile(sourcePath, "export interface Props { value: string }\n");
      // 로컬 빌드에서 확인한 3-worker 조건보다 하나 더 많은 writer로 공유 cache를 검증한다.
      const outputs = await runInNode<GeneratedDocs[]>(`
        const generators = Array.from({ length: 4 }, () =>
          generator.createFilteredTypeTableGenerator(${js(cacheDirectory)}),
        );
        return Promise.all(
          generators.map((g) => g.generateDocumentation({ path: ${js(sourcePath)} }, "Props")),
        );
      `);

      expect(outputs.every((output) => JSON.stringify(output) === JSON.stringify(outputs[0]))).toBe(
        true,
      );
      const files = await readdir(cacheDirectory);
      expect(files).toHaveLength(1);
      const cacheContents = await readFile(join(cacheDirectory, files[0]), "utf8");
      expect(() => JSON.parse(cacheContents)).not.toThrow();
    },
    CONCURRENT_GENERATOR_TEST_TIMEOUT,
  );

  it("손상된 JSON을 cache miss로 처리하고 다시 생성한다", async () => {
    const directory = await createTemporaryDirectory();
    const sourcePath = join(directory, "props.ts");
    const cacheDirectory = join(directory, "cache");
    await writeFile(sourcePath, "export interface Props { value: string }\n");
    const generate = `
      return generator
        .createFilteredTypeTableGenerator(${js(cacheDirectory)})
        .generateDocumentation({ path: ${js(sourcePath)} }, "Props");
    `;
    const expected = await runInNode<GeneratedDocs>(generate);
    const [cacheFile] = await readdir(cacheDirectory);
    await writeFile(join(cacheDirectory, cacheFile), "{broken");

    const recovered = await runInNode<GeneratedDocs>(generate);

    expect(recovered).toEqual(expected);
    const cacheContents = await readFile(join(cacheDirectory, cacheFile), "utf8");
    expect(() => JSON.parse(cacheContents)).not.toThrow();
  });

  it("cache 디렉터리에 쓸 수 없어도 문서 생성을 계속한다", async () => {
    const directory = await createTemporaryDirectory();
    const sourcePath = join(directory, "props.ts");
    const unavailableCachePath = join(directory, "not-a-directory");
    await writeFile(sourcePath, "export interface Props { value: string }\n");
    await writeFile(unavailableCachePath, "file blocks directory creation");

    const output = await runInNode<GeneratedDocs>(`
      return generator
        .createFilteredTypeTableGenerator(${js(unavailableCachePath)})
        .generateDocumentation({ path: ${js(sourcePath)} }, "Props");
    `);

    expect(output[0]?.entries.map((entry) => entry.name)).toEqual(["value"]);
  });
});

describe("filtered type table generator props", () => {
  it("선언 없이 외부 mapped type에서 온 Lynx native 이벤트를 제외한다", async () => {
    const directory = await createTemporaryDirectory();
    const sourcePath = join(directory, "props.ts");
    await writeFile(
      sourcePath,
      `import type { IntrinsicElements } from "@lynx-js/types";

export interface Props extends Omit<IntrinsicElements["view"], "className"> {
  value: string;
}
`,
    );

    const output = await runInNode<GeneratedDocs>(`
      return generator
        .createFilteredTypeTableGenerator(${js(join(directory, "cache"))})
        .generateDocumentation({ path: ${js(sourcePath)} }, "Props");
    `);

    expect(output[0]?.entries.map((entry) => entry.name)).toEqual(["value"]);
  });

  it("Lynx 공통 요소 속성과 통째로 상속한 레이아웃 prop은 빼고 Pick한 prop과 Box 문서의 prop은 남긴다", async () => {
    const directory = await createTemporaryDirectory();
    const lynxSourceDirectory = join(directory, "packages/lynx-react/src");
    const styleKeys = Array.from({ length: 12 }, (_, index) => `style${index}`);
    await mkdir(join(lynxSourceDirectory, "utils"), { recursive: true });
    await mkdir(join(lynxSourceDirectory, "components/Box"), { recursive: true });
    await writeFile(
      join(lynxSourceDirectory, "types.ts"),
      "export interface LynxStyledElementProps { className?: string; style?: object }\n",
    );
    await writeFile(
      join(lynxSourceDirectory, "utils/styled.ts"),
      `export interface StyleProps {\n${styleKeys.map((key) => `  ${key}?: string;\n`).join("")}}\n`,
    );
    const sourcePath = join(lynxSourceDirectory, "props.ts");
    await writeFile(
      sourcePath,
      `import type { LynxStyledElementProps } from "./types";
import type { StyleProps } from "./utils/styled";

export interface WholesaleProps extends StyleProps, LynxStyledElementProps {
  value: string;
}

export interface PickedProps extends Pick<StyleProps, "style0">, LynxStyledElementProps {
  value: string;
}
`,
    );
    const boxPath = join(lynxSourceDirectory, "components/Box/Box.tsx");
    await writeFile(
      boxPath,
      `import type { StyleProps } from "../../utils/styled";

export interface BoxProps extends StyleProps {}
`,
    );
    const [wholesale, picked, box] = await runInNode<GeneratedDocs[]>(`
      const g = generator.createFilteredTypeTableGenerator(${js(join(directory, "cache"))});
      return Promise.all([
        g.generateDocumentation({ path: ${js(sourcePath)} }, "WholesaleProps"),
        g.generateDocumentation({ path: ${js(sourcePath)} }, "PickedProps"),
        g.generateDocumentation({ path: ${js(boxPath)} }, "BoxProps"),
      ]);
    `);

    expect(wholesale[0]?.entries.map((entry) => entry.name)).toEqual(["value"]);
    expect(picked[0]?.entries.map((entry) => entry.name).sort()).toEqual(["style0", "value"]);
    // TypeScript 7은 선언 순서와 다르게 멤버를 돌려줄 수 있어, 남은 prop의 집합만 비교한다.
    expect(box[0]?.entries.map((entry) => entry.name).sort()).toEqual([...styleKeys].sort());
  });
});
