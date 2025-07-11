import { docs, reactDocs } from "@/.source";
import { IconContainer } from "@/components/ui/icon";
import { loader } from "fumadocs-core/source";

import { icons } from "lucide-react";
import { createElement } from "react";

/**
 * 한국 시간 기준으로 7일 이내에 업데이트된 문서인지 확인
 * Git lastModified 또는 manual updatedAt을 기준으로 판단
 */
function isRecentlyUpdated(lastModified?: Date, updatedAt?: Date | string): boolean {
  // Git lastModified를 우선 사용, 없으면 manual updatedAt 사용
  const dateToCheck = lastModified || updatedAt;
  if (!dateToCheck) return false;

  // 문자열인 경우 Date 객체로 변환
  const updatedDate = typeof dateToCheck === "string" ? new Date(dateToCheck) : dateToCheck;

  const now = new Date();
  // 7일 전 자정으로 설정
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  return updatedDate >= sevenDaysAgo;
}

export const source = loader({
  baseUrl: "/docs",
  icon(icon) {
    if (icon && icon in icons)
      return createElement(IconContainer, {
        icon: icons[icon as keyof typeof icons],
      });
  },
  source: docs.toFumadocsSource(),
  pageTree: {
    attachFile(node, file) {
      if (!file) return node;

      const data = file.data;

      if (isRecentlyUpdated(file.lastModified, data?.updatedAt)) {
        node.name = createElement(
          "div",
          {
            className: "relative inline-flex items-center",
          },
          [
            node.name,
            createElement("div", {
              key: "badge",
              className: "absolute -top-1 -right-1 w-2 h-2 bg-orange-600 rounded-full",
            }),
          ],
        );
      }

      return node;
    },
  },
});

export const reactSource = loader({
  baseUrl: "/react",
  source: reactDocs.toFumadocsSource(),
  pageTree: {
    attachFile(node, file) {
      if (!file) return node;

      const data = file.data;

      if (isRecentlyUpdated(file.lastModified, data?.updatedAt)) {
        node.name = createElement(
          "div",
          {
            className: "relative inline-flex items-center",
          },
          [
            node.name,
            createElement("div", {
              key: "badge",
              className: "absolute top-0 -right-[6px] w-1 h-1 bg-orange-500 rounded-full",
            }),
          ],
        );
      }

      return node;
    },
  },
});
