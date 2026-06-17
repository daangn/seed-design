import { getGuidelinesByTarget, type GuidelineScope, type GuidelineType } from "./data";
import { GuidelineCard } from "./guideline-card";

interface GuidelinesProps {
  /** 파일명(확장자 제외). 예: "action-button" */
  target: string;
  /** 기본값 component */
  scope?: GuidelineScope;
  /** do/dont 중 하나만 보고 싶을 때 필터 */
  type?: GuidelineType;
}

/**
 * 한 target의 가이드라인 전체를 do/dont 카드 섹션으로 렌더한다.
 * 데이터는 packages/guidelines의 YAML(SSOT)에서 직접 읽는다.
 */
export function Guidelines({ target, scope = "component", type }: GuidelinesProps) {
  const items = getGuidelinesByTarget(target, scope).filter((item) => !type || item.type === type);

  return (
    <div className="flex flex-col gap-2 not-prose my-4">
      {items.map((item) => (
        <GuidelineCard key={item.id} item={item} />
      ))}
    </div>
  );
}
