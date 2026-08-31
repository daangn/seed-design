---
"@seed-design/cli": patch
---

`docs`가 문서 경로만 해석하고, 이름 검색은 새 `docs-search` 명령이 맡습니다.

`docs`는 지금까지 한 명령 안에 성격이 다른 두 계약을 담고 있었습니다. 경로를 정확히 지목하는 조회와, 이름 조각으로 문서를 찾아 주는 검색입니다. 뒤엣것이 앞엣것의 답을 조용히 바꾸기 때문에, 받은 문서가 내가 지목한 문서인지 확인할 방법이 없었습니다. 이제 두 계약이 두 명령으로 나뉩니다.

## docs

받는 값이 문서 경로로 좁혀집니다. 문서 사이트 주소에서 도메인만 뺀 경로를 그대로 넣으면 됩니다.

```sh
seed-design docs                                       # 카테고리 목록
seed-design docs react                                 # 섹션 목록
seed-design docs react/components                      # 문서 목록
seed-design docs react/components/action-button        # 그 문서의 내용
seed-design docs react/components/layout/box           # 더 깊은 문서도 같은 방식
seed-design docs react/overview                        # 카테고리 개요 문서
```

경로는 인덱스가 발행하는 값 그대로입니다. 이전에는 `카테고리/섹션/항목`으로 다시 조립한 값이었는데, 섹션이 문서 경로의 첫 조각으로 묶이기 때문에 그보다 깊은 문서는 중간 조각이 사라졌습니다. 사이트에서 `/react/components/layout/box`인 문서가 `react/components/box`가 되고, `concepts/composition`과 `iconography/composition`은 둘 다 `react/components/composition`이 되어 뒤쪽 문서는 어떤 질의로도 열 수 없었습니다. 목록에 출력되는 경로도 같은 값이라, 화면에 찍힌 줄을 그대로 다시 넣으면 그 문서가 나옵니다.

## docs-search

이름과 제목으로 문서를 찾아 경로와 제목을 출력합니다. 결과가 여러 개인 것은 정상이므로 종료 코드는 `0`이고, 하나도 없을 때만 `1`입니다.

```sh
$ seed-design docs-search action-button
components/action-button                 Action Button
react/components/action-button           Action Button
lynx/components/action-button            Action Button
...
```

출력된 경로는 `docs`가 그대로 받는 값입니다. 이름으로 찾아서 경로로 여는 흐름이 두 명령으로 이어집니다.

**동작 변경**: `seed-design docs action-button`처럼 이름만 넣는 입력이 실패합니다. 대신 그 이름을 가진 경로를 모두 알려주므로, 그중 하나를 다시 넣거나 `seed-design docs-search action-button`을 쓰면 됩니다.

**동작 변경**: `docs`가 설정 파일의 `framework`와 `-f, --framework` 옵션을 더 이상 보지 않습니다. 이전에는 이 값이 이름 앞에 붙어서, 같은 명령이 실행한 디렉토리에 따라 다른 문서를 냈습니다.

**동작 변경**: `docs`의 종료 코드가 `0`과 `1` 두 개로 줄어듭니다. 경로는 유일하므로 여러 후보를 뜻하던 `2`가 필요 없어졌습니다.

**동작 변경**: `ui:checkbox`처럼 레지스트리 키를 넣는 입력을 더 이상 받지 않습니다. 레지스트리 항목과 문서는 일대일로 대응하는 개념이 아니어서, 대응하는 문서가 없는 항목이 엉뚱한 문서로 연결될 수 있었습니다. 스니펫은 이전과 같이 `seed-design add ui:checkbox`로 받습니다.
