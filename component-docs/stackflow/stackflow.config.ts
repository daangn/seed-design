import { defineConfig } from "@stackflow/config";

export const config = defineConfig({
  activities: [
    {
      name: "Main",
      path: "/",
    },
  ],
  transitionDuration: 270,
  initialActivity: () => "Main",
});
