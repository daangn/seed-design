import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 복사 버튼 상태. `onCopy`가 끝나면 1.5초 동안 `copied`가 true다.
 * fumadocs-ui `useCopyButton`과 같은 동작이다(R4: fumadocs-ui JS import 제거).
 */
export function useCopyButton(
  onCopy: () => void | Promise<void>,
): [copied: boolean, onClick: () => void] {
  const [copied, setCopied] = useState(false);
  const callbackRef = useRef(onCopy);
  const timeoutRef = useRef<number | undefined>(undefined);
  callbackRef.current = onCopy;

  const onClick = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    void Promise.resolve(callbackRef.current()).then(() => {
      setCopied(true);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
    });
  }, []);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return [copied, onClick];
}
