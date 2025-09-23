import { PageBanner, PageBannerButton } from "seed-design/ui/page-banner";

export default function PageBannerWithButton() {
  return (
    <PageBanner
      description="사업자 정보를 등록해주세요."
      suffix={<PageBannerButton>자세히 보기</PageBannerButton>}
    />
  );
}
