# Edgework

Alex Cheeseman's writing system: a private newsroom that turns daily reading into posts, and a public site where the results live. After Hunter S. Thompson: the manuscript filed at 4am, red ink, no apologies.

| Part | What it is | Live | Source here |
| --- | --- | --- | --- |
| **Owl Farm** | Private newsroom (Base44): the Wire, the Desk, the Typewriter, Cut-up | [owl-farm-notes.base44.app](https://owl-farm-notes.base44.app) (login) | [`owl-farm/`](owl-farm) |
| **Edgework site** | Public home: Positions, essays, Dispatches, Work, About | [edge-work-vault.base44.app](https://edge-work-vault.base44.app) (login until launch) | [`edgework-site/`](edgework-site) |
| **Design system** | Tokens, mark library, fonts, component specs, decisions | | [`mralexcheeseman/design` → `brands/edgework`](https://github.com/mralexcheeseman/design/tree/main/brands/edgework) |
| **The Last Animal** | Where the long essays live | [thelastanimal.base44.app](https://thelastanimal.base44.app) | (separate Base44 app) |

## Start here

- [`docs/daily-routine.md`](docs/daily-routine.md): what to do every day and every Friday (also in Google Docs: [Edgework: the daily routine](https://docs.google.com/document/d/1gikugQ1lH_wYqYDRVcQObTYvu3IeZxAYU5rOnohq720/edit)).
- [`docs/learnings.md`](docs/learnings.md): what worked, what didn't, and how to reuse it for the next project.
- [`docs/build-spec.md`](docs/build-spec.md): the original spec Owl Farm was built from.
- [`docs/sources.md`](docs/sources.md): which thinkers the Wire reads, and why the others are lens-only.
- [`docs/sync.md`](docs/sync.md): how to bring changes from Base44 back into this repo without leaking secrets.

## How the code here relates to Base44

Base44 is the source of truth for both apps; these folders are snapshots for reference and reuse, last synced 21 Oct 2026 (see `docs/sync.md`). Base44's boilerplate (`src/components/ui`, the auth pages) and the binary assets (`public/marks`, `public/fonts`) are left out; the assets' master copy is in the design repo. To change an app, edit it in Base44 (or ask Claude to through the Base44 sandbox), then refresh the snapshot here.

| App | Base44 app ID | Editor |
| --- | --- | --- |
| Owl Farm | `6ad79082c42f60485f1e32ef` | [editor](https://app.base44.com/apps/6ad79082c42f60485f1e32ef/editor/preview) |
| Edgework site | `6ad8b0ed795af7aa9ead4d02` | [editor](https://app.base44.com/apps/6ad8b0ed795af7aa9ead4d02/editor/preview) |

Secrets are not in this repo. The Wire's workflow key (`OWL_WIRE_KEY`) lives in Owl Farm's Base44 secrets; the snapshot of `The 6am Wire.jsonc` has it blanked.

## Tools

- [`owl-farm/scripts/build-marks.py`](owl-farm/scripts/build-marks.py): rebuilds the mark library from the Recraft source scans (un-multiply against local paper, feather, trim, webp).
- [`tools/unmultiply.py`](tools/unmultiply.py): the paper-removal step on its own, for any new scan.
- [`owl-farm/scripts/check-feeds.mjs`](owl-farm/scripts/check-feeds.mjs): checks every thinker's feed for freshness and paywalls.
