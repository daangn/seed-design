require("dotenv").config();

if (!process.env.POSTHOG_API_KEY || !process.env.POSTHOG_HOST) {
  console.error("Please set POSTHOG_API_KEY and POSTHOG_HOST in .env file");
  process.exit(1);
}

module.exports = (buildOptions) => ({
  ...buildOptions,
  resolveExtensions: [".ts", ".js", ".json", ".mjs"],
  define: {
    "Env.MODE": process.env.IS_DEV === "true" ? '"dev"' : '"prod"',
    "Env.POSTHOG_API_KEY": `"${process.env.POSTHOG_API_KEY}"`,
    "Env.POSTHOG_HOST": `"${process.env.POSTHOG_HOST}"`,
  },
});
