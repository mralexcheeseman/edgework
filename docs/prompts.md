# Prompts

**What this is.** Ready-to-copy text for running Edgework, Alex Cheeseman's publication about AI, marketing, work and judgement. Edgework runs on **Owl Farm**, a private app that reads articles by 50 writers Alex follows. It finds where an article meets one of his 30 **Positions** (beliefs he has argued in essays on his site The Last Animal) and calls that a **collision**. It then drafts a piece from his reaction. The [glossary](glossary.md) explains every term.

Copy, fill in the [brackets], paste. There are two kinds:

1. **Reaction starters** go in the **What do you think?** box on the Desk (the Owl Farm page that drafts from your reaction). They help you say what you actually think, which is what makes a draft good.
2. **Claude prompts** go into a session with Claude, the AI assistant that built Edgework. The session needs the Base44 connector (Base44 is the platform both apps run on) and the GitHub connector. Each prompt names the app IDs and files it needs, so Claude doesn't need this conversation's history.

## 1. Reaction starters (the Desk, step 3)

Use one when you're stuck. Each has a filled-in example underneath.

**The enemy**
> Everyone in [my industry] believes [the common belief]. They're wrong because [your reason]. I saw it when [something that happened].

*Everyone in marketing believes AI adoption is measured in seats activated. They're wrong because seats measure purchases, not work. I saw it when a client celebrated 94% activation and couldn't name one thing that got faster.*

**The missing half**
> [Writer] is right that [their point]. What they miss is [what you know from experience].

*Brian Solis, the digital analyst, is right that AI agents will soon do our shopping. What he misses is that the brand premium (the extra we pay for a name we like) was always a feeling, and agents don't have feelings, they have budgets.*

**The scene**
> The last time I saw this was [place, moment]. What actually happened was [outcome]. The lesson nobody took was [lesson].

*The last time I saw this was a quarterly review where the AI slide showed 94% of staff "active". What actually happened was that most had opened the tool once. The lesson nobody took was that activity isn't adoption.*

**The Monday test**
> If this is true, on Monday [a specific team or role] should stop [doing X] and start [doing Y].

*If this is true, on Monday every marketing team should stop reporting search rankings and start checking what ChatGPT says when someone asks for a brand in their category.*

**The number**
> The number everyone watches is [metric]. The thing that actually matters is [the real thing], and nobody measures it because [reason].

*The number everyone watches is prompts per employee. The thing that actually matters is whether the work got better, and nobody measures it because it's slow and awkward to judge.*

**The flip**
> We think [old belief]. It's closer to [sharper picture].

*We think trust disappeared. It went sideways, into star ratings from strangers.*

**The confession**
> I used to believe [thing]. I changed my mind when [moment]. Now I think [position].

*I used to believe a five-year plan was the grown-up thing to have. I changed my mind when ours was out of date by the second quarter. Now I think the speed you learn beats the plan you wrote.*

**Remember the reader.** Your reaction can be shorthand (only the Desk sees it), but the draft must make sense to a stranger. If your reaction leans on a name, idea or model, add a few words on who or what it is, and the Desk will carry that into the piece. "Goodhart's law (when a measure becomes a target, it stops measuring)" drafts far better than "Goodhart, obviously".

## 2. Shape picker

| You have… | Pick |
| --- | --- |
| One sharp opinion and 5 minutes | **Hey Rube** |
| A scene and an argument | **Dispatch** |
| A story you'd tell out loud | **Routine** |
| A habit that wastes money or time | **Expense report** |
| The week's best idea and 30 minutes | **Essay** (Fridays) |

## 3. Claude prompts

### Friday publish
> Publish this week's Edgework. In Owl Farm (Base44 app 6ad79082c42f60485f1e32ef), find drafts with status "published" updated since last Friday. For each one, create a Dispatch on the Edgework site (Base44 app 6ad8b0ed795af7aa9ead4d02) with status "published": title, deck, pull, body and go_deeper exactly as written. Before you publish, check each one reads alone: a stranger who has never seen the source would understand every name, idea and term. List any that don't, with the fix. Show me the list first, then publish and give me the links.

### Polish a draft
> Here's a draft from the Desk: [paste title, pull and body]. Edit it in my voice, using docs/voice.md and docs/craft-playbook.md in mralexcheeseman/edgework. Keep my argument. Fix the opening if it doesn't start on something concrete, sharpen the pull line, and give me three alternatives for it. UK spelling, no em dashes, no "Not X, but Y". Don't add any quote or number that isn't in the draft.

### Check it reads alone
> Read this as a stranger who has never heard of me, the source or anyone in it: [paste the piece]. List every name, idea, model, acronym or reference that wouldn't make sense on its own, and give me a few words to introduce each one on first mention (who they are or what it means). Use only facts that are in the piece or widely known; if you're not sure, say so. Then suggest two or three Go deeper links: real pages you're confident exist, each with one line on why to read it, and mark any you couldn't verify.

### The draft doesn't sound like me
> This draft doesn't sound like me: [paste it]. What's wrong is [e.g. too formal, too many questions, the ending is a lecture]. Rewrite it and tell me what you changed. Then suggest the change to Owl Farm's generateDraft prompt (Base44 app 6ad79082c42f60485f1e32ef) that would have prevented it, and make it if I agree.

### Turn the week's best into an essay
> From Owl Farm (Base44 app 6ad79082c42f60485f1e32ef), list this week's kept collisions and drafts. Pick the one with the most tension and outline an 800–1,200 word essay for The Last Animal using the Essay recipe in docs/craft-playbook.md. I'll write the reaction; you draft once I approve the outline.

### Write a caption
> Write a LinkedIn caption for this card: [pull line + title]. Two or three short lines, my voice (docs/voice.md), no hashtags, no emojis, end with the source credited: [writer, piece].

### Update a Position
> I've rewritten Position #[N] in the Notion ledger to: "[new wording]". Update it in Owl Farm (Base44 app 6ad79082c42f60485f1e32ef) and on the Edgework site (Base44 app 6ad8b0ed795af7aa9ead4d02), keeping the number and arena. Confirm both.

### Add a thinker
> Add [name] to the Wire. Their writing is at [URL]. Find a free RSS feed, check that recent posts are free to read in full (use owl-farm/scripts/check-feeds.mjs in mralexcheeseman/edgework), then add them as a Thinker in Owl Farm (Base44 app 6ad79082c42f60485f1e32ef) with feed_url, tier [1/2/3] and a one-line core position. If the feed is shared by several writers, set feed_author.

### Wire is empty
> The Owl Farm Wire (Base44 app 6ad79082c42f60485f1e32ef) has filed nothing since [date]. Check "The 6am Wire" workflow runs and the dailyWire function logs, find the cause, fix it, run the wire once, and tell me what happened.

### Reminders stopped
> I didn't get my Edgework reminders today. Check "The daily nudge" workflow runs and the dailyNudge function logs in Owl Farm (Base44 app 6ad79082c42f60485f1e32ef). Email goes to the NUDGE_EMAIL secret and Telegram uses TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID. Fix it, send me a test, and tell me what broke.

### Visual bug
> On the Owl Farm Typewriter (Base44 app 6ad79082c42f60485f1e32ef), [describe: e.g. the stain covers the headline on the Hey Rube template]. Fix it against the Edgework design system in mralexcheeseman/design (brands/edgework), screenshot at 1080 × 1350, and show me before and after.

### Sync to GitHub
> Sync Owl Farm (Base44 app 6ad79082c42f60485f1e32ef) and the Edgework site (6ad8b0ed795af7aa9ead4d02) into mralexcheeseman/edgework, following docs/sync.md. Redact any secret. Commit, push, and add anything we learned to docs/learnings.md.

### Monthly review
> Run the Edgework review. Using Owl Farm (Base44 app 6ad79082c42f60485f1e32ef), count since the last review: collisions filed, kept and killed; drafts by format; cards exported; days with all three steps done; current streak; Wire runs that failed. Score each line of docs/scorecard.md in mralexcheeseman/edgework from 1 to 10 with the evidence, compare with last time, name the three changes that would move the score most, and update the scorecard.

## Go deeper

- **On prompting well:** Anthropic's guide to prompt engineering ([docs.anthropic.com](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)). It explains why the Claude prompts above give context, name exact sources and ask for checks.
- **On finding what you think:** Paul Graham's essay ["Putting Ideas into Words"](https://paulgraham.com/words.html) (2022), on why writing a reaction down is how you discover whether you have one.
- **On the reaction starters:** most of them are classic opinion-column openings. Ann Handley, *Everybody Writes* (2014), has dozens more.
- **Every term used here:** [`glossary.md`](glossary.md).
