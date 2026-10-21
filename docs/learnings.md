# Learnings

What we learned building Owl Farm and the Edgework site (Oct 2026), written so the next project can start from here. Newest lessons are added at the bottom of each section.

## Product

- **Nothing starts from a blank prompt.** Every draft starts from Alex's own one-line reaction plus a collision, a Spark or a Position. Drafts written without a reaction read as AI and were thrown away. The Desk now refuses to draft until step 3 ("What do you think?") is filled in.
- **A headline is not enough to react to.** The first Desk showed a dropdown of headlines and Alex couldn't react to them. It was rebuilt as four steps: pick, briefing (Position, why it hits, synopsis, link, highlighted lines), reaction with three prompts, then format and lens. Give the person the material, then ask for the opinion.
- **Explain jargon in the product.** "Lenses" confused people until the Desk said, in plain words, that the default lens is the piece's own writer and a contrast thinker is optional.
- **Let the reader steer the machine.** Highlighting lines from the original ("Lines worth stealing", "Your highlights") gave the drafts quotes Alex actually cared about, and kept them honest.
- **One action a day.** The routine works because it is one collision, one reaction, one card. More than that and it stops happening.
- **Publish less, link more.** The Edgework site files the Last Animal essays and links out instead of copying them, so each essay has one home.

## Sources and synopses

- **Only read what you can read in full.** Synopses written from feed teasers or paywalled pages were vague, and the "lines worth stealing" were invented. The Wire now fetches the article, strips nav and scripts, and only counts it as read when there are at least 800 characters of body text and no paywall pattern. Everything else is stored as a stub and skipped. Lines are only kept when the full article was read.
- **Filter shared feeds by author.** Collab Fund's feed carries several writers, so the Thinker record has `feed_author` and the Wire filters on it.
- **Strength threshold on matches.** The first run produced weak collisions. Only matches the model scores at 4/5 or more are kept, ranked by strength plus Position conviction, capped at 10 a day.
- **Write the "why" to the person.** Collision reasons addressed to "you" read far better than third-person summaries.
- Check feeds with `check-feeds.mjs` before adding a thinker: many big names have no feed, a paywalled one, or haven't posted in years (see `sources.md`).

## Writing quality

- **Feed the model the writer, not a description of the writer.** Drafts got better when the prompt carried a fingerprint of Alex's voice plus three short passages of his real writing (`voice.md`), not adjectives like "punchy".
- **Borrow moves, never sentences.** Studying the thinkers we follow (and Cole Schafer for personality) gave a list of techniques per writer and six "flourish" moves; a draft uses two or three (`craft-playbook.md`). The prompt forbids imitating any named writer.
- **Give each format a recipe.** A Dispatch, Routine or Essay gets a numbered structure (scene, jab, reframe, evidence, callback). Free-form prompts produced throat-clearing openings.
- **Write, then edit, in two passes.** A writer pass picks an angle, an enemy and an opening; an editor pass scores ten checks and rewrites what fails. In A/B tests the two-pass drafts opened on concrete scenes and ended on callbacks; the one-pass drafts opened on abstractions. The editor also cut claims that weren't in the material on its own.
- **Short formats need options, not one shot.** The Hey Rube improved least, so the editor now returns three alternative lines and the Desk lets Alex tap one in.
- **Check the machine's honesty in code.** A filter replaces dashes and US spellings; any quote of 25+ characters not found word for word in the material is flagged on the Desk.
- **Cost:** drafts run on Claude Opus 5.5 through Base44's `InvokeLLM` (Base44 credits, no API key), about a minute per draft.
- **Shared feeds need the page's byline.** Collab Fund's feed has no author fields, so Housel never matched. The Wire now reads `<meta name="author">` on the article page. A plain text search for the name is useless: every page lists him in the sidebar.

## Design

- **Photographic marks, not drawn ones.** "Photo realistic, not stock" was the brief. Stains were generated as flatbed scans on white paper (Recraft), then the paper was removed by un-multiplying against a local estimate of the paper colour (48 px grid, MaxFilter 7, alpha threshold 0.10, edge feather). Tape needed real background removal instead. The scripts are in `tools/` and `owl-farm/scripts/`; the library's master copy is in the design repo.
- **Never set signature lettering in a font.** "HEY RUBE." in Anton looked like a stock font next to real stains. It's now a letterpress scan, and Anton headlines get a letterpress mask so they read as inked.
- **TT2020 is the free typewriter face that works** (SIL OFL, real strike variation). Add per-word jitter (±1.2 px, ±0.66°) from a stable hash so the same text always looks the same.
- **Seed everything.** Marks, tilts and jitter come from a hash of the record's number, so a card looks the same every time it renders.
- **Highlighter only on paper.** On the black ground the scanned highlighter made text unreadable; there the phrase turns red-pen instead.
- **Stains go at edges.** Any stain over text failed review; slot rules keep them bleeding off corners and away from headlines.
- **Render and look.** Several bugs were only visible in screenshots: tape pushing text down (absolute children overridden by a `> *` rule), an entrance animation with `fill: both` blocking the hover lift, a `position: relative` class beating Tailwind's `absolute`. Screenshot at 1440 px and 390 px before calling anything done.
- The mustard ground was rejected; Edgework uses paper and a 4am black. Settled choices are in the design repo's `brands/edgework/decisions.md`.

## Base44

- **Use the builder once, then edit code directly.** One builder turn is good for scaffolding (entities, routes, auth). Visual work through the builder chat is slow, costly and drifts from the design system (it chose orange and slab serifs). Direct sandbox edits through the Base44 MCP are cheaper and exact.
- **Replace the builder's design guidelines** with the real design rules (`PATCH /api/apps/{id}` `design_guidelines`), or later builder turns will undo the design.
- The sandbox `run_command` times out at 60 s: run long jobs with `nohup … &` and poll their logs.
- Backend functions are Deno (`base44/functions/<name>/entry.ts`, `export default async function (req)`); entity list and filter results are read from `.items`.
- A scheduled workflow needs `namespace: "base44"` and `then: "end"`; pass a shared key in the payload and check it in the function so the endpoint isn't open.
- Private apps (`private_with_login`) block their own static assets from other sandboxes. Move assets through a public repo (the design repo) and `curl` them from `raw.githubusercontent.com`.
- The platform API can't bulk-delete records on a private app; mark junk as draft instead and delete it in the editor.
- The builder seeds invented "starter" content. Replace it with real content before anyone sees the app.

## Process

- **Approve content before building.** The Positions ledger was drafted in Notion and marked keep, cut or edit by Alex before any of it went into the app. That saved rework.
- **Design on a canvas first.** Three identity directions on the Claude Design canvas, then two more after feedback, got to "Edgework" in a day; building straight in code would not have.
- **Keep the system in the design repo**, and the apps pointing at it. When the site and the system disagree, the system wins.
- **Credits:** spend builder credits on scaffolding, not on pixels.
