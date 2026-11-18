/**
 * LLMS.txt 메뉴(링크 복사·내용 복사·열기)와 복사 snackbar. `PageActions.tsx`가 사용자가 버튼에 다가갈 때 lazy로 받는다
 * (SEED Menu·floating-ui·snackbar가 첫 로드 JS에 들지 않게).
 */
import { IconSquare2StackedLine } from "@karrotmarket/react-monochrome-icon";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { IconLink } from "@/components/icons/IconLink";
import {
  DocsMenuContent,
  DocsMenuGroup,
  DocsMenuItem,
  DocsMenuRoot,
  DocsMenuTrigger,
} from "@/components/docs-menu";
import { useState } from "react";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { PageActionsButton } from "./PageActions";

const cache = new Map<string, string>();

export default function PageActionsMenu({
  markdownUrl,
  defaultOpen,
}: {
  /** 페이지의 원문 Markdown URL(루트 상대 경로). */
  markdownUrl: string;
  /** 정적 버튼을 눌러 받았으면 열린 채로 시작한다. */
  defaultOpen: boolean;
}) {
  return (
    <SnackbarProvider>
      <LLMOptionsContent markdownUrl={markdownUrl} defaultOpen={defaultOpen} />
    </SnackbarProvider>
  );
}

function LLMOptionsContent({
  markdownUrl,
  defaultOpen,
}: {
  markdownUrl: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [isLoading, setLoading] = useState(false);
  const adapter = useSnackbarAdapter();

  const showCopiedSnackbar = (message: string) => {
    adapter.create({
      timeout: 2000,
      onClose: () => {},
      render: () => <Snackbar message={message} />,
    });
  };

  // markdownUrl은 루트 상대 경로(`/llms/...`)라 그대로 복사하면 붙여넣는 쪽에서 못 연다.
  const handleCopyUrlClick = async () => {
    setOpen(false);

    await navigator.clipboard.writeText(new URL(markdownUrl, window.location.href).href);
    showCopiedSnackbar("링크가 복사되었습니다");
  };

  const handleCopyClick = async () => {
    setOpen(false);

    const cached = cache.get(markdownUrl);
    if (cached) {
      await navigator.clipboard.writeText(cached);
      showCopiedSnackbar("내용이 복사되었습니다");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(markdownUrl);
      const content = await res.text();

      cache.set(markdownUrl, content);
      await navigator.clipboard.writeText(content);
      showCopiedSnackbar("내용이 복사되었습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenClick = () => {
    window.open(markdownUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <DocsMenuRoot open={open} onOpenChange={setOpen} placement="bottom-end">
      <DocsMenuTrigger asChild>
        <PageActionsButton open={open} />
      </DocsMenuTrigger>
      <DocsMenuContent>
        <DocsMenuGroup>
          <DocsMenuItem
            label="링크 복사"
            suffixIcon={<IconLink />}
            onClick={() => {
              void handleCopyUrlClick();
            }}
          />
          <DocsMenuItem
            disabled={isLoading}
            label="내용 복사"
            suffixIcon={<IconSquare2StackedLine />}
            onClick={() => {
              void handleCopyClick();
            }}
          />
          <DocsMenuItem
            label="열기"
            suffixIcon={<IconSeedArrow external />}
            onClick={handleOpenClick}
          />
        </DocsMenuGroup>
      </DocsMenuContent>
    </DocsMenuRoot>
  );
}
