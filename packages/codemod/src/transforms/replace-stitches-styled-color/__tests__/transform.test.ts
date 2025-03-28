import { runFixtureTests } from "../../../utils/test.js";
import { join } from "node:path";
import transform from "../index.js";

runFixtureTests({
  transform,
  fixturesDir: join(__dirname, "..", "__testfixtures__"),
  // color-mappings.input.tsx와 color-mappings.output.tsx 테스트를 추가
});
