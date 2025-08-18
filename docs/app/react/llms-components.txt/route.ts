import { baseUrl } from "@/app/metadata";
import { reactSource } from "@/app/source";
import { shouldGenerateLLMFriendlyText } from "@/app/react/_llms/page-filter";

export const revalidate = false;

/**
 * This is an entry point for accessing individual component documentation.
 * Each component can be accessed through its specific endpoint.
 */
export async function GET() {
  const componentPages = reactSource.getPages().filter(shouldGenerateLLMFriendlyText);

  const components = componentPages
    .map(({ data, slugs }) => {
      const [_firstSlug, ...restSlugs] = slugs;

      // Attach .txt extension to the last slug
      const path = restSlugs
        .map((slug, index) => {
          if (index === restSlugs.length - 1) return `${slug}.txt`;

          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/react/llms-components/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design React Components - LLM Reference Entry

This is an entry point for accessing individual component documentation.
Each component can be accessed through its specific endpoint.

## Available Components

${components.join("\n")}

## Usage

To get information about a specific component, access its endpoint:
Example: /react/llms-components/action-button.txt

The response will include the full MDX content for that component, processed and ready for LLM consumption.

## Additional Resources

- Full components documentation (all in one): /react/llms-full.txt
- Changelog: /react/llms-changelog.txt
`;

  return new Response(response);
}
