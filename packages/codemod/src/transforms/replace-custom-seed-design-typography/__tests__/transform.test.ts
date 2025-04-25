import { runFixtureTests } from "../../../utils/test";
import { join } from "node:path";
import transform from "../index.js";

runFixtureTests({
  transform,
  fixturesDir: join(__dirname, "..", "__testfixtures__"),
});
