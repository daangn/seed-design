import { runFixtureTests } from "../../../utils/test.js";
import { join } from "node:path";
import transform, { reactMatch } from "../index.js";

runFixtureTests({
  transform,
  fixturesDir: join(__dirname, "..", "__testfixtures__"),
  extension: ["tsx", "ts"],
  transformOptions: {
    log: true,
    match: reactMatch,
  },
});
