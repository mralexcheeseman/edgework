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

### Targets for the first review (28 October)

- [ ] A streak of 5 days or more
- [ ] 5 cards exported and posted
- [ ] One longer Friday piece (an essay or a spoken routine)
- [ ] Edgework site reviewed; a go or no-go on launch
- [ ] A posting channel chosen
- [ ] Reminder email moved to Primary; no missed reminders all week

## Go deeper

- **On scoring what matters, not what's easy:** Jerry Z. Muller, *The Tyranny of Metrics* (2018). A short book on how measurement goes wrong. It's the reason this scorecard weights the habit and the audience over the machinery.
- **On reviewing in small, regular loops:** Eric Ries, *The Lean Startup* (2011), on build, measure, learn. The four-week review is a small version of that loop.
- **Alex's own essay on bad measurement:** [The McNamara Fallacy and the AI Usage OKR Trap](https://thelastanimal.base44.app/essays/mcnamara-fallacy-ai-okr-trap).
