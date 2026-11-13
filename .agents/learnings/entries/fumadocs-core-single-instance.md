---
id: fumadocs-core-single-instance
description: "docs의 fumadocs-core·fumadocs-ui를 올린 뒤 `next build` 정적 export가 `You need to wrap your application inside FrameworkProvider` 오류로 실패하거나, `node_modules/.bun`에 같은 버전의 fumadocs-core가 peer hash만 다르게 두 벌 생겼을 때 읽는다. Bun isolated 설치에서 optional peer 버전이 갈려 인스턴스가 나뉘는 원인과 확인·해결 순서를 다룬다."
scope: ["docs/package.json", "examples/stackflow-spa/package.json", "bun.lock"]
status: active
---

# fumadocs-core peer가 갈리면 FrameworkProvider 오류가 난다

## 교훈과 다음 행동

- `fumadocs-ui`의 `RootProvider`가 만든 context는 `fumadocs-ui`가 쓰는 `fumadocs-core` 인스턴스에만 있다. docs 코드가 다른 인스턴스의 `fumadocs-core`를 import하면 prerender에서 `FrameworkProvider` 오류가 난다.
- Bun isolated 설치는 같은 버전이라도 peer 해석이 다르면 `fumadocs-core@x+<hash>`를 따로 만든다. `readlink docs/node_modules/fumadocs-core`와 `readlink node_modules/.bun/fumadocs-ui@*/node_modules/fumadocs-core`가 같은 경로인지 먼저 확인한다.
- 다르면 두 디렉터리의 `node_modules/<peer>` 링크를 비교해 갈린 peer를 찾는다. 그 peer를 쓰는 workspace 패키지의 범위를 `fumadocs-ui`가 요구하는 범위에 맞춰 올린다. docs에 새 의존성을 추가하지 않고 기존 의존성 버전으로 맞춘다.

## 발생 근거와 적용 조건

- 상황(2026-11-10): `fumadocs-ui` 16.18.1은 `lucide-react ^1.61.0`을 직접 의존한다. 루트에는 `examples/stackflow-spa`의 `lucide-react ^1.40.0`(1.40.0)이 있어, `fumadocs-core`의 optional peer `lucide-react`가 docs 쪽에서는 1.40, `fumadocs-ui` 쪽에서는 1.70으로 해석됐다.
- 결과: `/docs/migration/deprecations` prerender가 위 오류로 실패했다. `examples/stackflow-spa`의 `lucide-react`를 `^1.61.0`으로 올리자 두 링크가 같은 인스턴스를 가리키고 빌드가 통과했다.
- 위험: 오류 메시지만 보고 레이아웃에 provider를 추가하는 우회 수정을 한다.

## 변경 이력

- 2026-11-10: fumadocs 16.18 업그레이드에서 재현·해결을 확인하고 작성했다.
