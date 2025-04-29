# 피그마 플러그인 템플릿

이 템플릿은 피그마 플러그인 개발을 위한 기본 설정을 제공합니다.

## 프로젝트 구조

```
figma-plugin-template/
├── dist/                # 빌드 출력 디렉토리
│   ├── main/            # 피그마 플러그인 메인 스크립트
│   └── ui/              # 피그마 플러그인 UI
├── src/                 # 소스 코드
│   ├── main/            # 피그마 플러그인 메인 스크립트 소스
│   └── ui/              # 피그마 플러그인 UI 리액트 소스
├── index.html           # UI를 위한 HTML 진입점
├── manifest.json        # 피그마 플러그인 매니페스트
├── vite.main.config.ts  # 메인 스크립트용 Vite 설정
├── vite.ui.config.ts    # UI용 Vite 설정
├── tsconfig.json        # 통합 TypeScript 설정
├── tsconfig.main.json   # 메인 스크립트용 TypeScript 설정
└── tsconfig.ui.json     # UI용 TypeScript 설정
```

## 시작하기

```bash
# 의존성 설치
yarn install

# 개발 모드 실행 (watch 모드)
yarn dev

# 프로덕션 빌드
yarn build
```

## 스크립트

- `yarn build`: 전체 프로젝트 빌드
- `yarn build:ui`: UI 컴포넌트만 빌드
- `yarn build:main`: 메인 스크립트만 빌드
- `yarn watch`: 전체 프로젝트 watch 모드
- `yarn watch:ui`: UI 컴포넌트만 watch 모드
- `yarn watch:main`: 메인 스크립트만 watch 모드
- `yarn dev`: `yarn watch`와 동일
- `yarn lint`: Biome를 사용하여 코드 린트 

## TODO

- [ ] Env
- [ ] Event
- [ ] Plugin System
- [ ] Styling Library
