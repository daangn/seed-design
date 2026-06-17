import { getGuidelineById } from "./data";
import { GuidelineCard } from "./guideline-card";

interface GuidelineRefProps {
  /** 참조할 가이드라인 id. 예: "G-C-action-button-001" */
  id: string;
}

/**
 * 특정 가이드라인 하나를 id로 인용해 렌더한다("한 곳에 정의 → 다른 곳에서 참조").
 * id에 scope/target이 인코딩돼 있어 어느 문서에서든 단일 조회가 가능하다.
 */
export function GuidelineRef({ id }: GuidelineRefProps) {
  const item = getGuidelineById(id);

  if (!item) {
    return (
      <span className="font-mono text-sm text-fg-critical-contrast bg-bg-critical-weak rounded-r1 px-1">
        [{id} 없음]
      </span>
    );
  }

  return <GuidelineCard item={item} />;
}
