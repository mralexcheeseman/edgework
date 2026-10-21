# Syncing from Base44

Base44 is where both apps run and change. This repo is public, so every sync must leave secrets out.

## The quick way

Ask Claude: **"Sync Owl Farm and the Edgework site from Base44 into the edgework repo."** It will follow the steps below.

## The steps

1. In each app's Base44 sandbox, tar the app without boilerplate or binaries:
   `src base44 scripts public index.html package.json tailwind.config.js vite.config.js postcss.config.js jsconfig.json components.json eslint.config.js`,
   excluding `src/components/ui`, `node_modules`, `dist`, `.git`, `public/marks`, `public/fonts` and the generated auth pages
   (`Register`, `ResetPassword`, `ForgotPassword`, `OAuthConsent`).
2. **Blank secrets before anything leaves the sandbox.** The Wire workflow (`base44/workflows/The 6am Wire.jsonc`) carries the `OWL_WIRE_KEY` value in its payload; replace it with `<OWL_WIRE_KEY: set in Base44 secrets>`.
3. Unpack into `owl-farm/` or `edgework-site/`, replacing the old snapshot.
4. Scan before committing:
   `grep -rnE "ghp_|sk-[A-Za-z0-9]{20}|AKIA|Bearer [A-Za-z0-9]|preview_token" --exclude-dir=.git .`
   and check that the real `OWL_WIRE_KEY` value does not appear anywhere.
5. Commit with a message naming what changed in the app, and add anything learned to `docs/learnings.md`.

## If a secret ever lands here

Rotate it in Base44 first (set a new `OWL_WIRE_KEY` secret and update the workflow payload), then remove it from the repo. Removing it from Git history alone is not enough once it has been public.
