import { baseUrl } from "@/app/metadata";
import { reactSource } from "@/app/source";

export const revalidate = false;

/**
 * This is an entry point for accessing AI integration documentation.
 * Each topic can be accessed through its specific endpoint.
 */
export async function GET() {
  const allPages = reactSource.getPages();

  // Filter ai-integration pages
  const aiIntegrationPages = allPages.filter(({ slugs }) => {
    const [firstSlug] = slugs;
    return firstSlug === "ai-integration";
  });

  // Process pages
  const topics = aiIntegrationPages
    .map(({ data, slugs }) => {
      const [_firstSlug, ...restSlugs] = slugs;

      // Attach .txt extension to the last slug
      const path = restSlugs
        .map((slug, index) => {
          if (index === restSlugs.length - 1) return `${slug}.txt`;
          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/react/llms-ai-integration/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design React AI Integration - LLM Reference Entry

This is an entry point for accessing AI integration documentation.
Includes LLMs.txt specification and MCP (Model Context Protocol) integration guides.

## Available Topics

${topics.join("\n")}

## Usage

To get information about a specific topic, access its endpoint:
Example: /react/llms-ai-integration/mcp.txt

The response will include the full MDX content for that topic, processed and ready for LLM consumption.

## Additional Resources

- Components documentation: /react/llms-components.txt
- Getting started: /react/llms-getting-started.txt
- Full documentation (all in one): /react/llms-full.txt
`;

  return new Response(response);
}
