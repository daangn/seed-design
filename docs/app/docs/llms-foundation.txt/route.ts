import { baseUrl } from "@/app/metadata";
import { source } from "@/app/source";
import { shouldGenerateFoundationLLMText } from "@/app/docs/_llms/page-filter";

export const revalidate = false;

/**
 * This is an entry point for accessing individual foundation documentation.
 * Each foundation topic can be accessed through its specific endpoint.
 */
export async function GET() {
  const allPages = source.getPages().filter(shouldGenerateFoundationLLMText);

  // Process foundation pages
  const foundations = allPages
    .map(({ data, slugs }) => {
      const [_firstSlug, ...restSlugs] = slugs;

      // Attach .txt extension to the last slug
      const path = restSlugs
        .map((slug, index) => {
          if (index === restSlugs.length - 1) return `${slug}.txt`;

          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/docs/llms-foundation/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design Foundation - LLM Reference Entry

This is an entry point for accessing individual foundation documentation.
Each foundation topic can be accessed through its specific endpoint.

## Available Foundation Topics

${foundations.join("\n")}

## Usage

To get information about a specific foundation topic, access its endpoint:
Example: /docs/llms-foundation/spacing.txt
Example: /docs/llms-foundation/color/palette.txt

The response will include the full MDX content for that topic, processed and ready for LLM consumption.

## Additional Resources

- Components documentation: /docs/llms-components.txt
- Full documentation index: /docs/llms.txt
`;

  return new Response(response);
}
