export type Article = {
  id: number;
  title: string;
  content: string;
  author: string;
  categoryId: string;
  createdAt: string;
  isPopular?: boolean;
};

export type Category = {
  id: string;
  name: string;
};

export const CATEGORIES: Category[] = [
  { id: "travel", name: "여행" },
  { id: "food", name: "음식" },
  { id: "lifestyle", name: "라이프스타일" },
];

export const ARTICLES: Article[] = [
  {
    id: 1,
    title: "산토리니의 일몰",
    content:
      "에게해의 푸른 바다와 하얀 건물들 사이로 지는 석양이 만드는 황홍빛 풍경. 산토리니에서 가장 로맨틱한 순간을 만날 수 있다.",
    author: "mollit",
    categoryId: "travel",
    createdAt: "2023-02-15T09:30:00Z",
  },

  {
    id: 2,
    title: "교토의 대나무 숲",
    content:
      "아라시야마의 대나무 숲길을 걸으며 느끼는 고요함. 바람에 흔들리는 대나무 소리가 마음을 평온하게 만든다.",
    author: "sunt",
    categoryId: "travel",
    createdAt: "2023-05-22T14:15:00Z",
    isPopular: true,
  },

  {
    id: 3,
    title: "알프스 하이킹 가이드",
    content:
      "스위스 알프스의 초보자용 트레킹 코스. 그린델발트에서 시작하여 아이거 북벽을 감상하며 2시간 코스로 즐길 수 있다.",
    author: "ullamco",
    categoryId: "travel",
    createdAt: "2023-10-15T12:10:00Z",
  },
  {
    id: 4,
    title: "홈메이드 파스타의 비밀",
    content:
      "신선한 면과 소스만 있다면 레스토랑 급 파스타를 만들 수 있다. 올리브오일과 마늘의 양이 맛을 결정한다.",
    author: "dolore",
    categoryId: "food",
    createdAt: "2023-03-30T16:20:00Z",
  },

  {
    id: 5,
    title: "제철 딸기 고르는 법",
    content:
      "봄철 딸기는 꼭지가 선명한 초록색이어야 한다. 윤기 나는 빨간색과 은은한 향기가 좋은 딸기의 조건.",
    author: "aliqua",
    categoryId: "food",
    createdAt: "2023-06-18T10:05:00Z",
  },

  {
    id: 6,
    title: "커피 브루잉 팁",
    content:
      "물 온도 92도, 분쇄도는 중간, 추출 시간 3분이 기본. 원두 양은 물 200ml당 15g이 황금비율이다.",
    author: "consectetur",
    categoryId: "food",
    createdAt: "2023-09-25T13:40:00Z",
  },

  {
    id: 7,
    title: "미니멀 홈 데코",
    content:
      "불필요한 소품은 과감히 정리하고, 화이트 톤의 기본 가구만으로 깔끔한 공간을 연출할 수 있다.",
    author: "adipisicing",
    categoryId: "lifestyle",
    createdAt: "2023-04-12T15:55:00Z",
    isPopular: true,
  },

  {
    id: 8,
    title: "아침 루틴의 힘",
    content:
      "하루를 5분 일찍 시작하는 것부터. 따뜻한 물 한잔과 스트레칭으로 활기찬 아침을 맞이하자.",
    author: "elit",
    categoryId: "lifestyle",
    createdAt: "2023-07-28T08:25:00Z",
    isPopular: true,
  },

  {
    id: 9,
    title: "실내 공기 정화 식물",
    content:
      "스투키, 스파티필름, 산세베리아는 관리가 쉽고 공기정화 능력이 뛰어난 대표적인 실내식물이다.",
    author: "exercitation",
    categoryId: "lifestyle",
    createdAt: "2023-08-07T11:45:00Z",
  },

  {
    id: 10,
    title: "독서 습관 만들기",
    content:
      "하루 10페이지부터 시작하자. 취침 전 20분 독서는 수면의 질도 높여주는 일석이조 습관이다.",
    author: "magna",
    categoryId: "lifestyle",
    createdAt: "2023-12-03T17:35:00Z",
    isPopular: true,
  },
];
