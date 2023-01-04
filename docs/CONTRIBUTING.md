# Seed Docs Contributing

## 📌 프로젝트 실행하기

- `seed-design` 프로젝트를 `clone`해줘요.
- 프로젝트 최상위 경로에서 `yarn`으로 의존성을 설치해줘요.
- `yarn build`로 필요한 패키지들을 한 번 빌드해줘요.
- `cd docs` 입력 후 `docs` 폴더에서 `yarn dev`를 입력하면 `8000`번 포트에서 프로젝트를 볼 수 있어요.

## 📌 usage 문서 작성하기

usage 문서를 작성하기 위해서는 다음과 같은 단계가 필요해요.

1. 알맞은 위치에 `usage.mdx` 파일 생성하기
2. `frontmatter`와 문서 작성하기.
3. `docs/configs/link.json` 파일에 정보 기입하기.

### 1. 알맞은 위치에 `usage.mdx` 파일 생성하기

그 전에 `content` 폴더 구조를 잠깐 살펴볼까요?

seed docs의 문서들은 `seed-design/docs/content` 폴더에 위치해요.

```
📦content
 ┣ 📂component
 ┃ ┣ 📂avatar
 ┃ ┃ ┣ 📜avatar-style-anatomy.png
 ┃ ┃ ┣ 📜style.mdx
 ┃ ┃ ┣ 📜thumbnail.png
 ┃ ┃ ┗ 📜usage.mdx
 ┃ ┣ 📂box-button
 ┃ ┃ ┣ ...
 ┃ ┣ 📂box-toggle-button
 ┃ ┃ ┣ ...
 ┣ 📂primitive
 ┃ ┣ 📂avatar
 ┃ ┃ ┣ 📜avatar-primitive-anatomy.png
 ┃ ┃ ┣ 📜primitive.mdx
 ┃ ┃ ┗ 📜thumbnail.png
 ┃ ┣ 📂button
 ┃ ┃ ┣ 📜primitive.mdx
 ┃ ┃ ┗ ...
```

- 크게 `component`, `primitive`로 나뉘어져 있어요. `avatar` 컴포넌트를 기준으로 말해볼게요.
- 각 컴포넌트 이름으로 된 폴더를 생성하고, 그 안에 `mdx` 확장자로 되어있는 파일을 생성해요.
- `mdx` 파일안에 적힌 `frontmatter`를 잘 기입해야 문서가 웹 페이지에 생성이 돼요.

### 2. `frontmatter`와 문서 작성하기.

> frontmatter: 보통 `md` or `mdx` 파일에서 추가적인 데이터(정보)를 식별하기 위한 방법이예요.

작성하는 방법은 다음과 같아요

```markdown
---
slug: /component/avatar/usage
title: Avatar
description: 프로필 사진 또는 대체 이미지를 통해 사용자를 표현합니다.
thumbnail: ./thumbnail.png
---

# Avatar

본문
```

`대쉬(-)`를 세 개로 열고, 닫은 사이 공간이 `frontmatter` 정보를 기입해 줄 공간이에요.

`usage` 문서에는 총 **4개**의 frontmatter 정보가 기입되어야 해요. `slug`, `title`, `description`, `thumbnail`.

- `slug`: 문서가 생성될 경로를 적어주세요.
  - `/component/avatar/usage` -> `https://seed-design.pages.dev/component/avatar/usage/` 에 문서가 생성돼요.
- `title`: 컴포넌트 이름을 적어주세요.
- `description`: 컴포넌트의 한 줄 설명을 적어주세요.
- `thumbnail`: `usage` 문서에만 있는 정보예요. list page에서 해당 컴포넌트 문서의 썸네일 이미지의 경로를 적어주세요.

### 3. `docs/configs/link.json` 파일에 정보 기입하기.

`link.json` 파일은 사이드바에 링크를 노출시키기 위해 정보가 적혀있는 파일이에요.

```json
{
  "component": [
    {
      "name": "Checkbox",
      "usage": "../content/component/checkbox/usage.mdx",
      "style": "../content/component/checkbox/style.mdx"
    }
  ],

  "primitive": [
    {
      "name": "Checkbox",
      "document": "../content/primitive/checkbox/primitive.mdx"
    }
  ]
}
```

`Avatar` 컴포넌트의 `usage` 문서를 사이드바에 노출시키고 싶으면 `component` 하위에 정보를 적어주면 돼요.

- `name`: 해당 링크들이 어떤 컴포넌트인지 식별하기 위한 값이예요. (중요한 정보는 아니예요.)
- `usage`: `usage`문서의 경로를 해당 `link.json`파일 기준으로 적어줘요.

## 📌 MDX 문서 작성하기

> mdx = markdown + jsx
> 기본적으로 `MDX` 문서는 `markdown`을 따르기 때문에 [markdown 문법](https://gist.github.com/ihoneymon/652be052a0727ad59601)을 알아야해요.

- [MDX에서 쓰일 컴포넌트 스토리북](https://04ba8dcb.seed-docs-storybook.pages.dev/?path=/docs/fullcard--docs)

### 이미지 첨부하기

mdx 문서를 만든 경로와 같은 경로에 이미지를 추가해요.
그 다음 `![이미지에 대한 대체 텍스트](./이미지명)`로 추가해줘요.
