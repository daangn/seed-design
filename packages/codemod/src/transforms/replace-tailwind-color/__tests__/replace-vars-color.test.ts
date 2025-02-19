import { runFixtureTests } from "../../../utils/test.js";
import { join } from "node:path";
import transform from "../index.js";

runFixtureTests("replace-tailwind-color", transform, join(__dirname, "..", "__testfixtures__"));
