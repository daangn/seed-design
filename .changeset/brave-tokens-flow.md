---
"@seed-design/mcp": minor
---

`createFigmaRestClient`에서 OAuth Bearer 토큰 인증을 지원합니다.

- 기존 PAT(Personal Access Token) 방식 외에 OAuth 토큰으로도 Figma REST API를 호출할 수 있습니다.
- `{ personalAccessToken: string }` 또는 `{ oAuthToken: string }` 중 하나를 전달하면 됩니다.
- `FigmaRestClientOptions` 타입이 새롭게 export됩니다.

```ts
// PAT 방식 (기존)
createFigmaRestClient({ personalAccessToken: "figd_..." })

// OAuth Bearer 방식 (신규)
createFigmaRestClient({ oAuthToken: "eyJ..." })
```
