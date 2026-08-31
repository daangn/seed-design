import type { Registry } from "../schema";

const lynxSeedPackageRanges = {
  "@seed-design/lynx-react": ">=0.1.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.1.0 <1.0.0",
};

const accordionPackageRanges = {
  "@seed-design/lynx-react": ">=0.5.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.9.0 <1.0.0",
  "@karrotmarket/lynx-monochrome-icon": ">=1.20.0 <2.0.0",
};

// Lynx UI registry. Each item must have a matching snippet file under
// `./ui/<id>.tsx` and a corresponding component implementation in
// `@seed-design/lynx-react`. See `docs/registry/react/registry-ui.ts`
// for the React-side registry that this list mirrors a subset of.
export const registryUI: Registry = {
  id: "ui",
  items: [
    {
      id: "accordion",
      snippets: [
        {
          path: "accordion.tsx",
          dependencies: accordionPackageRanges,
        },
      ],
    },
    {
      id: "app-bar",
      snippets: [
        {
          path: "app-bar.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "bottom-sheet",
      snippets: [
        {
          path: "bottom-sheet.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "callout",
      snippets: [
        {
          path: "callout.tsx",
          dependencies: {
            "@seed-design/lynx-react": ">=0.5.0 <1.0.0",
            "@seed-design/lynx-css": ">=0.9.0 <1.0.0",
          },
        },
      ],
    },
    {
      id: "page-banner",
      snippets: [
        {
          path: "page-banner.tsx",
          dependencies: {
            "@seed-design/lynx-react": ">=0.6.0 <1.0.0",
            "@seed-design/lynx-css": ">=0.10.0 <1.0.0",
            "@karrotmarket/lynx-monochrome-icon": ">=1.20.0 <2.0.0",
          },
        },
      ],
    },
    {
      id: "checkbox",
      snippets: [
        {
          path: "checkbox.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "progress-circle",
      snippets: [
        {
          path: "progress-circle.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "radio-group",
      snippets: [
        {
          path: "radio-group.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "switch",
      snippets: [
        {
          path: "switch.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "tabs",
      snippets: [
        {
          path: "tabs.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "tag-group",
      snippets: [
        {
          path: "tag-group.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "text-field",
      snippets: [
        {
          path: "text-field.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
  ],
};
