---
"@seed-design/cli": minor
---

`docs`가 문서 경로를 llms.txt 내용으로 답합니다. `--raw` 옵션을 제거합니다.

문서 하나를 지목했을 때 나오던 링크 세 줄은 그 다음에 할 일이 늘 정해져 있었습니다. 링크를 받아서 하는 일이 결국 그 주소를 다시 요청하는 것이라면, 처음부터 내용을 주는 편이 짧습니다. 그래서 `--raw`가 하던 일이 기본 동작이 되고, 옵션은 사라집니다.

```sh
seed-design docs list                                       # 카테고리 목록
seed-design docs list react/                                # 그 아래 목록
seed-design docs read /react/components/action-button       # 그 문서의 llms.txt 내용
seed-design docs read /react/updates/changelog/react/1.2.5  # 문서 목록에 없는 주소도 그대로
```

목록은 `docs list`가 stdout으로 출력하고 종료 코드 `0`으로 끝납니다. 출력된 주소를 `docs read`에 그대로 다시 넣으면 그 문서의 내용이 나옵니다.

**동작 변경**: `--raw` 옵션을 넘기면 `Unknown option --raw`로 실패합니다. 스크립트에서 쓰고 있었다면 옵션만 지우면 되고, 출력은 이전 `--raw`와 같습니다.

**동작 변경**: `--raw`와 함께 카테고리·섹션 경로를 넣었을 때 stdout을 비우고 종료 코드 `1`로 끝나던 동작이 없어집니다. 이제 `docs list`가 그 목록을 stdout으로 내보내고 `0`으로 끝납니다.

**동작 변경**: 문서 목록에 없는 주소가 문서 사이트에도 없으면, 시도한 URL을 나열하는 대신 비슷한 주소를 제안합니다. 경로를 잘못 넣은 경우에 받던 안내를 이 경우에도 받습니다.
