"use client";

import { useEffect, useState } from "react";

/**
 * 문서 하단의 "Last updated on" 줄. fumadocs `PageLastUpdate`처럼 날짜는 hydrate 뒤 방문자 locale로 채운다.
 * fumadocs 쪽 모듈은 notebook page 전체를 끌고 와서 island에는 이 작은 컴포넌트를 쓴다.
 */
export function PageLastUpdate({ date }: { date: Date }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(date.toLocaleDateString());
  }, [date]);

  return <p className="text-sm text-fd-muted-foreground">Last updated on {text}</p>;
}
