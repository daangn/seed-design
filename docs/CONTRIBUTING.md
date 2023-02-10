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
 ┃ ┣ 📂alert-dialog
 ┃ ┃ ┣ 📜component-meta.json
 ┃ ┃ ┣ 📜overview.mdx
 ┃ ┃ ┣ 📜style.mdx
 ┃ ┃ ┗ 📜usage.mdx
 ┃ ┣ 📂avatar
 ┃ ┃ ┣ 📜avatar-options-image.png
 ┃ ┃ ┣ 📜avatar-options-size.png
 ┃ ┃ ┣ 📜avatar-style-anatomy.png
 ┃ ┃ ┣ 📜component-meta.json
 ┃ ┃ ┣ 📜overview.mdx
 ┃ ┃ ┣ 📜style.mdx
 ┃ ┃ ┣ 📜thumbnail.png
 ┃ ┃ ┗ 📜usage.mdx
 ┣ 📂primitive
 ┃ ┣ 📂avatar
 ┃ ┃ ┣ 📜avatar-primitive-anatomy.png
 ┃ ┃ ┣ 📜primitive-meta.json
 ┃ ┃ ┣ 📜primitive.mdx
 ┃ ┃ ┗ 📜thumbnail.png
 ┃ ┣ 📂button
 ┃ ┃ ┣ 📜primitive-meta.json
 ┃ ┃ ┣ 📜primitive.mdx
 ┃ ┃ ┗ 📜thumbnail.png
...
```

- 크게 `component`, `primitive`로 나뉘어져 있어요. `avatar` 컴포넌트를 기준으로 말해볼게요.
- 각 컴포넌트 이름으로 된 폴더를 생성하고, 그 안에 `mdx` 확장자로 되어있는 파일을 생성해요.
- `primitive` 폴더의 각각의 컴포넌트에는 `primitive-meta.json` 파일이 존재해요.
- `component` 폴더의 각각의 컴포넌트에는 `component-meta.json` 파일이 존재해요.

### 2. `frontmatter` 기입하기

> frontmatter: 보통 `md` or `mdx` 파일에서 추가적인 데이터(정보)를 식별하기 위한 방법이예요.

작성하는 방법은 다음과 같아요

```markdown
---
slug: /component/avatar/usage
---

본문
```

현재는 `slug` 필드만 작성해주면 돼요.

### 3. meta.json 파일 작성하기

Avatar Component를 기준으로 설명을 드릴게요.

```json
{
  "name": "Avatar",
  "description": "프로필 사진 또는 대체 이미지를 통해 사용자를 표현합니다.",
  "thumbnail": "./thumbnail.png",
  "group": "Avatar",
  "primitive": "../../primitive/avatar/primitive-meta.json",
  "platform": {
    "ios": {
      "status": "todo",
      "alias": "",
      "path": ""
    },
    "android": {
      "status": "todo",
      "path": ""
    },
    "react": {
      "status": "done",
      "path": "https://sprout-storybook.vercel.app/?path=/docs/components-avatar--docs"
    },
    "docs": {
      "overview": {
        "status": "in-progress",
        "mdx": "./overview.mdx"
      },
      "usage": {
        "status": "in-progress",
        "mdx": "./usage.mdx"
      },
      "style": {
        "status": "done",
        "mdx": "./style.mdx"
      }
    }
  }
}
```

- `name`(필수): 컴포넌트 이름을 적어주세요.
- `description`(필수): 컴포넌트에 대한 전반적인 설명을 적어주세요.
- `thumbnail`(필수): 컴포넌트 리스트 페이지에서 보여질 썸네일 이미지 주소를 적어주세요. 현재 `meta.json` 파일에서의 상대경로입니다.
- `group`(옵션): 이건 사이드 바에서 같이 그룹핑 될 그룹을 적어줘요.
- `primitive`(옵션): 해당 컴포넌트의 `Primitive` 문서의 경로를 적어줘요. 현재 `meta.json` 파일에서의 상대경로입니다.
- `platform`: 각 플랫폼 별로의 진행 상황을 적어주기 위한 필드에요.
  - 현재는 `ios`, `android`, `react`, docs의 `overview` 문서, docs의 `usage` 문서, docs의 `style` 문서로 나눠서 진행 상황을 관리해요.
  - status(필수): `todo`, `in-progress`, `done`의 세 가지로만 적을 수 있어요. (제대로 안적으면 PR에서 에러가 납니다.)
  - mdx(옵션): docs에서 해당 문서의 상대 위치를 적어줘요.
  - alias(옵션): 해당 컴포넌트의 별칭을 적어줘요. (ios에서는 똑같은 Box Button이 아니라 Karrot이라는 prefix가 붙음.)

## 📌 MDX 문서 작성하기

> mdx = markdown + jsx
> 기본적으로 `MDX` 문서는 `markdown`을 따르기 때문에 [markdown 문법](https://gist.github.com/ihoneymon/652be052a0727ad59601)을 알아야해요.

- [MDX에서 쓰일 컴포넌트 스토리북](https://04ba8dcb.seed-docs-storybook.pages.dev/?path=/docs/fullcard--docs)

### 이미지 첨부하기

mdx 문서를 만든 경로와 같은 경로에 이미지를 추가해요.
그 다음 `![이미지에 대한 대체 텍스트](./이미지명)`로 추가해줘요.
