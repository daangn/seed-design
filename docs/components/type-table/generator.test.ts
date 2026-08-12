import { afterEach, describe, expect, it } from "bun:test";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createCompatibleTypeTableCache, createFilteredTypeTableGenerator } from "./generator";

const temporaryDirectories: string[] = [];

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
    const generator = createFilteredTypeTableGenerator(cacheDirectory);

    const cold = await generator.generateTypeTable({ path: sourcePath, name: "Props" });
    const warm = await generator.generateTypeTable({ path: sourcePath, name: "Props" });

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

  it("여러 generator가 같은 파일을 동시에 안전하게 기록한다", async () => {
    const directory = await createTemporaryDirectory();
    const sourcePath = join(directory, "props.ts");
    const cacheDirectory = join(directory, "cache");
    await writeFile(sourcePath, "export interface Props { value: string }\n");
    const generators = Array.from({ length: 12 }, () =>
      createFilteredTypeTableGenerator(cacheDirectory),
    );

    const outputs = await Promise.all(
      generators.map((generator) => generator.generateDocumentation({ path: sourcePath }, "Props")),
    );

    expect(outputs.every((output) => JSON.stringify(output) === JSON.stringify(outputs[0]))).toBe(
      true,
    );
    const files = await readdir(cacheDirectory);
    expect(files).toHaveLength(1);
    const cacheContents = await readFile(join(cacheDirectory, files[0]), "utf8");
    expect(() => JSON.parse(cacheContents)).not.toThrow();
  });

  it("손상된 JSON을 cache miss로 처리하고 다시 생성한다", async () => {
    const directory = await createTemporaryDirectory();
    const sourcePath = join(directory, "props.ts");
    const cacheDirectory = join(directory, "cache");
    await writeFile(sourcePath, "export interface Props { value: string }\n");
    const firstGenerator = createFilteredTypeTableGenerator(cacheDirectory);
    const expected = await firstGenerator.generateDocumentation({ path: sourcePath }, "Props");
    const [cacheFile] = await readdir(cacheDirectory);
    await writeFile(join(cacheDirectory, cacheFile), "{broken");

    const recovered = await createFilteredTypeTableGenerator(cacheDirectory).generateDocumentation(
      { path: sourcePath },
      "Props",
    );

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

    const output = await createFilteredTypeTableGenerator(
      unavailableCachePath,
    ).generateDocumentation({ path: sourcePath }, "Props");

    expect(output[0]?.entries.map((entry) => entry.name)).toEqual(["value"]);
  });
});
