# The Edgework handbook

**What this is.** Edgework is Alex Cheeseman's publication: short, opinionated pieces about how AI is changing marketing, work and judgement, published as typewritten cards and on the Edgework website. This handbook explains how to run it day to day with Owl Farm, the private app that does the reading and drafting. It takes about 15 minutes a day, plus 30 minutes on Fridays and 10 on Sundays. You can read this page on its own; every term is explained below, and in full in the [glossary](glossary.md).

- **Prompts you can copy:** [`prompts.md`](prompts.md)
- **Where we are and what's next:** [`scorecard.md`](scorecard.md)
- **Every term explained:** [`glossary.md`](glossary.md)
- **Google Docs copy:** [Edgework: the daily routine](https://docs.google.com/document/d/1gikugQ1lH_wYqYDRVcQObTYvu3IeZxAYU5rOnohq720/edit), with this handbook, the prompts, the glossary and the scorecard in four tabs

## The words you'll meet

| Word | What it means |
| --- | --- |
| **Owl Farm** | The private app where everything happens, named after Hunter S. Thompson's home in Colorado. Only Alex can log in. |
| **Position** | One of the 30 things Alex believes, each argued in full in an essay on his site The Last Animal. Example: *"AI usage metrics are the McNamara fallacy: measurable, and beside the point."* |
| **Thinker** | One of the 50 writers Alex follows, such as Seth Godin, Morgan Housel and Zoe Scaman. 17 have free articles the app can read. |
| **The Wire** | The page that reads new articles from the thinkers every morning at 6am. |
| **Collision** | An article that **supports**, **challenges** or **extends** one of Alex's Positions. The Wire files at most 10 a day. |
| **Reaction** | What Alex thinks about a collision, in his own words, one to three sentences. Every draft is built on it. |
| **The Desk** | The page that turns a reaction into a draft, in two AI passes: a writer, then an editor. |
| **The Typewriter** | The page that turns a draft into an image to post: typewritten text with real scanned coffee stains and tape. |
| **Hey Rube, Dispatch, Routine, Expense report, Essay** | The five shapes a draft can take, from a 25-word jab to a 1,200-word essay. "Hey Rube" is Hunter S. Thompson's: the title of his column and the old carnival cry for help. |
| **Go deeper** | Two to four real links under each piece for readers who want more, chosen from links Owl Farm already holds. |

## The idea in one paragraph

At 6am the Wire reads new, free-to-read pieces from the thinkers you follow and checks each one against your Positions. Where a piece supports, challenges or extends a Position, it files a **collision**. You pick one, say in a sentence what you think, and the Desk turns that into a draft in your voice that a stranger could read and understand. The Typewriter turns the draft into a stained, typewritten card you can post. **The machine supplies the accident; you supply the argument.** If you skip your sentence, there is nothing worth drafting.

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

## Doing it all from Telegram

Once it's switched on (see "Still to do" below), the whole daily routine can happen in the Telegram chat with [@Acowlfarm_bot](https://t.me/Acowlfarm_bot). The app is still there for editing and for making the card.

1. **The pick.** Straight after the 07:30 message (and again at 12:30 if you haven't drafted), the bot sends **Today's pick**: the best collision waiting on the Wire. It shows the piece, who wrote it, a short summary, your Position and why they collide.
2. **Reply with what you think.** Press and hold the message, choose Reply, and write a line or two. That's your reaction, the same as "What do you think?" on the Wire. Start with `rube:` for a Hey Rube, `expense:` for an Expense Report, or `essay:` / `routine:` for the longer shapes; anything else becomes a Dispatch.
3. **The draft comes back** in about a minute, with buttons:
   - **✅ Keep:** saves it and gives you a button to the Typewriter;
   - **🔁 Redo:** a fresh draft from the same reaction;
   - **As Hey Rube / As Dispatch / As Expense:** the same reaction in another shape;
   - **🗑 Kill:** deletes the draft;
   - **reply to the draft** with a note ("shorter, open on the pit gate") and it redrafts with it.
4. **Not this one?** Under the pick, **🗑 Kill** drops the collision and **↪ Another one** shows the next. Send `/pick` any time for a pick, `/status` for what's done today.
5. **The card** still happens in the app: Keep, then **Make the card →**.

**Example.** The pick is Seth Godin on choosing depth over easily measured numbers, against your Position that dashboards reward the wrong work. You reply: `rube: give a team a number and they'll hit it; whether the work got better is a different meeting`. A minute later a Hey Rube arrives. You tap **As Dispatch** to see the longer version, prefer the Hey Rube, scroll up, tap **Keep**, then **Make the card →**.

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

**Example.** The Wire files "Toward depth" by Seth Godin (the American marketing author who blogs daily at seths.blog) against Position #22: *AI usage metrics are the McNamara fallacy: measurable, and beside the point.* The McNamara fallacy means trusting only what you can count; it's named after the US defence secretary who judged the Vietnam war by body counts. Why the Wire says it collides: "Godin reinforces your stance by condemning the trade of quality work for easily measured metrics."
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

5. **Lenses** (optional). A lens is a thinker whose way of seeing shapes the argument. The piece's own writer is the default. Add a contrast thinker with **Choose another…** for tension. For example, add Byron Sharp, the marketing scientist whose research suggests brand loyalty is mostly habit and availability, against a piece praising loyalty.
6. **Write the draft.** It takes about a minute: a writer pass, then an editor pass.
7. **Review what comes back:**
   - **Red warnings:**
     - a quote that isn't word for word in the source: fix it or cut it;
     - a reference a reader can't see ("Position #22", "the Wire", "this piece"): say it in plain words.
   - **The editor's note:** the biggest change it made, and why.
   - **Other lines the editor tried:** tap one to use it as the pull line (on a Hey Rube it replaces the whole thing).
   - **Go deeper:** two to four links for readers who want more, plus "Look up" lines naming ideas to search for. They appear under the piece on the Edgework site. Delete any you wouldn't recommend.
   - **Caption:** the text to post with the card, written so a stranger scrolling past understands it.
8. **Edit until it sounds like you.** Check it against the list below.

**Before you move on, check:**
- [ ] Opens on something concrete: a scene, an object, a number.
- [ ] Names the false belief it's arguing against.
- [ ] Has one line someone would repeat at work. That's the pull line.
- [ ] Sounds like you said it, not like the source writer.
- [ ] **Reads alone:** someone who has never heard of the source, the people in it or your Positions would follow it. Every name, idea and model is introduced the first time it appears, e.g. "Seth Godin, the marketing author" or "OKRs (objectives and key results, the quarterly goals most teams live by)".
- [ ] UK spelling, no em dashes, never "Not X, but Y".
- [ ] Every quote and number appears in the original.

**What "reads alone" looks like.** From a real Desk draft on the Godin collision above:
- *Not alone:* "Godin's piece on Tamariz and Berry proves the McNamara point."
- *Alone:* "Seth Godin, the marketing author, wrote this week about two people who had recently died: Juan Tamariz, the magician, and Wendell Berry, the writer and farmer… There's a name for this. The McNamara fallacy means trusting only what you can count."

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
4. **Export PNG.** On the draft, press **Copy caption + link**, and post the card with that caption. The copied text includes the first Go deeper link.
5. Back on the draft, press **Mark published**. This is what tells the reminders you're done.

**Caption example** (from the Desk, for the Godin draft):
> Give people a number and they'll hit the number.
> Whether the work gets better is a separate matter.
> Count the clicks and you'll get clicks. Nobody games depth.
> Prompted by Seth Godin, the marketing author, on choosing depth over easily measured metrics.
>
> Go deeper: https://seths.blog/2026/10/toward-depth/

## Every Friday (30 minutes)

| Step | Time | How |
| --- | --- | --- |
| 1. One longer piece | 15 min | Take the week's best collision to the Desk as an **Essay** or **Routine**. Essays get posted on The Last Animal. |
| 2. Cut-up | 5 min | On [Cut-up](https://owl-farm-notes.base44.app/cut-up), press **✂ Cut it up** three or four times. Save any line that surprises you as a Spark. |
| 3. Publish to Edgework | 5 min | Paste the "Friday publish" prompt from [`prompts.md`](prompts.md) into Claude. |
| 4. Positions | 5 min | In the [ledger](https://app.notion.com/p/3ff58b5148c4816fba94f3d91c7dc351), rewrite one Position marked "edit", then use the "Update a Position" prompt. |
| 5. Thinkers (optional) | — | Drop a source that's gone quiet, or add a new free one with the "Add a thinker" prompt. |

## Every Sunday (10 minutes)

| Step | Time | How |
| --- | --- | --- |
| 1. The Sunday letter | 5 min | At 17:00 Owl Farm emails you the week's published pieces as one letter: an opener in your voice, the pieces, the best Go deeper links and three subject lines. Open a new post in [Beehiiv](https://app.beehiiv.com/posts/new) (the newsletter tool), paste it in, pick a subject and schedule it for Monday 07:00. Owl Farm can't press send for you; that stays your call. |
| 2. Your numbers | 3 min | The same email lists last week's posts with no numbers yet. Open each, and under **After posting** add the post link, its reach (impressions or views) and its reactions (likes, comments, reposts and saves added together). The monthly review uses these to see which Positions and shapes land. |
| 3. What your edits taught the Desk | 2 min | At 18:00, once you've edited three or more drafts, Telegram sends what the Desk learned from your changes: how much of its wording you kept, and up to four proposed rules (for example "Cut the first sentence when it explains instead of showing"). Tap **Adopt** on the ones you agree with. Every new draft follows them. |

## Worked example: one day, start to finish

1. **07:30.** Telegram: "4 collisions waiting." You open the Wire.
2. **The Wire.** Brian Solis (a digital analyst and author who writes about technology and customer behaviour) on AI agents buying for people. It's filed against Position #6: *brands were built on human irrationality, and an agent buying for you is more rational than you, which puts the price premium at risk.* Kill two other collisions, keep this one.
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
| The bot doesn't answer your reply | The Telegram connection to Owl Farm is off | Use the "Reconnect the bot" prompt. The reminders keep working either way. |
| Drafts keep making the same mistake | The Desk hasn't learned it yet | Fix it by hand in three drafts; the Sunday "What your edits taught the Desk" message will propose a rule. |
| A card looks off (stain over text, wrong colours) | Visual bug | Shuffle marks. If it persists, use the "Visual bug" prompt. |

## Review

Every four weeks, you and Claude (the AI assistant that built and maintains Edgework) review the system together against [`scorecard.md`](scorecard.md). The first review is **Wednesday 28 October, 19:30**. Claude prepares the numbers beforehand; bring one draft you liked and one you didn't.

## Still to do (one-offs)

**Switch on the new features.** They are built and tested, and switch on in this order:
1. Reconnect Base44 in claude.ai (Settings → Connectors), then ask Claude: "Deploy the Owl Farm improvements" (the prompt is in [`prompts.md`](prompts.md)).
2. **Telegram replies:** in Owl Farm's Base44 Secrets, add `TELEGRAM_WEBHOOK_SECRET` (any long string of letters, numbers, `_` or `-`). Claude then connects the bot.
3. **Readwise:** copy your token from [readwise.io/access_token](https://readwise.io/access_token) and add it to Owl Farm's Secrets as `READWISE_TOKEN`. From the next 6am run, your highlights feed the Wire.
4. **The Sunday letter:** decide where it goes: your existing Beehiiv newsletter *Beyond the Click*, or a new *Edgework* publication.
5. **Posting channel:** choose LinkedIn, Instagram or both for the daily cards.

**Other one-offs:**

- Rewrite the Positions marked "edit" in the [Positions ledger](https://app.notion.com/p/3ff58b5148c4816fba94f3d91c7dc351) (25 of the 30), then decide whether to launch the Edgework site.
- Delete the placeholder posts the Base44 builder created in the Edgework editor. They're marked as drafts, so the public never sees them.
- Reel rendering: export Routines as video (MP4 with a typewriter sound) instead of a still image.

## Go deeper

- **On the daily habit:** James Clear, *Atomic Habits* (2018). On why a tiny daily action that's easy to start beats an ambitious plan, and why it helps to track a streak.
- **On writing short and clear:** William Zinsser, *On Writing Well* (1976). The classic on cutting clutter; most of the editor's checks come from the same instincts.
- **On writing every day in public:** Seth Godin's blog [seths.blog](https://seths.blog). He has posted daily for over twenty years, which shows what a short daily format can become.
- **On where the attitude comes from:** Hunter S. Thompson, *The Great Shark Hunt* (1979), a collection of his journalism.
- **On how the voice and the craft rules were built:** [`voice.md`](voice.md) and [`craft-playbook.md`](craft-playbook.md) in this repo.
