import { runFixtureTests } from "../../../utils/test.js";
import { join } from "node:path";
import transform from "../index.js";

runFixtureTests(
  "replace-css-color-variable",
  transform,
  join(__dirname, "..", "__testfixtures__"),
  "css",
);
