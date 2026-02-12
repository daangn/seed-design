# tools/figma-codegen

## 디렉토리 개요

**Figma Dev Mode codegen 플러그인**. 디자이너가 Figma Dev Mode에서 노드를 선택하면 React 코드를 자동 생성한다. Plugin 환경에서 실행이 보장되므로 **`createPluginNormalizer`를 사용**한다.

데이터 흐름: Plugin API 노드(`SceneNode`) → `createPluginNormalizer` → normalized → `react.createPipeline` → React 코드

## 파일 작성 컨벤션

- `manifest.json`: Figma 플러그인 매니페스트
- `src/main.ts`: 플러그인 엔트리포인트 (`figma.codegen.on("generate")` 핸들러)

## 코드 작성 컨벤션

- `packages/figma`의 `createPluginNormalizer`와 `react`(codegen)를 import해서 사용
- `createRestNormalizer`는 사용하지 않는다 — Plugin 환경에서 직접 노드에 접근 가능
- `figma.*` 전역 객체 사용 가능 (Plugin 환경 보장)
- codegen 결과는 `CodegenResult[]` 형태로 Figma에 반환
