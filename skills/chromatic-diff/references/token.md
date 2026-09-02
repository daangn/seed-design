# Getting a Chromatic API token

`CHROMATIC_TOKEN` holds an **OAuth access token** for Chromatic's GraphQL API at `https://www.chromatic.com/api`.

## It is not the project token

Chromatic has two separate credential systems, and the more widely known one is the wrong one here:

| Credential | Where it comes from | What it opens |
| --- | --- | --- |
| Project token (`CHROMATIC_PROJECT_TOKEN`) | Chromatic project settings; used by the CLI and CI | `index.chromatic.com`, the CLI's own endpoint |
| OAuth access token | Signing in from the Storybook Visual Tests addon | `www.chromatic.com/api`, which this skill uses |

A project token will not authenticate any request this skill makes. The CLI never writes a credential to disk either — it reads `CHROMATIC_PROJECT_TOKEN` from the environment and nothing else — so there is no existing file to reuse.

## How to get one

1. Make sure `@chromatic-com/storybook` is registered in the Storybook config. Storybook adds it during `storybook init`, so it is usually already there.
2. Start Storybook.
3. Open the **Visual Tests** panel and sign in. A browser tab opens for device authorization; approve it there.
4. In the DevTools console **on the Storybook page itself** (the top frame, not the preview iframe), read the stored token:

   ```js
   copy(
     localStorage.getItem(
       "chromaui/addon-visual-tests/access-token/https://www.chromatic.com",
     ),
   );
   ```

5. Export it in the shell that will run this skill's scripts:

   ```sh
   export CHROMATIC_TOKEN='eyJ...'
   ```

Put the export in a shell profile or a secrets manager if you want it to persist. Never commit it, never paste it into a file inside the repo, and never echo it — the scripts read it straight from the environment so its value never has to be seen.

## If sign-in is refused

The addon showing **"You must be a beta user to use this addon at this time."** means the account is not in Chromatic's OAuth beta. The gate is enforced when the token is issued, so there is no way around it from this side. Ask Chromatic to add the account, and until then the build and story metadata this skill reports is out of reach.

## Renewing

These tokens last 30 days, and the scripts fail with a clear message once one has expired. Repeat the steps above to refresh it.
