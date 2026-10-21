# The daily routine

About 15 minutes a day, plus 30 minutes on Fridays. Also in Google Docs: [Edgework: the daily routine](https://docs.google.com/document/d/1gikugQ1lH_wYqYDRVcQObTYvu3IeZxAYU5rOnohq720/edit). A recurring 07:30 (London) calendar reminder links to it.

## Links

| | |
| --- | --- |
| Owl Farm (private newsroom) | [owl-farm-notes.base44.app](https://owl-farm-notes.base44.app) |
| The Wire | [/](https://owl-farm-notes.base44.app/) |
| The Desk | [/desk](https://owl-farm-notes.base44.app/desk) |
| Typewriter | [/typewriter](https://owl-farm-notes.base44.app/typewriter) |
| Cut-up | [/cut-up](https://owl-farm-notes.base44.app/cut-up) |
| Archive | [/archive](https://owl-farm-notes.base44.app/archive) |
| Positions / Thinkers | [/positions](https://owl-farm-notes.base44.app/positions) · [/thinkers](https://owl-farm-notes.base44.app/thinkers) |
| Edgework site | [edge-work-vault.base44.app](https://edge-work-vault.base44.app) |
| The Last Animal | [thelastanimal.base44.app](https://thelastanimal.base44.app) |
| Positions ledger (Notion) | [Edgework: Positions ledger](https://app.notion.com/p/3ff58b5148c4816fba94f3d91c7dc351) |
| Identity canvas | [Claude Design](https://claude.ai/artifact/81MWsBJSGEbyhuRdoBxWrT) |

## How it works

At 6am the Wire reads new, free-to-read pieces from your thinkers and checks each against your Positions. Where a piece supports, challenges or extends one, it files a **collision**. You keep or kill them and say in one line what you think. The Desk turns your line into a draft in the shape you choose; the Typewriter turns the draft into a stained, typewritten card or reel. The machine supplies the accident, you supply the argument.

## Reminders

You can't miss a day without being told. Owl Farm checks its own records and emails you:

| Time (London) | Email | When |
| --- | --- | --- |
| 07:30 | Today's three steps, with links, how many collisions are waiting, and your streak | Every day |
| 12:30 | "Not started yet" or "1 of 3 done, next: …" | Only if a step is open |
| 18:30 | "Still to do: …" | Only if a step is open |
| 21:30 | "Last call today" | Only if a step is open |

A step counts as done when Owl Farm sees it: a collision kept or killed (the Wire), a draft written (the Desk), a card exported or a draft marked published (the Typewriter). Once all three are done, the emails stop for the day. On Fridays the emails add the weekly list, and the longer piece counts as an open step. If the Wire has filed nothing in 48 hours, the email says so.

Two calendar events are a backstop that doesn't depend on Owl Farm: the 07:30 routine and a 21:45 "card out today?" popup. If you get the 21:45 popup but had no emails that day, the reminders have broken: ask Claude to check the "The daily nudge" workflow and the `dailyNudge` function logs.

## Every day

### 1. The Wire (5 min)

1. Open the Wire. Collisions from the last three days are under "On the wire · last three days".
2. Read **The piece** and the **Core claim**; open **Read the original ↗** if it's interesting.
3. Tap any **Lines worth stealing**, or paste your own under **Your highlights** → **Add highlight**.
4. **Kill**, **Keep for later**, or write a line in **What do you think?** and click **Keep · take to the Desk →**.

One collision goes to the Desk each day. Empty wire? **Run the wire now**, or **Log a piece by hand**.

### 2. The Desk (7 min)

1. **What are you writing about?** is already chosen.
2. Skim **The briefing**.
3. **What do you think?** A sentence or two, the way you'd say it across a table. Stuck? Do you agree, or is it wrong? What has your industry got wrong? Where have you seen it happen?
4. **What shape should it take?** Hey Rube (≤25 words, the busy-day default), Dispatch (250–400), Routine (60–90 s script), Expense report (4–6 items and a total), Essay (800–1,200, Fridays).
5. **Lenses** are optional: add a contrast thinker with **Choose another…**.
6. **Write the draft** (about a minute: a writer pass, then an editor pass). Read the editor's note and any red quote warnings, tap one of the **Other lines the editor tried** if it beats the pull, then edit title, deck, pull line (`*asterisks*` mark the highlight) and body.

Edit until it sounds like you: a clear enemy, why it matters now, one repeatable line, UK English, no em dashes, never "Not X, but Y". Check every quote and fact against the original.

### 3. The Typewriter (3 min)

1. Pick the draft under **Draft** and a template (Dispatch, Hey Rube, Expense report, Essay cover at 1080 × 1350; Routine (Reel) at 1080 × 1920).
2. **Shuffle marks** until no stain covers the headline; **Replay typing** previews a Routine.
3. **Export PNG**, post it with the pull line as caption, then **Mark published** on the draft.

## Every Friday (30 min)

1. **Publish to Edgework.** The apps aren't connected: ask Claude to publish the week's published drafts as Dispatches, or add Dispatch rows yourself in the Edgework editor (status `published`).
2. **Cut-up:** **✂ Cut it up** a few times; keep any line that surprises you as a Spark.
3. **One longer piece:** an Essay or Routine from the week's best collision. Essays go on The Last Animal, then get filed on Edgework.
4. **Positions:** rewrite one marked "edit" in the ledger and ask Claude to update Owl Farm and Edgework.
5. **Thinkers** (optional): drop a dead source or add a new free one (check it with `check-feeds.mjs`).

## Examples

**Reaction (illustrative).** Collision: Brian Solis, "On the Internet, Nobody Knows You're a Robot", against Position 34 ("Trust wasn't lost, it was redesigned").
- Weak: "Interesting point about AI and trust."
- Strong: "We spent ten years teaching people to trust a star rating from a stranger. Now the stranger is a model, and nobody's asking who wrote the rating."

**A real draft.** Routine · "Why Your Metrics Are Lying To You" · pull: "We must stop choosing the *path of least resistance*." Before publishing: fix US spelling ("optimizing") and check the Seth Godin quote.

## When something looks wrong

- **Wire empty for days:** Run the wire now; if still empty, ask Claude to check the `dailyWire` logs.
- **Synopsis thin or invented:** the piece was partly paywalled. **Re-read the piece**, or kill it.
- **Draft doesn't sound like you:** the reaction was too vague. Rewrite step 3.
- **Anything visual off:** fix it against the design system in `mralexcheeseman/design/brands/edgework`.
