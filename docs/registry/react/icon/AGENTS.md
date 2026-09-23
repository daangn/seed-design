# docs/registry/react/icon

block이 쓰는 SVG 아이콘을 파일 하나씩 제공하는 React registry다. registry id는 `icon`이고 `hideFromCLICatalog: true`라 CLI 카탈로그에 보이지 않으며, block의 `innerDependencies`로만 설치된다.

## 작업 절차

### 아이콘을 추가할 때

1. `icon-{서비스명}.tsx`를 만든다(예: `icon-facebook.tsx`).
2. `docs/registry/react/registry-icon.ts`의 `items`에 `{ id: "icon-{서비스명}", snippets: [{ path: "icon-{서비스명}.tsx" }] }`를 추가한다. 등록하지 않은 파일을 block이 import하면 registry 생성이 실패한다.
3. block에서 `../icon/icon-{서비스명}`으로 import하고 `bun docs:generate`를 실행한다.

## 규칙

- 파일 하나는 아이콘 컴포넌트 하나만 named export한다. 이름은 `Icon` + PascalCase다(예: `IconFacebook`, `IconKakaoTalk`).
- props는 `React.SVGProps<SVGSVGElement>`를 받아 `<svg>`에 펼친다. 색은 `fill="currentColor"`로 둔다. 형태는 `icon-facebook.tsx:IconFacebook`을 따른다.
