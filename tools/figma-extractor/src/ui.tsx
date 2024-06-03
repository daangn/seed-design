import {
  Button,
  Container,
  TextboxMultiline,
  render,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import {
  RequestComponentKeyHandler,
  RequestComponentPropertyDefinitionsHandler,
  RequestCssVariablesHandler,
  ResponseHandler,
} from "./types";

function Plugin() {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const handler = (code: string) => {
      setCode(code);
    };
    const unsubscribe = on<ResponseHandler>("RESPONSE", handler);
    return () => {
      unsubscribe();
    };
  });

  return (
    <Container space="medium">
      <Button
        fullWidth
        onClick={useCallback(
          () =>
            emit<RequestComponentPropertyDefinitionsHandler>(
              "REQUEST_COMPONENT_PROPERTY_DEFINITIONS",
            ),
          [],
        )}
      >
        GET ComponentPropertyDefinitions
      </Button>
      <Button
        fullWidth
        onClick={useCallback(
          () => emit<RequestComponentKeyHandler>("REQUEST_COMPONENT_KEY"),
          [],
        )}
      >
        GET ComponentKey
      </Button>
      <Button
        fullWidth
        onClick={useCallback(
          () => emit<RequestCssVariablesHandler>("REQUEST_CSS_VARIABLES"),
          [],
        )}
      >
        GET CSS Variables
      </Button>
      <TextboxMultiline grow value={code ?? ""} />
    </Container>
  );
}

export default render(Plugin);
