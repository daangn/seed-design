import { Suspense } from "react";
import { PreferenceProvider } from "./hooks/usePreference";
import { SnackbarProvider } from "seed-design/ui/snackbar";
import { Stack } from "./stackflow";
import { useURLSync } from "./hooks/useUrlSync";

const App = () => {
  useURLSync();

  return (
    <PreferenceProvider>
      <SnackbarProvider>
        <Suspense>
          <Stack />
        </Suspense>
      </SnackbarProvider>
    </PreferenceProvider>
  );
};

export default App;
