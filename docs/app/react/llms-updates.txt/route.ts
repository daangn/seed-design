import { baseUrl } from "@/app/metadata";
import { reactSource } from "@/app/source";

export const revalidate = false;

/**
 * This is an entry point for accessing updates documentation.
 * Each topic can be accessed through its specific endpoint.
 */
export async function GET() {
  const allPages = reactSource.getPages();

  // Filter updates pages (excluding changelog which has its own endpoint)
  const updatesPages = allPages.filter(({ slugs, path }) => {
    const [firstSlug] = slugs;
    // Exclude the main changelog page as it has its own dedicated endpoint
    if (path.includes("changelog.mdx")) return false;
    return firstSlug === "updates";
  });

  // Process pages
  const topics = updatesPages
    .map(({ data, slugs }) => {
      const [_firstSlug, ...restSlugs] = slugs;

      // Attach .txt extension to the last slug
      const path = restSlugs
        .map((slug, index) => {
          if (index === restSlugs.length - 1) return `${slug}.txt`;
          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/react/llms-updates/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design React Updates - LLM Reference Entry

This is an entry point for accessing updates documentation.
Includes version improvements and release notes.

## Available Topics

${topics.join("\n")}

## Usage

To get information about a specific topic, access its endpoint:
Example: /react/llms-updates/v3-improvements.txt

The response will include the full MDX content for that topic, processed and ready for LLM consumption.

## Additional Resources

- Changelog (version history): /react/llms-changelog.txt
- Migration guides: /react/llms-migration.txt
- Components documentation: /react/llms-components.txt
`;

  return new Response(response);
}
