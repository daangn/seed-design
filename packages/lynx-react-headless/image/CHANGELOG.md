# @seed-design/lynx-react-image

## 0.1.0

### Minor Changes

- fa699aa: Lynx 이미지의 로딩 상태와 대체 콘텐츠를 구성하는 headless `Image` 컴포넌트를 추가합니다.

  - `Image.Root`가 로딩 상태를 공유하고, native `image` 요소를 렌더링하는 `Image.Content`가 로드·오류 이벤트를 상태에 연결합니다.
  - `Image.Fallback`은 이미지가 로딩 중이거나 로드에 실패했을 때 대체 콘텐츠를 표시하고, 로드에 성공하면 숨깁니다.
  - 이미지 주소가 변경되면 상태를 초기화하고 이전 요청에서 발생한 이벤트를 무시합니다.
  - 직접 동작을 구성하는 `useImage`와 하위 컴포넌트에서 상태를 읽는 `useImageContext`를 함께 제공합니다. 시각적 스타일은 사용처에서 지정합니다.
