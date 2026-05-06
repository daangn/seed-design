import type { Registry } from "../schema";

// Lynx UI registry. Each item must have a matching snippet file under
// `./ui/<id>.tsx` and a corresponding component implementation in
// `@seed-design/lynx-react`. See `docs/registry/react/registry-ui.ts`
// for the React-side registry that this list mirrors a subset of.
export const registryUI: Registry = {
  id: "ui",
  items: [
    {
      id: "action-button",
      snippets: [
        {
          path: "action-button.tsx",
          dependencies: {
            "@seed-design/lynx-react": "~0.1.0-alpha.0",
            "@seed-design/lynx-css": "~0.1.0-alpha.0",
          },
        },
      ],
    },
    {
      id: "bottom-sheet",
      snippets: [
        {
          path: "bottom-sheet.tsx",
          dependencies: {
            "@seed-design/lynx-react": "~0.1.0-alpha.0",
            "@seed-design/lynx-css": "~0.1.0-alpha.0",
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
            "@seed-design/lynx-react": "~0.1.0-alpha.0",
            "@seed-design/lynx-css": "~0.1.0-alpha.0",
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
            "@seed-design/lynx-react": "~0.1.0-alpha.0",
            "@seed-design/lynx-css": "~0.1.0-alpha.0",
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
            "@seed-design/lynx-react": "~0.1.0-alpha.0",
            "@seed-design/lynx-css": "~0.1.0-alpha.0",
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
            "@seed-design/lynx-react": "~0.1.0-alpha.0",
            "@seed-design/lynx-css": "~0.1.0-alpha.0",
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
            "@seed-design/lynx-react": "~0.1.0-alpha.0",
            "@seed-design/lynx-css": "~0.1.0-alpha.0",
          },
        },
      ],
    },
  ],
};
