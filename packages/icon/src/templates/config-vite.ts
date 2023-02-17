import dedent from "string-dedent";
import { YAML_SCHEMA_URL } from "../constants";

export function generateViteConfig() {
  return dedent`
    # yaml-language-server: $schema=${YAML_SCHEMA_URL}

    # https://www.figma.com/file/58VvezaS8z1FsIOr9KFHKW/icon?node-id=0%3A1
    # 위 피그마 파일에서 사용되는 아이콘 이름을 추가해주세요.
    # 예: icon_add_circle_fill | icon_add_circle_regular
    icons:
      - icon_add_circle_fill
      - icon_add_circle_regular
      - icon_add_circle_thin

    # 아이콘 컴포넌트가 저장될 경로입니다. 프로젝트 루트 기준입니다.
    # 예: src/components/SeedIcon.tsx
    componentPath: ./src/components/SeedIcon.tsx

    # sprite svg 파일이 저장될 경로입니다. 프로젝트 루트 기준입니다.
    # 예: src/assets/sprite.svg
    spritePath: ./assets/sprite.svg

    # 아이콘 Context 컴포넌트를 생성할지 여부입니다.
    # 라이브러리 제공자가 아닌 경우 false로 설정해주세요.
    # 라이브러리 제공자인 경우 true로 설정하고 유저에게서 sprite 경로를 받도록 설계해주세요.
    withContext: false
    
    # 아이콘 Context 컴포넌트가 저장될 경로입니다. 프로젝트 루트 기준입니다.
    # withContext가 true일 경우에만 설정해주세요.
    # 예: src/components/SeedIconContext.tsx
    # contextPath: src/contexts/SeedIconContext.tsx\n
`;
}
