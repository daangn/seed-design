import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPrompts(server: McpServer): void {
  server.prompt("read_design_strategy", "Best practices for reading Figma designs", (_extra) => {
    return {
      messages: [
        {
          role: "assistant",
          content: {
            type: "text",
            text: `When reading Figma designs, follow these best practices:
  
  1. Start with selection:
     - First use get_selection() to understand the current selection
     - If no selection ask user to select single or multiple nodes
  
  2. Get node infos of the selected nodes:
     - Use get_nodes_info() to get the information of the selected nodes
     - If no selection ask user to select single or multiple nodes
  `,
          },
        },
      ],
      description: "Best practices for reading Figma designs",
    };
  });
}
