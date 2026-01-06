import type { Tool } from "../types.js";
import { fetchReactChangelog } from "../fetch.js";

export const getReactChangelogTool: Tool = {
  name: "get_react_changelog",
  description: "Get the SEED React package changelog with version history and release notes.",
  exec(server, { name, description }) {
    server.tool(name, description, {}, async () => {
      try {
        const content = await fetchReactChangelog();

        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching React changelog: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        };
      }
    });
  },
};
