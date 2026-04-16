import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShiki } from "@/hooks/useShiki";
import { cn } from "@/lib/utils";

interface CodePreviewProps {
  code: string;
  lang: string;
  className?: string;
}

export function CodePreview({ code, lang, className }: CodePreviewProps) {
  const { highlight, isReady } = useShiki();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    const result = highlight(code, lang);
    setHtml(result);
  }, [code, lang, isReady, highlight]);

  return (
    <ScrollArea className={cn("h-full", className)}>
      {html ? (
        <div
          className="shiki-container p-4"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is trusted
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-4 font-mono text-[11px] leading-relaxed text-foreground/70 whitespace-pre-wrap">
          {code}
        </pre>
      )}
    </ScrollArea>
  );
}
