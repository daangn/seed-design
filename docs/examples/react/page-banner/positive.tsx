import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "seed-design/ui/page-banner";

export default function PageBannerPositive() {
  return (
    <div className="w-full grid grid-cols-2 items-start gap-4">
      <PageBanner
        tone="positive"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <PageBanner
        tone="positive"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>등록하기</PageBannerButton>}
      />
      <ActionablePageBanner
        tone="positive"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <ActionablePageBanner
        tone="positive"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="positive"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="positive"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미노출"
        description="사업자 정보를 등록해주세요."
      />
    </div>
  );
}
