import type React from "react";

import { Suspense } from "react";
import { PreferenceProvider } from "./hooks/usePreference";
import { useIframeSync } from "./hooks/useIframeSync";
import { SnackbarProvider } from "./seed-design/ui/snackbar";
import { Stack } from "./stackflow";

const App: React.FC = () => {
  useIframeSync();

  return (
    <div style={{ minHeight: "100vh" }}>
      <PreferenceProvider>
        <SnackbarProvider>
          <Suspense>
            <Stack />
          </Suspense>
        </SnackbarProvider>
      </PreferenceProvider>
    </div>
  );
};

export default App;
