import { ErrorBoundary } from "react-error-boundary";

function Fallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

interface Props {
  children: React.ReactNode;
}

export default function (props: Props) {
  const { children } = props;
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
}
