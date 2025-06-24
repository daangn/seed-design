import { typographyMappings, type FoundationTokenMapping } from "@seed-design/migration-index";
import type { API, FileInfo, Options } from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";

// 로깅 설정
const logger = createTransformLogger("replace-custom-seed-design-typography");

// 프로젝트별로 다양한 타이포그래피 접두사를 허용
const TARGET_PREFIXES = ["typography", "f.typography", "typo", "text"];

///////////////////////////////////////////////////////////////////

export default function transformer(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // 파일 변환 시작 로깅
  logger.startFile(file.path);

  // 변환 여부 추적
  let hasChanges = false;

  // 타이포그래피 매핑 정보를 가져옴
  const typographyMap = typographyMappings as FoundationTokenMapping[];

  // 복합 접두사 (f.typography와 같은) 처리
  TARGET_PREFIXES.filter((prefix) => prefix.includes(".")).forEach((prefix) => {
    const parts = prefix.split(".");
    const objectName = parts[0];
    const propertyName = parts[1];

    root
      .find(j.MemberExpression, {
        object: {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: objectName,
          },
          property: {
            type: "Identifier",
            name: propertyName,
          },
        },
      })
      .forEach((path) => {
        processTypographyNode(j, path, file, typographyMap);
        hasChanges = true;
      });
  });

  // 단일 접두사 (typography, typo와 같은) 처리
  TARGET_PREFIXES.filter((prefix) => !prefix.includes(".")).forEach((prefix) => {
    root
      .find(j.MemberExpression, {
        object: {
          type: "Identifier",
          name: prefix,
        },
      })
      .forEach((path) => {
        processTypographyNode(j, path, file, typographyMap);
        hasChanges = true;
      });
  });

  // 파일 변환 완료 로깅
  logger.finishFile(file.path);

  // 변경사항이 있는 경우에만 소스 반환
  return hasChanges ? root.toSource(options) : file.source;
}

// 타이포그래피 노드 처리 함수
function processTypographyNode(
  j: API["jscodeshift"],
  path: any,
  file: FileInfo,
  typographyMap: FoundationTokenMapping[],
) {
  // 속성명 가져기기 (dot notation과 bracket notation 모두 지원)
  const propertyName = path.node.property.name || path.node.property.value;

  if (!propertyName) {
    logger.logTransformResult(file.path, {
      previousToken: "Cannot determine property name",
      nextToken: null,
      line: path.node.loc?.start.line || 0,
      status: "failure",
      failureReason: "Property name not found",
    });
    return;
  }

  // 매핑에서 해당 토큰 찾기
  // bracket notation의 경우 $semantic.{token} 형태를 $semantic.typography.{token} 형태로 변환하여 매칭
  let searchKey = propertyName;
  if (propertyName.startsWith("$semantic.") && !propertyName.startsWith("$semantic.typography.")) {
    searchKey = propertyName.replace("$semantic.", "$semantic.typography.");
  }

  const mapping = typographyMap.find(
    (m) =>
      m.previous === propertyName ||
      m.previous === `$semantic.typography.${propertyName}` ||
      m.previous === searchKey,
  );

  if (mapping) {
    if (mapping.next.length > 0) {
      // 첫 번째 매핑된 토큰 사용
      const nextToken = mapping.next[0];

      // 속성명 변경 (bracket notation을 dot notation으로 변환)
      path.node.computed = false;
      path.node.property = j.identifier(nextToken);

      // 성공 로깅
      logger.logTransformResult(file.path, {
        previousToken: propertyName,
        nextToken: nextToken,
        line: path.node.loc?.start.line || 0,
        status: "success",
      });

      // 검증 필요한 경우 경고 로그 추가
      if (mapping.needsVerification) {
        logger.logTransformResult(file.path, {
          previousToken: propertyName,
          nextToken: nextToken,
          line: path.node.loc?.start.line || 0,
          status: "warning",
          failureReason: "Needs manual verification",
        });
      }
    } else if (mapping.alternative && mapping.alternative.length > 0) {
      // 대체 토큰이 있는 경우
      const alternativeToken = mapping.alternative[0];

      // 속성명 변경 (bracket notation을 dot notation으로 변환)
      path.node.computed = false;
      path.node.property = j.identifier(alternativeToken);

      // 성공 로깅 (대체 토큰 사용)
      logger.logTransformResult(file.path, {
        previousToken: propertyName,
        nextToken: alternativeToken,
        line: path.node.loc?.start.line || 0,
        status: "warning",
        failureReason: "Using alternative token as primary is deprecated",
      });
    } else {
      // 매핑이 있지만 다음 토큰이 없는 경우 (deprecated)
      logger.logTransformResult(file.path, {
        previousToken: propertyName,
        nextToken: null,
        line: path.node.loc?.start.line || 0,
        status: "failure",
        failureReason: "Token is deprecated with no direct replacement",
      });
    }
  } else {
  }
}
