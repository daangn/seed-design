import { runFixtureTests } from "../../../utils/test.js";
import { join } from "node:path";
import transform from "../index.js";

// CSS 타이포그래피 변수 변환 테스트 (transform 내부에서 파일 타입 확인)
runFixtureTests({
  transform,
  fixturesDir: join(__dirname, "..", "__testfixtures__"),
  extension: ["css"],
});
