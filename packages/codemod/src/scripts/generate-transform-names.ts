#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { constantCase } from "change-case";

/**
 * transforms 디렉토리에서 transform 이름을 추출하여 상수 파일을 생성하는 스크립트
 */

// 프로젝트 루트 디렉토리 경로
const rootDir = path.resolve(__dirname, "../../");

// transforms 디렉토리 경로
const transformsDir = path.resolve(rootDir, "src/transforms");

// 출력 파일 경로
const outputDtsFile = path.resolve(rootDir, "bin/transforms.d.ts");
const outputCjsFile = path.resolve(rootDir, "bin/transforms.cjs");

// transforms 디렉토리의 모든 폴더 이름 가져오기
function getTransformerNames(): string[] {
  try {
    return fs
      .readdirSync(transformsDir)
      .filter((name) => fs.statSync(path.join(transformsDir, name)).isDirectory());
  } catch (error) {
    console.error("transforms 디렉토리를 읽는 데 실패했습니다:", error);
    return [];
  }
}

// CSS transform 목록
const cssTransforms = [
  "replace-css-seed-design-color-variable",
  "replace-css-seed-design-typography-variable",
];

// TypeScript 정의 파일(.d.ts) 생성
function generateDtsFile(transformerNames: string[]): string {
  const enumEntries = transformerNames
    .map((name) => {
      const constName = constantCase(name);
      return `  ${constName} = '${name}'`;
    })
    .join(",\n");

  const content = `/**
 * @seed-design/codemod Transformers
 * 
 * Seed Design codemod의 transformer 목록을 제공합니다.
 * 자동 생성된 파일이므로 직접 수정하지 마세요.
 */

/**
 * Transformer 이름 열거형
 */
export enum Transformers {
${enumEntries},
}

/**
 * 가능한 transform 이름 목록
 */
export const transformerNames: readonly string[] = [
  ${transformerNames.map((name) => `'${name}'`).join(",\n  ")},
];

/**
 * CSS 관련 transformer 목록
 */
export const cssTransformers: readonly string[] = [
  ${cssTransforms.map((name) => `'${name}'`).join(",\n  ")}
];

/**
 * transformer 이름이 유효한지 검증
 */
export function isValidTransformer(name: string): name is string {
  return transformerNames.includes(name);
}

/**
 * 기본 내보내기
 */
export default {
  Transformers,
  transformerNames,
  cssTransformers,
  isValidTransformer
};`;

  return content;
}

// CommonJS 모듈 파일(.cjs) 생성
function generateCjsFile(transformerNames: string[]): string {
  const transformersObj = transformerNames
    .reduce((acc, name) => {
      const constName = constantCase(name);
      acc.push(`  ${constName}: '${name}'`);
      return acc;
    }, [] as string[])
    .join(",\n");

  const content = `/**
 * @seed-design/codemod Transformers
 * 
 * Seed Design codemod의 transformer 목록을 제공합니다.
 * 자동 생성된 파일이므로 직접 수정하지 마세요.
 */

"use strict";

/**
 * Transformer 이름 열거형
 */
const Transformers = {
${transformersObj},
};

/**
 * 가능한 transform 이름 목록
 */
const transformerNames = [
  ${transformerNames.map((name) => `'${name}'`).join(",\n  ")},
];

/**
 * CSS 관련 transformer 목록
 */
const cssTransformers = [
  ${cssTransforms.map((name) => `'${name}'`).join(",\n  ")}
];

/**
 * transformer 이름이 유효한지 검증
 */
function isValidTransformer(name) {
  return transformerNames.includes(name);
}

// 내보내기
module.exports = {
  Transformers,
  transformerNames,
  cssTransformers,
  isValidTransformer
};`;

  return content;
}

// 메인 함수
async function main() {
  try {
    // transforms 디렉토리에서 transform 이름 가져오기
    const transformerNames = getTransformerNames();

    // bin 디렉토리가 없으면 생성
    if (!fs.existsSync(path.dirname(outputDtsFile))) {
      fs.mkdirSync(path.dirname(outputDtsFile), { recursive: true });
    }

    // 파일 생성
    const dtsContent = generateDtsFile(transformerNames);
    const cjsContent = generateCjsFile(transformerNames);

    fs.writeFileSync(outputDtsFile, dtsContent);
    fs.writeFileSync(outputCjsFile, cjsContent);

    console.log(`Transformer 정의 파일이 생성되었습니다:`);
    console.log(`- ${outputDtsFile}`);
    console.log(`- ${outputCjsFile}`);
    console.log(`총 ${transformerNames.length} 개의 transformer가 발견되었습니다.`);
  } catch (error) {
    console.error("오류 발생:", error);
    process.exit(1);
  }
}

// 스크립트 실행
main().catch(console.error);
