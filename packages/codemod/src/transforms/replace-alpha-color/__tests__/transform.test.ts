import { runFixtureTests } from "../../../utils/test.js";
import { join } from "node:path";
import transform from "../index.js";

// TypeScript/JavaScript 파일 테스트
runFixtureTests({
  transform,
  fixturesDir: join(__dirname, "..", "__testfixtures__"),
  extension: ["tsx"],
});

// CSS 파일 테스트
runFixtureTests({
  transform,
  fixturesDir: join(__dirname, "..", "__testfixtures__"),
  extension: ["css"],
});
