import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "seed-design/ui/page-banner";

export default function PageBannerNeutral() {
  return (
    <div className="w-full grid grid-cols-2 items-start gap-4">
      <PageBanner
        tone="neutral"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미등록"
        description="사업자 정보를 등록해주세요. Fugiat nulla laboris consectetur quis sunt tempor Lorem. Occaecat velit ullamco duis sit occaecat amet velit pariatur aliquip anim velit sit. Do culpa ullamco tempor ad Lorem nostrud elit minim irure excepteur cupidatat exercitation dolore."
        suffix={<PageBannerButton>foobar</PageBannerButton>}
      />
      <PageBanner
        tone="neutral"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미등록"
        description="사업자 정보를 등록해주세요."
        suffix={<PageBannerButton>foobar</PageBannerButton>}
      />
      <ActionablePageBanner
        tone="neutral"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미등록"
        description="사업자 정보를 등록해주세요. Fugiat nulla laboris consectetur quis sunt tempor Lorem. Occaecat velit ullamco duis sit occaecat amet velit pariatur aliquip anim velit sit. Do culpa ullamco tempor ad Lorem nostrud elit minim irure excepteur cupidatat exercitation dolore."
      />
      <ActionablePageBanner
        tone="neutral"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미등록"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="neutral"
        variant="weak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미등록"
        description="사업자 정보를 등록해주세요."
      />
      <DismissiblePageBanner
        tone="neutral"
        variant="solid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        title="미등록"
        description="사업자 정보를 등록해주세요."
      />
    </div>
  );
}
