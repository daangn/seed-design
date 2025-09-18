import { Project, type SourceFile } from "ts-morph";
import type {
  Registry,
  RegistryItem,
  GeneratedRegistry,
  GeneratedRegistryItem,
  AvailableRegistries,
} from "../registry/schema.js";
import packageJson from "../package.json" with { type: "json" };
import path from "node:path";

type GetFileContent = (filePath: string) => string;

export class RegistryGenerator {
  #project: Project;
  #installedDeps: Set<string>;
  #innateDeps: Set<string>;
  #importAlias: string;
  #registries: Registry[] = [];
  #getFileContent: GetFileContent;

  constructor({
    registries,
    importAlias,
    innateDeps,
    getFileContent,
  }: {
    registries: Registry[];
    importAlias: string;
    innateDeps?: Set<string>;
    getFileContent: GetFileContent;
  }) {
    this.#registries = registries ?? [];
    this.#importAlias = importAlias;
    this.#innateDeps = innateDeps ?? new Set();
    this.#getFileContent = getFileContent;

    this.#installedDeps = new Set(Object.keys(packageJson.dependencies ?? {}));
    this.#project = new Project({
      // TODO: find out what options are these
      skipLoadingLibFiles: true,
      useInMemoryFileSystem: true,
    });
  }

  generate(): {
    availableRegistries: AvailableRegistries;
    registries: { index: GeneratedRegistry; items: GeneratedRegistryItem[] }[];
  } {
    return {
      availableRegistries: this.#registries.map(({ id }) => ({ id })),
      registries: this.#registries.map((registry) => {
        const processedItems = registry.items.map((registryItem) =>
          this.processRegistryItem({ registryId: registry.id, registryItem }),
        );

        return {
          index: {
            ...registry,
            items: processedItems.map(({ snippets, ...rest }) => ({
              snippets: snippets.map(({ content, ...rest }) => rest),
              ...rest,
            })),
          },
          items: processedItems,
        };
      }),
    };
  }

  private processRegistryItem({
    registryId,
    registryItem,
  }: {
    registryId: Registry["id"];
    registryItem: RegistryItem;
  }): GeneratedRegistryItem {
    const { snippets, ...metadata } = registryItem;

    const sourceFiles: SourceFile[] = [];

    const snippetsWithContent = snippets.map(({ path: filePath }) => {
      const content = this.#getFileContent(path.join(registryId, filePath));
      const sourceFile = this.#project.createSourceFile(filePath, content);

      sourceFiles.push(sourceFile);

      return { path: filePath, content };
    });

    const deps = this.resolveDependencies({
      sourceFiles,
      currentFile: { registryId, itemId: registryItem.id },
    });

    for (const file of sourceFiles) {
      this.#project.removeSourceFile(file);
    }

    return {
      ...metadata,
      ...deps,
      snippets: snippetsWithContent,
    };
  }

  private findRegistryItem({
    registryId,
    relativePath,
  }: {
    registryId: string;
    relativePath: string;
  }) {
    const registry = this.#registries.find((r) => r.id === registryId);
    if (!registry) return null;

    const pathWithoutExt = path.basename(relativePath, path.extname(relativePath));

    // see which registry item contains the file
    // e.g a registry item may look like this: { name: "button", snippets: ["variants/ghost-button.tsx"] }
    // if import { GhostButton } from "seed-design/ui/variants/ghost-button"
    // with { registryId: "ui", relativePath: "variants/ghost-button" }, find the "button" item
    for (const item of registry.items) {
      for (const { path: filePath } of item.snippets) {
        const fileWithoutExt = path.basename(filePath, path.extname(filePath));

        // TODO: this can be better I guess
        if (
          filePath === relativePath ||
          fileWithoutExt === pathWithoutExt ||
          filePath === `${relativePath}.tsx` ||
          filePath === `${relativePath}.ts` ||
          filePath === `${relativePath}.jsx` ||
          filePath === `${relativePath}.js`
        ) {
          return { registryId: registry.id, itemId: item.id };
        }
      }
    }

    return null;
  }

  private resolveDependencies({
    sourceFiles,
    currentFile,
  }: {
    sourceFiles: SourceFile[];
    currentFile: { registryId: Registry["id"]; itemId: RegistryItem["id"] };
  }): Pick<GeneratedRegistryItem, "dependencies" | "innerDependencies"> {
    const dependencies = new Set<string>();
    const innerDepsMap = new Map<Registry["id"], Set<string>>();

    for (const sourceFile of sourceFiles) {
      const importDeclarations = sourceFile.getImportDeclarations();

      findDeclaration: for (const declaration of importDeclarations) {
        const moduleSpecifier = declaration.getModuleSpecifier().getLiteralText();

        // throw relative imports
        if (moduleSpecifier.startsWith(".")) {
          throw new Error(
            `레지스트리의 파일을 import할 때는 ${this.#importAlias}/registry-name/file/path 형식을 사용해주세요: "${moduleSpecifier}"`,
          );
        }

        // registry imports (seed-design/registry-name/file/path)
        // e.g. "seed-design/ui/button" -> registryId: "ui", relativePath: "button"
        // e.g. "seed-design/breeze/animate-number/animate-number" -> registryId: "breeze", relativePath: "animate-number/animate-number"
        if (moduleSpecifier.startsWith(`${this.#importAlias}/`)) {
          const pathWithoutAlias = moduleSpecifier.slice(`${this.#importAlias}/`.length);
          const [registryId, ...pathParts] = pathWithoutAlias.split("/");
          const relativePath = pathParts.join("/");

          const registryItem = this.findRegistryItem({ registryId, relativePath });

          if (!registryItem) {
            throw new Error(`Could not find registry item for import: "${moduleSpecifier}"`);
          }

          // e.g. import styles from "seed-design/breeze/animate-number/animate-number.module.css" in "breeze/animate-number"
          if (
            registryItem.registryId === currentFile.registryId &&
            registryItem.itemId === currentFile.itemId
          ) {
            continue;
          }

          if (!innerDepsMap.has(registryItem.registryId)) {
            innerDepsMap.set(registryItem.registryId, new Set());
          }

          innerDepsMap.get(registryItem.registryId)!.add(registryItem.itemId);

          continue;
        }

        // innate dependencies
        // e.g. "react"
        if (this.#innateDeps.has(moduleSpecifier)) continue;

        // e.g. "react/jsx-runtime" -> adds "react"
        for (const dep of this.#innateDeps) {
          if (moduleSpecifier.startsWith(`${dep}/`)) continue findDeclaration;
        }

        // non-relative imports (npm packages)
        // e.g. "@seed-design/react"
        if (this.#installedDeps.has(moduleSpecifier)) {
          dependencies.add(moduleSpecifier);

          continue;
        }

        // e.g. "@seed-design/react/primitive" -> adds "@seed-design/react"
        for (const dep of this.#installedDeps) {
          if (moduleSpecifier.startsWith(`${dep}/`)) {
            dependencies.add(dep);

            continue findDeclaration;
          }
        }

        throw new Error(`의존성을 설치하지 않고 import하는 것 같아요: "${moduleSpecifier}"`);
      }
    }

    const sortedDependencies = Array.from(dependencies).sort();

    // Convert innerDepsMap to array format that matches the schema
    let innerDependencies: GeneratedRegistryItem["innerDependencies"];

    if (innerDepsMap.size > 0) {
      innerDependencies = [];

      for (const [registryId, itemsSet] of innerDepsMap) {
        innerDependencies.push({
          registryId,
          itemIds: Array.from(itemsSet).sort(),
        });
      }
    }

    return {
      dependencies: sortedDependencies.length > 0 ? sortedDependencies : undefined,
      innerDependencies,
    };
  }
}
