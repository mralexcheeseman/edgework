# Scorecard

**What this is.** A regular, honest score of how well Edgework is working. Edgework is Alex Cheeseman's publication on AI, marketing, work and judgement. It runs on a private app, **Owl Farm**, that turns his daily reading into short posts in three steps:
- the **Wire** finds articles that meet one of his 30 beliefs (his **Positions**);
- the **Desk** drafts a piece from his reaction;
- the **Typewriter** makes the card to post.

Each area below is scored from 1 (not working) to 10 (as good as it can be), with the evidence and the next step that would raise the score. Alex and Claude (the AI assistant that built the system) review it every four weeks using the "Monthly review" prompt in [`prompts.md`](prompts.md). Newest review first. Terms are explained in the [glossary](glossary.md).

## How to read the areas

| Area | What it measures |
| --- | --- |
| **Sources** | Whether the Wire has enough good, free-to-read material. It can only read writers with a free **feed**: an RSS feed, the machine-readable list of new posts most blogs and newsletters publish. |
| **Collisions** | Whether the matches the Wire finds between articles and Positions are worth writing about. The **keep rate** is the share Alex keeps rather than kills. |
| **Drafts** | Whether the Desk's drafts are good enough to publish after light editing: in Alex's voice, accurate, and understandable on their own. |
| **Cards** | Whether the images the Typewriter makes look right and follow the Edgework design system (the rules for colours, fonts and the scanned coffee stains and tape). |
| **Habit** | Whether Alex actually does the 15-minute routine every day. The **streak** is the number of days in a row it's done. |
| **Reminders** | Whether the reminders reliably reach Alex: on Telegram, by email and by calendar. |
| **Publishing and audience** | Whether pieces are reaching readers: posted on a social channel, and live on the Edgework website. |
| **Documentation and reuse** | Whether someone new could run or rebuild this from the written docs alone. |

**The overall score** counts Habit and Publishing twice, because a working machine that nobody uses or reads is worth little.

## 28 October 2026 · first review · 5.1 / 10

**In one line:** the machine ran every day and the reminders all arrived, but only one day got all three steps done and nothing reached a reader. The drop is between a draft and a card.

**Counted from Owl Farm, 22 to 28 October** (28 October up to 17:00 UTC):
- **Collisions:** 24 filed, 9 kept, 0 killed, 15 still waiting (19 waiting in all, counting 4 from the baseline). None came from Readwise, which isn't switched on yet.
- **Drafts:** 4 new, all on the new Desk: 2 dispatches (22 and 26 October) and 2 essays (23 and 27 October). One was exported, three are still at "drafted", and none was made from Telegram.
- **Cards:** 2 exported on 26 October, both for one draft ("Somebody Should Always Own the Room"), one on the Dispatch template and one on the Routine template. No draft is marked published, so there's no record of a card being posted.
- **Days with each step done:** the Wire on 6 of 7 days, the Desk on 4 of 7 and the Typewriter on 1 of 7. **All three were done on 1 day** (26 October).
- **Streak:** 0 today. The best run was 1 day.
- **Wire runs:** the 6am run filed collisions on all 7 days, so there were no failed runs. Base44 keeps no older log lines for it.
- **Reminder emails:** 25 sent and 25 arrived, out of 25 due (the 21:30 on 26 October was rightly skipped because the day was done). All 25 went to Gmail's **Updates** tab, not Primary. Base44's logs only keep the last two nudge runs (both succeeded), and those don't show whether Telegram delivered, so Telegram delivery isn't checked here.
- **Not measurable yet:** kept share, voice rules, reach and reactions, and Sunday letters. These features are built but not switched on.

| Area | Score | Change | Evidence | What moves it up |
| --- | --- | --- | --- | --- |
| **Sources** | 6 | = | The Wire ran all 7 days and filed 24 collisions, about 3 a day. It still reads only the 17 free feeds; Readwise isn't switched on. | Switch on Readwise intake. |
| **Collisions** | 5 | −1 | 9 kept and none killed, so the queue only grows: 19 are waiting, some from 21 October. Picking one a day and leaving the rest makes the Wire noisier each morning. | Let collisions that have waited 3 days lapse on their own, so the Wire only shows fresh ones. |
| **Drafts** | 7 | = | 4 real drafts on the new Desk, including 2 essays. Only one was taken further, and the system can't yet tell how much of each you kept. | Switch on "learn from edits"; take each draft to a card the same day. |
| **Cards** | 8 | = | The first two cards were exported on 26 October, on two templates. Nothing is recorded on how they looked on a phone or how they did once posted. | Post a card and note anything that looks wrong on a phone. |
| **Habit** | 3 | +1 | 1 full day out of 7, and the streak is 0. You start most days (the Wire on 6 days), but the Desk drops off at 4 days and the Typewriter at 1. | Make the card a single tap after a draft is kept, and do the Desk from Telegram. |
| **Reminders** | 9 | = | Every email that was due arrived. They still land in Updates, and Telegram delivery isn't logged. | Move the email to Primary; log Telegram's reply in the nudge's result. |
| **Publishing and audience** | 1 | = | Nothing is marked published. The site hasn't been reviewed and no posting channel has been chosen. | Choose a channel and post the 26 October card this week. |
| **Documentation and reuse** | 8 | = | The handbook, prompts and learnings were updated with each change. The Google Doc's Scorecard tab doesn't have this review yet. | Copy this review into the Google Doc. |

**Overall:** (6 + 5 + 7 + 8 + 3×2 + 9 + 1×2 + 8) / 10 = **5.1**, up from 5.0. The machine on its own (a plain average) scores 5.9, the same as at the baseline.

### Targets from the baseline

- [ ] A streak of 5 days or more: **missed** (best 1)
- [ ] 5 cards exported and posted: **missed** (2 exported, none recorded as posted)
- [x] One longer Friday piece: **hit as a draft** ("Nobody Is Coming to Say Yes", an essay, Friday 23 October), not yet published
- [ ] Edgework site reviewed; a go or no-go on launch: **missed**
- [ ] A posting channel chosen: **missed**
- [ ] Reminder email moved to Primary; no missed reminders all week: **half**. None were missed, but all landed in Updates.
- [ ] Telegram replies, Readwise and the Sunday letter switched on: **missed** (waiting on your go-ahead and two secrets)
- [ ] The first Sunday letter sent: **missed** (not switched on)
- [ ] Reach and reactions recorded for every posted card: **not applicable** (nothing recorded as posted)

### The three changes that would move the score most

1. **Switch on what's already built:** Telegram replies, Readwise and the Sunday letter. The Desk is where most days stop, and replying to the morning pick on your phone makes the Desk a one-line job. This needs the bot token reissued, TELEGRAM_WEBHOOK_SECRET and READWISE_TOKEN set, and a go-ahead to deploy. Moves Habit, Sources and Publishing.
2. **Make the card one tap after Keep.** Of 4 drafts, 1 became a card. If the Typewriter made a card on the default template as soon as a draft is kept, step 3 would be a check and a save, not a separate session. Moves Habit and Cards.
3. **Choose a channel and post this week.** Publishing counts double and is still at 1. Post the 26 October card, mark it published, and decide go or no-go on the site. Moves Publishing.

### Targets for the next review (25 November)

- [ ] A streak of 5 days or more
- [ ] 10 cards posted and marked published, with reach and reactions recorded
- [ ] Telegram replies, Readwise and the Sunday letter switched on; 3 Sunday letters sent
- [ ] A channel chosen and the site's go or no-go decided
- [ ] No collisions waiting more than 3 days
- [ ] Reminder email in Primary

## 21 October 2026 · baseline · 5.0 / 10

**In one line:** the machine is built and tested; the daily habit and the audience don't exist yet.

| Area | Score | Evidence | What moves it up |
| --- | --- | --- | --- |
| **Sources** | 6 | Of the 50 thinkers Alex follows, only 17 have a free feed. Several of his most important influences never reach the Wire: Rory Sutherland (behavioural science at Ogilvy), Mark Ritson (marketing professor and columnist), Byron Sharp (marketing scientist), Marcus Collins (culture and marketing), Donella Meadows (systems thinker) and Malcolm Gladwell (author). The 6am run worked on 21 October. | Find free sources for the ten most important thinkers without a feed: newsletters, podcast transcripts, YouTube talks. |
| **Collisions** | 6 | 15 collisions filed in the first two days: 6 kept, 5 killed, 4 waiting. That's a 55% keep rate, which is healthy. A few reasons were generic, and two called Alex by name instead of "you" (fixed). | Watch the keep rate. If it falls below 40%, make the Wire stricter about what counts as a match. |
| **Drafts** | 7 | The new two-pass Desk beat the old one in side-by-side tests. Drafts now open on concrete scenes, end by echoing the opening, flag any quote that isn't in the source, and explain every name and idea. They also come with Go deeper links. Only one real draft exists so far, made on the old version (US spelling, a flat ending). | Ten real drafts on the new Desk, then tune it from what Alex changes. |
| **Cards** | 8 | A full design system, real scanned marks and five templates. No cards exported yet. | Export the first five cards and fix anything that looks wrong on a phone. |
| **Habit** | 2 | Day one: streak 0, no card shipped. | A five-day streak by the first review. |
| **Reminders** | 9 | Telegram and email at 07:30, 12:30, 18:30 and 21:30, sent only for steps not yet done, plus two calendar pop-ups as a backstop. All tested on 21 October. Gmail filed the email under the Updates tab, where it's easy to miss. | Move the email to Primary in Gmail; check nothing is missed for a week. |
| **Publishing and audience** | 1 | Nothing posted yet. The Edgework site is private, waiting for Alex's review. No decision on where cards go (LinkedIn, Instagram or both). | Review the site, choose the channel, post the first five cards. |
| **Documentation and reuse** | 8 | Handbook, prompts, glossary, voice guide, craft playbook, learnings and all code are on GitHub. Each doc explains its terms and points to further reading. The Google Doc mirrors the handbook, prompts, glossary and scorecard in four tabs. | Keep GitHub and the Google Doc in step after every change; add a worked example of a published card once there is one. |

**Overall:** (6 + 6 + 7 + 8 + 2×2 + 9 + 1×2 + 8) / 10 = **5.0**. The machine on its own (a plain average of all eight areas) scores 5.9.

### Built since the baseline (22 October)

These are built and tested but not yet switched on (Base44 needs reconnecting first), so the scores above stay as they are until they're live:
- **Habit:** the whole routine from Telegram. The bot sends the day's pick, you reply with your reaction, and the draft comes back with Keep / Redo / Kill buttons.
- **Sources:** your Readwise highlights feed the Wire before the RSS feeds, which reaches the writers who have no free feed.
- **Drafts:** the Desk learns from your edits. Each Sunday it proposes voice rules from what you changed, and every new draft follows the ones you adopt. "Kept share" measures how close it's getting.
- **Publishing and audience:** the Sunday letter, a weekly email ready to paste into Beehiiv, and reach and reactions recorded on each posted draft so reviews can see what lands.

### Targets for the first review (28 October)

- [ ] A streak of 5 days or more
- [ ] 5 cards exported and posted
- [ ] One longer Friday piece (an essay or a spoken routine)
- [ ] Edgework site reviewed; a go or no-go on launch
- [ ] A posting channel chosen
- [ ] Reminder email moved to Primary; no missed reminders all week
- [ ] Telegram replies, Readwise and the Sunday letter switched on
- [ ] The first Sunday letter sent
- [ ] Reach and reactions recorded for every posted card

## Go deeper

- **On scoring what matters, not what's easy:** Jerry Z. Muller, *The Tyranny of Metrics* (2018). A short book on how measurement goes wrong. It's the reason this scorecard weights the habit and the audience over the machinery.
- **On reviewing in small, regular loops:** Eric Ries, *The Lean Startup* (2011), on build, measure, learn. The four-week review is a small version of that loop.
- **Alex's own essay on bad measurement:** [The McNamara Fallacy and the AI Usage OKR Trap](https://thelastanimal.base44.app/essays/mcnamara-fallacy-ai-okr-trap).
