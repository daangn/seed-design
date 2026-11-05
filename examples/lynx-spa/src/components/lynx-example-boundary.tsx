import { Component, type ReactNode } from "@lynx-js/react";
import { ActionButton, Text, VStack } from "@seed-design/lynx-react";
import type { LynxExampleId, LynxPlaygroundExample } from "../../../../docs/playground/lynx/types";

interface LynxExampleBoundaryProps {
  children: ReactNode;
  exampleId: LynxExampleId;
  load: LynxPlaygroundExample["load"];
  onBack: () => void;
}

interface LynxExampleBoundaryState {
  error: Error | null;
}

export class LynxExampleBoundary extends Component<
  LynxExampleBoundaryProps,
  LynxExampleBoundaryState
> {
  state: LynxExampleBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): LynxExampleBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error): void {
    console.error("Lynx 문서 예제를 불러오지 못했습니다.", error);
  }

  componentDidUpdate(previousProps: LynxExampleBoundaryProps): void {
    if (
      this.state.error &&
      (previousProps.exampleId !== this.props.exampleId || previousProps.load !== this.props.load)
    ) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <VStack className="flex-1" align="center" justify="center" gap="x4" px="x4">
        <Text textStyle="t5Bold" color="fg.neutral">
          예제를 불러오지 못했습니다.
        </Text>
        <ActionButton bindtap={this.props.onBack}>목록으로</ActionButton>
      </VStack>
    );
  }
}
