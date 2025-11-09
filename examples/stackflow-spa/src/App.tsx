import type React from "react";
import { Suspense } from "react";
import { PreferenceProvider } from "./hooks/usePreference";
import { useIframeSync } from "./hooks/useIframeSync";
import { SnackbarProvider } from "seed-design/ui/snackbar";
import { Stack } from "./stackflow";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

function AppContent() {
  const { setTheme } = useTheme();

  useIframeSync({ onThemeChange: setTheme });

  return (
    <PreferenceProvider>
      <SnackbarProvider>
        <Suspense>
          <Stack />
        </Suspense>
      </SnackbarProvider>
    </PreferenceProvider>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
