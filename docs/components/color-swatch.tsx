"use client";

import { IconCheckmarkClipboardLine, IconCheckmarkFill } from "@karrotmarket/react-monochrome-icon";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface ColorSwatchProps {
  identifier: string;
  lightValue: string;
  darkValue: string;
}

export const ColorSwatch = forwardRef<HTMLButtonElement, ColorSwatchProps>(
  ({ identifier, lightValue, darkValue }, forwardedRef) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const composedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        (buttonRef as RefObject<HTMLButtonElement | null>).current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) (forwardedRef as RefObject<HTMLButtonElement | null>).current = node;
      },
      [forwardedRef],
    );

    function handleClick() {
      if (buttonRef.current) {
        setRect(buttonRef.current.getBoundingClientRect());
      }
      setIsOpen(true);
    }

    useLayoutEffect(() => {
      if (!isOpen || !popupRef.current || !rect) return;
      const el = popupRef.current;
      const popupRect = el.getBoundingClientRect();
      if (popupRect.right > window.innerWidth) {
        el.style.left = "";
        el.style.right = `${window.innerWidth - rect.right}px`;
      }
    }, [isOpen, rect]);

    useEffect(() => {
      if (!isOpen) return;
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") setIsOpen(false);
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const label = identifier.replace("$color.palette.", "");

    return (
      <>
        <button
          ref={composedRef}
          type="button"
          className={`flex-1 h-12 border cursor-pointer hover:opacity-90 transition-opacity ${isOpen ? "border-fd-primary" : "border-fd-border/20"}`}
          style={{ backgroundColor: lightValue }}
          onClick={handleClick}
          title={label}
          aria-label={`${label} 색상 정보 열기`}
        />
        {isOpen &&
          createPortal(
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                aria-label="닫기"
                onClick={() => setIsOpen(false)}
              />
              <div
                ref={popupRef}
                className="fixed z-50 bg-fd-background border border-fd-border rounded-xl shadow-xl p-4 min-w-52"
                style={{
                  top: (rect?.bottom ?? 0) + 8,
                  left: rect?.left ?? 0,
                }}
              >
                <p className="text-sm font-semibold mb-3">{label}</p>
                <CopyRow label="Light" value={lightValue} />
                <CopyRow label="Dark" value={darkValue} />
              </div>
            </>,
            document.body,
          )}
      </>
    );
  },
);
ColorSwatch.displayName = "ColorSwatch";

interface CopyRowProps {
  label: string;
  value: string;
}

const CopyRow = forwardRef<HTMLButtonElement, CopyRowProps>(({ label, value }, ref) => {
  const [copied, onClick] = useCopyButton(() => {
    navigator.clipboard.writeText(value);
  });

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full py-1.5 text-left hover:bg-fd-muted rounded-md px-1 transition-colors group"
    >
      <div
        className="w-5 h-5 rounded-md border border-fd-border/50 flex-none"
        style={{ backgroundColor: value }}
      />
      <span className="text-xs text-fd-muted-foreground flex-none w-8">{label}</span>
      <code className="text-xs flex-1 font-mono">{value}</code>
      {copied ? (
        <IconCheckmarkFill size={14} className="flex-none" />
      ) : (
        <IconCheckmarkClipboardLine
          size={14}
          className="flex-none opacity-0 group-hover:opacity-100 transition-opacity text-fd-muted-foreground"
        />
      )}
    </button>
  );
});
CopyRow.displayName = "CopyRow";
