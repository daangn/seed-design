"use client";

import { useIcon } from "./icon-context";

export const IconDetailMetadata = () => {
  const { selectedIcon, search, setSearch } = useIcon();

  if (!selectedIcon) return null;

  const metadatas = selectedIcon.metadatas;
  if (metadatas.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {metadatas.map((metadata) => {
        const isActive = search !== "" && metadata.includes(search);

        return (
          <button
            key={metadata}
            type="button"
            onClick={() => setSearch(metadata)}
            className={`cursor-pointer text-xs px-2 py-0.5 rounded-full border transition-colors ${
              isActive
                ? "bg-seed-bg-brandWeak-pressed border-seed-stroke-brand text-seed-fg-brand"
                : "bg-fd-muted border-fd-border text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-foreground"
            }`}
          >
            {metadata}
          </button>
        );
      })}
    </div>
  );
};
