# Outdated Version

설치된 `@seed-design/*` 패키지가 npm 최신 버전에서 얼마나 뒤졌는지 판정합니다. **major가 뒤지면 `warn`, minor/patch만 뒤지면 `info`.**

## 왜

SEED는 **2.0.0부터 strict SemVer를 따릅니다.** 그 이전(1.x)에는 minor/patch에도 breaking이 섞여 있어 버전 격차가 클수록 마이그레이션 비용이 비선형으로 커집니다. major가 뒤진 상태는 버그 수정과 신규 컴포넌트를 받지 못하는 상태이기도 합니다.

## 판정 방법

1. **SEED를 쓰는 워크스페이스의** `package.json`에서 `dependencies`/`devDependencies`의 `@seed-design/*` 패키지를 수집합니다. 모노레포면 루트가 아니라 그 워크스페이스에 선언이 있습니다(어느 워크스페이스인지는 `references/doctor.md`의 Step 1에서 이미 찾습니다). **선언된 것만** 대상입니다 — 전이 의존성으로 딸려온 `@seed-design/react-*`는 상위 패키지가 범위를 고정하므로 판정하지 않습니다.
2. 각 패키지의 **실제 설치본** 버전을 읽습니다. 선언 범위(`^1.2.0`)가 아니라 설치본이 기준입니다.

   ```bash
   node -p "require('@seed-design/react/package.json').version"
   ```

   모노레포에서는 선언이 워크스페이스에 있어도 **설치본은 저장소 루트로 hoist**됩니다. 워크스페이스 디렉토리에서 실행하면 resolve에 실패하니, 루트까지 올라가며 `node_modules/@seed-design/{pkg}/package.json`을 직접 찾습니다.

3. npm 최신 버전과 비교합니다.

   ```bash
   npm view @seed-design/react version
   ```

   `npm` 실행이 막힌 환경(bun 전용 훅 등)이면 registry를 직접 조회합니다: `curl -s https://registry.npmjs.org/@seed-design%2freact/latest` 응답의 `version`.

4. major 차이 → `warn`, minor/patch 차이 → `info`. 네트워크가 막혀 조회에 실패하면 이 룰은 **판정하지 않고 건너뜁니다**(진단 전체를 중단하지 않습니다).

   `0.x` 패키지는 SemVer상 minor가 breaking 자리이므로, **`0.x` 안에서의 minor 차이도 `warn`으로 봅니다**(`0.0.15` → `0.1.0`). `1.0.0` 이상으로 넘어간 경우는 당연히 major 차이입니다.

패키지가 여러 개면 하나로 묶어 보고합니다 — 원인이 같고 조치도 한 번이라, 패키지마다 한 건씩 내면 읽기만 어려워집니다.

## 수정 방법

"업그레이드하세요"로 끝내지 않습니다. 격차에 따라 읽을 문서 순서까지 안내합니다.

**어느 가이드를 볼지는 `@seed-design/react`(lynx면 `lynx-react`)의 설치본으로 정합니다.** 업그레이드 가이드가 이 패키지의 버전 라인을 기준으로 쓰여 있어서, `stackflow`나 `vite-plugin`의 버전 번호를 여기 대입하면 엉뚱한 안내가 나갑니다.

- 설치본이 **1.2 미만**이면 v1 가이드로 1.2까지 먼저 올린 뒤 v2 가이드를 진행합니다. 1.x 구간의 패키지 조합은 선언만으로 판단하면 안 되고 v1 문서의 호환표를 따릅니다.
- 설치본이 **1.2 이상 2.0 미만**이면 v2 업그레이드 가이드를 따릅니다.
- 스니펫도 세대가 함께 뒤졌을 가능성이 높으므로 [snippet-generation](./snippet-generation.md) 판정을 같이 봅니다.
- 특정 버전 이후의 변경사항 목록이 필요하면: `npx @seed-design/cli@latest docs react/updates/changelog/react/{현재버전} --raw`

## 읽어야 할 문서

- [SEED React 2 업그레이드 가이드](https://seed-design.io/llms/react/updates/upgrade/v2.txt)
- [SEED React 1 업그레이드 가이드 · 1.x 호환표](https://seed-design.io/llms/react/updates/upgrade/v1.txt)
