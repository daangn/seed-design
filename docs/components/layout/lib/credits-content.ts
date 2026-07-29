/**
 * /credits 페이지의 기여자 명단 데이터.
 * 명단·문구 변경은 이 파일에서만 한다(프레젠테이션은 app/credits/).
 *
 * 표기는 사내 호칭을 그대로 쓴다. `koreanName`·`link`는 본인이 원할 때만 채우는
 * 옵셔널 필드다 — 표기 방식을 기여자 재량에 맡기는 건 Vue 팀 페이지나
 * All Contributors 스펙과 같은 관습이다. 커밋 기록이 없는 기여자(디자이너 등)가
 * 명단에 포함되므로 이 목록은 git log에서 생성할 수 없고, 수동으로 관리한다.
 *
 * **배열 순서가 곧 표시 순서이며, 기준은 디자인 시스템 팀 합류 순서다.**
 * 입사일과는 일치하지 않으므로(입사가 빨라도 팀 합류가 늦을 수 있다) 자동 정렬하지 않는다.
 * 새 사람은 합류 시점에 해당하는 위치에 끼워 넣는다.
 */

export interface Contributor {
  /** 표시 이름. 사내 호칭 그대로 쓴다. */
  name: string;
  /** 한국어 이름. 본명은 개인정보라 본인 동의를 받은 경우에만 채운다 — 없으면 렌더하지 않는다. */
  koreanName?: string;
  /** GitHub·개인 사이트 등. 없으면 이름만 렌더한다. */
  link?: string;
}

export interface CreditsGroup {
  title: string;
  contributors: Contributor[];
}

export const CREDITS_TITLE = "Credits";
export const CREDITS_DESCRIPTION = "SEED는 이 사람들의 손을 거쳐 자랐어요.";

/** 현재 SEED를 유지보수하고 있는 사람들. */
const MAINTAINERS: Contributor[] = [
  { name: "June.jung", koreanName: "정현수" },
  { name: "Max.kim", koreanName: "김동규" },
  { name: "Lucas", koreanName: "신현성" },
  { name: "Tyler.joo", koreanName: "주찬휘" },
  { name: "Minnie.kim", koreanName: "김민효" },
  { name: "Zen", koreanName: "김지수" },
  { name: "Tony.kim", koreanName: "김주성" },
  { name: "Antonio", koreanName: "정승원" },
  { name: "Owen.lee", koreanName: "이건우" },
  { name: "Ette", koreanName: "이찬희" },
];

/** 재직 중이지만 현재 유지보수에 참여하지 않는 사람 + 제작에 도움을 준 사람. */
const CONTRIBUTORS: Contributor[] = [
  { name: "Tony", koreanName: "원지혁" },
  { name: "Journy", koreanName: "김지현" },
  { name: "Iseo", koreanName: "박이서" },
  { name: "Dion", koreanName: "국도연" },
  { name: "Hiko", koreanName: "박시은" },
];

export const CREDITS_GROUPS: CreditsGroup[] = [
  { title: "Maintainers", contributors: MAINTAINERS },
  { title: "Contributors", contributors: CONTRIBUTORS },
];
