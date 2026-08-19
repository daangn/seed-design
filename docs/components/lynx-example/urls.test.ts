import { describe, expect, it } from "bun:test";
import { configuredLynxBundleOrigin, createLynxExampleUrls } from "./urls";

describe("Lynx 예제 URL", () => {
  it("HTTP(S) origin만 설정값으로 사용한다", () => {
    expect(configuredLynxBundleOrigin("https://docs.example.com/path")).toBe(
      "https://docs.example.com",
    );
    expect(configuredLynxBundleOrigin("lynx://open")).toBeUndefined();
  });

  it("native URL에는 fullscreen을, Explorer URL에는 인코딩한 native URL을 넣는다", () => {
    const urls = createLynxExampleUrls(
      "/__lynx__/badge/preview.12345678.lynx.bundle",
      "http://192.168.0.10:3000",
    );
    expect(urls.native).toBe(
      "http://192.168.0.10:3000/__lynx__/badge/preview.12345678.lynx.bundle?fullscreen=true",
    );
    expect(urls.qr).toBe(urls.native);
    expect(urls.explorer).toBe(`lynx://open?url=${encodeURIComponent(urls.native)}`);
    expect(urls.loopback).toBe(false);
  });

  it("loopback origin을 구분한다", () => {
    expect(createLynxExampleUrls("/__lynx__/a.lynx.bundle", "http://localhost:3000").loopback).toBe(
      true,
    );
  });
});
