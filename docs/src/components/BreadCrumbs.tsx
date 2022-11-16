import React from "react";

import * as style from "./BreadCrumbs.css";

const word: Record<string, string> = {
  components: "컴포넌트",
  spec: "스펙",
  guideline: "사용 가이드",
};

const BreadCrumbs = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const currentPath = location.pathname.split("/").slice(1, 5);

  return (
    <div className={style.breadcrumbs}>
      {currentPath.map((path, index) => {
        if (index === 0) {
          return <span key={path}>{word[path] || path} </span>;
        }
        return <span key={path}>/ {word[path] || path} </span>;
      })}
    </div>
  );
};

export default BreadCrumbs;
