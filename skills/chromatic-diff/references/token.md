# Getting a Chromatic API token

`CHROMATIC_TOKEN` holds an **OAuth access token** for Chromatic's GraphQL API at `https://www.chromatic.com/api`.

## It is not the project token

Chromatic has two separate credential systems, and the more widely known one is the wrong one here:

- Project token (`CHROMATIC_PROJECT_TOKEN`): issued in Chromatic project settings and used by the CLI and CI. Opens only `index.chromatic.com`, the CLI's own endpoint.
- OAuth access token: issued by signing in from the Storybook Visual Tests addon. Opens `www.chromatic.com/api`, which this skill uses.

A project token will not authenticate any request this skill makes. The CLI never writes a credential to disk either — it reads `CHROMATIC_PROJECT_TOKEN` from the environment and nothing else — so there is no existing file to reuse.

## How to get one

These steps match `@chromatic-com/storybook` 5.x, the version `docs/` uses.

1. Make sure `@chromatic-com/storybook` is registered in the Storybook config. Storybook adds it during `storybook init`, so it is usually already there.
2. Start Storybook (`bun storybook`) and open it at a loopback origin: `http://localhost:<port>` or `http://127.0.0.1:<port>`. A portless hostname does not work, whether `*.test` or `*.localhost`:
   - Over plain HTTP on a non-loopback host the page is not a secure context, so sign-in fails with `window.crypto.randomUUID is not a function`.
   - Chromatic builds the OAuth `redirect_uri` from the page's origin and accepts only loopback addresses, so a `*.localhost` subdomain is refused with `redirect_uri must be a loopback address or a pre-registered redirect URI`.
3. Open the **Visual Tests** panel and sign in. A browser tab opens for device authorization; approve it there.
4. In the DevTools console **on the Storybook page itself** (the top frame, not the preview iframe), copy the access token. The addon stores a JSON record under a key that ends with a Storybook id (`unscoped` when none is set), and the scripts need only its `accessToken` field:

   ```js
   copy(
     JSON.parse(
       Object.entries(localStorage).find(([key]) =>
         key.startsWith("chromaui/addon-visual-tests/access-token/https://www.chromatic.com/"),
       )[1],
     ).accessToken,
   );
   ```

5. Export it in the shell that will run this skill's scripts:

   ```sh
   export CHROMATIC_TOKEN="$(pbpaste)"
   ```

Put the export in a shell profile or a secrets manager if you want it to persist. A running agent session keeps the environment it started with, so restart the session after changing a profile. Never commit the token, never paste it into a file inside the repo, and never echo it — the scripts read it straight from the environment so its value never has to be seen.

## If sign-in is refused

The addon showing **"You must be a beta user to use this addon at this time."** means the account is not in Chromatic's OAuth beta. The gate is enforced when the token is issued, so there is no way around it from this side. Ask Chromatic to add the account, and until then the build and story metadata this skill reports is out of reach.

## Renewing

An access token from addon 5.x lasts one hour. The addon renews its own copy with the refresh token stored next to it, but the copy in `CHROMATIC_TOKEN` is never renewed, so expect to repeat the steps above for each investigation and start the investigation right after copying. An expired token fails API calls with a generic authorization error that reads like a permissions problem, so `scripts/preflight.ts` decodes the expiry up front and reports what is left, or `token EXPIRED … ago`.
