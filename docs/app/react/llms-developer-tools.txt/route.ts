import { baseUrl } from "@/app/metadata";
import { reactSource } from "@/app/source";

export const revalidate = false;

/**
 * This is an entry point for accessing developer tools documentation.
 * Each topic can be accessed through its specific endpoint.
 */
export async function GET() {
  const allPages = reactSource.getPages();

  // Filter developer-tools pages
  const developerToolsPages = allPages.filter(({ slugs }) => {
    const [firstSlug] = slugs;
    return firstSlug === "developer-tools";
  });

  // Process pages
  const topics = developerToolsPages
    .map(({ data, slugs }) => {
      const [_firstSlug, ...restSlugs] = slugs;

      // Attach .txt extension to the last slug
      const path = restSlugs
        .map((slug, index) => {
          if (index === restSlugs.length - 1) return `${slug}.txt`;
          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/react/llms-developer-tools/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design React Developer Tools - LLM Reference Entry

This is an entry point for accessing developer tools documentation.
Includes codemods for automated migrations and Figma integration.

## Available Topics

${topics.join("\n")}

## Usage

To get information about a specific topic, access its endpoint:
Example: /react/llms-developer-tools/codemods/introduction.txt

The response will include the full MDX content for that topic, processed and ready for LLM consumption.

## Additional Resources

- Components documentation: /react/llms-components.txt
- Getting started: /react/llms-getting-started.txt
- Migration guides: /react/llms-migration.txt
`;

  return new Response(response);
}
