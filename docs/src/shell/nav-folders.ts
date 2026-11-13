/**
 * 사이드바 폴더 열림 상태의 전이 규칙. 순수 함수만 있다. 상태를 들고 있는 곳은 `DocsNav` 하나다.
 *
 * 상태 모양: 사용자가 바꾸었거나 이동으로 연 폴더만 기록하는 맵. 기록이 없으면 폴더의 `defaultOpen`을 따른다.
 * 키는 `NavFolder.key`(섹션을 넘어 유일)이므로 섹션을 오가도 한 맵으로 충분하다.
 *
 * 규칙(기존 Next `usePersistentOpenState`와 같다)
 * 1. 첫 렌더: 현재 경로를 포함한 폴더는 열린다.
 * 2. 이동으로 어떤 폴더가 "현재 경로를 포함하게 되면" 연다. 이미 포함하던 폴더 안에서 이동할 때는
 *    사용자가 닫아 둔 상태를 존중한다.
 * 3. 인덱스 페이지가 있는 폴더의 trigger를, 인덱스가 현재가 아닐 때 누르면 열고 인덱스로 이동한다(`DocsNav`).
 *
 * 모든 함수는 idempotent하다. persist된 `DocsNav`는 이동마다 island가 다시 연결되어 render가 여러 번 돌 수 있다.
 * 섹션을 넘는 이동과 사이드바 없는 페이지 경유에서도 맵은 유지된다(오너 결정 3). 전체 로드에서는 초기 상태로 돌아간다.
 */
import { currentFolderKey, folderContains, type NavFolder, type SectionNav } from "./nav-model";

export type FolderOpenMap = Readonly<Record<string, boolean>>;

/** SSR과 첫 hydrate가 같은 값을 쓰도록 순수 함수로 둔다. */
export function initialFolders(nav: SectionNav | null, path: string): FolderOpenMap {
  const key = nav ? currentFolderKey(nav, path) : undefined;
  return key ? { [key]: true } : {};
}

export function isFolderOpen(map: FolderOpenMap, folder: NavFolder): boolean {
  if (!folder.collapsible) return true;
  return map[folder.key] ?? folder.defaultOpen;
}

function* folders(nav: SectionNav | null): Generator<NavFolder> {
  if (!nav) return;
  for (const group of nav.groups) {
    for (const item of group.items) if (item.kind === "folder") yield item;
  }
}

/**
 * 현재 경로가 바뀔 때 부른다. nav가 다른 섹션으로 바뀌어도 맵은 유지한다.
 * 규칙 2: next에서 현재 경로를 포함하는 폴더가 prev에서는 포함하지 않았으면 연다.
 */
export function foldersAfterNavigation(
  map: FolderOpenMap,
  nav: SectionNav | null,
  prevPath: string,
  nextPath: string,
): FolderOpenMap {
  let next = map;
  for (const folder of folders(nav)) {
    if (
      folderContains(folder, nextPath) &&
      !folderContains(folder, prevPath) &&
      !isFolderOpen(next, folder)
    ) {
      next = { ...next, [folder.key]: true };
    }
  }
  return next;
}

export function setFolderOpen(map: FolderOpenMap, folder: NavFolder, open: boolean): FolderOpenMap {
  if (map[folder.key] === open) return map;
  return { ...map, [folder.key]: open };
}
