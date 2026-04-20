import {
  BottomSheet as SeedBottomSheet,
  type BottomSheetBodyProps as SeedBottomSheetBodyProps,
  type BottomSheetContentProps as SeedBottomSheetContentProps,
  type BottomSheetFooterProps as SeedBottomSheetFooterProps,
  type BottomSheetRootProps as SeedBottomSheetRootProps,
  type BottomSheetRootRef as SeedBottomSheetRootRef,
  type BottomSheetTriggerProps as SeedBottomSheetTriggerProps,
} from "@seed-design/lynx-react";
import {
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes,
} from "@lynx-js/react";

export interface BottomSheetRootProps extends SeedBottomSheetRootProps {}

/**
 * @see https://seed-design.io/lynx/components/bottom-sheet
 */
export const BottomSheetRoot: ForwardRefExoticComponent<
  PropsWithoutRef<BottomSheetRootProps> & RefAttributes<SeedBottomSheetRootRef>
> = forwardRef<SeedBottomSheetRootRef, BottomSheetRootProps>((props, ref) => {
  return <SeedBottomSheet.Root ref={ref} {...props} />;
});
BottomSheetRoot.displayName = "BottomSheetRoot";

export interface BottomSheetTriggerProps extends SeedBottomSheetTriggerProps {}

export const BottomSheetTrigger = SeedBottomSheet.Trigger;

export interface BottomSheetContentProps extends Omit<SeedBottomSheetContentProps, "title"> {
  title?: ReactNode;

  description?: ReactNode;

  /**
   * @default false
   */
  showHandle?: boolean;
}

/**
 * Positioner / Backdrop / Handle / Header / Title / Description을 내부에서 조립해
 * 사용자가 단일 컴포넌트로 콘텐츠를 구성할 수 있도록 한다.
 *
 * 웹 BottomSheetContent와 달리 아래는 Lynx에서 미지원:
 * - `showCloseButton` (Tier B: SVG 지원 후 추가 예정)
 * - `aria-label` 기반 VisuallyHidden 제목 fallback (VisuallyHidden 미구현)
 */
export const BottomSheetContent = (props: BottomSheetContentProps) => {
  const { children, title, description, showHandle = false, ...otherProps } = props;

  const shouldRenderHeader = title || description;

  return (
    <SeedBottomSheet.Positioner>
      <SeedBottomSheet.Backdrop />
      <SeedBottomSheet.Content {...otherProps}>
        {showHandle && <SeedBottomSheet.Handle />}
        {shouldRenderHeader && (
          <SeedBottomSheet.Header>
            {title && <SeedBottomSheet.Title>{title}</SeedBottomSheet.Title>}
            {description && (
              <SeedBottomSheet.Description>{description}</SeedBottomSheet.Description>
            )}
          </SeedBottomSheet.Header>
        )}
        {children}
      </SeedBottomSheet.Content>
    </SeedBottomSheet.Positioner>
  );
};

export interface BottomSheetBodyProps extends SeedBottomSheetBodyProps {}

export const BottomSheetBody = SeedBottomSheet.Body;

export interface BottomSheetFooterProps extends SeedBottomSheetFooterProps {}

export const BottomSheetFooter = SeedBottomSheet.Footer;
