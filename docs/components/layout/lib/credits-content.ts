export interface Contributor {
  name: string;
  koreanName?: string;
}

export interface CreditsGroup {
  title: string;
  contributors: Contributor[];
}

export const CREDITS_TITLE = "Credits";
export const CREDITS_DESCRIPTION = "SEED는 이 사람들의 손을 거쳐 자랐어요.";

const MAINTAINERS: Contributor[] = [
  { name: "June.jung", koreanName: "정현수" },
  { name: "Max.kim", koreanName: "김동규" },
  { name: "Lucas", koreanName: "신현성" },
  { name: "Tyler.joo", koreanName: "주찬휘" },
  { name: "Minnie.kim", koreanName: "김민효" },
  { name: "Tony.kim", koreanName: "김주성" },
  { name: "Antonio", koreanName: "정승원" },
  { name: "Owen.lee", koreanName: "이건우" },
  { name: "Ette", koreanName: "이찬희" },
];

const CONTRIBUTORS: Contributor[] = [
  { name: "Tony", koreanName: "원지혁" },
  { name: "Journy", koreanName: "김지현" },
  { name: "Ray", koreanName: "오강훈" },
  { name: "Zen", koreanName: "김지수" },
  { name: "Gina", koreanName: "조은진" },
  { name: "Iseo", koreanName: "박이서" },
  { name: "Dion", koreanName: "국도연" },
  { name: "Hiko", koreanName: "박시은" },
];

export const CREDITS_GROUPS: CreditsGroup[] = [
  { title: "Maintainers", contributors: MAINTAINERS },
  { title: "Contributors", contributors: CONTRIBUTORS },
];
