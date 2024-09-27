import { Button, Container, TextboxMultiline, render } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import type {
  RequestComponentKeyHandler,
  RequestComponentPropertyDefinitionsHandler,
  RequestCssHandler,
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
        onClick={useCallback(() => emit<RequestComponentKeyHandler>("REQUEST_COMPONENT_KEY"), [])}
      >
        GET ComponentKey
      </Button>
      <Button fullWidth onClick={useCallback(() => emit<RequestCssHandler>("REQUEST_CSS"), [])}>
        GET Global CSS
      </Button>
      <TextboxMultiline grow value={code ?? ""} />
    </Container>
  );
}

export default render(Plugin);
