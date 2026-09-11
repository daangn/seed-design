import type { Registry } from "../schema";

const lynxSeedPackageRanges = {
  "@seed-design/lynx-react": ">=0.1.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.1.0 <1.0.0",
};

const fieldPackageRanges = {
  "@seed-design/lynx-react": ">=0.4.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.8.0 <1.0.0",
};

const accordionPackageRanges = {
  "@seed-design/lynx-react": ">=0.5.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.9.0 <1.0.0",
  "@karrotmarket/lynx-monochrome-icon": ">=1.20.0 <2.0.0",
};
const fieldButtonPackageRanges = {
  "@seed-design/lynx-react": ">=0.7.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.11.0 <1.0.0",
  "@karrotmarket/lynx-monochrome-icon": ">=1.20.0 <2.0.0",
};

const floatingActionButtonPackageRanges = {
  "@seed-design/lynx-react": ">=0.8.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.12.0 <1.0.0",
};
const chipTabsPackageRanges = {
  "@seed-design/lynx-react": ">=0.8.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.12.0 <1.0.0",
};

const selectBoxPackageRanges = {
  "@seed-design/lynx-react": ">=0.6.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.10.0 <1.0.0",
  "@karrotmarket/lynx-monochrome-icon": ">=1.20.0 <2.0.0",
};
const menuPackageRanges = {
  "@seed-design/lynx-react": ">=0.7.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.11.0 <1.0.0",
};
const dialogPackageRanges = {
  "@seed-design/lynx-react": ">=0.8.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.12.0 <1.0.0",
  "@karrotmarket/lynx-monochrome-icon": ">=1.20.0 <2.0.0",
};

const helpBubblePackageRanges = {
  "@seed-design/lynx-react": ">=0.8.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.12.0 <1.0.0",
  "@karrotmarket/lynx-monochrome-icon": ">=1.20.0 <2.0.0",
};

const listPackageRanges = {
  "@seed-design/lynx-react": ">=0.7.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.11.0 <1.0.0",
};

const swipeableMenuSheetPackageRanges = {
  "@seed-design/lynx-react": ">=0.7.0 <1.0.0",
  "@seed-design/lynx-css": ">=0.11.0 <1.0.0",
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
      id: "dialog",
      snippets: [
        {
          path: "dialog.tsx",
          dependencies: dialogPackageRanges,
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
      id: "checkbox",
      snippets: [
        {
          path: "checkbox.tsx",
          dependencies: fieldPackageRanges,
        },
      ],
    },
    {
      id: "chip-tabs",
      snippets: [
        {
          path: "chip-tabs.tsx",
          dependencies: chipTabsPackageRanges,
        },
      ],
    },
    {
      id: "field-button",
      snippets: [
        {
          path: "field-button.tsx",
          dependencies: fieldButtonPackageRanges,
        },
      ],
    },
    {
      id: "floating-action-button",
      snippets: [
        {
          path: "floating-action-button.tsx",
          dependencies: floatingActionButtonPackageRanges,
        },
      ],
    },
    {
      id: "list",
      snippets: [
        {
          path: "list.tsx",
          dependencies: {
            ...listPackageRanges,
            "@karrotmarket/lynx-monochrome-icon": ">=1.20.0 <2.0.0",
          },
        },
        {
          path: "list-header.tsx",
          dependencies: listPackageRanges,
        },
      ],
    },
    {
      id: "menu",
      snippets: [
        {
          path: "menu.tsx",
          dependencies: menuPackageRanges,
        },
      ],
    },
    {
      id: "help-bubble",
      snippets: [
        {
          path: "help-bubble.tsx",
          dependencies: helpBubblePackageRanges,
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
      id: "page-banner",
      snippets: [
        {
          path: "page-banner.tsx",
          dependencies: {
            "@seed-design/lynx-react": ">=0.6.0 <1.0.0",
            "@seed-design/lynx-css": ">=0.10.0 <1.0.0",
          },
        },
      ],
    },
    {
      id: "radio-group",
      snippets: [
        {
          path: "radio-group.tsx",
          dependencies: fieldPackageRanges,
        },
      ],
    },
    {
      id: "result-section",
      snippets: [
        {
          path: "result-section.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "segmented-control",
      snippets: [
        {
          path: "segmented-control.tsx",
          dependencies: {
            "@seed-design/lynx-react": ">=0.6.0 <1.0.0",
            "@seed-design/lynx-css": ">=0.10.0 <1.0.0",
          },
        },
      ],
    },
    {
      id: "select-box",
      snippets: [
        {
          path: "select-box.tsx",
          dependencies: selectBoxPackageRanges,
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
      id: "swipeable-menu-sheet",
      snippets: [
        {
          path: "swipeable-menu-sheet.tsx",
          dependencies: swipeableMenuSheetPackageRanges,
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
