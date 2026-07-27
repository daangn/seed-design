---
"@seed-design/cli": minor
---

`compat` 명령이 설치된 seed 패키지들 간의 peer 호환성을 진단합니다.

- node_modules에 실제로 해소된 버전을 읽어 compat manifest(선언 ⊕ overlay)로 판정합니다.
- manifest에 없는 버전(스냅샷 이후 릴리즈)은 설치본 package.json의 peer 선언으로 대신 판정하고, 그마저 없으면 unchecked로 보고해 조용히 통과시키지 않습니다.
- `--with pkg@version`으로 설치본 대신 가정한 버전 조합을 조회할 수 있습니다.
- `--json`으로 에이전트/CI가 소비할 수 있는 구조화 출력을 제공합니다. 위반에는 방향(`installed-too-low`/`installed-too-high`)이 표시되고, 대상을 올려서 풀리는 위반에만 resolution을 제안합니다.
- manifest를 가져오지 못해(미지원 프레임워크·오프라인) 패키지 검사를 못 한 경우 `--json`의 `packagesUnchecked`에 사유가 담기고, 사람용 출력도 "이슈 없음"으로 끝내지 않습니다.
