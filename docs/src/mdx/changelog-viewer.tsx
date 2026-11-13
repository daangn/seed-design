/** `ChangelogViewer`에 URL 상태 adapter를 붙인다(기존 Next 앱은 레이아웃의 `NuqsAdapter`가 감쌌다). */
import { NuqsAdapter } from "nuqs/adapters/react";
import type { ComponentProps } from "react";
import { ChangelogViewer } from "../../components/changelog-viewer";

export function ChangelogViewerWithUrlState(props: ComponentProps<typeof ChangelogViewer>) {
  return (
    <NuqsAdapter>
      <ChangelogViewer {...props} />
    </NuqsAdapter>
  );
}
