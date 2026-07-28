/** rootage `metadata.deprecated`가 선언된 컴포넌트 */
export interface DeprecatedComponent {
  /** rootage 컴포넌트 id. 예: "fab" */
  id: string;
  /** rootage 표시 이름. 예: "Action Sheet" */
  name: string;
  /** 대체 안내 문구. 예: "Use contextual-floating-button instead." */
  message?: string;
}

/** registry에서 `deprecated: true`로 표시된 스니펫 아이템 */
export interface DeprecatedSnippetItem {
  registryId: string;
  itemId: string;
  /** 설치 경로 후보 (jsx/js 변형 포함). registryId 디렉토리 기준 상대 경로 */
  snippetPaths: string[];
  message?: string;
}

/** rootage ComponentSpec의 variant 스키마 (유효 값 목록) */
export interface ComponentVariantSpec {
  id: string;
  name: string;
  /** variant 이름 → 유효 값 목록. 예: { variant: ["brandSolid", ...], size: [...] } */
  variants: Record<string, string[]>;
}

/** registry의 스니펫 아이템. `requires`는 해당 세대가 요구하는 패키지 버전 범위. */
export interface SnippetItem {
  registryId: string;
  itemId: string;
  /** 설치 경로 후보 (jsx/js 변형 포함). registryId 디렉토리 기준 상대 경로 */
  snippetPaths: string[];
  /** 예: { "@seed-design/react": "^2.0.0" } */
  requires: Record<string, string>;
}

export interface SeedDoctorKnowledge {
  /** 전체 rootage 컴포넌트 (id + 표시 이름) */
  components: Array<{ id: string; name: string }>;
  deprecatedComponents: DeprecatedComponent[];
  deprecatedSnippetItems: DeprecatedSnippetItem[];
  componentVariantSpecs: ComponentVariantSpec[];
  /** deprecated 여부와 무관한 전체 스니펫 아이템 */
  snippetItems: SnippetItem[];
}
