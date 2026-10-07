# @seed-design/react-select

## 1.0.3

### Patch Changes

- 363c02a: 화면 끝을 기준으로 위치를 잡는 컴포넌트가 노치·홈 인디케이터·가로 화면의 측면 safe area inset을 피하도록 수정합니다. Backdrop과 시트·패널 배경은 그대로 화면 끝까지 채웁니다.
  
  - Dialog·AlertDialog·BottomSheet·MenuSheet는 좌우 inset을 뺀 영역의 가운데에 놓이고, 너비도 그 영역을 넘지 않습니다. Dialog의 기본 너비(90%)는 그 영역을 기준으로 계산합니다.
  - Dialog·AlertDialog는 위아래 inset도 피합니다. Dialog의 최대 높이는 화면 높이의 80%와 위아래 inset 사이 높이 중 작은 쪽입니다.
  - BottomSheet·MenuSheet의 높이는 화면 높이의 90%를 넘지 않고, 위쪽 inset이 그보다 크면 inset 아래까지로 제한됩니다. 넘친 내용은 시트 안에서 스크롤합니다.
  - SidePanel은 붙는 쪽의 inset만큼 넓어지고, 콘텐츠는 inset 안쪽에 놓입니다. md 미만의 기본 너비(80%)는 좌우 inset을 뺀 너비를 기준으로 계산합니다.
  - HelpBubble·Menu·Select·NavigationMenu는 네 방향의 inset을 피해 위치를 잡고, `overflowPadding`을 화면 끝이 아니라 safe area 경계에서부터 잽니다.

## 1.0.2

### Patch Changes

- 2c79160: `AppScreen`, Dialog처럼 포커스를 가두는 레이어 안에서 Menu, Select, Navigation Menu를 연 채 Tab 키로 트리거 밖으로 이동하면, 포커스가 이동할 요소 대신 레이어 컨테이너로 가던 문제를 수정합니다.
- f1c5545: Menu, NavigationMenu, Select 사용 시, placement가 `left`/`right` 계열일 때 transform origin이 trigger와 맞닿은 모서리를 가리키도록 변경합니다. 이전에는 가로축이 `center`로 남고, `start`/`end` 정렬이 세로축 대신 가로축에 반영됐습니다.

## 1.0.1

### Patch Changes

- 4e5fe66: `@seed-design/react-dismissible-layer`의 최소 요구 버전을 올려 Chrome 92 / iOS Safari 15.4 이전 버전에서 시트나 다이얼로그를 열 때 발생하던 `TypeError: layers.at is not a function` 크래시 수정이 반드시 설치되도록 합니다.

## 1.0.0

### Major Changes

- 4dad2e9: 트리거를 눌러 열리는 목록에서 값을 선택하는 Select 컴포넌트를 추가합니다.

  - `multiple`로 다중 선택을, `SelectGroup`으로 옵션 그룹과 그룹 라벨을 지원합니다.
  - 키보드 탐색을 지원하며, `size`·`disabled`·`readOnly`·`invalid` 상태를 제공합니다.
  - `label`, `description`, `errorMessage`로 Field와 연동되고, `name`으로 폼 제출 값의 키를 지정합니다.

  ```tsx
  <SelectRoot label="과일" defaultValue={["apple"]} name="fruit">
    <SelectTrigger placeholder="과일을 선택하세요" />
    <SelectContent>
      <SelectGroup>
        <SelectItem value="apple" label="사과" />
        <SelectItem value="banana" label="바나나" />
      </SelectGroup>
    </SelectContent>
  </SelectRoot>
  ```

### Patch Changes

- Updated dependencies [4dad2e9]
  - @seed-design/dom-utils@2.1.0
