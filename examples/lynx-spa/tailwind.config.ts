import seedDesignPlugin from "@seed-design/tailwind3-plugin";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  plugins: [seedDesignPlugin],
} satisfies Config;
