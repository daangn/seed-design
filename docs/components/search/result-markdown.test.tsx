import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ResultMarkdown } from "./result-markdown";

describe("ResultMarkdown", () => {
  it("행이 담고 있는 인라인 마크다운과 검색어 하이라이트를 렌더한다", () => {
    const { container } = render(
      <ResultMarkdown>{"**<mark>button</mark>Props**를 `Primitive`에 넘깁니다"}</ResultMarkdown>,
    );

    expect(container.querySelector("strong > mark")?.textContent).toBe("button");
    expect(container.querySelector("code")?.textContent).toBe("Primitive");
  });

  it("볼드의 끝이 하이라이트되고 조사가 바로 붙으면 볼드가 풀린 채로 남는다", () => {
    // CommonMark의 flanking 규칙: 닫는 `**` 앞이 구두점(`>`)이고 뒤가 글자면 강조를 닫지
    // 못한다. 검색 서버가 마크다운 위에 `<mark>`를 씌우는 이상 렌더러 쪽에서 어쩔 수 없고,
    // 색인 14,789행 중 볼드 뒤에 조사가 바로 붙는 행은 64개다.
    const { container } = render(
      <ResultMarkdown>{"**<mark>능동문</mark>**을 사용해요"}</ResultMarkdown>,
    );

    expect(container.querySelector("strong")).toBeNull();
    expect(container.querySelector("mark")?.textContent).toBe("능동문");
  });

  it("링크는 텍스트로 남기고 문단은 블록 span으로 평탄화해 앵커 안에서 유효한 마크업을 만든다", () => {
    const { container } = render(
      <ResultMarkdown>{"첫 문단의 [링크](/react/overview)\n\n둘째 문단"}</ResultMarkdown>,
    );

    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("p")).toBeNull();
    expect(screen.getByText("링크")).toBeDefined();
    expect(container.querySelectorAll("span.block")).toHaveLength(2);
  });

  it("MDX 컴포넌트는 출처 배지와 속성값으로 렌더한다", () => {
    render(<ResultMarkdown>{'<FigmaImage alt="Elevation 원칙" />'}</ResultMarkdown>);

    expect(screen.getByText("이미지")).toBeDefined();
    expect(screen.getByText(/Elevation 원칙/)).toBeDefined();
  });

  it("Callout은 type에 해당하는 배지를 쓰고 본문을 함께 보여준다", () => {
    render(<ResultMarkdown>{"<Callout type='warn'>주의할 점</Callout>"}</ResultMarkdown>);

    const badge = screen.getByText("주의");

    expect(badge.className).toContain("bg-bg-warning-weak");
    expect(screen.getByText(/주의할 점/)).toBeDefined();
    // `type`은 배지가 이미 말하고 있으므로 속성값으로 또 적지 않는다.
    expect(screen.queryByText(/warn/)).toBeNull();
  });

  it("배지가 정해지지 않은 컴포넌트는 이름을 그대로 드러낸다", () => {
    render(<ResultMarkdown>{'<ProgressBoardTable caption="진행 현황" />'}</ResultMarkdown>);

    expect(screen.getByText("progressboardtable")).toBeDefined();
    expect(screen.getByText(/진행 현황/)).toBeDefined();
  });

  it("코드 스팬 안의 JSX는 컴포넌트가 아니라 코드로 남는다", () => {
    const { container } = render(
      <ResultMarkdown>{"`<AlertDialogTrigger>`는 dialog를 엽니다"}</ResultMarkdown>,
    );

    expect(container.querySelector("code")?.textContent).toBe("<AlertDialogTrigger>");
    expect(container.textContent).toContain("는 dialog를 엽니다");
  });
});
