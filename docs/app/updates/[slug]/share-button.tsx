"use client";

import { IconLink } from "@/components/icons/IconLink";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "seed-design/ui/snackbar";

/**
 * Updates 글 상단 메타(게시일 옆)에 붙는 "공유하기" 컨트롤.
 * - 모바일 등 Web Share API 지원 환경: 네이티브 공유 시트.
 * - 미지원 환경: 현재 URL을 클립보드에 복사하고 스낵바로 안내.
 * 아이콘은 SEED Icons의 링크/체인 글리프(IconLink)를 16px(size-4)로 써, 나란히 놓인
 * 16px(text-base) 날짜 텍스트와 스케일을 맞춘다. 호버 시 "공유하기" 라벨을 띄운다.
 */
export function ArticleShareButton({ title }: { title: string }) {
  return (
    <SnackbarProvider>
      <ShareButtonContent title={title} />
    </SnackbarProvider>
  );
}

function ShareButtonContent({ title }: { title: string }) {
  const adapter = useSnackbarAdapter();

  const showCopiedSnackbar = () => {
    adapter.create({
      timeout: 2000,
      onClose: () => {},
      render: () => <Snackbar message="링크가 복사되었습니다" />,
    });
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // 사용자가 공유 시트를 닫은 경우 등 — 조용히 클립보드 폴백으로 이어진다.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showCopiedSnackbar();
    } catch {
      // 클립보드 접근이 막힌 환경에서는 아무 동작도 하지 않는다.
    }
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="공유하기"
        onClick={() => {
          void handleShare();
        }}
        className="peer inline-flex shrink-0 items-center justify-center rounded-r1 p-x1 text-fg-neutral-muted transition-colors hover:bg-[#CCFFA3] hover:text-[#1A1C20] focus-visible:bg-[#CCFFA3] focus-visible:text-[#1A1C20]"
      >
        <IconLink className="size-4" />
      </button>
      {/* 호버 시 뜨는 "공유하기" 라벨. absolute라 가운데 정렬된 메타 행 레이아웃을 밀지 않는다. */}
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-r1 bg-bg-neutral-solid px-x2 py-x1 text-sm text-fg-neutral-inverted opacity-0 transition-opacity peer-hover:opacity-100">
        공유하기
      </span>
    </span>
  );
}
