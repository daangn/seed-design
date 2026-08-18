# Lynx 컴포넌트 미리보기 통합 설계 및 구현 계획

- 작성일: 2026-08-13
- 수정일: 2026-08-14
- 상태: 기술 검토 완료, 구현 미착수
- 대상: SEED Docs의 Lynx 컴포넌트 문서
- 관련 안내: [Lynx 웹 통합 가이드](https://lynxjs.org/guide/start/integrate-with-existing-apps?platform=web)

## 결론

Docs 빌드를 시작할 때 Lynx 예제를 Rspeedy로 한 번에 묶고, 같은 entry에서 web bundle과 native Lynx bundle을 함께 생성한다. MDX의 `LynxComponentExample`은 `Preview`, `QR Code`, `Code` 세 탭을 제공한다. `Preview`는 `<lynx-view>`로 web bundle을 실행하고, `QR Code`는 Lynx Explorer가 열 수 있는 native bundle URL과 QR 코드를 보여준다.

권장 구조는 다음과 같다.

```text
docs/examples/lynx/**/*.tsx
          │
          │ entry 검색
          ▼
Rspeedy web·lynx multi-entry 빌드 ── docs/.next/cache/lynx-rspeedy
          │
          ├── docs/public/__lynx__/*.web.bundle
          ├── docs/public/__lynx__/*.lynx.bundle
          └── docs/public/__lynx__/manifest.json
                                      │
Lynx MDX ── LynxComponentExample ─────┤
                    │                 │
                    ├── Preview ── <lynx-view> + web bundle
                    ├── QR Code ── QR + native bundle URL
                    └── Code ───── entry source
```

핵심 결정은 다음과 같다.

| 항목 | 권장안 | 이유 |
| --- | --- | --- |
| 빌드 단위 | 모든 예제를 한 Rspeedy 실행의 여러 entry로 빌드 | 예제마다 프로세스를 시작하는 비용과 Next worker의 중복 빌드를 피한다. |
| 빌드 환경 | `web`과 `lynx`를 함께 생성 | Preview와 Lynx Explorer가 같은 source의 플랫폼별 bundle을 사용한다. |
| 패키지 사용 | workspace의 공개 export를 사용 | 실제 소비자가 쓰는 `@seed-design/lynx-react`와 `@seed-design/lynx-css` 결과를 검증한다. |
| 파일 시스템 캐시 | `docs/.next/cache/lynx-rspeedy`에서 Rspeedy의 `performance.buildCache` 사용 | 기존 Docs cache restore/save를 그대로 활용해 CI 변경 부담을 줄인다. |
| bundle 식별 | 논리 이름과 실제 URL을 manifest로 분리 | MDX 오타를 빌드에서 잡고, 이후 content hash 파일명으로 바꿔도 MDX API를 유지한다. |
| 웹 호스트 | client component 안의 JSX `<lynx-view>`와 ref 사용 | SSR에서 web runtime을 실행하지 않으면서 `globalProps`와 정리 순서를 제어한다. |
| QR Code | native bundle의 현재 배포 origin URL을 QR과 링크로 제공 | Lynx 공식 QR 흐름은 `.lynx.bundle`을 사용하며 Alpha·Production 주소를 자동 반영해야 한다. |
| 첫 적용 | `Badge`로 정적 렌더를 검증한 뒤 `ActionButton`으로 상호작용 검증 | 단순한 경로와 main-thread 이벤트 경로를 나누어 문제 범위를 좁힌다. |

Docs에서는 기존 Rspeedy `0.13.6` 대신 최신 `0.16.x` 계열을 우선 검토한다. 사용자 제안 버전은 `0.16.3`이다. local Refer에 고정된 `0.16.1`부터 TypeScript peer 범위가 `5.1.6 - 6.0.x`로 넓어졌으므로 Docs의 일반 TypeScript `6.0.3`과 맞는다. 다만 Web Docs의 공식 `typecheck`는 별도로 `@typescript/native` `7.0.2`를 실행한다.

Rspeedy `0.16.x`는 Rsbuild 2 기반이므로 현재 React plugin `0.13.0`과 조합할 수 없다. React plugin은 `0.17.0`부터 Rsbuild 2를 지원하고 `0.17.2`에서 web 환경 HMR 문제를 고쳤다. 따라서 첫 검증 후보는 Rspeedy `0.16.3`, `@lynx-js/react-rsbuild-plugin 0.17.2`, `@lynx-js/config-rsbuild-plugin 0.1.1` 이상이다. 로컬 Bun registry metadata에서 React plugin `0.17.2`가 `@lynx-js/react 0.117.0`을 peer 범위에 포함하는 것도 확인했다. React plugin `0.18.x`는 `@lynx-js/react ^0.123.0`을 요구하므로 현재 ReactLynx `0.117.0`을 유지하는 안에서는 제외한다. Rspeedy `0.16.3`의 정확한 package metadata와 이 조합의 실제 web·native bundle 동작은 설치 전에 다시 확인한다.

## 목표

- Lynx 컴포넌트 문서에서 저장소의 실제 `@seed-design/lynx-react` 컴포넌트를 렌더링한다.
- 예제 소스와 코드 탭이 같은 파일을 가리키게 한다.
- 같은 예제 source에서 web·native bundle을 만들고 Lynx Explorer용 QR 코드와 링크를 제공한다.
- Docs의 정식 빌드 전에 모든 Lynx bundle을 한 번만 생성한다.
- 로컬과 CI에서 재사용할 수 있는 파일 시스템 캐시를 둔다.
- 저장소의 현재 `lynx-react`, `lynx-css` 생성 결과를 확실하게 사용한다.
- Next.js 정적 export와 Cloudflare Pages 배포에서도 두 bundle, web runtime, QR URL이 동작하게 한다.
- 새 MDX 컴포넌트가 `llms.txt` 계열 출력에 그대로 노출되지 않게 한다.
- 예제가 늘어날 때 entry 등록, URL 작성, 개별 Rspeedy 설정을 반복하지 않게 한다.

## 범위 밖

- 브라우저에서 Lynx 코드를 편집하거나 다시 컴파일하는 playground
- 첫 변경에서 모든 Lynx 컴포넌트의 웹 호환성을 보장하는 일
- Docs 미리보기와 실제 앱 사이의 화면 픽셀 일치 보장
- 여러 `<lynx-view>`가 하나의 worker를 공유하도록 최적화하는 일
- `globalProps`나 `initData`를 MDX 작성자에게 범용 API로 공개하는 일

## 용어 구분

두 종류의 `view`를 혼동하지 않아야 한다.

- `<view>`는 Lynx bundle 안에서 사용하는 native element다.
- `<lynx-view>`는 브라우저에서 Lynx bundle을 실행하는 web component다.

Docs의 React 트리는 `<lynx-view>`만 소유한다. `<view>`, `<text>`, `<page>`는 `docs/examples/lynx` 아래의 ReactLynx 소스에만 작성한다.

## 현재 상태

### Docs 빌드

- [`docs/package.json`](../package.json)의 `build`는 Figma 이미지 준비, Docs 타입 검사, Next/Turbopack 빌드, changelog 문서 생성을 차례로 실행한다. Rspeedy 단계는 없다.
- [`docs/next.config.mjs`](../next.config.mjs)는 `output: "export"`를 사용한다. `docs/public`의 bundle은 최종 `docs/out`으로 복사할 수 있다.
- [`docs/tsconfig.json`](../tsconfig.json)은 모든 `*.tsx`를 Web React 설정으로 검사한다. 공식 `typecheck`는 `@typescript/native`를 사용한다. `docs/examples/lynx/tsconfig.json`을 새로 두고 이 경로를 기존 Web React 검사에서 제외해야 두 JSX 환경이 섞이지 않는다.
- [`docs/components/component-example.tsx`](../components/component-example.tsx)는 미리보기와 코드 탭을 제공한다. 실제 React 예제는 [`docs/components/component-preview.tsx`](../components/component-preview.tsx)가 Next chunk로 불러온다.
- Lynx 문서는 현재 코드 블록만 제공한다. 실제 bundle이나 `<lynx-view>` 호스트는 없다.

### workspace 패키지

- Docs는 `@seed-design/lynx-react`와 `@seed-design/lynx-css`를 이미 선언한다.
- 현재 설치 결과는 두 패키지 모두 저장소의 workspace로 연결된다. 다만 `docs/package.json`의 버전이 로컬 패키지 버전과 우연히 같기 때문에 가능한 상태다.
- `@seed-design/lynx-react`의 공개 export는 `packages/lynx-react/lib`를 가리킨다. 깨끗한 checkout에서는 패키지 빌드가 먼저 필요하다.
- 요구사항에서 말한 `lynx-qvism-css`라는 runtime 패키지는 이 저장소에 없다. 실제 bundle은 생성 결과인 `@seed-design/lynx-css`를 사용한다. `@seed-design/lynx-qvism-preset`은 해당 CSS를 만드는 생성기다.
- 저장소의 생성 순서는 rootage, qvism, `lynx-react`, Docs 순서다. Lynx 예제는 생성물을 직접 수정하지 않고 이 흐름의 결과를 소비해야 한다.

### Rspeedy 선례

[`examples/lynx-spa`](../../examples/lynx-spa)는 다음 조합을 사용한다.

| 패키지 | 현재 버전 |
| --- | --- |
| `@lynx-js/react` | `0.117.0` |
| `@lynx-js/react-rsbuild-plugin` | `0.13.0` |
| `@lynx-js/rspeedy` | `0.13.6` |
| TypeScript | `5.9.3` |

설치된 Rspeedy `0.13.6`은 여러 `source.entry`, `web`·`lynx` 환경, `[name]`·`[platform]`·`[contenthash]` 파일명, `performance.buildCache`를 지원한다. 최신 후보인 Rspeedy `0.16.x`도 이 기능을 제공하지만 Rsbuild 2 전환으로 일부 설정 위치가 바뀌었다. 새 설정은 `0.16.x` API를 기준으로 작성하고, 기존 설정을 그대로 복사하지 않는다.

local Refer revision의 `@lynx-js/rspeedy 0.16.1`은 TypeScript `6.0.x`를 허용한다. 같은 revision의 React plugin changelog에 따르면 Rsbuild 2 지원은 React plugin `0.17.0`부터다. 이름이 같은 React plugin `0.16.3`은 대응 버전이 아니다. Rspeedy, React plugin, config plugin은 버전 번호가 항상 같지 않으므로 각 package의 peer와 Rsbuild 호환성을 묶어서 확인해야 한다.

### CI

- Production 배포는 Docs의 `bun run build`를 호출하지만 Alpha 배포는 같은 과정을 workflow 안에 풀어서 실행한다.
- 이번 변경에서 Alpha도 `bun run build`를 호출하도록 통합한다. 이후 package script가 바뀌어도 두 배포 경로가 달라지지 않게 한다.
- 변경 부담을 줄이기 위해 Alpha의 Turbopack 전용 성능 지표는 제거하고 전체 Docs build의 cold·warm 시간을 기록한다. 단계별 시간이 다시 필요해져도 workflow가 빌드 순서를 소유하지 않고 공통 build runner가 시간을 기록하게 한다.
- Docs 배포와 테스트 workflow의 경로 필터에는 `packages/lynx-react`, `packages/lynx-css`, `packages/lynx-qvism-preset`이 없다. 패키지만 바뀐 커밋에서는 Docs 검증이 시작되지 않는다.
- 공통 setup은 패키지 산출물을 캐시하고 빌드한다. 다만 복원된 캐시의 완전성을 검사할 때 `packages/lynx-react/lib`는 확인하지 않는다.
- 기존 Docs cache action은 `docs/.next/cache`를 저장한다. Alpha에서는 브랜치의 첫 cache를 `baseline`으로 고정하므로 후속 push의 갱신 결과를 다시 저장하지 않는다.

## 검토한 대안

### 빌드 구조

| 대안 | 장점 | 단점 | 판단 |
| --- | --- | --- | --- |
| 여러 entry를 한 번에 선빌드 | Rspeedy 시작이 한 번이고 공통 모듈 캐시를 재사용한다. Next 렌더와 분리된다. | entry 검색과 manifest 생성이 필요하다. | 권장 |
| 예제마다 Rspeedy 실행 | 한 예제의 실패 범위가 작다. | 예제가 늘수록 프로세스 시작과 CI 시간이 선형으로 커진다. 동시 빌드 충돌도 관리해야 한다. | 제외 |
| 하나의 큰 Lynx 앱에서 예제 선택 | bundle 수가 적다. | 한 예제 변경이 전체를 무효화하고 예제 사이의 상태·의존성이 결합된다. 코드 탭과 실제 entry도 달라진다. | 제외 |
| 브라우저에서 컴파일 | 빌드 산출물이 필요 없다. | 빌드 타임 Rspeedy 사용 요구와 맞지 않고 초기 로딩 비용이 크다. | 제외 |

### workspace 소비 방식

| 대안 | 장점 | 단점 | 판단 |
| --- | --- | --- | --- |
| `@seed-design/lynx-react` 공개 export 사용 | 실제 배포 패키지와 같은 경계를 검증한다. package setup cache를 재사용한다. | `lib` 빌드 선행 조건이 있다. | 권장 |
| `packages/lynx-react/src` alias | 별도 package 빌드가 없어도 된다. | 공개 artifact와 달라지고 ReactLynx compiler의 파일 경계 규칙을 우회할 위험이 있다. | 제외 |

Lynx compiler는 native JSX tag를 파일 단위로 정적으로 분석한다. 공통 helper가 `<view>` 같은 tag를 대신 만들거나 runtime 변수로 tag를 선택하는 구조는 사용하지 않는다. 각 예제 또는 해당 예제가 직접 import하는 ReactLynx 컴포넌트 파일에 literal JSX를 둔다.

### 캐시 위치

| 대안 | 장점 | 단점 | 판단 |
| --- | --- | --- | --- |
| `docs/.next/cache/lynx-rspeedy` | 기존 Actions cache에 바로 포함된다. 별도 restore/save 단계가 필요 없다. | Next cache archive와 Alpha의 고정 baseline 정책을 공유한다. | 권장 |
| `docs/.cache/lynx-rspeedy`와 별도 Actions cache | cache 크기와 갱신 정책을 독립적으로 관리할 수 있다. | 별도 cache action과 workflow 단계가 필요하다. | 측정 후 대안 |
| 기본 `node_modules/.cache` | 설정이 가장 적다. | 현재 CI가 저장하지 않으므로 CI 재사용이 없다. | 제외 |

Rspeedy cache는 Next 빌드에 종속되어서가 아니라 기존 CI 경로를 재사용하기 위해 `.next/cache` 아래에 둔다. Fumadocs 타입 cache도 Next가 `.next/cache` 밖의 `.next` 하위 파일을 정리하는 동작과 기존 Actions cache를 고려해 이 위치를 사용한다. Rspeedy cache가 전체 archive를 눈에 띄게 키우거나 Alpha의 오래된 baseline 때문에 효과가 낮으면 그때 별도 경로와 cache action으로 분리한다.

### `<lynx-view>` 생성 방식

`LynxComponentPreview`는 JSX로 `<lynx-view>`를 렌더한다. web runtime은 `useEffect`에서 동적으로 불러오고, 준비되기 전에는 loading UI만 렌더한다. JSX intrinsic element 타입을 별도 선언하고, 속성이 아닌 객체 프로퍼티는 ref로 설정한다.

`url`을 JSX attribute로 즉시 넘기지 않는다. ref가 가리키는 element에 `globalProps`를 먼저 넣고 마지막에 `url`을 설정한다. 이 순서로 첫 render부터 Docs 테마와 locale을 사용할 수 있다. React가 element를 제거하면 `<lynx-view>`의 `disconnectedCallback`이 runtime을 정리한다.

공식 예제처럼 element를 전부 명령형으로 생성하는 방법도 가능하다. 그러나 이 저장소의 React 컴포넌트에서는 element 구조를 JSX에 남기고, web component 고유 프로퍼티와 event listener만 ref로 제어하는 편이 일관적이다.

## 세부 설계

### 1. 예제 계약

예제 경로를 논리 이름으로 사용한다.

```text
docs/examples/lynx/<component>/<example>.tsx
                 ↓
lynx/<component>/<example>
```

예를 들어 `docs/examples/lynx/badge/preview.tsx`의 논리 이름은 `lynx/badge/preview`다.

규칙은 다음과 같다.

- entry 파일 하나가 CSS import, `Root` 정의, `root.render(<Root />)`까지 포함한다.
- 코드 탭은 이 entry 파일을 그대로 보여준다.
- 기본 스타일은 `@seed-design/lynx-css/base.css`를 import한다.
- 최상위 `<page>`에는 `useSeedClassName({ colorMode: "system" })`의 결과를 적용한다.
- `<view>`, `<text>`, `<page>`는 literal JSX로 작성한다.
- entry 이름은 정규화하고 정렬한다. 대소문자 충돌, 중복 이름, 허용하지 않은 문자, symlink를 통한 디렉터리 이탈은 빌드 오류로 처리한다.
- 처음에는 각 문서의 대표 `preview` 하나만 만든다. 변형 예제는 필요가 확인된 뒤 추가한다.

`docs/examples/lynx/AGENTS.md`에는 위 규칙과 파일명 규칙을 기록한다. 새 핵심 디렉터리이므로 저장소 지침의 필수 세 섹션도 포함한다.

### 2. Rspeedy 구성

`docs/lynx.config.ts`는 다음 계약을 가진다.

- 검색한 모든 entry를 `source.entry` record에 넣는다.
- `pluginReactLynx()`를 사용한다.
- 현재 SPA와 같은 Lynx 설정이 필요하면 `pluginLynxConfig()`를 명시한다.
- `environments`에 `web`과 `lynx`를 모두 둔다.
- 각 entry와 platform이 URL 하나로 실행되도록 Rspeedy `0.16.x`의 top-level `splitChunks`를 끈다. 여러 entry에서도 platform별 단일 bundle이 나오는지는 실제 산출물로 검증한다.
- workspace의 실제 `packages/lynx-react/lib`와 `packages/lynx-css` 경로를 `source.include` 또는 이에 준하는 해석 설정에 넣는다.
- `@lynx-js/react`는 하나의 버전으로 해석되는지 검사하고 필요하면 dedupe한다.
- build cache를 켜고 `docs/.next/cache/lynx-rspeedy`를 사용한다.

논리 이름과 물리 파일명은 분리한다. 우선 `[name].[contenthash].[platform].bundle`을 검증하고, Rspeedy `0.16.x`의 실제 출력과 두 runtime에서 문제가 없으면 채택한다. 지원이 불완전하면 `[name].[platform].bundle`로 내려가되 manifest 계약은 유지한다.

### 3. 빌드 스크립트와 manifest

`build:lynx-examples`는 Next 빌드 전에 한 번만 실행한다.

1. entry 파일을 검색하고 논리 이름을 만든다.
2. Rspeedy를 `web`·`lynx` 환경으로 한 번 실행한다.
3. 각 entry에 self-contained `.web.bundle`과 `.lynx.bundle`이 하나씩 있는지 확인한다.
4. 빈 파일, 예상하지 않은 추가 chunk, 중복 URL을 오류로 처리한다.
5. 논리 이름, platform별 URL, 파일 checksum을 `manifest.json`에 기록한다.
6. 완전한 결과를 만든 뒤 `docs/public/__lynx__`에 반영한다.
7. 삭제된 entry의 bundle은 남기지 않는다.
8. manifest는 항상 마지막에 교체한다. Docs가 불완전한 산출물을 읽지 않게 한다.

예상 manifest 형식은 다음과 같다.

```json
{
  "schemaVersion": 1,
  "examples": {
    "lynx/badge/preview": {
      "web": {
        "url": "/__lynx__/badge/preview.a1b2c3.web.bundle",
        "sha256": "..."
      },
      "lynx": {
        "url": "/__lynx__/badge/preview.d4e5f6.lynx.bundle",
        "sha256": "..."
      }
    }
  }
}
```

`LynxComponentExample`은 manifest에 없는 이름이나 platform URL을 받으면 Next 빌드를 실패시킨다. 오류에는 잘못된 이름, 검색한 예제 경로, 다시 실행할 명령을 포함한다. 조용히 404 화면을 배포하지 않는다.

`docs/public/__lynx__`는 생성물이므로 Git에서 제외한다. Next static export가 이를 `docs/out/__lynx__`로 복사하는지 통합 테스트로 확인한다.

### 4. 파일 시스템 캐시

첫 구현에서는 Rspeedy/Rspack의 native persistent cache를 사용한다. 별도의 자체 compiler cache는 만들지 않는다.

cache 설정은 다음 입력을 다룬다.

- cache schema 버전
- 정렬한 entry 논리 이름 목록
- `docs/lynx.config.ts`
- entry 검색 및 manifest 생성 코드
- `docs/examples/lynx/tsconfig.json`
- `docs/package.json`
- 루트 `package.json`, `bun.lock`, `bunfig.toml`
- `packages/lynx-react/package.json`과 실제 import되는 `lib`
- `packages/lynx-css/package.json`과 실제 import되는 CSS
- 사용한 `@lynx-js/*` 도구 버전

설정·lockfile·entry 목록은 `cacheDigest`와 `buildDependencies`에 넣는다. 일반 모듈 내용 변경은 Rspack dependency graph가 추적한다. workspace symlink가 `node_modules`의 변경 없는 외부 패키지로 잘못 취급되지 않는지는 호환성 검증에서 반드시 확인한다.

CI에서는 기존 Next cache namespace와 restore/save 단계를 재사용한다. 해당 compatibility hash에 `docs/lynx.config.ts`, `docs/examples/lynx/tsconfig.json`, entry 검색·manifest 코드처럼 compiler cache의 호환성을 바꾸는 파일을 추가한다. 일반 예제와 package source 전체를 외부 key에 넣어 매 변경마다 완전한 cold cache를 만들지는 않는다. 세부 모듈 무효화는 내부 cache가 담당한다.

cache 오류나 손상은 miss로 처리하고 다시 빌드한다. Rspeedy compile 실패, 최종 bundle 누락, checksum 불일치는 Docs 빌드 실패로 처리한다. cold와 warm 빌드가 만든 bundle checksum도 같아야 한다. 절대 경로나 빌드 시각이 bundle에 들어가 checksum이 계속 바뀐다면 먼저 재현성 문제를 해결한다.

현재 [`docs/components/type-table/cache-compatibility.ts`](../components/type-table/cache-compatibility.ts)가 schema, 정렬된 경로, 파일 내용을 조합해 호환성 hash를 만드는 가까운 선례다. Lynx cache도 Rspeedy와 기존 Docs cache action이 같은 호환성 기준을 공유하게 한다.

### 5. workspace 해석과 선행 빌드

구현 시 `docs/package.json`의 다음 항목은 `workspace:*`로 바꾼다.

- `@seed-design/lynx-react`
- `@seed-design/lynx-css`

설치 결과가 우연히 같은 버전을 고른 상태에 의존하지 않게 하기 위해서다. build smoke test에서도 두 import의 `realpath`가 각각 `packages/lynx-react`와 `packages/lynx-css` 아래인지 확인한다.

Rspeedy는 `@seed-design/lynx-react`의 공개 `lib`를 소비한다. 다음 두 경로가 모두 이 선행 조건을 보장해야 한다.

- CI: 공통 setup의 package build가 Rspeedy보다 먼저 끝난다.
- 로컬: 공식 `bun docs:build`가 깨끗한 checkout에서도 필요한 `lynx-react` build를 먼저 실행한다.

이미 package build가 끝난 경우에는 Ultra cache를 활용해 같은 작업을 반복하지 않게 한다. 정확한 task 연결은 호환성 검증 뒤 정하되, “먼저 `bun generate:all`을 수동 실행해야만 Docs가 빌드된다”는 숨은 계약은 만들지 않는다.

`@seed-design/lynx-qvism-preset`은 Docs runtime dependency로 추가하지 않는다. preset 변경은 `bun generate:all`이 `@seed-design/lynx-css` 생성물에 반영하며, Rspeedy는 그 결과만 소비한다.

### 6. 경로별 TypeScript 분리

Lynx 예제 디렉터리에 `docs/examples/lynx/tsconfig.json`을 둔다. 설정의 적용 범위와 source 경계를 같은 위치에 둬 새 예제가 자동으로 이 config를 사용하게 한다.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@lynx-js/react",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noEmit": true
  },
  "include": ["./**/*.ts", "./**/*.tsx"]
}
```

Docs의 Web React tsconfig에서는 `examples/lynx`를 제외한다. 대신 `typecheck:lynx-examples`를 별도 실행해 타입 검사를 생략하지 않는다.

`typecheck:lynx-examples`는 일반 `typescript` `6.0.x`와 위 경로의 config를 사용한다. Web Docs는 지금처럼 native TypeScript 7을 사용한다. Rspeedy 최신 후보의 TypeScript 6 지원을 활용하면서 서로 다른 JSX 타입 환경을 한 compiler 실행에 섞지 않는다.

React 타입도 분리해서 확인한다. ReactLynx `0.117.0`의 `@types/react ^18` peer와 Docs의 React 19 타입이 한 typecheck 안에서 충돌한다면 Lynx 전용 type root 또는 호환되는 패키지 조합을 사용한다. `skipLibCheck`만 추가해 충돌을 숨기는 방법은 기본안으로 삼지 않는다.

### 7. MDX API

요청에 적힌 `LynxComponentExmaple` 오타는 코드에서 `LynxComponentExample`로 바로잡는다.

```tsx
interface LynxComponentExampleProps {
  name: `lynx/${string}`;
  height?: number;
  children?: React.ReactNode;
}
```

- `name`: manifest의 논리 이름이다.
- `height`: 기본값은 `320`이다. `<lynx-view>`는 명시적인 크기가 필요하다.
- `children`: 기존 `ComponentExample`처럼 코드 탭에 표시할 내용이다.
- `isolate`: `<lynx-view>` 자체가 렌더 경계를 가지므로 제공하지 않는다.
- `globalProps`, `initData`: 첫 공개 API에서는 제공하지 않는다.

MDX 사용 예시는 다음과 같다.

````mdx
<LynxComponentExample name="lynx/badge/preview" height={320}>
  ```json doc-gen:file
  {
    "file": "examples/lynx/badge/preview.tsx",
    "codeblock": true
  }
  ```
</LynxComponentExample>
````

`LynxComponentExample`은 server 쪽에서 manifest를 해석하고 `Preview`, `QR Code`, `Code` 탭과 `ErrorBoundary`를 렌더한다. web bundle URL과 높이는 `LynxComponentPreview`에, native bundle URL은 `LynxComponentQRCode`에 전달한다. Lynx TSX를 Next가 import하지 않는다.

탭의 책임은 다음처럼 고정한다.

| 탭 | 내용 |
| --- | --- |
| `Preview` | `<lynx-view>`에서 `.web.bundle` 실행 |
| `QR Code` | `.lynx.bundle?fullscreen=true`의 QR 코드, Explorer 실행 링크, 복사 가능한 절대 URL |
| `Code` | 실제 entry source |

기존 `SeedTabs`는 비활성 panel도 DOM에 유지한다. 숨겨진 Preview에서는 `IntersectionObserver`가 runtime 시작을 막고, 한 번 연 Preview는 다른 탭을 다녀와도 재부팅하지 않는 현재 전략을 유지한다. QR도 최초 한 번만 생성한다.

### 8. 브라우저 host

`LynxComponentPreview`의 동작 순서는 다음과 같다.

1. viewport 근처에 오기 전에는 runtime을 시작하지 않는다.
2. client에서 호환되는 `@lynx-js/web-core/client`를 동적으로 import한다.
3. import가 끝나면 JSX로 `<lynx-view>`를 렌더한다.
4. element에 `display: block`, `width: 100%`, 명시적 `height`를 적용한다.
5. ref를 통해 `{ theme, locale }`를 `globalProps`에 먼저 넣는다.
6. 마지막에 같은 origin의 bundle URL을 설정한다.
7. Docs 테마가 바뀌면 기존 element의 `globalProps`를 갱신한다.
8. runtime error를 사용자에게 보이는 오류 UI로 바꾼다.
9. unmount 시 event listener와 observer를 정리한다. element 제거는 web runtime의 `disconnectedCallback` 정리를 유도한다.

한 페이지에 예제가 많으면 `<lynx-view>`마다 worker와 runtime 비용이 생길 수 있다. `IntersectionObserver`로 첫 진입 전 mount를 미루고, 한 번 열린 미리보기는 탭 전환 때문에 매번 재부팅하지 않는다.

현재 local Lynx source의 REPL 구현은 `<lynx-view>`에 별도 load event가 없어 내부의 `[lynx-tag="page"]` 생성을 `MutationObserver`로 감지한다. 선택한 web-core 버전에서도 같은 계약인지 확인한 뒤 loading 종료 조건으로 사용한다. 불안정한 내부 selector라면 명시적인 준비 상태 없이 bundle fetch와 error만 표시하는 쪽을 택한다.

테마는 [`docs/hooks/useTheme.ts`](../hooks/useTheme.ts)의 현재 값을 `globalProps.theme`으로 전달한다. `useSeedClassName`이 `useGlobalProps()`를 구독하므로 theme 갱신 시 SEED class가 다시 계산되는지 실제 bundle에서 확인한다.

### 9. QR Code와 Lynx Explorer

QR Code는 web bundle을 가리키지 않는다. 공식 QR plugin의 URL 생성 코드도 항상 `lynx` platform의 main bundle을 선택한다. 두 탭은 같은 entry source에서 나온 서로 다른 산출물을 사용한다.

`LynxComponentQRCode`는 브라우저의 현재 origin과 manifest의 native bundle 경로를 합쳐 절대 URL을 만든다. 이렇게 해야 빌드 시점에 알 수 없는 Alpha 배포 주소와 Production 주소를 모두 올바르게 반영할 수 있다. URL에는 `fullscreen=true` query를 붙여 Lynx Explorer의 화면 안쪽 탐색 UI 없이 예제를 연다.

QR 탭은 다음을 제공한다.

- Lynx Explorer로 스캔할 수 있는 QR 코드
- 전체 native bundle URL
- 지원되는 Lynx Explorer를 여는 링크와 bundle URL 복사 동작
- QR 생성 실패 시에도 사용할 수 있는 텍스트 링크

QR은 배포 origin에 따라 달라지므로 PNG나 SVG 파일을 빌드 산출물로 미리 만들지 않는다. client에서 SVG를 렌더할 수 있는 작은 QR encoder를 직접 의존성으로 추가한다. local Refer의 공식 QR plugin이 사용하는 `uqr`를 첫 후보로 검토하되, terminal 출력용 `@lynx-js/qrcode-rsbuild-plugin`을 Docs 화면 렌더링 때문에 추가하지는 않는다.

배포된 Docs URL은 모바일 기기에서 접근할 수 있지만 `localhost`는 접근할 수 없다. 로컬 개발에서는 다음 중 하나를 제공한다.

- LAN에서 접근 가능한 Docs origin을 자동 사용
- `NEXT_PUBLIC_LYNX_BUNDLE_ORIGIN` 같은 명시적 override
- 둘 다 없으면 QR 탭에 로컬 주소 제한 안내 표시

QR과 링크가 가리키는 `.lynx.bundle`도 Cloudflare Pages의 정적 산출물에 포함되어야 한다. 실제 Lynx Explorer에서 QR 스캔, bundle fetch, fullscreen 진입을 확인한다.

QR payload는 절대 HTTPS bundle URL을 사용한다. Android·iOS Explorer source에는 `lynx://open?url=...`으로 앱을 여는 경로도 있으므로 QR 탭의 `Lynx Explorer에서 열기` 링크 후보로 사용한다. 다만 이 deep link는 QR scanner가 읽는 값과 다른 계약이다. 배포 대상 Explorer 버전에서 중첩 URL과 `fullscreen=true` query 처리까지 검증한 뒤 활성화한다. 지원되지 않으면 HTTPS URL 열기·복사를 fallback으로 남긴다.

### 10. web runtime 의존성과 정적 배포

Docs에는 현재 `@lynx-js/web-core` 직접 의존성이 없다. 다른 패키지의 전이 의존성이나 `examples/lynx-spa/node_modules`에 기대지 않는다.

호환성 검증에서 다음을 확정한다.

- ReactLynx `0.117.0` bundle과 맞는 `@lynx-js/web-core` 버전
- `@lynx-js/web-elements` CSS를 별도로 import해야 하는지
- worker, WASM, CSS asset이 Next static export에 모두 포함되는지
- Cloudflare Pages의 하위 경로와 같은 origin URL에서 asset을 찾는지
- Chromium과 Safari에서 custom element 등록과 bundle 실행이 같은지
- 여러 미리보기와 페이지 이동 뒤 worker가 남지 않는지

첫 후보는 현재 Rspeedy가 사용하는 web middleware와 같은 릴리스 계열이다. 정확한 버전은 추측으로 lockfile에 넣지 않는다.

### 11. llms 변환

새 MDX 컴포넌트에는 AST 변환 규칙과 fixture가 필요하다. 그렇지 않으면 `<LynxComponentExample>` JSX가 `llms.txt` 계열 산출물에 그대로 남는다.

기존 `ComponentExample`과 같은 의미로 변환한다.

- 이름이 `/preview`로 끝나면 `## Preview` heading을 넣는다.
- wrapper는 제거하고 코드 블록인 children만 남긴다.
- 변환 중 예외가 발생하면 기존 규칙의 정책대로 원본 node를 보존한다.
- 공통 변환 함수는 공유하되 `LynxComponentExample` match와 fixture를 별도로 둔다.
- 독립 fixture와 전체 pipeline fixture를 모두 추가한다.

구조화 검색 출력은 현재 MDX UI tag의 children만 처리하므로 별도 분기가 필요한지 테스트로 확인한다.

## 제안 파일 구성

```text
docs/
  lynx.config.ts
  scripts/
    build-lynx-examples.ts
  lib/lynx-examples/
    discover.ts
    manifest.ts
    cache-compatibility.ts
    *.test.ts
  components/
    lynx-component-example.tsx
    lynx-component-preview.tsx
    lynx-component-preview.test.tsx
    lynx-component-qr-code.tsx
    lynx-component-qr-code.test.tsx
    mdx-components.tsx                      # 기존 파일에 MDX component 등록
  types/
    lynx-view.d.ts
  examples/lynx/
    AGENTS.md
    tsconfig.json
    global.css
    badge/preview.tsx
    action-button/preview.tsx
  app/_llms/rules/
    lynx-component-example-rule.ts
    lynx-component-example-rule.test.ts
  app/_llms/__fixtures__/lynx-component-example/
    *.input.mdx
    *.output.md
  public/__lynx__/
    manifest.json
    *.web.bundle
    *.lynx.bundle
  content/lynx/components/
    badge.mdx
    action-button.mdx
```

`public/__lynx__`는 설계를 보여주기 위해 목록에 넣었지만 Git에 저장하지 않는다.

주요 기존 파일 변경 범위는 다음과 같다.

| 파일 | 변경 내용 |
| --- | --- |
| `docs/package.json`, `bun.lock` | Rspeedy·web runtime·QR encoder 직접 의존성, build·dev·typecheck 명령 |
| `docs/tsconfig.json` | Web React 검사에서 Lynx 예제 제외 |
| `docs/.gitignore` | `public/__lynx__` 생성물 제외 |
| `docs/components/mdx-components.tsx` | `LynxComponentExample` 등록 |
| `docs/app/_llms/rules/index.ts` | 새 llms 규칙 등록 |
| `docs/app/_llms/__fixtures__/pipeline/*` | 전체 변환 결과 갱신 |
| `docs/content/lynx/components/{badge,action-button}.mdx` | Preview·QR Code·Code 탭 추가 |
| `.github/actions/nextjs-cache/action.yml` | Rspeedy compatibility 파일을 cache key에 추가 |
| `.github/actions/setup/action.yml` | `lynx-react/lib` cache 복원 검증 |
| `.github/workflows/docs-test.yml` | package 경로와 bundle smoke test 추가 |
| Docs Alpha·Production workflow | package 경로 추가, Alpha 빌드 진입점을 `bun run build`로 통합 |

## 빌드 명령 연결

구현 후 명령 책임은 다음처럼 나눈다.

| 명령 | 책임 |
| --- | --- |
| `build:lynx-examples` | workspace 선행 산출물 확인, entry 검색, web·native Rspeedy build, manifest 검증 |
| `typecheck:lynx-examples` | ReactLynx JSX만 경로 전용 tsconfig와 TypeScript 6으로 검사 |
| `build` | Figma 준비 → Web/Lynx 타입 검사 → 두 Lynx bundle → Next build → 후처리 |
| `dev:lynx-examples` | 최초 bundle 생성 뒤 기존 entry 변경 감시 |
| `dev` | Lynx watcher, Stackflow 예제, Next dev를 함께 실행 |

Next가 MDX를 렌더하기 전에 manifest가 반드시 존재해야 한다. 이 순서는 `docs/package.json`의 `build`가 한 곳에서 소유한다.

```text
prepare:figma-images
→ Web/Lynx typecheck
→ build:lynx-examples
→ build:turbopack
→ generate:changelog-llms
```

Alpha와 Production workflow는 모두 `bun run build`만 호출한다. 가장 작은 변경을 위해 Alpha의 Turbopack 단독 시간은 제거하고 전체 Docs build의 cold/warm 시간을 기록한다. 이는 Rspeedy cache를 포함한 실제 CI 개선 효과도 함께 보여준다. 나중에 단계별 지표가 꼭 필요해지면 workflow를 다시 분기하지 않고 공통 build runner가 시간을 보고하게 한다.

개발 watcher는 기존 entry 내용 변경을 빠르게 다시 빌드해야 한다. 새 파일 추가·삭제를 Rspeedy watch가 감지하지 못하면 watcher를 재시작하거나 entry 디렉터리를 감시하는 얇은 wrapper를 둔다. 이 동작도 호환성 검증에서 확인한다.

## CI 변경 계획

다음 변경은 저장소 지침상 구현 전에 승인이 필요하다.

1. Alpha와 Production 배포 workflow의 경로 필터에 아래 경로를 추가한다.
   - `packages/lynx-react/**`
   - `packages/lynx-css/**`
   - `packages/lynx-qvism-preset/**`
2. Docs test workflow에도 같은 경로를 추가한다.
3. Alpha의 수동 build 순서를 제거하고 Production과 같이 `bun run build`를 호출한다.
4. Alpha 보고서는 Turbopack 단독 시간 대신 전체 Docs build cold/warm 시간을 사용한다.
5. 기존 Docs cache compatibility hash에 Rspeedy config와 cache schema 파일을 추가한다. restore/save 경로는 바꾸지 않는다.
6. 공통 setup이 cache hit를 복원했을 때 `packages/lynx-react/lib/index.js`의 존재도 검사한다.
7. Docs test job에서 최소 한 entry의 web·native bundle을 실제 Rspeedy로 compile하는 smoke test를 실행한다.

Rspeedy 빌드를 MDX component render 중에 실행하지 않는다. Next worker마다 같은 bundle을 만들 수 있고, output clean과 manifest 쓰기가 경합하기 때문이다.

## 구현 전 승인 항목

다음 세 범주는 root `AGENTS.md`의 사전 승인 대상이다.

- 외부 의존성 추가
  - `@lynx-js/rspeedy`
  - Rsbuild 2를 지원하는 `@lynx-js/react-rsbuild-plugin`
  - Rspeedy `0.16.x`를 지원하는 `@lynx-js/config-rsbuild-plugin`
  - 호환되는 `@lynx-js/web-core`와 필요한 web element 패키지
  - browser용 QR encoder
- tsconfig 변경
  - `docs/examples/lynx/tsconfig.json` 추가
  - Docs Web React config에서 Lynx 예제 제외
- CI 변경
  - workflow 경로 필터와 Alpha 빌드 진입점 통합
  - 기존 Docs cache compatibility hash 확장

`@seed-design/lynx-react`와 `@seed-design/lynx-css`를 `workspace:*`로 바꾸는 작업도 lockfile 변경과 함께 검토한다.

## 단계별 구현 계획

### 0단계: 호환성 검증과 버전 결정

목표는 현재 ReactLynx `0.117.0`을 유지한 채 web과 Lynx Explorer에서 같은 예제를 실행할 수 있는 최신 도구 조합을 찾는 것이다.

- [ ] Rspeedy `0.16.3`을 첫 후보로 정확한 package metadata와 Node engine 범위를 확인한다.
- [ ] peer 범위가 확인된 React plugin `0.17.2`로 ReactLynx `0.117.0` web·native bundle을 실제 compile한다.
- [ ] config plugin `0.1.1` 이상이 선택한 Rspeedy `0.16.x`를 지원하는지 확인한다.
- [ ] 승인받은 Rspeedy·React plugin·web-core·QR encoder를 Docs의 직접 의존성으로 설치한다.
- [ ] `Badge` 하나에서 `.web.bundle`과 `.lynx.bundle`을 함께 만든다.
- [ ] Lynx 예제를 일반 TypeScript `6.0.x`와 경로 전용 tsconfig로 검사한다.
- [ ] ReactLynx의 React 18 타입 peer와 Docs의 React 19 타입이 충돌하지 않는지 확인한다.
- [ ] 여러 entry와 `splitChunks: false` 조합이 platform별 self-contained bundle을 만드는지 확인한다.
- [ ] `web-core`와 web element CSS의 정확한 import 조합을 확인한다.
- [ ] Next static export에서 worker·WASM·CSS·bundle URL을 확인한다.
- [ ] 배포 origin의 native bundle URL을 Lynx Explorer에서 QR과 링크로 연다.
- [ ] cold/warm 시간, cache 크기, bundle checksum을 기록한다.
- [ ] Safari와 Chromium에서 실제 렌더를 확인한다.

중단 조건은 다음과 같다.

- ReactLynx 전체 업그레이드가 필요하다.
- 현재 컴포넌트가 요구하는 main-thread API를 web runtime이 제공하지 않는다.
- static export에서 필수 worker나 WASM asset을 안정적으로 배포할 수 없다.
- 배포된 native bundle을 Lynx Explorer가 가져오거나 실행할 수 없다.

중단 조건에 해당하면 의존성 범위를 넓히기 전에 별도 결정을 요청한다.

### 1단계: 빌드 기반

- [ ] `docs/examples/lynx` 규칙과 첫 entry를 추가한다.
- [ ] 전용 tsconfig와 typecheck 명령을 추가한다.
- [ ] 결정적인 entry 검색과 이름 검증을 구현한다.
- [ ] Rspeedy multi-entry, `web`·`lynx`, `splitChunks: false` 설정을 추가한다.
- [ ] workspace 공개 export와 realpath 검증을 연결한다.
- [ ] native persistent cache와 compatibility hash를 추가한다.
- [ ] staging output 검증, stale file 정리, manifest 생성을 구현한다.
- [ ] cold/warm 및 cache 무효화 테스트를 추가한다.

### 2단계: Docs host와 MDX

- [ ] `<lynx-view>` 타입 선언을 추가한다.
- [ ] server 쪽 `LynxComponentExample`을 구현한다.
- [ ] client 쪽 `LynxComponentPreview`를 구현한다.
- [ ] client 쪽 `LynxComponentQRCode`와 링크·복사 동작을 구현한다.
- [ ] loading, error, 크기, lazy mount, theme 갱신, cleanup을 테스트한다.
- [ ] 현재 배포 origin과 local override의 QR URL 생성을 테스트한다.
- [ ] 배포 대상 Explorer에서 `lynx://open?url=...` 링크를 검증하고, 지원되지 않을 때 HTTPS URL fallback을 확인한다.
- [ ] MDX component map에 등록한다.
- [ ] llms AST rule, 독립 fixture, pipeline fixture를 추가한다.

### 3단계: 첫 문서 통합

- [ ] `Badge` 문서에 대표 preview를 추가한다.
- [ ] Preview·QR Code·Code 탭이 같은 entry source의 산출물을 사용하는지 확인한다.
- [ ] 실제 Lynx Explorer로 native bundle QR을 스캔한다.
- [ ] `ActionButton` preview를 추가해 tap과 main-thread 동작을 확인한다.
- [ ] 각 문서에서 미리보기 수와 초기 worker 비용을 측정한다.

### 4단계: CI와 배포

- [ ] Alpha의 수동 build 순서를 없애고 `bun run build`로 Production과 통합한다.
- [ ] Production과 Docs test의 trigger 경로를 갱신한다.
- [ ] 기존 Docs cache key에 Rspeedy compatibility 파일을 추가한다.
- [ ] package cache 복원 검증에 `lynx-react/lib`를 추가한다.
- [ ] 정적 산출물 smoke test를 CI에 넣는다.
- [ ] Alpha에서 cold와 warm cache를 각각 한 번 측정한다.
- [ ] 전체 Docs build 지표와 Rspeedy 단계 로그로 cache 효과를 확인한다.

### 5단계: 적용 범위 확대

컴포넌트를 다음 세 부류로 나누어 순차적으로 추가한다.

1. layout과 CSS 중심 컴포넌트
2. main-thread script와 gesture를 사용하는 컴포넌트
3. native module 또는 외부 Lynx UI에 의존하는 컴포넌트

세 번째 부류는 web runtime 대체 구현이 없으면 미리보기를 제공하지 않고, 문서에 코드만 유지한다. 모든 컴포넌트가 web에서 동작한다고 가정하지 않는다.

## 검증 계획

| 구분 | 실행 또는 확인 | 통과 기준 |
| --- | --- | --- |
| entry 단위 | discovery·manifest 테스트 | 정렬, 이름 변환, 중복·경로 이탈 거부, 삭제 반영 |
| cache 단위 | 동일 입력 두 번, source/config/lock/package 변경 | 동일 입력은 재사용하고 각 변경은 영향 범위만 다시 빌드 |
| cold build | `build:lynx-examples` | 모든 entry의 web·native bundle과 manifest 생성 |
| warm build | 같은 명령 재실행 | cache 재사용 확인, 두 platform의 bundle checksum 동일 |
| workspace | import realpath와 package 변경 후 재빌드 | 저장소 패키지를 사용하고 변경이 bundle을 무효화 |
| 타입 | Docs typecheck와 Lynx 전용 typecheck | Web React와 ReactLynx JSX 타입 충돌 없음 |
| llms | `cd docs && bun test app/_llms` | wrapper JSX가 사라지고 코드 블록과 heading 유지 |
| 정적 export | `bun docs:build` | `docs/out/__lynx__`에 manifest와 두 platform bundle 존재, 404 없음 |
| 브라우저 | Chromium·Safari에서 Badge와 ActionButton | Preview 렌더, tap, theme 전환, 오류 표시, 재방문 동작 |
| QR·Explorer | 배포 URL의 QR 스캔과 링크 열기 | 현재 origin의 `.lynx.bundle?fullscreen=true`를 Lynx Explorer에서 실행 |
| 정리 | 페이지 이동과 반복 mount/unmount | element·observer 정리, 남은 worker 증가 없음 |
| 생성물 | `bun generate:all` 후 diff 확인 | 필요한 생성물만 갱신, cache와 bundle은 추적 안 됨 |
| 전체 회귀 | `bun docs:test`, 마지막 `bun test:all` | 기존 테스트 포함 전체 통과 |
| CI | Alpha cold/warm 실행 | 동일 `bun run build` 경로와 전체 시간, Rspeedy cache 결과 보고 |

구현 뒤 저장소 규칙에 따라 `bun generate:all`을 실행하고 변경을 확인한다. Docs 변경 직후 `bun docs:test`를 실행하며, 최종 확인에는 `bun test:all`을 포함한다.

## 완료 조건

- Lynx 문서의 `LynxComponentExample`이 실제 workspace `@seed-design/lynx-react` 컴포넌트를 표시한다.
- `Preview`, `QR Code`, `Code` 탭이 각각 web 실행, native bundle QR·링크, 실제 source를 제공한다.
- Docs build 전에 Rspeedy가 정확히 한 번 실행되며 Next render 중에는 실행되지 않는다.
- 깨끗한 checkout과 CI에서 별도의 수동 준비 없이 공식 Docs build가 성공한다.
- `docs/out/__lynx__`의 URL로 모든 manifest entry의 web·native bundle을 가져올 수 있다.
- 같은 입력의 cold/warm bundle checksum이 같다.
- `lynx-react`, `lynx-css`, entry, config, lockfile 변경이 cache에 올바르게 반영된다.
- 삭제한 예제의 오래된 public bundle이 남지 않는다.
- loading, error, theme 갱신, unmount 정리가 동작한다.
- `llms.txt` 계열 산출물에 `LynxComponentExample` JSX가 남지 않는다.
- Alpha와 Production 배포가 모두 같은 `bun run build`를 실행한다.

## 위험과 대응

| 위험 | 영향 | 대응 |
| --- | --- | --- |
| Rspeedy `0.16.x`와 React·config plugin 조합 불일치 | 설치 또는 bundle compile 실패 | Rsbuild 2와 ReactLynx `0.117.0` 지원 범위를 함께 검증하고 도구 묶음을 고정한다. React plugin `0.18.x`는 제외한다. |
| Web Docs의 native TypeScript 7과 Lynx의 TypeScript 6 혼용 | JSX 타입 충돌 또는 서로 다른 진단 | `docs/examples/lynx/tsconfig.json`과 별도 명령으로 compiler 경계를 고정한다. |
| ReactLynx의 React 18 타입과 Docs의 React 19 타입 충돌 | Lynx 예제 또는 Docs typecheck 실패 | Lynx 타입 환경을 분리하고, 오류를 `skipLibCheck`만으로 숨기지 않는다. |
| web-core 버전 불일치 | bundle은 생성되지만 브라우저 boot 실패 | ReactLynx·Rspeedy와 같은 릴리스 계열을 직접 의존성으로 검증한다. |
| workspace symlink를 immutable package로 취급 | package 변경 뒤 이전 bundle 재사용 | realpath 검증, `source.include`, package 변경 cache 테스트를 둔다. |
| Alpha와 Production build 계약 이탈 | 한 환경에서 bundle URL이 404 | 두 workflow가 모두 `bun run build`만 호출하고 manifest 누락 시 실패시킨다. |
| stale public bundle | 삭제한 예제가 계속 배포되거나 용량 증가 | staging 결과를 검증한 뒤 output을 교체하고 manifest를 마지막에 쓴다. |
| 한 페이지의 많은 runtime | 초기 로드, memory, worker 비용 증가 | 대표 preview부터 시작하고 viewport 진입 시점까지 mount를 미룬다. |
| native module 의존 컴포넌트 | web 미리보기만 실패 | capability 목록을 만들고 지원되지 않는 문서는 코드 전용으로 유지한다. |
| QR이 `localhost` 또는 잘못된 host를 포함 | 모바일 Lynx Explorer가 bundle을 받지 못함 | 현재 배포 origin을 사용하고 로컬에서는 LAN origin override 또는 안내를 제공한다. |
| llms 변환 누락 | 배포 문서에 raw MDX JSX 노출 | 전용 rule과 fixture를 필수 변경으로 묶는다. |
| Rspeedy cache로 기존 Docs archive가 커짐 | restore/save 시간이 compile 절감보다 커짐 | 전체·Rspeedy cache 크기와 시간을 측정하고 필요할 때만 별도 cache로 분리한다. |

## 열린 결정

다음 항목은 구현 전에 0단계 결과로 확정한다.

1. 사용자 제안 Rspeedy `0.16.3`, React plugin `0.17.2`, config plugin `0.1.1` 이상, ReactLynx `0.117.0`, web-core의 정확한 호환 조합
2. ReactLynx `0.117.0`과 Docs의 React 19 타입을 경로 전용 TypeScript 6 검사에서 함께 사용할 수 있는지
3. web-core client import만으로 충분한지, web element CSS를 따로 포함해야 하는지
4. content hash bundle 이름을 Rspeedy `0.16.x`의 web·lynx 환경에서 안정적으로 사용할 수 있는지
5. 기존 Docs cache archive에 Rspeedy cache를 포함했을 때 크기와 Alpha baseline 재사용 효과
6. browser QR encoder와 로컬 개발용 bundle origin 결정
7. Rspeedy watch가 entry 추가·삭제를 감지하는지
8. 첫 배포 범위를 `Badge` 하나로 제한할지, `ActionButton` 상호작용 검증까지 한 변경에 포함할지

## 조사 근거

저장소의 현재 코드와 설치된 패키지를 우선 확인했다.

- [`examples/lynx-spa/lynx.config.ts`](../../examples/lynx-spa/lynx.config.ts)
- [`examples/lynx-spa/src/index.tsx`](../../examples/lynx-spa/src/index.tsx)
- [`packages/lynx-react/AGENTS.md`](../../packages/lynx-react/AGENTS.md)
- [`packages/lynx-react/package.json`](../../packages/lynx-react/package.json)
- [`packages/lynx-css/package.json`](../../packages/lynx-css/package.json)
- [`docs/components/component-example.tsx`](../components/component-example.tsx)
- [`docs/app/_llms/rules/component-example-rule.ts`](../app/_llms/rules/component-example-rule.ts)
- [`.github/actions/nextjs-cache/action.yml`](../../.github/actions/nextjs-cache/action.yml)
- [`.github/workflows/deploy-seed-design-docs-alpha-pages.yml`](../../.github/workflows/deploy-seed-design-docs-alpha-pages.yml)
- [`.github/workflows/deploy-seed-design-docs-prod-pages.yml`](../../.github/workflows/deploy-seed-design-docs-prod-pages.yml)

Lynx API와 web component 동작은 local Refer에 고정된 `lynx-family/lynx-stack` revision `19e9f1af8ec2d39ae0b933cde3648cc645010fa6`의 다음 소스로 교차 확인했다.

- `packages/web-platform/web-core/README.md`
- `packages/web-platform/web-core/ts/client/mainthread/LynxView.ts`
- `packages/repl/src/components/LynxPreview.tsx`
- `packages/rspeedy/core/package.json`과 `CHANGELOG.md`
- `packages/rspeedy/plugin-react/CHANGELOG.md`
- `packages/rspeedy/plugin-config/package.json`과 `CHANGELOG.md`
- `packages/rspeedy/plugin-qrcode/src/generateDevUrls.ts`
- `packages/rspeedy/core/src/config/performance/build-cache.ts`
- `packages/rspeedy/core/src/config/source/entry.ts`

QR payload가 HTTPS bundle URL을 직접 받을 수 있는지는 local Refer의 `lynx-family/lynx` revision `4fa388975b7ad820f05c51ca46b363009f21943c`에 있는 Android·iOS Lynx Explorer scanner와 HTTP dispatcher에서도 확인했다.

Refer의 revision은 저장소에 설치된 버전보다 새 버전이지만 Rspeedy core는 `0.16.1`까지만 포함한다. 따라서 실제 구현에서는 사용자 제안 `0.16.3`을 포함해 설치할 정확한 package source와 peer를 다시 확인하고, 이 문서의 API 가정을 호환성 검증으로 확정한다.
