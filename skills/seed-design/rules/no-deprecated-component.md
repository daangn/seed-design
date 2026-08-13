# No Deprecated Component

deprecated 컴포넌트의 import·설치된 deprecated 스니펫·deprecated 토큰과 옵션 사용을 판정합니다. severity: `warn`.

## 왜

deprecated 항목은 다음 메이저에서 제거됩니다. 지금 당장 동작이 깨지진 않지만, 업그레이드하려면 먼저 정리해야 합니다. 어떤 버전에서 제거되는지와 대체안은 문서가 출처입니다 — **기억으로 판정하지 말고 문서를 읽고 대조합니다.**

## 판정 방법

1. 출처 문서를 읽어 deprecated 목록과 대체안을 확보합니다. 출처는 둘이고, 담는 것이 다릅니다:
   - **컴포넌트 옵션·토큰**: deprecation 현황 문서 (아래 "읽어야 할 문서")
   - **컴포넌트 자체**: registry 인덱스(`https://seed-design.io/__registry__/{framework}/{registryId}/index.json`)의 **`deprecated: true` 플래그**. 현황 문서에는 컴포넌트가 한 줄도 없습니다.

   대체안은 registry에 없으므로 rootage(`packages/rootage/components/{id}.yaml`의 `metadata.deprecated` 문자열)나 업그레이드 가이드에서 찾습니다.

   현황 문서에는 **"제거 완료 히스토리"** 표도 있습니다. **설치본이 그 제거 버전보다 낮으면 이 표도 검사 대상입니다** — 지금은 정상 동작하지만 업그레이드하는 순간 깨지는 것들이고, 그게 정확히 이 진단이 미리 알려줘야 할 내용입니다. 설치본이 제거 버전 이상이면 이미 지나간 일이니 건너뜁니다.

   **어느 패키지의 설치본과 비교할지는 항목마다 다릅니다.** 토큰과 스타일 API는 선택된 Doctor 프로필의 스타일링 패키지, 컴포넌트와 옵션은 구현 패키지 기준입니다. 두 패키지 버전이 갈린 프로젝트에서는 이걸 섞으면 판정이 틀립니다.
2. **패키지 import 검사**: 선택된 Doctor 프로필의 구현 패키지에서 import하는 이름을 deprecated 컴포넌트 이름과 대조합니다. 매칭은 이름의 공백을 뺀 **prefix 매칭 + 최장 일치 우선**입니다 — `ActionSheetItem`은 `action-sheet`가 아니라 `action-sheet-item`으로 매칭돼야 합니다.
3. **설치 스니펫 검사**: 스니펫 디렉토리에 deprecated 항목의 파일이 설치돼 있는지 경로로 판정합니다. 스니펫 디렉토리 **내부** 파일이 패키지에서 deprecated 컴포넌트를 import하거나 deprecated 옵션을 구현하는 건 검사하지 않습니다 — 스니펫이 패키지를 감싸는 건 정당한 사용이고, 스니펫 내부 문제는 재설치([snippet-generation](./snippet-generation.md))로 해소됩니다.
4. **토큰·옵션 검사**: 현황 문서의 deprecated 토큰과 컴포넌트 옵션을 **앱 코드**에서 사용하는지 검사합니다.

   토큰은 **문서 표기 그대로 찾으면 안 됩니다.** 같은 토큰이 코드에서 세 가지 형태로 나타나므로 전부 확인합니다.

   | 표기 | 예 | 나타나는 곳 |
   |------|-----|------------|
   | 문서(kebab) | `$color.bg.layer-fill` | 문서·rootage |
   | 코드(camelCase) | `vars.$color.bg.layerFill` | 선택된 프로필의 스타일링 패키지 vars import |
   | CSS 변수 | `--seed-color-bg-layer-fill` | 직접 작성한 CSS·인라인 스타일 |

   문서 표기만 grep하면 실제로 쓰고 있어도 0건이 나와 **조용히 통과합니다.**

## 수정 방법

**문서의 "대체안" 열을 먼저 보고 갈라집니다.** 대체안이 `-`인 항목(토큰·옵션에 흔합니다)에 "대체 컴포넌트로 교체하세요"라고 안내하면 존재하지 않는 것을 가리키게 됩니다.

**대체안이 있으면** 그것으로 교체합니다. 스니펫이 deprecated인 경우 대체 스니펫을 설치하고 기존 파일의 커스터마이징을 옮깁니다.

```bash
npx @seed-design/cli@latest add --on-diff backup {registryId}:{대체 itemId}
```

**대체안 칸이 컴포넌트 이름이 아닐 때**는 그 칸이 시키는 대로 안내합니다.

- **"제거 (…)"** — 제거된 prop이 하던 일을 라이브러리가 이미 표준 동작으로 합니다. 괄호 안이 그 설명입니다(예: Snackbar `shouldCloseOnAction`의 대체안 칸은 `제거 (자동 닫힘이 표준 동작)`). 옵션만 지우면 됩니다.
- **수동 마이그레이션** — 문서의 비고란에 절차가 적혀 있으면 그것을 인용합니다.
- **`-` (아직 대체안이 없음)** — 지금 할 수 있는 게 없다는 사실과 **제거 예정 버전**을 알리고, 문서를 추적하라고 안내합니다. 실제로 `-`인 것은 AppBar `divider`, BottomSheet `direction`, Drawer의 두 옵션, `$color.bg.layer-fill`입니다. 대안 없이 "고치세요"라고만 하면 사용자가 할 수 있는 게 없습니다. 이 경우 **업그레이드 경로의 함정을 함께 확인합니다** — 제거됐다가 되살아난 항목이 있어(`$color.bg.layer-fill`은 css 2.0.0에서 제거·2.1.0에서 복구) 중간 버전을 건너뛰어야 할 수 있습니다.

## 읽어야 할 문서

- [Deprecated 현황](https://seed-design.io/llms/docs/migration/deprecations.txt)
- 선택된 Doctor 프로필의 업그레이드·호환 문서
