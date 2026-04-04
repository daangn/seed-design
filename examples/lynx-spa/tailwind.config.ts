import type { Config } from "tailwindcss";
import seedDesignPlugin from "@seed-design/tailwind3-plugin";

export default {
  content: ["./src/**/*.{jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  plugins: [seedDesignPlugin],
} satisfies Config;
