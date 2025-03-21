import { runFixtureTests } from "../../../utils/test.js";
import { join } from "node:path";
import transform, { reactMatch } from "../index.js";

runFixtureTests(transform, join(__dirname, "..", "__testfixtures__"), "tsx", {
  log: true,
  match: reactMatch,
});
