import Image from "next/image";
import Link from "next/link";
import { RootProvider } from "fumadocs-ui/provider";

export default function NotFound() {
  return (
    <RootProvider>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-fd-background text-fd-foreground px-4">
        <Image src="/favicon.svg" alt="" width={36} height={32} aria-hidden />

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium text-fd-muted-foreground">404</p>
          <h1 className="text-2xl font-bold tracking-tight">페이지를 찾을 수 없어요</h1>
          <p className="text-sm text-fd-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동됐어요.
          </p>
        </div>

        <Link
          href="/docs"
          className="rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-80"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </RootProvider>
  );
}
