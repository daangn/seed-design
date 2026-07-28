/**
 * 코드 식별자 ↔ 컴포넌트 문서 이름이 어긋나는 예외들.
 *
 * **판정 기준은 여기 두지 않는다.** 기준은 가이드라인 문서(`/llms/components/{id}.txt`)에
 * 있고 에이전트가 그걸 읽는다 — 룰에 베껴 두면 문서를 고쳐도 판정이 따라오지 않는다.
 * 새 컴포넌트에 검토를 켜고 싶으면 여기가 아니라 **가이드라인 문서에 Guidelines를 쓰면 된다.**
 *
 * 기본 규칙은 rootage `name`에서 공백을 뺀 뒤 prefix 매칭이다("Bottom Sheet" →
 * `BottomSheet*`가 `BottomSheetRoot`·`BottomSheetContent`를 다 잡는다). 그 규칙으로
 * 안 잡히는 리네이밍만 여기 적는다.
 */
export const IDENTIFIER_OVERRIDES: Record<string, string[]> = {
  // rootage/문서 이름은 "Floating Action Button"인데 export는 Fab / ExtendedFab
  "floating-action-button": ["Fab", "ExtendedFab", "FloatingActionButton"],
};
