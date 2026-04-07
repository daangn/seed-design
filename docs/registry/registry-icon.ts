import type { Registry } from "./schema";

export const registryIcon: Registry = {
  id: "icon",
  hideFromCLICatalog: true,
  items: [
    {
      id: "icon-facebook",
      snippets: [{ path: "icon-facebook.tsx" }],
    },
    {
      id: "icon-instagram",
      snippets: [{ path: "icon-instagram.tsx" }],
    },
    {
      id: "icon-github",
      snippets: [{ path: "icon-github.tsx" }],
    },
    {
      id: "icon-medium",
      snippets: [{ path: "icon-medium.tsx" }],
    },
    {
      id: "icon-youtube",
      snippets: [{ path: "icon-youtube.tsx" }],
    },
    {
      id: "icon-blog",
      snippets: [{ path: "icon-blog.tsx" }],
    },
    {
      id: "icon-kakaotalk",
      snippets: [{ path: "icon-kakaotalk.tsx" }],
    },
  ],
};
