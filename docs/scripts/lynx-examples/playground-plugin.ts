import { dirname, resolve } from "node:path";
import { rspack } from "@lynx-js/rspeedy";
import type { RsbuildPlugin, Rspack } from "@lynx-js/rspeedy";
import { DOCS_DIRECTORY, EXAMPLES_DIRECTORY } from "./constants.js";
import { discoverLynxExamples } from "./discovery.js";
import { createCatalogModule } from "./modules.js";

const PLUGIN_NAME = "seed-lynx-docs-playground";
const VIRTUAL_CATALOG_MODULE = resolve(DOCS_DIRECTORY, "playground/lynx/catalog.ts");
const VIRTUAL_CATALOG_REQUEST = "lynx-docs-examples";

export async function pluginLynxPlayground(): Promise<RsbuildPlugin> {
  const initialEntries = await discoverLynxExamples();
  const initialCatalogSource = createCatalogModule(initialEntries);

  return {
    name: PLUGIN_NAME,
    setup(api) {
      api.modifyRspackConfig((config) => {
        let currentEntries = initialEntries;
        let currentCatalogSource = initialCatalogSource;
        const virtualModules = new rspack.experiments.VirtualModulesPlugin({
          [VIRTUAL_CATALOG_MODULE]: currentCatalogSource,
        });
        let virtualModulesReady = false;

        config.resolve ??= {};
        if (!config.resolve.alias) config.resolve.alias = {};
        config.resolve.alias[VIRTUAL_CATALOG_REQUEST] = VIRTUAL_CATALOG_MODULE;

        config.plugins ??= [];
        config.plugins.push(virtualModules, {
          apply(compiler: Rspack.Compiler) {
            compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
              virtualModulesReady = true;
              compilation.contextDependencies.add(EXAMPLES_DIRECTORY);
              for (const entry of currentEntries) {
                compilation.contextDependencies.add(dirname(entry.sourcePath));
              }
            });

            compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, async () => {
              if (!virtualModulesReady) return;

              const nextEntries = await discoverLynxExamples();
              const nextCatalogSource = createCatalogModule(nextEntries);
              currentEntries = nextEntries;
              if (nextCatalogSource === currentCatalogSource) return;

              currentCatalogSource = nextCatalogSource;
              virtualModules.writeModule(VIRTUAL_CATALOG_MODULE, currentCatalogSource);
              compiler.modifiedFiles = new Set([
                ...(compiler.modifiedFiles ?? []),
                VIRTUAL_CATALOG_MODULE,
              ]);
            });
          },
        });
      });
    },
  };
}
