import { ActionButton, Box } from "@seed-design/react";

function App() {
  return (
    <Box display="flex" padding="x6" gap="x4" borderColor="stroke.neutral" borderWidth={1}>
      <ActionButton>Hello</ActionButton>
      <ActionButton variant="neutralSolid">Hello</ActionButton>
      <ActionButton variant="neutralWeak">Hello</ActionButton>
    </Box>
  );
}

export default App;
