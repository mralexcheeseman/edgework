# The Edgework handbook

Everything you need to run Edgework, in the order you'll need it. It takes about 15 minutes a day, plus 30 minutes on Fridays.

- **Prompts you can copy:** [`prompts.md`](prompts.md)
- **Where we are and what's next:** [`scorecard.md`](scorecard.md)
- **Google Docs copy:** [Edgework: the daily routine](https://docs.google.com/document/d/1gikugQ1lH_wYqYDRVcQObTYvu3IeZxAYU5rOnohq720/edit)

## The idea in one paragraph

At 6am the Wire reads new, free-to-read pieces from the thinkers you follow and checks each one against your Positions (the 30 things you believe). Where a piece supports, challenges or extends a Position, it files a **collision**. You pick one, say in a sentence what you think, and the Desk turns that into a draft in your voice. The Typewriter turns the draft into a stained, typewritten card you can post. **The machine supplies the accident; you supply the argument.** If you skip your sentence, there is nothing worth drafting.

## Links

| What | Where | What it's for |
| --- | --- | --- |
| **The Wire** | [owl-farm-notes.base44.app](https://owl-farm-notes.base44.app/) | Today's collisions. Start here every day. |
| **The Desk** | [/desk](https://owl-farm-notes.base44.app/desk) | Turn your reaction into a draft. |
| **The Typewriter** | [/typewriter](https://owl-farm-notes.base44.app/typewriter) | Turn the draft into a card (PNG). |
| Cut-up | [/cut-up](https://owl-farm-notes.base44.app/cut-up) | Friday: random line collisions for new ideas. |
| Archive | [/archive](https://owl-farm-notes.base44.app/archive) | Every draft, by status. |
| Positions · Thinkers | [/positions](https://owl-farm-notes.base44.app/positions) · [/thinkers](https://owl-farm-notes.base44.app/thinkers) | What you believe; who you read. |
| Edgework site (private until you approve it) | [edge-work-vault.base44.app](https://edge-work-vault.base44.app) | The public home, once launched. |
| The Last Animal | [thelastanimal.base44.app](https://thelastanimal.base44.app) | Where long essays live. |
| Positions ledger | [Notion](https://app.notion.com/p/3ff58b5148c4816fba94f3d91c7dc351) | The master list of Positions. |
| Owl Farm bot | [t.me/Acowlfarm_bot](https://t.me/Acowlfarm_bot) | Reminders on Telegram. |
| This repo | [github.com/mralexcheeseman/edgework](https://github.com/mralexcheeseman/edgework) | Code, docs and learnings. |

## Reminders: you will be told

Owl Farm checks its own records and messages you on **Telegram and email** at once:

| Time (London) | Message | Sent |
| --- | --- | --- |
| 07:30 | Today's three steps with links, how many collisions are waiting, your streak | Every day |
| 12:30 | "Not started yet" or "2 of 3 done, next: the Typewriter" | Only if a step is open |
| 18:30 | "Still to do: the Desk, the Typewriter" | Only if a step is open |
| 21:30 | "Last call today" | Only if a step is open |

**How a step counts as done:**
- **Wire:** you kept or killed a collision.
- **Desk:** you wrote a draft.
- **Typewriter:** you exported a card or pressed Mark published.

Finish all three and the messages stop for the day. On Fridays the messages add the weekly list, and the longer piece counts as an open step. If the Wire has filed nothing in 48 hours, the message warns you.

**Backstops that don't depend on Owl Farm:** the 07:30 calendar event, and a 21:45 calendar pop-up, "Edgework: card out today?". If you get the 21:45 pop-up but had no Telegram or email that day, the reminders are broken. Use the "Reminders stopped" prompt in [`prompts.md`](prompts.md).

## Every day

### 1. The Wire (5 minutes)

1. Open [the Wire](https://owl-farm-notes.base44.app/). New collisions sit at the top; older ones are under "On the wire · last three days".
2. For each collision, read **The piece** (a synopsis) and the **Core claim**, and the line that says why it collides with your Position. Open **Read the original ↗** if it grabs you.
3. Tap any **Lines worth stealing** you like, or paste your own under **Your highlights** → **Add highlight**. These become the quotes the Desk is allowed to use.
4. Decide:
   - **Kill:** not interesting, or the match is a stretch.
   - **Keep for later:** good, but not today.
   - **Keep · take to the Desk →:** today's one. Write your line in **What do you think?** first.

**Pick the one that makes you slightly annoyed.** Agreement makes dull writing; friction makes good writing. A "challenges" collision is usually the best pick.

**Example.** The Wire files Seth Godin's "Toward depth" against Position #22 (*McNamara fallacy: we measure what's easy, not what matters*). Why it collides: "Godin reinforces your stance by condemning the trade of quality work for easily measured metrics."
- Kill it if you've said this ten times already.
- Take it to the Desk if you have a fresh angle, e.g. AI dashboards counting prompts.

### 2. The Desk (7 minutes)

1. **What are you writing about?** Today's collision is already chosen.
2. Skim **The briefing**: your Position, why it collides, the synopsis, the link and your highlighted lines.
3. **What do you think?** This is the only step that matters. Write one to three sentences, the way you'd say it to a friend across a table. Use the templates in [`prompts.md`](prompts.md) if you're stuck.
4. **What shape should it take?**

| Shape | Length | Use it when | Example pull line |
| --- | --- | --- | --- |
| **Hey Rube** | One line, ≤25 words (plus up to two short lines) | Busy day. A sharp opinion. | "Your kitchen speaker is *a promise with a microphone*." |
| **Dispatch** | 250–400 words | You have a scene and an argument. | "The feeling paid the margin. The agent only *pays for facts*." |
| **Routine** | 60–90 s script, 150–220 words | You want a reel or a talk. | "Count prompts and you get prompts. *Nobody counted the work*." |
| **Expense report** | 4–6 line items and a total | Showing the cost of a bad habit, with wit. | "TOTAL: one quarter, no answer." |
| **Essay** | 800–1,200 words | Fridays, the week's best idea. | |

5. **Lenses** (optional). The piece's own writer is the default. Add a contrast thinker with **Choose another…** for tension, e.g. Byron Sharp against a loyalty piece.
6. **Write the draft.** It takes about a minute: a writer pass, then an editor pass.
7. **Review what comes back:**
   - **Red warnings:** a quote that isn't word for word in the source. Fix it or cut it.
   - **The editor's note:** the biggest change it made, and why.
   - **Other lines the editor tried:** tap one to use it as the pull line (on a Hey Rube it replaces the whole thing).
8. **Edit until it sounds like you.** Check it against the list below.

**Before you move on, check:**
- [ ] Opens on something concrete: a scene, an object, a number.
- [ ] Names the false belief it's arguing against.
- [ ] Has one line someone would repeat at work. That's the pull line.
- [ ] Sounds like you said it, not like the source writer.
- [ ] UK spelling, no em dashes, never "Not X, but Y".
- [ ] Every quote and number appears in the original.

### 3. The Typewriter (3 minutes)

1. Open [the Typewriter](https://owl-farm-notes.base44.app/typewriter). Pick today's draft under **Draft**.
2. Pick a template:

| Template | Size | Best for |
| --- | --- | --- |
| Hey Rube | 1080 × 1350 | Hey Rube drafts |
| Dispatch | 1080 × 1350 | Dispatch pull lines |
| Expense report | 1080 × 1350 | Expense reports |
| Essay cover | 1080 × 1350 | Friday essays |
| Routine (Reel) | 1080 × 1920 | Routines; **Replay typing** previews the animation |

3. **Shuffle marks** until no stain or tape covers the headline.
4. **Export PNG**. Post it with the pull line (or the first line of the body) as the caption.
5. Back on the draft, press **Mark published**. This is what tells the reminders you're done.

**Caption example:** *Count prompts and you get prompts. Nobody counted the work. (From this week's Edgework.)* Add the link to the original piece in the first comment, credited.

## Every Friday (30 minutes)

| Step | Time | How |
| --- | --- | --- |
| 1. One longer piece | 15 min | Take the week's best collision to the Desk as an **Essay** or **Routine**. Essays get posted on The Last Animal. |
| 2. Cut-up | 5 min | On [Cut-up](https://owl-farm-notes.base44.app/cut-up), press **✂ Cut it up** three or four times. Save any line that surprises you as a Spark. |
| 3. Publish to Edgework | 5 min | Paste the "Friday publish" prompt from [`prompts.md`](prompts.md) into Claude. |
| 4. Positions | 5 min | In the [ledger](https://app.notion.com/p/3ff58b5148c4816fba94f3d91c7dc351), rewrite one Position marked "edit", then use the "Update a Position" prompt. |
| 5. Thinkers (optional) | — | Drop a source that's gone quiet, or add a new free one with the "Add a thinker" prompt. |

## Worked example: one day, start to finish

1. **07:30.** Telegram: "4 collisions waiting." You open the Wire.
2. **The Wire.** Brian Solis on AI agents and brand premiums, against Position #6. Kill two others, keep this one.
3. **What do you think?** "Every brand premium I've worked on was built on a feeling the buyer couldn't fully explain. If the agent is the buyer, the premium has to be earned in facts."
4. **Shape:** Dispatch.
5. **The Desk returns:**
   - **Title:** *The Agent Doesn't Love Your Brand.*
   - **Opening:** "You're in the supermarket, aisle seven, a Tuesday. Two bottles of washing-up liquid sit side by side…"
   - **Pull line:** "The feeling paid the margin. The agent only *pays for facts*."
6. **Edit.** You swap one sentence for something that happened at work, and check the Solis quote against the original.
7. **The Typewriter.** Dispatch template, shuffle marks once, Export PNG, post to LinkedIn, Mark published.
8. **12:30.** No reminder comes, because you're done.

## Reactions: weak vs strong

| Weak (the draft will be generic) | Strong (the draft will sound like you) |
| --- | --- |
| "Interesting point about AI and trust." | "We spent ten years teaching people to trust a star rating from a stranger. Now the stranger is a model, and nobody's asking who wrote the rating." |
| "I agree metrics are overrated." | "Metrics shape behaviour. Humans are calorie hoarders, so we hit targets the cheapest way. Our industry counts prompts and calls it transformation." |
| "Apple is good at privacy." | "Apple didn't earn trust with ads. It earned it by refusing to do something everyone else did. Trust is the price of the things you won't do." |

A strong reaction has at least one of these: an opinion someone could disagree with, something that actually happened to you, a concrete noun.

## When something looks wrong

| Symptom | What it means | What to do |
| --- | --- | --- |
| Wire empty for 2+ days | Feeds quiet, or the 6am run failed | **Run the wire now**. Still empty? Use the "Wire is empty" prompt. |
| Synopsis vague, or quotes look invented | The piece was partly paywalled | Kill it, or **Re-read the piece**. |
| Draft doesn't sound like you | Your reaction was too vague | Rewrite step 3 with a story or a stronger opinion, then draft again. |
| Red quote warning | A quote isn't word for word in the source | Fix it from the original, or cut it. |
| No Telegram or email by 08:00 | Reminders broken | Use the "Reminders stopped" prompt. |
| A card looks off (stain over text, wrong colours) | Visual bug | Shuffle marks. If it persists, use the "Visual bug" prompt. |

## Review

Every four weeks, you and Claude review the system together against [`scorecard.md`](scorecard.md). The first review is **Wednesday 28 October, 19:30**. Claude prepares the numbers beforehand; bring one draft you liked and one you didn't.
