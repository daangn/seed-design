import { join } from "node:path";
import { runFixtureTests } from "../../../utils/test.js";
import transform from "../index.js";

runFixtureTests("replace-text-component", transform, join(__dirname, "..", "__testfixtures__"));
