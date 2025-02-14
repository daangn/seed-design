import type { Transform } from "jscodeshift";
import { allColorMappings } from "./mappings.js";
import { TokenMigrationReporter } from "../../utils/reporter.js";

const reporter = new TokenMigrationReporter("replace-tailwind-color");

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  // JSX className 속성을 찾음
  root.find(j.JSXAttribute, { name: { name: "className" } }).forEach((path) => {
    if (path.node.value?.type !== "StringLiteral") return;

    const classNames = path.node.value.value.split(" ");

    const newClassNames = classNames.map((className) => {
      const mapping = allColorMappings.find((m) => m.previous === className);

      if (!mapping) return className;

      if (mapping.next.length === 1) {
        // 매핑이 1개인 경우 자동 변환
        reporter.addResult({
          previousToken: className,
          nextToken: mapping.next[0],
          status: "success",
          line: path.node.loc?.start.line,
        });
        return mapping.next[0];
      }

      // 매핑이 여러개인 경우 reporter에 기록
      reporter.addResult({
        previousToken: className,
        nextToken: null,
        status: "failure",
        failureReason: `Multiple mappings available: ${mapping.next.join(", ")}`,
        line: path.node.loc?.start.line,
      });
      return className;
    });

    // 클래스명 업데이트
    path.node.value.value = newClassNames.join(" ");
  });

  reporter.writeReport();
  return root.toSource();
};

export default transform;
