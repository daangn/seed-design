import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  direction?: "left" | "right";
  className?: string;
}

export function ResizeHandle({ onResize, direction = "left", className }: ResizeHandleProps) {
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startX.current = e.clientX;
      isDragging.current = true;

      function onMouseMove(ev: MouseEvent) {
        if (!isDragging.current) return;
        const delta = ev.clientX - startX.current;
        startX.current = ev.clientX;
        // "left" means dragging left edge: moving left = grow, moving right = shrink
        onResize(direction === "left" ? -delta : delta);
      }

      function onMouseUp() {
        isDragging.current = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onResize, direction],
  );

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        "group relative z-10 w-1 shrink-0 cursor-col-resize",
        "before:absolute before:inset-y-0 before:-left-1 before:-right-1 before:content-['']",
        "after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border after:transition-colors after:content-['']",
        "hover:after:bg-primary/40 active:after:bg-primary/60",
        className,
      )}
    >
      {/* Visible drag indicator on hover */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-px">
          <div className="h-6 w-px rounded-full bg-muted-foreground/30" />
          <div className="h-6 w-px rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    </div>
  );
}
