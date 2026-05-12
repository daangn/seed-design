import type { Registry } from "../schema";

// Lynx UI registry. Each item must have a matching snippet file under
// `./ui/<id>.tsx` and a corresponding component implementation in
// `@seed-design/lynx-react`. See `docs/registry/react/registry-ui.ts`
// for the React-side registry that this list mirrors a subset of.
export const registryUI: Registry = {
  id: "ui",
  items: [
    {
      id: "bottom-sheet",
      snippets: [
        {
          path: "bottom-sheet.tsx",
          dependencies: {
            "@seed-design/lynx-react": "~0.2.0-alpha.1",
            "@seed-design/lynx-css": "~0.1.1-alpha.1",
          },
        },
      ],
    },
    {
      id: "checkbox",
      snippets: [
        {
          path: "checkbox.tsx",
          dependencies: {
            "@seed-design/lynx-react": "~0.2.0-alpha.1",
            "@seed-design/lynx-css": "~0.1.1-alpha.1",
          },
        },
      ],
    },
    {
      id: "progress-circle",
      snippets: [
        {
          path: "progress-circle.tsx",
          dependencies: {
            "@seed-design/lynx-react": "~0.2.0-alpha.1",
            "@seed-design/lynx-css": "~0.1.1-alpha.1",
          },
        },
      ],
    },
    {
      id: "radio-group",
      snippets: [
        {
          path: "radio-group.tsx",
          dependencies: {
            "@seed-design/lynx-react": "~0.2.0-alpha.1",
            "@seed-design/lynx-css": "~0.1.1-alpha.1",
          },
        },
      ],
    },
    {
      id: "switch",
      snippets: [
        {
          path: "switch.tsx",
          dependencies: {
            "@seed-design/lynx-react": "~0.2.0-alpha.1",
            "@seed-design/lynx-css": "~0.1.1-alpha.1",
          },
        },
      ],
    },
    {
      id: "tag-group",
      snippets: [
        {
          path: "tag-group.tsx",
          dependencies: {
            "@seed-design/lynx-react": "~0.2.0-alpha.1",
            "@seed-design/lynx-css": "~0.1.1-alpha.1",
          },
        },
      ],
    },
  ],
};
