import { jsdoc } from "@seed-design/rootage-core/plugins/jsdoc";

/** @type {import("@seed-design/rootage-core/config").RootageConfig} */
export default {
  prefix: "seed",
  plugins: [
    jsdoc({
      target: "ComponentSpec",
      // typography는 값 객체를 CSS-in-JS에 펼쳐 쓰는 공개 용도가 있어 SemVer를 지킨다.
      exclude: ["typography"],
      text: [
        "SEED가 컴포넌트 스타일을 만들 때 쓰는 내부 값입니다. 공개 API가 아닙니다.",
        "minor·patch 업그레이드만으로도 이름이나 구조가 바뀔 수 있습니다.",
        "개별 컴포넌트의 스타일이 필요하면 `recipes/*`를, 값이 필요하면 디자인 토큰(`vars/*`)을 쓰세요.",
      ].join("\n"),
      tag: "internal",
    }),
  ],
};
