# (draft) Contributing Guideline

패키지 관리를 위해 사용하는 도구

- [Yarn 2](https://yarnpkg.com/)
- [Changesets](https://github.com/atlassian/changesets)
- [ultra-runner](https://github.com/folke/ultra-runner)

## 프로젝트 빌드하기

```bash
# 프로젝트 전체 빌드
yarn build:all

# 워크스페이스 빌드
yarn workspace @daangn/design-token build
yarn workspace @daangn/emotion-react-theme build

# (특정 워크스페이스 경로에서)
cd emotion-react-theme
yarn build # 현재 워크스페이스 빌드
yarn ultra build # 의존성 포함해서 topological 빌드
```
