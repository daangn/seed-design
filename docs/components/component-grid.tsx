import { source } from "@/app/source";
import { ComponentCard } from "@/components/component-card";

export function ComponentGrid() {
  // Get all component pages
  const allPages = source.getPages();

  const componentPages = allPages
    .filter((page) => {
      // Only include pages under /docs/components/
      if (!page.url.startsWith("/docs/components/")) return false;

      // Exclude the index page itself
      if (page.url === "/docs/components") return false;

      // Exclude deprecated components
      if (page.url.includes("deprecated")) return false;

      return true;
    })
    .sort((a, b) => {
      // Sort alphabetically by title
      const titleA = a.data.title || "";
      const titleB = b.data.title || "";
      return titleA.localeCompare(titleB);
    });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-10 not-prose">
      {componentPages.map((page) => {
        // Extract component slug from URL
        const componentSlug = page.url.split("/").pop() || "";

        return (
          <ComponentCard
            key={page.url}
            title={page.data.title || componentSlug}
            description={page.data.description}
            href={page.url}
            imagePath={`/docs/components/${componentSlug}/anatomy.webp`}
          />
        );
      })}
    </div>
  );
}
