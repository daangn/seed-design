import { createSectionIndexRoute } from "@/app/_llms/section-index";
import { getUpdatesSource } from "@/app/source";

export const revalidate = false;

/** publishedAt은 프론트매터 파싱에 따라 문자열/Date 양쪽으로 온다. */
const publishedTime = (page: { data: { frontmatter: { publishedAt?: string | Date } } }) =>
  page.data.frontmatter.publishedAt ? new Date(page.data.frontmatter.publishedAt).getTime() : 0;

export const GET = createSectionIndexRoute({
  section: "updates",
  getSource: getUpdatesSource,
  listHeading: "Posts",
  // 글 목록이라 slug 알파벳순은 의미가 없다. 발행일 최신순으로 세운다.
  sort: (a, b) => publishedTime(b) - publishedTime(a),
  related: ["react"],
  extraRelated: [
    {
      label: "Changelog",
      path: "/llms/react/updates/changelog.txt",
      description: "패키지별/버전별 변경 이력",
    },
  ],
});
