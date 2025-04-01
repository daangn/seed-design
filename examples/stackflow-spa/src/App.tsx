import type React from "react";

import { SnackbarProvider } from "./seed-design/ui/snackbar";
import { PreferenceProvider } from "./hooks/usePreference";
import { Stack } from "./stackflow";
import { Suspense } from "react";

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
