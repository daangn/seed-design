import React from "react";

import * as style from "./BreadCrumbs.css";

const word: Record<string, string> = {
  components: "컴포넌트",
  spec: "스펙",
  guideline: "사용 가이드",
};

interface BreadCrumbsProps {
  slug: string;
}

const BreadCrumbs = ({ slug }: BreadCrumbsProps) => {
  // NOTE: /components/overview/spec/primitive -> ["components", "overview", "spec", "primitive"]
  const currentPath = slug.split("/").slice(1, 5);

  return (
    <div className={style.breadcrumbs}>
      {currentPath.map((path, index) => {
        return (
          <span key={path}>
            {index === 0 ? "" : " / "}
            {word[path] || path}
          </span>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;
