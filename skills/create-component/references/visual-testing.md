# Visual Testing 가이드

## 테스트 환경 구성

### 서버 시작

```bash
# 터미널 1: docs 개발 서버
cd docs && bun dev
# → localhost:3000

# 터미널 2: stackflow-spa 개발 서버
cd examples/stackflow-spa && bun dev
# → localhost:5173

# 터미널 3: lynx-spa 개발 서버 (Lynx 작업 시)
cd examples/lynx-spa && bun dev
# → Lynx dev server output 확인

# 터미널 4: Storybook (React 작업 시)
cd docs && bun storybook
# → localhost:6006
```

## Agent Browser 테스트 플로우

### 1. Docs 테스트

```bash
agent-browser open http://localhost:3000/react/components/[name]
agent-browser snapshot -i
agent-browser screenshot docs-[name].png
agent-browser close
```

### 2. Stackflow-SPA 테스트

```bash
agent-browser open http://localhost:5173
# Activity[ComponentName]으로 이동
agent-browser snapshot -i
agent-browser screenshot stackflow-[name].png
agent-browser close
```

### 3. Storybook 테스트 (테마별)

```bash
# Light Theme
agent-browser open http://localhost:6006/?path=/story/[name]--light-theme
agent-browser screenshot storybook-[name]-light.png

# Dark Theme
agent-browser open http://localhost:6006/?path=/story/[name]--dark-theme
agent-browser screenshot storybook-[name]-dark.png

# Font Scaling
agent-browser open http://localhost:6006/?path=/story/[name]--font-scaling-extra-small
agent-browser screenshot storybook-[name]-font-xs.png

agent-browser open http://localhost:6006/?path=/story/[name]--font-scaling-extra-extra-extra-large
agent-browser screenshot storybook-[name]-font-xxxl.png

agent-browser close
```

### 4. Lynx-SPA 테스트

Lynx 컴포넌트는 Storybook 대신 `examples/lynx-spa`의 page/catalog에서 실제 사용 화면을 확인한다. snippet을 vendoring하는 컴포넌트라면 `examples/lynx-spa/src/seed-design/ui/`가 `docs/registry/lynx/ui/`와 동기화되어 있는지도 함께 본다.

```bash
cd examples/lynx-spa && bun dev
# dev server URL과 QR/device target은 rspeedy output을 따른다.
```

## 테스트 체크리스트

| 환경 | URL | 확인 사항 |
|------|-----|----------|
| docs | localhost:3000 | 컴포넌트 렌더링, 예제 동작 |
| stackflow-spa (React) | localhost:5173 | 실제 앱 환경 동작 |
| lynx-spa (Lynx) | rspeedy output | Lynx runtime/page/catalog 동작 |
| Storybook Light (React) | localhost:6006 | 라이트 모드 스타일 |
| Storybook Dark (React) | localhost:6006 | 다크 모드 스타일 |
| Storybook Font XS (React) | localhost:6006 | 작은 폰트 스케일 |
| Storybook Font XXXL (React) | localhost:6006 | 큰 폰트 스케일 |

## Figma 비교 (선택)

스크린샷 저장 위치: `agent-browser-report/`

**불일치 발견 시**: Step 2(Rootage)부터 다시 검토
