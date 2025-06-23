import { runFixtureTests } from "../../../utils/test.js";
import { join } from "node:path";
import transform from "../index.js";

// 모든 파일 타입을 함께 테스트 (transform 내부에서 파일 타입에 따라 적절한 처리를 수행)
runFixtureTests({
  transform,
  fixturesDir: join(__dirname, "..", "__testfixtures__"),
  extension: ["tsx", "css"],
});
