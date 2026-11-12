/**
 * 데스크톱 사이드바의 폴더 열림 상태와 스크롤 위치를 전체 로드 사이에 이어 준다(Starlight의 `SidebarPersister`와
 * 같은 방식). 링크를 누르면 문서를 새로 불러오므로, 떠날 때 `sessionStorage`에 남기고 다음 문서가 HTML을 파싱하는
 * 동안 inline script로 되살린다. island의 HTML에는 본문 전체가 들어 있어 island 뒤의 script는 첫 paint보다 늦다 →
 * script를 사이드바 마크업 안에 둔다.
 *
 * script가 바꾼 폴더는 `window.__docsSidebarOpen`에 남고, `DocsSideNavigationFolder`가 그 값으로 첫 state를 정한다.
 * hydration은 서버 HTML이 아니라 지금 DOM과 비교하므로, script가 고친 DOM과 첫 render가 같아 mismatch가 없다.
 * SEED Collapsible의 열림 마크업(`data-open`·`aria-expanded`·content의 `hidden`)이나 scroller(`.seed-scroll-fog`)가
 * 바뀌면 아래 script도 함께 고친다.
 */

import type { Key } from "react";
import { type SidebarGroup, isSidebarFolderItem } from "./lib/sidebar-items";

declare global {
  interface Window {
    __docsSidebarOpen?: Record<string, boolean>;
  }
}

// script 본문은 서버와 브라우저 번들에서 글자 하나까지 같아야 hydration 경고가 나지 않는다 → 함수의
// `toString()` 대신 문자열로 둔다. 오류는 삼킨다. 되살리지 못해도 서버 기본 상태로 보이면 된다.

/**
 * 사이드바 맨 앞. 떠날 때 저장하는 listener를 걸고, 저장 상태가 있으면 폴더 script가 쓸 함수를 둔다.
 * 저장 key에 트리 id를 붙여 다른 섹션의 상태를 읽지 않고, 섹션을 오가도 각자의 상태가 남는다.
 *
 * 스크롤은 목록이 다 파싱되어야 맞출 수 있다. 사이드바 HTML은 여러 network 조각에 걸쳐 오고 그 사이에도
 * paint되므로, 그동안 목록을 저장한 스크롤만큼 transform으로 올려 둔다. 파싱된 항목은 처음부터 최종 위치에
 * 보이고, 목록 뒤 script가 transform을 걷고 같은 task에서 `scrollTop`을 맞춘다. 순서를 바꾸면 transform으로
 * 줄어든 스크롤 범위에 `scrollTop`이 잘린다. React가 관리하는 요소의 속성 대신 `<head>`의 `<style>`을 쓴다.
 */
const SETUP_SCRIPT = `(function(){try{
var KEY="seed-docs-sidebar:"+document.currentScript.getAttribute("data-tree");
function isOpen(s){return s.parentElement.querySelector("[aria-expanded]").getAttribute("aria-expanded")==="true"}
addEventListener("visibilitychange",function(){if(document.visibilityState!=="hidden")return;try{
var scroller=document.querySelector("#nd-sidebar .seed-scroll-fog");
if(!scroller||scroller.getClientRects().length===0)return;
var open={};document.querySelectorAll("#nd-sidebar script[data-folder]").forEach(function(s){open[s.getAttribute("data-folder")]=isOpen(s)});
sessionStorage.setItem(KEY,JSON.stringify({scroll:scroller.scrollTop,open:open}))}catch(e){}});
var state=JSON.parse(sessionStorage.getItem(KEY));
if(!state||!state.open)return;
var applied=window.__docsSidebarOpen={},y=Math.max(0,Number(state.scroll)||0);
if(y){var st=document.createElement("style");
st.textContent="#nd-sidebar .seed-scroll-fog>*{transform:translateY(-"+y+"px)}";
document.head.appendChild(st);
addEventListener("DOMContentLoaded",function(){st.remove()});
window.__docsSidebarScroll=function(scroller){st.remove();scroller.scrollTop=y}}
window.__docsSidebarFolder=function(s){try{
var key=s.getAttribute("data-folder"),open=state.open[key];
if(typeof open!=="boolean"||s.hasAttribute("data-locked"))return;
if(isOpen(s)!==open){
var root=s.parentElement,trigger=root.querySelector("[aria-expanded]");
[root].concat([].slice.call(root.querySelectorAll("[data-collapsible]"))).forEach(function(el){el.toggleAttribute("data-open",open)});
trigger.setAttribute("aria-expanded",String(open));
document.getElementById(trigger.getAttribute("aria-controls")).hidden=!open}
applied[key]=open}catch(e){}}
}catch(e){}})()`;

/** 각 폴더의 마지막 자식. 폴더 마크업이 파싱된 직후에 열림 상태를 되살린다. */
const FOLDER_SCRIPT = "window.__docsSidebarFolder&&__docsSidebarFolder(document.currentScript)";

/** 목록 맨 뒤. 목록이 다 파싱되어 높이가 정해진 뒤 위의 transform을 걷고 실제 스크롤 위치로 바꾼다. */
const SCROLL_SCRIPT = `(function(){try{window.__docsSidebarScroll&&
__docsSidebarScroll(document.currentScript.closest(".seed-scroll-fog"))}catch(e){}})()`;

/** 저장 key에 붙는 트리 id. 섹션·archive 버전마다 폴더와 링크가 다르다. */
export function sidebarTreeId(groups: SidebarGroup[]): string {
  const parts: string[] = [];
  for (const group of groups) {
    for (const item of group.items) {
      if (isSidebarFolderItem(item)) {
        parts.push(`${item.key}:${item.index?.href ?? ""}`, ...item.items.map((sub) => sub.href));
      } else {
        parts.push(item.href);
      }
    }
  }
  let hash = 5381;
  for (const char of parts.join("\n")) hash = (Math.imul(hash, 33) + char.charCodeAt(0)) | 0;
  return (hash >>> 0).toString(36);
}

/** script가 이 폴더를 저장 상태로 바꿨으면 그 값. hydration의 첫 render가 바뀐 DOM과 같아지게 한다. */
export function restoredFolderOpen(key: Key): boolean | undefined {
  return typeof window === "undefined" ? undefined : window.__docsSidebarOpen?.[String(key)];
}

export function SidebarRestoreSetup({ tree }: { tree: string }) {
  return <script data-tree={tree} dangerouslySetInnerHTML={{ __html: SETUP_SCRIPT }} />;
}

/** `locked`: 현재 페이지가 든 폴더와 접을 수 없는 폴더. 저장 상태와 관계없이 열린 채로 둔다. */
export function SidebarFolderRestore({ folderKey, locked }: { folderKey: Key; locked: boolean }) {
  return (
    <script
      data-folder={String(folderKey)}
      data-locked={locked ? "" : undefined}
      dangerouslySetInnerHTML={{ __html: FOLDER_SCRIPT }}
    />
  );
}

export function SidebarScrollRestore() {
  return <script dangerouslySetInnerHTML={{ __html: SCROLL_SCRIPT }} />;
}
