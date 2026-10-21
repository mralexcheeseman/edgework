> **What this is.** The original plan Owl Farm was built from (20 October 2026), kept as written. Owl Farm is the private app behind Alex Cheeseman's publication Edgework: it reads articles by the writers he follows, matches them to his beliefs (his Positions) and helps him draft posts. Some names changed after this was written (for example the Position arenas), and the Desk now drafts in two AI passes. What changed since is in [`learnings.md`](learnings.md); every term is in the [glossary](glossary.md).

# Edgework newsroom: Base44 build spec

Private newsroom ("Owl Farm") that turns Alex's thinking into Edgework posts. Written content and visual assets only: no teleprompter, no video editor.

Design reference: canvas https://claude.ai/artifact/81MWsBJSGEbyhuRdoBxWrT (row "Edgework templates", board "D · Edgework mark library").

## 1. Principles

- **Nothing starts from a blank AI prompt.** Every draft starts from Alex's own reaction (one typed line or a voice note) plus a Spark, a Position or a Collision.
- **The machine supplies the accident, Alex supplies the argument.** The cut-up machine and the Wire generate raw material only. The Desk drafts, and only from Alex's input.
- **One daily action.** Open the Wire, keep or kill five collisions, write one reaction. Everything else is optional.
- **Private.** Only Alex can log in (admin). Nothing is public; the output is exported images and text.

## 2. Data (Base44 entities)

| Entity | Fields | Seeded from |
|---|---|---|
| Thinker | name, cluster, tier (1–3), tags[], website, newsletter, feed_url, core_position, active | Notion "Thinkers" database (53 active rows; Tom Goodwin is duplicated, so merge him) |
| Position | statement, arena (marketing-orthodoxy, ai-knowledge-work, independent-judgement), source_essay, source_url, conviction (1–5) | Extracted by Claude from the 37 Last Animal essays before the build (no credits) |
| SourceItem | title, url, thinker, published_at, summary, core_claim, quote | Daily job |
| Collision | source_item, position, relation (supports, challenges, extends), why (one line), status (new, kept, killed), reaction | Daily job, then Alex |
| Spark | body, tag, origin (own, cut-up, collision), source | The Last Animal Sparks (15) plus Alex |
| Draft | format (dispatch, hey_rube, expense_report, essay, routine), title, body, reaction, lenses[] (up to 3 thinkers), status (idea, drafted, edited, exported, published), spark, collision | The Desk |
| Asset | draft, template, mark_mix, size (1080×1350, 1080×1920), image_url, created_at | The Typewriter |

## 3. Screens

1. **The Wire** (home). Today's collisions, at most 10. Each card shows the thinker, the headline, one line on why it hits a Position, and the Position itself. Two buttons: Keep and Kill. Keeping one opens a single-line "your reaction" field.
2. **Cut-up machine.** Fragments from Sparks, Positions and kept SourceItem quotes, cut into strips. A lever re-pastes them at random (GSAP ScrambleText, with paper-strip motion). Pin a line to save it as a Spark (origin: cut-up).
3. **The Desk.** Pick a Spark or Collision, type a reaction (required before drafting), choose a format and up to three lenses (primary thinker, contrast thinker, Alex). The draft follows Alex's Thinker-to-Content quality bar: a clear enemy, a reason it matters now, a line people would repeat, UK English, and no "Not X, but Y" constructions. The editor shows typewriter type on paper; edits save as Alex types.
4. **The Typewriter.** Choose a template, and the draft text flows in. A "Mark mix" dial reshuffles the stains. Export to PNG at 1080×1350 or 1080×1920. Routine (Reel) exports a storyboard plus script; the MP4 render happens outside Base44 (Remotion).
5. **Archive.** Every Draft and Asset, filterable by format, arena and status.

## 4. Daily job (Base44 scheduled backend function, 06:00 UK)

1. For each active Tier 1 thinker with a feed_url, fetch posts from the last 48 hours and store any new ones as SourceItems.
2. For each new item, ask the LLM to match it against all Positions and return at most one Collision: the relation plus a one-line reason. If nothing is strong, return nothing.
3. Keep at most 10 Collisions a day, ranked by strength. A Wire with nothing new is fine.

## 5. Edgework design system

- **Colours:** manuscript #F1EBDD (with the paper scan), ink #121110, red ink #C4211A, coffee #8A6A3B.
- **Type:**
  - Anton, with the letterpress mask, for shouted headlines.
  - Special Elite for manuscript text, swapped to TT2020 once it's in the Drive folder. Every letter gets a little random baseline and angle jitter.
  - Courier Prime for labels and UI.
  - Rock Salt for margin scrawl: one line per card, maximum.
- **Fixed lettering:** the letterpress "HEY RUBE." (image), plus a rubber-stamp alternative.
- **Marks:** 28 transparent PNGs at up to 2400 px (coffee ×5, red ink ×4, smudge ×3, burn ×2, tape ×3, red pen ×6, highlighter ×3). They're blended onto the paper (multiply), apart from tape. Each card uses 3–4 marks picked from slot rules by the Mark mix value, so no two cards match.
- **Rules:** one highlighted phrase per card, at most. Tape always sits on a corner. Never cover the headline with a mark.
- **Brand home:** the storefront-kit CLAUDE.md convention keeps each brand's system in mralexcheeseman/design under brands/<brand>. Edgework should get a brands/edgework folder there (tokens, marks, templates) as a follow-up.

## 6. Third-party pieces

- **gsap** (free, including SplitText and ScrambleText): type-on and cut-up shuffle.
- **howler**: typewriter key, carriage-return and bell sounds. The sound files still need sourcing or recording.
- **html-to-image**: PNG export of templates.
- **Remotion** (outside Base44): Reel MP4 with type-on and sound, from the Routine storyboard.

## 7. Build plan (to keep credits under control)

1. **Before Base44:** Claude extracts the Positions from the essays and exports Thinkers from Notion. Alex approves the Positions list.
2. **One builder turn:** create the app, the entities and the five screens as plain scaffolding, with no styling requests.
3. **Direct code edits (Claude, via the Base44 sandbox):** port the canvas templates, the design system, the mark library, gsap and the export. The builder chat is not used for visual tweaks.
4. **Seed data** with create_entities (Thinkers, Positions, Sparks).
5. **Backend function** for the daily job, tested once by hand.
6. **Checkpoint**, then the preview link to Alex.

## 8. Open items

- Fonts: TT2020 (free) and any licensed headline face go in a Drive folder.
- Sounds: record a real typewriter (best option) or source CC0 recordings.
- Feed URLs: about half the Tier 1 thinkers have no feed in Notion, so they need filling in.
- Name of the private app: Owl Farm, or something else.
