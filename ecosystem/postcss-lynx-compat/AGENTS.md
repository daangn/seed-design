# postcss-lynx-compat

## 디렉토리 개요

웹 CSS를 Lynx 호환 CSS로 변환하는 PostCSS 플러그인. **generic 호환 레이어**로서, 특정 디자인 시스템이나 테마의 맥락을 갖지 않는다.

상위: `ecosystem/` — SEED 생태계 도구 모음
소비자: `packages/qvism-preset` — 플러그인 설정과 SEED 특화 옵션을 주입

## 파일 작성 컨벤션

- `src/index.ts` — 플러그인 본체 (PluginCreator)
- `src/types.ts` — `LynxCompatConfig` 인터페이스
- `src/defaults.ts` — 기본 설정값
- `__tests__/index.test.ts` — 단위 테스트

## 핵심 설계 원칙

### 이 플러그인은 generic이다

- 웹 CSS → Lynx CSS 변환만 담당
- light/dark 테마, 디자인 토큰 이름, 컴포넌트 명명 등 SEED 고유 맥락을 알지 않는다
- 테마 매핑, 토큰 구조 등 도메인 지식은 소비자(`qvism-preset`)에서 설정으로 주입

### Lynx CSS 변수 제약 (반드시 숙지)

| 패턴 | Lynx 지원 |
|------|-----------|
| `var(--x)` where `--x: #hex` (단일 참조) | ✅ |
| Cascade override (같은 변수명 덮어쓰기) | ✅ |
| Nested `var()` (`--a: var(--b)` 체인) | ❌ |
| `[data-*]` attribute selector | ❌ |
| `prefers-color-scheme` media query | ❌ |

이 제약 때문에:
- 토큰 **정의**의 nested var()는 반드시 flat 값으로 resolve해야 함
- 컴포넌트 CSS의 `var(--token)` **참조**는 유지해야 함 (토큰이 flat이므로 단일 참조로 동작)
- `[data-*]` selector는 class selector로 변환해야 함

### 변환 파이프라인 (실행 순서)

1. **@media 제거** — `(hover: hover)` 등 Lynx 미지원 media query
2. **Selector 변환** — `:root` → `page`, `:is()` 확장, pseudo-class 필터링
3. **OnceExit Phase 0**: nested var() resolve (`resolveVarScope` 설정에 따라 범위 결정)
4. **OnceExit Phase 0.5**: `selectorMappings`에 따른 data-attr → class 변환
5. **OnceExit Phase 1**: `[data-X]` → `--X_true` class 변환 (컴포넌트 상태)
6. **OnceExit Phase 3**: 프로퍼티/값 필터링 (vendor prefix, clamp, 미지원 속성)
7. **OnceExit Phase 5**: text slot 분리 (view/text CSS 분리)

## 코드 작성 컨벤션

- 새 옵션 추가 시: `types.ts`에 타입, `defaults.ts`에 기본값, `index.ts`에 로직
- 모든 변환은 `__tests__/index.test.ts`에 테스트 필수
- SEED 특화 로직 금지 — 범용 메커니즘만 제공하고 소비자가 설정으로 주입
