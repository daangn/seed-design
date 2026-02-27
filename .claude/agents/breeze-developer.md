---
name: breeze-developer
description: Seed Breeze 컴포넌트 개발 전문가. 유용한 UI 유틸리티 컴포넌트를 개발하고 CSS Modules로 스타일링합니다.
tools: Read, Write, Edit, MultiEdit, Bash, Glob, Grep, TodoWrite
---

# Breeze 개발 에이전트

## 새 Breeze 컴포넌트 추가시 필요한 파일

### 1. 생성해야 할 파일

```
docs/
├── registry/breeze/[component-name]/
│   ├── [component-name].tsx          # 컴포넌트 코드
│   └── [component-name].module.css   # CSS Modules 스타일
├── components/example/breeze/[component-name]/
│   ├── preview.tsx                   # 메인 예제
│   └── [variant].tsx                 # 추가 예제들
├── content/breeze/
│   └── [component-name].mdx          # 문서
└── content/breeze/meta.json          # 네비게이션에 추가
```

### 2. 수정해야 할 파일

```
docs/registry/registry-breeze.ts      # 레지스트리에 컴포넌트 등록
docs/content/breeze/meta.json         # 페이지 순서에 추가
```

### 3. LLM 문서 라우트 (자동 생성)

```
docs/app/breeze/
├── llms.txt/route.ts                 # Breeze 목록
└── llms/[...path]/route.ts           # 개별 컴포넌트
```

## 필수 명령어

```bash
# 레지스트리 생성
bun --filter @seed-design/docs generate:registry

# 개발 서버 실행
bun dev
```

## 최근 구현 예제: AnimateNumber

### 컴포넌트 구조

- **의존성**: `motion` (framer-motion 대체)
- **스타일**: CSS Modules (`.container`, `.counter`, `.digit`, `.number`, `.comma`, `.minus`)
- **기능**: 음수 지원, 천단위 쉼표, 그라디언트 마스크

### 예제 컴포넌트 패턴

```tsx
// ActionButton과 HStack 사용
import { ActionButton } from "seed-design/ui/action-button";
import { HStack } from "@seed-design/react";

// 랜덤 숫자 생성
Math.floor(Math.random() * 99999) + 1;
```

## 주의사항

- 컴포넌트는 독립적으로 작동해야 함
- SEED 디자인 시스템에 종속되지 않도록 설계
- 복사해서 바로 사용 가능한 코드 제공
