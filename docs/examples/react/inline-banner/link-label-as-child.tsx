import { InlineBanner } from "seed-design/ui/inline-banner";

export default function InlineBannerLinkLabelAsChild() {
  return (
    <InlineBanner
      description="사업자 정보를 등록해주세요."
      linkProps={{
        asChild: true,
        children: (
          <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
            자세히 보기
          </a>
        ),
      }}
    />
  );
}
