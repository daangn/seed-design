import { ComponentCard } from "@/components/component-card";
import { source } from "@/app/source";
import { existsSync } from "fs";
import { join } from "path";

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

  // Helper function to find anatomy image
  const getAnatomyImage = (componentSlug: string): string | undefined => {
    const extensions = ["webp", "png", "jpg", "jpeg"];
    const publicDir = join(process.cwd(), "public");

    for (const ext of extensions) {
      const imagePath = `/docs/components/${componentSlug}/anatomy.${ext}`;
      const fullPath = join(publicDir, imagePath);

      if (existsSync(fullPath)) {
        return imagePath;
      }
    }

    return undefined;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-10 not-prose">
      {componentPages.map((page) => {
        // Extract component slug from URL
        const componentSlug = page.url.split("/").pop() || "";
        const imagePath = getAnatomyImage(componentSlug);

        return (
          <ComponentCard
            key={page.url}
            title={page.data.title || componentSlug}
            description={page.data.description}
            href={page.url}
            imagePath={imagePath}
          />
        );
      })}
    </div>
  );
}
