import { Box } from "@seed-design/react";
import type { ReactNode } from "react";

// 여러 열린 모달을 함께 표시하는 외형 표에만 적용한다. 실제 동작 Story에는 사용하지 않는다.
export function ModalVisualPreview({
  children,
  width,
  constrainDialogWidth = false,
}: {
  children: ReactNode;
  width?: "400px";
  constrainDialogWidth?: boolean;
}) {
  return (
    <Box
      p="x4"
      width={width}
      data-modal-visual-preview
      data-constrain-dialog-width={constrainDialogWidth || undefined}
    >
      <style>{`
        [data-modal-visual-preview] :is(.seed-content-dialog__positioner, .seed-bottom-sheet__positioner, .seed-side-panel__positioner) {
          position: relative !important;
          inset: unset !important;
        }
        [data-modal-visual-preview] .seed-bottom-sheet__positioner { display: block !important; }
        [data-modal-visual-preview] :is(.seed-content-dialog__backdrop, .seed-bottom-sheet__backdrop, .seed-side-panel__backdrop) { display: none !important; }
        [data-modal-visual-preview] :is(.seed-content-dialog__content, .seed-bottom-sheet__content, .seed-side-panel__content) {
          animation: none !important;
          transition: none !important;
          transform: none !important;
          will-change: auto !important;
        }
        [data-modal-visual-preview] :is(.seed-bottom-sheet__content, .seed-side-panel__content) {
          position: relative !important;
          inset: unset !important;
          width: 100% !important;
          height: auto !important;
          flex: none !important;
        }
        [data-modal-visual-preview] .seed-side-panel__content { max-width: 100% !important; }
        [data-modal-visual-preview] .seed-side-panel__content::after { display: none !important; }
        [data-modal-visual-preview] .seed-bottom-sheet__content::after { height: unset !important; }
        [data-modal-visual-preview][data-constrain-dialog-width] .seed-content-dialog__content {
          width: 100% !important;
          max-width: 100% !important;
        }
      `}</style>
      {children}
    </Box>
  );
}
