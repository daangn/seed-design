import { baseUrl } from "@/app/metadata";
import { source } from "@/app/source";
import { shouldGenerateComponentLLMText } from "@/app/docs/_llms/page-filter";

export const revalidate = false;

/**
 * This is an entry point for accessing individual component documentation.
 * Each component can be accessed through its specific endpoint.
 */
export async function GET() {
  const allPages = source.getPages().filter(shouldGenerateComponentLLMText);

  // Process components
  const components = allPages
    .map(({ data, slugs }) => {
      const [_firstSlug, ...restSlugs] = slugs;

      // Attach .txt extension to the last slug
      const path = restSlugs
        .map((slug, index) => {
          if (index === restSlugs.length - 1) return `${slug}.txt`;

          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/docs/llms-components/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design Components (Design Guidelines) - LLM Reference Entry

This is an entry point for accessing individual component design guideline documentation.
Each component can be accessed through its specific endpoint.

## Available Components

${components.join("\n")}

## Usage

To get information about a specific component, access its endpoint:
Example: /docs/llms-components/action-button.txt

The response will include the full MDX content for that component, processed and ready for LLM consumption.

## Additional Resources

- Foundation documentation: /docs/llms-foundation.txt
- Full documentation index: /docs/llms.txt
`;

  return new Response(response);
}
