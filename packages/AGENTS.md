# packages

## 디렉토리 개요

SEED Design의 **핵심 패키지**들이 위치한다. 디자인 토큰 정의부터 React 컴포넌트까지 생성 파이프라인을 구성한다.

## 패키지 흐름

```text
rootage (YAML 정의) → css/vars, qvism-preset/vars (토큰 생성)
                          ↓
qvism-preset (Recipe 정의) → css/recipes (CSS 생성)
                                ↓
react-headless (로직) + css → react (스타일드 컴포넌트)
```

## 패키지 역할

## 패키지 역할

디자인 토큰 정의(rootage), 스타일 레시피(qvism-preset), 생성된 CSS(css), Headless 로직(react-headless), 스타일드 컴포넌트(react), Figma 연동(figma), 문서 서버(docs-mcp) 등의 패키지로 구성된다.

## 생성 파일 주의

다음 경로는 **자동 생성**되므로 직접 수정 금지:
- `css/vars/`, `css/recipes/` → rootage, qvism-preset에서 생성
- `qvism-preset/src/vars/` → rootage에서 생성

수정이 필요하면 **원천 파일 수정 후** `bun generate:all` 실행.
