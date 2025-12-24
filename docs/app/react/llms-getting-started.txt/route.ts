import { baseUrl } from "@/app/metadata";
import { reactSource } from "@/app/source";

export const revalidate = false;

/**
 * This is an entry point for accessing getting started documentation.
 * Each topic can be accessed through its specific endpoint.
 */
export async function GET() {
  const allPages = reactSource.getPages();

  // Filter getting-started pages
  const gettingStartedPages = allPages.filter(({ slugs }) => {
    const [firstSlug] = slugs;
    return firstSlug === "getting-started";
  });

  // Process pages
  const topics = gettingStartedPages
    .map(({ data, slugs }) => {
      const [_firstSlug, ...restSlugs] = slugs;

      // Attach .txt extension to the last slug
      const path = restSlugs
        .map((slug, index) => {
          if (index === restSlugs.length - 1) return `${slug}.txt`;
          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/react/llms-getting-started/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design React Getting Started - LLM Reference Entry

This is an entry point for accessing getting started documentation.
Each topic can be accessed through its specific endpoint.

## Available Topics

${topics.join("\n")}

## Usage

To get information about a specific topic, access its endpoint:
Example: /react/llms-getting-started/installation/vite.txt

The response will include the full MDX content for that topic, processed and ready for LLM consumption.

## Additional Resources

- Components documentation: /react/llms-components.txt
- Full documentation (all in one): /react/llms-full.txt
- Changelog: /react/llms-changelog.txt
`;

  return new Response(response);
}
