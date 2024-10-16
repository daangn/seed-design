import { defineConfig } from "@stackflow/config";

export const getConfig = (name: string) =>
  defineConfig({
    activities: [
      {
        name,
        path: "/",
      },
    ],
    transitionDuration: 270,
    initialActivity: () => name,
  });
