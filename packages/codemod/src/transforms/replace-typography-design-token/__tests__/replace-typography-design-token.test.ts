import { join } from "node:path";
import { runFixtureTests } from "../../../utils/test.js";
import transform from "../index.js";

runFixtureTests(
  "replace-typography-design-token",
  transform,
  join(__dirname, "..", "__testfixtures__"),
);
