// packages/codemod/src/transforms/replace-custom-imported-typography-variable/index.ts
import { typographyMappings } from "@seed-design/migration-index";
import type { API, FileInfo, Options } from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";

// 로깅 설정
const logger = createTransformLogger("replace-custom-imported-typography-variable");

export default function transformer(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // 파일 변환 시작 로깅
  logger.startFile(file.path);

  // 변환 여부 추적
  let hasChanges = false;
  const variableMappings = new Map(); // 이전 변수명 -> 새 변수명 매핑
  const importedTokens = new Map(); // 소스 -> 이미 변환된 토큰 목록
  const importSources = new Map(); // 토큰 -> 원본 소스 맵핑

  // 스타일 관련 import 문 찾기 (typography 관련)
  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      const importSource = path.node.source.value as string;
      return importSource.includes("typography") || importSource.includes("styles");
    })
    .forEach((path) => {
      const importSource = path.node.source.value as string;

      // 현재 import 소스에 대한 이미 변환된 토큰 목록 초기화
      if (!importedTokens.has(importSource)) {
        importedTokens.set(importSource, new Set());
      }

      // ImportSpecifier 타입의 import 문만 처리 (named import)
      const specifiers = path.node.specifiers.filter(
        (specifier) => specifier.type === "ImportSpecifier",
      );

      // 처리할 specifier들과 제거할 specifier들 구분
      const specifiersToProcess = [];
      const specifiersToRemove = [];

      // 각 specifier 확인
      specifiers.forEach((specifier) => {
        if (specifier.type !== "ImportSpecifier") return;

        const importedName = specifier.imported?.name || specifier.local.name;
        const localName = specifier.local.name;
        const hasAlias = specifier.imported && specifier.imported.name !== specifier.local.name;

        // 매핑 찾기
        const mapping = typographyMappings.find(
          (m) =>
            m.previous === importedName || m.previous === `$semantic.typography.${importedName}`,
        );

        if (mapping) {
          let targetToken = "";

          if (mapping.next.length > 0) {
            // 첫 번째 매핑된 토큰 사용
            targetToken = mapping.next[0];
          } else if (mapping.alternative && mapping.alternative.length > 0) {
            // 대체 토큰이 있는 경우
            targetToken = mapping.alternative[0];
          }

          // 변환할 토큰이 있는 경우
          if (targetToken) {
            // 이 import 소스에서 해당 토큰이 이미 import되었는지 확인
            const alreadyImported = importedTokens.get(importSource).has(targetToken);

            // 별칭이 있는 경우는 항상 처리 (중복 확인 불필요)
            if (hasAlias || !alreadyImported) {
              // 처리 대상에 추가
              specifiersToProcess.push(specifier);

              // 별칭이 없는 경우만 토큰 추적
              if (!hasAlias) {
                importedTokens.get(importSource).add(targetToken);
                importSources.set(targetToken, importSource);
              }
            } else {
              // 이미 import된 경우 제거 대상에 추가
              specifiersToRemove.push(specifier);

              // 변수 매핑은 여전히 필요 (원래 변수 -> 새 변수 이름)
              variableMappings.set(localName, targetToken);

              // 로그 기록
              logger.logTransformResult(file.path, {
                previousToken: `Removed duplicate import: ${importedName}`,
                nextToken: targetToken,
                line: path.node.loc?.start.line || 0,
                status: "success",
              });
            }
          } else {
            // 변환할 토큰이 없는 경우 기존 처리 유지
            specifiersToProcess.push(specifier);
          }
        } else {
          // 매핑이 없는 경우 그대로 유지
          specifiersToProcess.push(specifier);

          // 매핑을 찾지 못한 경우 실패 로깅
          logger.logTransformResult(file.path, {
            previousToken: `Failed to find mapping for typography token: ${importedName}`,
            nextToken: null,
            line: path.node.loc?.start.line || 0,
            status: "failure",
            failureReason: "No mapping found",
          });
        }
      });

      // 제거 대상이 있는 경우 specifier 목록에서 제거
      if (specifiersToRemove.length > 0) {
        path.node.specifiers = path.node.specifiers.filter(
          (spec) => !specifiersToRemove.includes(spec),
        );
        hasChanges = true;
      }

      // 각 specifier 처리
      specifiersToProcess.forEach((specifier) => {
        if (specifier.type !== "ImportSpecifier") return;

        const importedName = specifier.imported?.name || specifier.local.name;
        const localName = specifier.local.name;
        const hasAlias = specifier.imported && specifier.imported.name !== specifier.local.name;

        // 매핑 찾기
        const mapping = typographyMappings.find(
          (m) =>
            m.previous === importedName || m.previous === `$semantic.typography.${importedName}`,
        );

        if (mapping) {
          if (mapping.next.length > 0) {
            // 첫 번째 매핑된 토큰 사용
            const nextToken = mapping.next[0];

            // 매핑 저장 (이전 변수명 -> 새 변수명)
            if (!hasAlias) {
              variableMappings.set(localName, nextToken);
            }

            // imported명 변경 (모든 경우)
            if (specifier.imported) {
              specifier.imported = j.identifier(nextToken);
            }

            // 별칭이 없는 경우만 로컬 이름 변경
            if (!hasAlias) {
              specifier.local = j.identifier(nextToken);
            } else {
              // 별칭이 있는 경우는 as 구문 유지하고 원본 변수만 변경
              // 변수 매핑에 추가 (원래 별칭 -> 원래 별칭으로 유지)
              variableMappings.set(localName, localName);
            }

            hasChanges = true;

            // 성공 로깅
            logger.logTransformResult(file.path, {
              previousToken: importedName,
              nextToken: hasAlias ? `${nextToken} as ${localName}` : nextToken,
              line: path.node.loc?.start.line || 0,
              status: "success",
            });

            // 검증 필요한 경우 경고 로그 추가
            if (mapping.needsVerification) {
              logger.logTransformResult(file.path, {
                previousToken: importedName,
                nextToken: hasAlias ? `${nextToken} as ${localName}` : nextToken,
                line: path.node.loc?.start.line || 0,
                status: "warning",
                failureReason: "Needs manual verification",
              });
            }
          } else if (mapping.alternative && mapping.alternative.length > 0) {
            // 대체 토큰이 있는 경우
            const alternativeToken = mapping.alternative[0];

            // 매핑 저장 (이전 변수명 -> 새 변수명 또는 원래 별칭)
            if (!hasAlias) {
              variableMappings.set(localName, alternativeToken);
            } else {
              variableMappings.set(localName, localName);
            }

            // imported명 변경 (모든 경우)
            if (specifier.imported) {
              specifier.imported = j.identifier(alternativeToken);
            }

            // 별칭이 없는 경우만 로컬 이름 변경
            if (!hasAlias) {
              specifier.local = j.identifier(alternativeToken);
            }

            hasChanges = true;

            // 대체 토큰 사용 시 성공 로깅 (경고 추가)
            logger.logTransformResult(file.path, {
              previousToken: importedName,
              nextToken: hasAlias ? `${alternativeToken} as ${localName}` : alternativeToken,
              line: path.node.loc?.start.line || 0,
              status: "warning",
              failureReason: "Using alternative token as primary is deprecated",
            });
          } else {
            // 매핑이 있지만 다음 토큰이 없는 경우 (deprecated)
            logger.logTransformResult(file.path, {
              previousToken: importedName,
              nextToken: null,
              line: path.node.loc?.start.line || 0,
              status: "failure",
              failureReason: "Token is deprecated with no direct replacement",
            });
          }
        }
      });

      // 변환 후 import 목록이 비어 있으면 import 문 자체를 제거
      if (path.node.specifiers.length === 0) {
        path.prune();
        hasChanges = true;
      }
    });

  // 변수 참조 위치 변경
  if (variableMappings.size > 0) {
    // 템플릿 리터럴 내부의 변수 사용 처리
    root.find(j.TemplateLiteral).forEach((path) => {
      path.node.expressions.forEach((expr, index) => {
        if (expr.type === "Identifier") {
          const oldName = expr.name;
          if (variableMappings.has(oldName)) {
            const newName = variableMappings.get(oldName);

            // 식별자 이름 변경
            path.node.expressions[index] = j.identifier(newName);
            hasChanges = true;

            logger.logTransformResult(file.path, {
              previousToken: `Using ${oldName} in template`,
              nextToken: `Using ${newName} in template`,
              line: path.node.loc?.start.line || 0,
              status: "success",
            });
          }
        }
      });
    });

    // 객체 분해할당에서의 사용 변경
    root.find(j.ObjectPattern).forEach((path) => {
      path.node.properties.forEach((prop) => {
        if (prop.type === "Property" && prop.key.type === "Identifier") {
          const oldName = prop.key.name;
          if (variableMappings.has(oldName)) {
            const newName = variableMappings.get(oldName);

            // 속성 이름 변경
            prop.key = j.identifier(newName);
            hasChanges = true;

            logger.logTransformResult(file.path, {
              previousToken: `Using ${oldName} in object pattern`,
              nextToken: `Using ${newName} in object pattern`,
              line: path.node.loc?.start.line || 0,
              status: "success",
            });
          }
        }
      });
    });

    // 일반 변수 사용 변경
    root.find(j.Identifier).forEach((path) => {
      // import 선언 내부는 이미 처리했으므로 건너뜀
      if (j(path).closest(j.ImportDeclaration).length > 0) {
        return;
      }

      const oldName = path.node.name;
      if (variableMappings.has(oldName)) {
        const newName = variableMappings.get(oldName);

        // 식별자 이름 변경
        path.node.name = newName;
        hasChanges = true;

        logger.logTransformResult(file.path, {
          previousToken: `Using ${oldName}`,
          nextToken: `Using ${newName}`,
          line: path.node.loc?.start.line || 0,
          status: "success",
        });
      }
    });
  }

  // 파일 변환 완료 로깅
  logger.finishFile(file.path);

  // 변경사항이 있는 경우에만 소스 반환
  return hasChanges ? root.toSource(options) : file.source;
}
