import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 16,
            background: "#FFF0F0",
            borderRadius: 8,
            margin: 16,
            fontSize: 13,
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
          }}
        >
          <strong style={{ color: "#D00" }}>Renderer Error:</strong>
          <br />
          {this.state.error.message}
          <br />
          <br />
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{
              padding: "4px 12px",
              borderRadius: 4,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
