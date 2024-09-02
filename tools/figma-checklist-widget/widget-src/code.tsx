const { widget } = figma;
const { AutoLayout, Fragment, SVG, Text, usePropertyMenu, useSyncedState, useEffect } = widget;

type CheckState = "unchecked" | "checked" | "not-applicable";

const Checkmark = () => (
  <SVG
    width={20}
    height={20}
    strokeWidth={2}
    src={`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#ffffff"
      viewBox="0 0 256 256"
    >
      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
    </svg>
    `}
  />
);

const CheckItem = ({
  state,
  onClick,
  children,
}: {
  state: CheckState;
  onClick: () => void;
  children: FigmaDeclarativeNode;
}) => (
  <AutoLayout width="fill-parent" spacing={4} onClick={onClick}>
    <AutoLayout width={32} height={24}>
      {state === "unchecked" ? (
        <AutoLayout width={24} height={24} cornerRadius={4} stroke="#000" strokeWidth={1} />
      ) : state === "checked" ? (
        <AutoLayout
          width={24}
          height={24}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          cornerRadius={4}
          fill="#FF6600"
          strokeWidth={1}
        >
          <Checkmark />
        </AutoLayout>
      ) : (
        <Text>N/A</Text>
      )}
    </AutoLayout>
    <AutoLayout width="fill-parent" direction="vertical">
      {children}
    </AutoLayout>
  </AutoLayout>
);

function checkReducer(state: CheckState) {
  switch (state) {
    case "unchecked":
      return "checked";
    case "checked":
      return "not-applicable";
    case "not-applicable":
      return "unchecked";
  }
}

function Widget() {
  const [contrastMinimum, setContrastMinimum] = useSyncedState<CheckState>(
    "contrast-minimum",
    "unchecked",
  );
  const [resizeText, setResizeText] = useSyncedState<CheckState>("resize-text", "unchecked");
  const [touchArea, setTouchArea] = useSyncedState<CheckState>("touch-area", "unchecked");
  const [interactionState, setInteractionState] = useSyncedState<CheckState>(
    "interaction-state",
    "unchecked",
  );
  const [designToken, setDesignToken] = useSyncedState<CheckState>("design-token", "unchecked");
  const [reactCodeGen, setReactCodeGen] = useSyncedState<CheckState>("react-code-gen", "unchecked");

  return (
    <AutoLayout
      fill="#FFFFFF"
      cornerRadius={16}
      direction="vertical"
      height="hug-contents"
      spacing={20}
      padding={16}
      width={480}
    >
      <Text fontSize={24} fontWeight="bold">
        Checklist
      </Text>
      <AutoLayout width="fill-parent" direction="vertical" spacing={16}>
        <CheckItem
          state={contrastMinimum}
          onClick={() => setContrastMinimum(checkReducer(contrastMinimum))}
        >
          <Text fontWeight="semi-bold">접근 가능한 텍스트 대비</Text>
          <Text fill="#4D5159" width="fill-parent">
            컨텐츠가 인식될 수 있도록 충분한 대비를 가져야 합니다. 본문 컨텐츠는 Lc 75 이상, 본문이
            아닌 텍스트는 Lc 60 이상을 충족해야 합니다. / APCA Contrast
          </Text>
        </CheckItem>
        <CheckItem state={resizeText} onClick={() => setResizeText(checkReducer(resizeText))}>
          <Text fontWeight="semi-bold">유저가 조정 가능한 텍스트 크기</Text>
          <Text fill="#4D5159" width="fill-parent">
            텍스트 크기는 유저 설정에 의해 조정될 수 있어야 합니다. Variable Mode에 따라 변경된
            텍스트 크기에 컴포넌트가 알맞게 반응하는지 확인하세요. / WCAG 1.4.4 Resize Text
          </Text>
        </CheckItem>
        <CheckItem state={touchArea} onClick={() => setTouchArea(checkReducer(touchArea))}>
          <Text fontWeight="semi-bold">최소 터치 영역</Text>
          <Text fill="#4D5159" width="fill-parent">
            버튼, 링크 등의 터치 요소는 최소 24x24의 터치 영역을 가져야 합니다. 44x44 이상이
            권장됩니다. 터치 요소들의 터치 영역이 프레임에 표현되고 있는지 확인하세요. / WCAG 2.5.5
            Target Size, WCAG 2.5.8 Target Size (Minimum)
          </Text>
        </CheckItem>
        <CheckItem
          state={interactionState}
          onClick={() => setInteractionState(checkReducer(interactionState))}
        >
          <Text fontWeight="semi-bold">상호작용 및 상태 표현</Text>
          <Text fill="#4D5159" width="fill-parent">
            상호작용이 가능한 컴포넌트는 상태 표현을 제공해야 합니다. Enabled, Pressed, Disabled 등
            상태에 따라 사용자에게 충분한 시각적 정보를 제공하는 지 확인하세요.
          </Text>
        </CheckItem>
        <CheckItem state={designToken} onClick={() => setDesignToken(checkReducer(designToken))}>
          <Text fontWeight="semi-bold">디자인 토큰</Text>
          <Text fill="#4D5159" width="fill-parent">
            컴포넌트의 디자인 요소에 디자인 토큰이 적용되어 있는지 확인하세요. Fill, Stroke, Corner
            Radius, Auto Layout 등의 속성에 Variable이 적용되어 있는지 확인하세요.
          </Text>
        </CheckItem>
        <CheckItem state={reactCodeGen} onClick={() => setReactCodeGen(checkReducer(reactCodeGen))}>
          <Text fontWeight="semi-bold">React 코드 생성</Text>
          <Text fill="#4D5159" width="fill-parent">
            가능한 경우, Figma 컴포넌트는 대응되는 React 코드로 변환되어야 합니다. figma-codegen
            플러그인에서 해당 컴포넌트의 변환 규칙이 작성되어 있는지 확인하세요.
          </Text>
        </CheckItem>
      </AutoLayout>
    </AutoLayout>
  );
}
widget.register(Widget);
