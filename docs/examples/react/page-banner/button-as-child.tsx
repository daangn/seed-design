import { PageBanner, PageBannerButton } from "seed-design/ui/page-banner";

export default function PageBannerButtonAsChild() {
  return (
    <PageBanner
      description="사업자 정보를 등록해주세요."
      suffix={
        <PageBannerButton asChild>
          <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
            새 탭에서 열기
          </a>
        </PageBannerButton>
      }
    />
  );
}
