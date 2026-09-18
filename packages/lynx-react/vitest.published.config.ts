import { createLynxVitestConfig } from "@seed-design/lynx-vitest-config";

const config = await createLynxVitestConfig();
config.test = { ...config.test, include: ["tests/*-published.test.tsx"] };
export default config;
