/**
 * 정적 MDX 컴포넌트가 쓰는 아이콘 SVG 문자열(`@karrotmarket/react-monochrome-icon`의 같은 이름 아이콘을 렌더링한 결과).
 * 빌드 데이터를 await하는 `.astro`(ManualInstallation 등) 아래에서도 쓰이므로 React 렌더러를 거치지 않는다.
 * React renderer 호출 순서가 바뀌면 `useId` 접두사가 바뀌어 빌드가 비결정적이 된다(DESIGN 핵심 결정 9 ③).
 */

function svg(paths: string, attributes = ""): string {
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-seed-icon="true" width="24" height="24"${attributes}><g>${paths}</g></svg>`;
}

const CHEVRON_DOWN_LINE =
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M21.2612 7.27589C20.8613 6.89499 20.2283 6.9104 19.8474 7.31032L11.9996 15.55L4.15284 7.31037C3.77196 6.91043 3.13899 6.89497 2.73904 7.27584C2.3391 7.65671 2.32364 8.28969 2.70451 8.68963L11.2754 17.6896C11.4641 17.8878 11.7258 18 11.9995 18C12.2732 18 12.5349 17.8879 12.7236 17.6897L21.2956 8.68968C21.6765 8.28976 21.6611 7.65679 21.2612 7.27589Z" fill="currentColor"></path>';

const CHEVRON_DOWN_SMALL_LINE =
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M6.29436 9.29143C6.68569 8.90171 7.31886 8.90303 7.70857 9.29436L11.9848 13.5884L16.297 9.3256C16.6897 8.93733 17.3229 8.94097 17.7112 9.33374C18.0994 9.7265 18.0958 10.3597 17.703 10.7479L12.6823 15.7112C12.2906 16.0984 11.6594 16.096 11.2707 15.7056L6.29143 10.7056C5.90171 10.3143 5.90303 9.68114 6.29436 9.29143Z" fill="currentColor"></path>';

const SQUARE_2_STACKED_LINE =
  '<g><path fill-rule="evenodd" clip-rule="evenodd" d="M2 8.8C2 7.2536 3.2536 6 4.8 6H15.2C16.7464 6 18 7.2536 18 8.8V19.2C18 20.7464 16.7464 22 15.2 22H4.8C3.2536 22 2 20.7464 2 19.2V8.8ZM4.8 8C4.35817 8 4 8.35817 4 8.8V19.2C4 19.6418 4.35817 20 4.8 20H15.2C15.6418 20 16 19.6418 16 19.2V8.8C16 8.35817 15.6418 8 15.2 8H4.8Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3C7 2.44772 7.44772 2 8 2H19.2C20.7464 2 22 3.2536 22 4.8V16C22 16.5523 21.5523 17 21 17C20.4477 17 20 16.5523 20 16V4.8C20 4.35817 19.6418 4 19.2 4H8C7.44772 4 7 3.55228 7 3Z" fill="currentColor"></path></g>';

const CHECKMARK_CLIPBOARD_LINE =
  '<g><path d="M16.2857 11.0188C16.6273 10.5849 16.5526 9.95617 16.1186 9.61451C15.6847 9.27285 15.056 9.34764 14.7143 9.78155L11.0746 14.4041L9.22191 12.4714C8.83973 12.0727 8.20671 12.0593 7.80801 12.4414C7.40931 12.8236 7.39592 13.4566 7.77809 13.8553L10.4267 16.6185C10.6271 16.8275 10.9081 16.9394 11.1973 16.9253C11.4864 16.9113 11.7552 16.7726 11.9343 16.5451L16.2857 11.0188Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7 2.00049C7 1.4482 7.44772 1.00049 8 1.00049H16C16.5523 1.00049 17 1.4482 17 2.00049V3.00052L18.1526 3.00049C19.7251 3.00045 21 4.27527 21 5.84786V20.1531C21 21.7256 19.7252 23.0004 18.1526 23.0004H5.84737C4.27481 23.0004 3 21.7256 3 20.1531V5.84786C3 4.27527 4.27485 3.00045 5.84744 3.00049L7 3.00052V2.00049ZM15 3.00049V4.70324C14.1948 4.89175 13.1383 4.99942 12.0275 5.00048C10.9097 5.00154 9.83259 4.89454 9 4.70046V3.00049H15ZM7 5.44974V5.00052L5.84739 5.00049C5.37939 5.00048 5 5.37986 5 5.84786V20.1531C5 20.6211 5.37938 21.0004 5.84737 21.0004H18.1526C18.6206 21.0004 19 20.6211 19 20.1531V5.84786C19 5.37986 18.6206 5.00048 18.1526 5.00049L17 5.00052V5.44974C17 5.86841 16.7392 6.24276 16.3464 6.3878C15.201 6.81085 13.5787 6.99901 12.0294 7.00048C10.4783 7.00195 8.84019 6.81645 7.66028 6.39026C7.26404 6.24714 7 5.87103 7 5.44974Z" fill="currentColor"></path></g>';

/** SEED `Icon`(size x4, fg.neutralMuted)이 감싼 모양: `class="seed-icon"`과 크기·색 변수. */
function seedIcon(paths: string, className: string): string {
  return svg(
    paths,
    ` aria-hidden="true" class="seed-icon ${className}" style="--seed-icon-size:var(--seed-dimension-x4);--seed-icon-color:var(--seed-color-fg-neutral-muted)"`,
  );
}

/** lucide 아이콘(fumadocs-ui가 쓰는 것과 같은 마크업). */
function lucide(name: string, paths: string, className = ""): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name}${className ? ` ${className}` : ""}" aria-hidden="true">${paths}</svg>`;
}

export const ICONS = {
  chevronDownLine: svg(CHEVRON_DOWN_LINE),
  chevronDownSmallLine: (className: string) =>
    svg(CHEVRON_DOWN_SMALL_LINE, ` class="${className}"`),
  /** 복사 버튼: 평소 아이콘과 복사 뒤 아이콘. 버튼의 `data-copied`(group)로 하나만 보인다. */
  copy:
    seedIcon(SQUARE_2_STACKED_LINE, "group-data-[copied]:hidden") +
    seedIcon(CHECKMARK_CLIPBOARD_LINE, "hidden group-data-[copied]:block"),
  /** 헤딩 링크 복사(fumadocs `Heading`과 같은 lucide link / copy-check). */
  headingLink:
    lucide(
      "link",
      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',
      "group-data-[copied]/copy:hidden",
    ) +
    lucide(
      "copy-check",
      '<path d="m12 15 2 2 4-4"></path><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>',
      "hidden group-data-[copied]/copy:block",
    ),
  file: lucide(
    "file",
    '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path>',
  ),
  /** 폴더: 닫힘·열림 아이콘을 둘 다 그리고 `<details open>`(group)이 하나를 고른다. */
  folder:
    lucide(
      "folder",
      '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>',
      "group-open/folder:hidden",
    ) +
    lucide(
      "folder-open",
      '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path>',
      "hidden group-open/folder:block",
    ),
  /** 가이드 이미지 Do/Don’t 표시(SEED `Icon` x5). */
  checkmarkCircleFill:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-seed-icon="true" width="24" height="24" class="seed-icon shrink-0" aria-hidden="true" style="--seed-icon-size:var(--seed-dimension-x5);--seed-icon-color:var(--seed-color-fg-positive-contrast)"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92549 5.92549 1 12 1C18.0745 1 23 5.92549 23 12C23 18.0745 18.0745 23 12 23C5.92549 23 1 18.0745 1 12ZM16.7857 9.61868C17.1273 9.18476 17.0526 8.55602 16.6186 8.21436C16.1847 7.8727 15.556 7.94749 15.2143 8.38141L10.953 13.7934L8.72191 11.4659C8.33973 11.0672 7.70671 11.0539 7.30801 11.436C6.90931 11.8182 6.89592 12.4512 7.27809 12.8499L10.3051 16.0078C10.5054 16.2168 10.7865 16.3287 11.0756 16.3146C11.3648 16.3006 11.6336 16.1619 11.8127 15.9345L16.7857 9.61868Z" fill="currentColor"></path></g></svg>',
  xmarkCircleFill:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-seed-icon="true" width="24" height="24" class="seed-icon shrink-0" aria-hidden="true" style="--seed-icon-size:var(--seed-dimension-x5);--seed-icon-color:var(--seed-color-fg-critical-contrast)"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.800781 11.9998C0.800781 5.81706 5.81804 0.799805 12.0008 0.799805C18.1835 0.799805 23.2008 5.81706 23.2008 11.9998C23.2008 18.1825 18.1835 23.1998 12.0008 23.1998C5.81804 23.1998 0.800781 18.1825 0.800781 11.9998ZM8.46537 8.46574C8.8559 8.07522 9.48906 8.07522 9.87959 8.46574L12.0006 10.5868L14.1216 8.46574C14.5121 8.07522 15.1453 8.07522 15.5358 8.46574C15.9264 8.85627 15.9264 9.48943 15.5358 9.87996L13.4148 12.001L15.5364 14.1226C15.927 14.5131 15.927 15.1463 15.5364 15.5368C15.1459 15.9273 14.5128 15.9273 14.1222 15.5368L12.0006 13.4152L9.87898 15.5368C9.48846 15.9273 8.85529 15.9273 8.46477 15.5368C8.07424 15.1463 8.07424 14.5131 8.46477 14.1226L10.5864 12.001L8.46537 9.87996C8.07485 9.48943 8.07485 8.85627 8.46537 8.46574Z" fill="currentColor"></path></g></svg>',
};
