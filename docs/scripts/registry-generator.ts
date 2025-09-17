import { Project, type SourceFile } from "ts-morph";
import type {
  Registry,
  RegistryItem,
  GeneratedRegistry,
  GeneratedRegistryItem,
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

  generate(): { index: GeneratedRegistry; items: GeneratedRegistryItem[] }[] {
    return this.#registries.map((registry) => {
      const processedItems = registry.items.map((registryItem) =>
        this.processRegistryItem({ registryName: registry.id, registryItem }),
      );

      return {
        index: {
          ...registry,
          items: processedItems.map(({ files, ...rest }) => ({
            files: files.map(({ content, ...rest }) => rest),
            ...rest,
          })),
        },
        items: processedItems,
      };
    });
  }

  private processRegistryItem({
    registryName,
    registryItem,
  }: {
    registryName: Registry["id"];
    registryItem: RegistryItem;
  }): GeneratedRegistryItem {
    const { files, ...metadata } = registryItem;

    const sourceFiles: SourceFile[] = [];

    const filesWithContent = files.map(({ path: filePath }) => {
      const content = this.#getFileContent(path.join(registryName, filePath));
      const sourceFile = this.#project.createSourceFile(filePath, content);

      sourceFiles.push(sourceFile);

      return { path: filePath, content };
    });

    const deps = this.resolveDependencies({
      sourceFiles,
      currentFile: { registryName, itemName: registryItem.id },
    });

    for (const file of sourceFiles) {
      this.#project.removeSourceFile(file);
    }

    return {
      ...metadata,
      ...deps,
      files: filesWithContent,
    };
  }

  private findRegistryItem({
    registryName,
    relativePath,
  }: {
    registryName: string;
    relativePath: string;
  }) {
    const registry = this.#registries.find((r) => r.id === registryName);
    if (!registry) return null;

    const pathWithoutExt = path.basename(relativePath, path.extname(relativePath));

    // see which registry item contains the file
    // e.g a registry item may look like this: { name: "button", files: ["variants/ghost-button.tsx"] }
    // if import { GhostButton } from "seed-design/ui/variants/ghost-button"
    // with { registryName: "ui", relativePath: "variants/ghost-button" }, find the "button" item
    for (const item of registry.items) {
      for (const { path: filePath } of item.files) {
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
          return { registryName: registry.id, itemName: item.id };
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
    currentFile: { registryName: Registry["id"]; itemName: RegistryItem["id"] };
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
        // e.g. "seed-design/ui/button" -> registryName: "ui", relativePath: "button"
        // e.g. "seed-design/breeze/animate-number/animate-number" -> registryName: "breeze", relativePath: "animate-number/animate-number"
        if (moduleSpecifier.startsWith(`${this.#importAlias}/`)) {
          const pathWithoutAlias = moduleSpecifier.slice(`${this.#importAlias}/`.length);
          const [registryName, ...pathParts] = pathWithoutAlias.split("/");
          const relativePath = pathParts.join("/");

          const registryItem = this.findRegistryItem({ registryName, relativePath });

          if (!registryItem) {
            throw new Error(`Could not find registry item for import: "${moduleSpecifier}"`);
          }

          // e.g. import styles from "seed-design/breeze/animate-number/animate-number.module.css" in "breeze/animate-number"
          if (
            registryItem.registryName === currentFile.registryName &&
            registryItem.itemName === currentFile.itemName
          ) {
            continue;
          }

          if (!innerDepsMap.has(registryItem.registryName)) {
            innerDepsMap.set(registryItem.registryName, new Set());
          }

          innerDepsMap.get(registryItem.registryName)!.add(registryItem.itemName);

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
