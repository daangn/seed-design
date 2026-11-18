/**
 * `ChangelogViewer`에 URL 상태 adapter(`nuqs/adapters/react`)를 붙인다(기존 Next 앱은 레이아웃의 `NuqsAdapter`가 감쌌다).
 * `islands/ChangelogViewer.astro`가 `client:idle`로 hydrate한다.
 *
 * 서버 HTML은 URL query 없이(기본 필터로) 그려진다. `?package=`·`?version=`이 있는 URL로 처음 들어오면 hydrate render가
 * 서버 HTML과 같도록 빈 query adapter로 hydrate한 뒤, 실제 URL adapter로 바꿔 그 필터로 다시 그린다(hydration 불일치 없음).
 * query가 없으면 처음부터 실제 adapter다.
 */
import { NuqsAdapter } from "nuqs/adapters/react";
import { unstable_createAdapterProvider as createAdapterProvider } from "nuqs/adapters/custom";
import { type ComponentProps, useSyncExternalStore } from "react";
import { ChangelogViewer } from "../../components/changelog-viewer";

const EMPTY_SEARCH = new URLSearchParams();
const ServerQueryAdapter = createAdapterProvider(() => ({
  searchParams: EMPTY_SEARCH,
  updateUrl: () => {},
}));

const subscribe = () => () => {};
const hasUrlState = () =>
  typeof location !== "undefined" && /[?&](?:package|version)=/.test(location.search);

export function ChangelogViewerWithUrlState(props: ComponentProps<typeof ChangelogViewer>) {
  // hydrate render에서는 server snapshot(false), 그 뒤에는 true.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const Adapter = !hydrated && hasUrlState() ? ServerQueryAdapter : NuqsAdapter;
  return (
    <Adapter>
      <ChangelogViewer {...props} />
    </Adapter>
  );
}
