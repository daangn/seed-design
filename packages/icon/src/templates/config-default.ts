import dedent from "string-dedent";
import { YAML_SCHEMA_URL } from "../constants";

export function generateDefaultConfig() {
  return dedent`
    # yaml-language-server: $schema=${YAML_SCHEMA_URL}

    # https://www.figma.com/file/58VvezaS8z1FsIOr9KFHKW/icon?node-id=0%3A1
    # 아이콘의 실제 모습은 위 링크에서 확인할 수 있습니다.
    # 예: icon_add_circle_fill | icon_add_circle_regular
    icons:
      - icon_add_circle_fill
      - icon_add_circle_regular
      - icon_add_circle_thin

    # 아이콘 컴포넌트가 저장될 경로입니다. 프로젝트 루트 기준입니다.
    # 해당 경로에 iconData가 같이 저장됩니다.
    # 예: src/components/SeedIcon.tsx
    componentPath: src/components/SeedIcon.tsx\n
  `;
}
