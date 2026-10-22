# Syncing from Base44

**What this is.** How to copy the latest code of Edgework's two apps into this GitHub repository. The apps are Owl Farm (Alex Cheeseman's private writing app) and the public Edgework site. Both run on **Base44**, an app-building platform, and that is where they change. This repo keeps a public copy for reference and reuse, so every sync must leave **secrets** out. Secrets are private keys and passwords, such as the key that lets the 6am Wire job run and the Telegram bot's token. In the steps below, a **sandbox** is Base44's editable copy of an app, and **tar** is a standard command that bundles files into one archive.

## The quick way

Ask Claude: **"Sync Owl Farm and the Edgework site from Base44 into the edgework repo."** It will follow the steps below.

## The steps

1. In each app's Base44 sandbox, tar the app without boilerplate or binaries:
   `src base44 scripts public index.html package.json tailwind.config.js vite.config.js postcss.config.js jsconfig.json components.json eslint.config.js`,
   excluding `src/components/ui`, `node_modules`, `dist`, `.git`, `public/marks`, `public/fonts` and the generated auth pages
   (`Register`, `ResetPassword`, `ForgotPassword`, `OAuthConsent`).
2. **Blank secrets before anything leaves the sandbox.** Every workflow in `base44/workflows/` (the 6am Wire, the daily nudge, Learn from edits, the Sunday letter) can carry the `OWL_WIRE_KEY` value in its payload; replace it with `<OWL_WIRE_KEY: set in Base44 secrets>`.
3. Unpack into `owl-farm/` or `edgework-site/`, replacing the old snapshot.
4. Scan before committing:
   `grep -rnE "ghp_|sk-[A-Za-z0-9]{20}|AKIA|Bearer [A-Za-z0-9]|preview_token" --exclude-dir=.git .`
   and check that the real `OWL_WIRE_KEY` value does not appear anywhere.
5. Commit with a message naming what changed in the app, and add anything learned to `docs/learnings.md`.

## If a secret ever lands here

Rotate it in Base44 first (set a new `OWL_WIRE_KEY` secret and update the workflow payload), then remove it from the repo. Removing it from Git history alone is not enough once it has been public.
