# Lynx for Web sp 단위 임시 패치

대상은 `@lynx-js/web-core@0.26.7`이다.
루트 `package.json`과 `bun.lock`의 `patchedDependencies`로 등록하며, `bun install`할 때 적용된다.

web-core는 rpx·ppx·vw·vh·rem은 `calc(N * var(--X-unit))`로 바꾸지만 `sp`는 그대로 둔다.
브라우저는 `width: 16sp` 같은 선언을 무효로 보고 버리므로, docs의 Lynx 웹 프리뷰에서 sp를 쓴 recipe와 인라인 style이 적용되지 않는다.
이 패치는 `Nsp`를 `calc(N * var(--sp-unit, 1px))`로 바꾼다.

- 빌드 시점: `dist/encode_prod/index.js`의 `Rule.push_declaration`. web bundle에 들어가는 스타일시트 선언(일반 규칙, keyframes, font-face, CSS 변수)이 모두 이 메서드를 거친다.
- 런타임: `dist/client/mainthread/elementAPIs/createElementAPI.js`의 `__AddInlineStyle`·`__SetInlineStyles`. JS로 넣는 인라인 style을 처리한다.

`--sp-unit`을 지정하지 않으면 1px이다. Lynx native에서 font scale이 1일 때 sp와 px가 같기 때문이다.
프리뷰에서 폰트 스케일을 흉내 내려면 `lynx-view`에 `--sp-unit`을 지정한다.

web-core를 올리면 이 패치를 새 버전에 맞춰 다시 만든다. 버전이 맞지 않는 패치는 `bun install`이 경고만 내고 건너뛰므로, docs 프리뷰에서 sp 값이 적용되는지 직접 확인한다.
업스트림 lynx-stack에 sp 변환이 들어오면 이 패치를 지우고 그 기능으로 바꾼다.
