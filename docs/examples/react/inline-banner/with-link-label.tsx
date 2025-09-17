import { InlineBanner } from "@/registry/ui/inline-banner";

export default function InlineBannerWithLinkLabel() {
  return (
    <InlineBanner
      description="사업자 정보를 등록해주세요."
      linkProps={{ children: "자세히 보기" }}
    />
  );
}
