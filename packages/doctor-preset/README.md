# @seed-design/doctor-preset

SEED Design 룰 팩입니다. seed-design.io가 서빙하는 기계가독 아티팩트(rootage ComponentSpec, 스니펫 registry)를 지식원으로 사용해, 릴리스마다 별도 배포 없이 룰 지식이 최신으로 유지됩니다.

## 룰

| id | kind | 기본 severity | 설명 |
|---|---|---|---|
| `seed/no-deprecated-component` | static | warn | deprecated 컴포넌트 import·설치된 deprecated 스니펫 감지 |
| `seed/valid-variant` | static | error | 컴포넌트 스펙에 존재하지 않는 variant 값 감지 |

## 사용

```ts
import { runStaticRules } from "@seed-design/doctor-core";
import { loadSeedRulePack } from "@seed-design/doctor-preset";

const pack = await loadSeedRulePack({
  baseUrl: "https://seed-design.io",
  framework: "react",
  snippetRoot: "src/seed-design",
});
const result = runStaticRules({ files, rules: pack.rules });
```

진입점은 `@seed-design/cli`의 `seed-design doctor` 커맨드입니다.
