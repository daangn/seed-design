import { mock } from "bun:test";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "../../test/fixtures");

export const createApiClient = mock(() => {
  return {
    getFileComponents: mock(async () => {
      return await fs.readJson(path.join(fixturesDir, "file-components.json"));
    }),
    getFileComponentSets: mock(async () => {
      return await fs.readJson(path.join(fixturesDir, "file-component-sets.json"));
    }),
    getFileNodes: mock(async (_, { ids }: { ids: string }) => {
      const componentNodesData = await fs.readJson(path.join(fixturesDir, "component-nodes.json"));
      const componentSetNodesData = await fs.readJson(
        path.join(fixturesDir, "component-set-nodes.json"),
      );

      const allNodes = {
        ...componentNodesData.nodes,
        ...componentSetNodesData.nodes,
      };

      const requestedIds = ids.split(",");
      const filteredNodes = {};

      requestedIds.forEach((id) => {
        if (allNodes[id]) {
          filteredNodes[id] = allNodes[id];
        }
      });

      return { nodes: filteredNodes };
    }),
    getFileStyles: mock(async () => {
      return await fs.readJson(path.join(fixturesDir, "file-styles.json"));
    }),
    getLocalVariables: mock(async () => {
      return await fs.readJson(path.join(fixturesDir, "file-variables.json"));
    }),
  };
});
