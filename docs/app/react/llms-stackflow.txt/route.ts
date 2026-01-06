import { baseUrl } from "@/app/metadata";
import { reactSource } from "@/app/source";

export const revalidate = false;

/**
 * This is an entry point for accessing Stackflow integration documentation.
 * Each topic can be accessed through its specific endpoint.
 */
export async function GET() {
  const allPages = reactSource.getPages();

  // Filter stackflow pages
  const stackflowPages = allPages.filter(({ slugs }) => {
    const [firstSlug] = slugs;
    return firstSlug === "stackflow";
  });

  // Process pages
  const topics = stackflowPages
    .map(({ data, slugs }) => {
      const [_firstSlug, ...restSlugs] = slugs;

      // Attach .txt extension to the last slug
      const path = restSlugs
        .map((slug, index) => {
          if (index === restSlugs.length - 1) return `${slug}.txt`;
          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/react/llms-stackflow/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design React Stackflow Integration - LLM Reference Entry

This is an entry point for accessing Stackflow integration documentation.
Stackflow provides native-like navigation for web applications.

## Available Topics

${topics.join("\n")}

## Usage

To get information about a specific topic, access its endpoint:
Example: /react/llms-stackflow/getting-started.txt

The response will include the full MDX content for that topic, processed and ready for LLM consumption.

## Additional Resources

- Components documentation: /react/llms-components.txt
- Getting started: /react/llms-getting-started.txt
- Full documentation (all in one): /react/llms-full.txt
`;

  return new Response(response);
}
