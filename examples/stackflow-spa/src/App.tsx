import type React from "react";

import { Suspense } from "react";
import { PreferenceProvider } from "./hooks/usePreference";
import { SnackbarProvider } from "./seed-design/ui/snackbar";
import { Stack } from "./stackflow";

const App: React.FC = () => (
  <div>
    <PreferenceProvider>
      <SnackbarProvider>
        <Suspense>
          <Stack />
        </Suspense>
      </SnackbarProvider>
    </PreferenceProvider>
  </div>
);

export default App;
