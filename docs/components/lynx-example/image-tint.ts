const TINT_COLOR_ATTRIBUTE = "tint-color";
const TINTED_IMAGE_SELECTOR = `x-image[${TINT_COLOR_ATTRIBUTE}]`;

/** img의 `object-fit`과 같은 크기로 mask를 그려야 원본 아이콘과 같은 자리에 색이 칠해진다. */
const MASK_SIZE_BY_OBJECT_FIT: Record<string, string> = {
  fill: "100% 100%",
  contain: "contain",
  cover: "cover",
  none: "auto",
  "scale-down": "contain",
};

function clearImageTint(img: HTMLImageElement) {
  img.style.removeProperty("mask");
  img.style.removeProperty("background-color");
  img.style.removeProperty("object-position");
}

function syncImageTint(image: Element) {
  const img = image.shadowRoot?.querySelector("img");
  if (!img) {
    if (!customElements.get(image.localName)) {
      void customElements.whenDefined(image.localName).then(() => syncImageTint(image));
    }
    return;
  }

  const tintColor = image.getAttribute(TINT_COLOR_ATTRIBUTE);
  const src = image.getAttribute("src");
  if (!tintColor || !src || !CSS.supports("color", tintColor)) {
    clearImageTint(img);
    return;
  }

  const maskUrl = JSON.stringify(new URL(src, document.baseURI).href);
  const maskSize = MASK_SIZE_BY_OBJECT_FIT[getComputedStyle(img).objectFit] ?? "100% 100%";
  img.style.setProperty("mask", `url(${maskUrl}) center / ${maskSize} no-repeat`);
  img.style.setProperty("background-color", tintColor);
  // 원본 픽셀은 content box 밖으로 밀어 숨기고, mask로 잘린 배경색만 보이게 한다.
  img.style.setProperty("object-position", "-99999px -99999px");
}

/**
 * Lynx Web의 `x-image`는 native `tint-color`를 렌더링하지 않는다.
 * 문서 미리보기에서만 `tint-color`가 있는 `x-image`의 shadow root `img`에 원본 이미지를 mask로 적용해
 * 브라우저에서도 아이콘이 tint 색으로 보이게 한다.
 */
export function observeLynxImageTint(root: ShadowRoot) {
  for (const image of root.querySelectorAll(TINTED_IMAGE_SELECTOR)) syncImageTint(image);

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        if (record.target instanceof Element && record.target.localName === "x-image") {
          syncImageTint(record.target);
        }
        continue;
      }
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(TINTED_IMAGE_SELECTOR)) syncImageTint(node);
        for (const image of node.querySelectorAll(TINTED_IMAGE_SELECTOR)) syncImageTint(image);
      }
    }
  });
  observer.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [TINT_COLOR_ATTRIBUTE, "src"],
  });

  return () => observer.disconnect();
}
