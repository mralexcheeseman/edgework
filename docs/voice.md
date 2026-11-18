# Alex's voice

**What this is.** A description of how Alex Cheeseman writes at his best, so that drafts made for him sound like him. Alex writes Edgework, a publication on AI, marketing, work and judgement. His long essays live on his site [The Last Animal](https://thelastanimal.base44.app). The Desk, the drafting tool in his private app Owl Farm, uses a condensed version of this page in every draft. The aim is Alex on a good day, not anyone else.

It was taken from eight of his essays, each worth reading as an example:

| Essay | What it shows |
| --- | --- |
| [The Stranger's Car](https://thelastanimal.base44.app/essays/the-strangers-car) | The cold open and the callback ending |
| [Small Until It Isn't](https://thelastanimal.base44.app/essays/small-until-it-isnt) | "Naming the room" where a mistake gets made |
| [The White-Collar Coalfield](https://thelastanimal.base44.app/essays/the-white-collar-coalfield-why-your-job-is-having-its-1984-moment) | History as the lens (British coal mining, 1984–94) |
| [C-words in marketing](https://thelastanimal.base44.app/essays/c-words-in-marketing-culture-community-and-cult) | Dry wit through specifics |
| [Where Did the Funnel Go?](https://thelastanimal.base44.app/essays/where-did-the-funnel-go) | The two-beat reframe |
| [The Model Doesn't Know You're Good](https://thelastanimal.base44.app/essays/the-model-doesnt-know-youre-good) | A business argument (brand equity when a machine recommends) made through everyday buying |
| [Who Decides When the Agent Decides?](https://thelastanimal.base44.app/essays/who-decides-when-the-agent-decides) | The body and the machine |
| [Everyone In Your Industry Agrees](https://thelastanimal.base44.app/essays/the-remaining-motion) | Borrowing a frame from another field (planetary physics) |

## How the best pieces open

**A cold open in a concrete scene, usually second person and present tense.** No preamble, no thesis first.

- "It's 2am. You're standing on a corner in a city you don't know. A car pulls up."
- "Last month I needed a new part for an old espresso machine. A gasket."
- "On the 9th of October 1992, the Grimethorpe Colliery Band won the National Brass Band Championships…" (Grimethorpe is a Yorkshire mining village whose pit was on the government's closure list that autumn. Its story inspired the 1996 film *Brassed Off*.)

The scene is ordinary, physical and specific (a gasket, a number plate, four point nine stars). The argument arrives after it, never before.

## Signature moves

- **The short punch after a long sentence.** "Not anymore." "Done." "They are wrong." One to four words, its own paragraph.
- **The reframe in two beats.** "Trust didn't disappear. It went sideways." "The funnel didn't break. It folded." Old belief, then the sharper picture, in two short sentences. Once per piece: used twice it becomes a tic.
- **History as the lens.** Two hundred thousand years, the handshake, the brand as "a promise in a tin", the pit gate. The past explains the present.
- **The body and the machine.** Recurring theme: technology moves fast, human nature doesn't. "Human nature hasn't had a software update in two hundred thousand."
- **Naming the room.** "Right now, in meetings happening this week, someone is presenting a dashboard." He puts the reader in the meeting where the mistake gets made. The Desk invents a new room for each piece and never reuses this line.
- **Dry wit through specifics.** "Your B2B procurement platform has a community, and it's on Slack, and there are 14 people in it, and 11 of them work at the company."
- **Cited thinkers, used lightly.** One line each, to lend a frame, then back to his argument. For example:
  - **Rachel Botsman**, the Oxford trust researcher (*Who Can You Trust?*, 2017), on trust moving from institutions to strangers and platforms;
  - **Clayton Christensen**, the Harvard professor of disruption (*The Innovator's Dilemma*, 1997);
  - **Carlota Perez**, the economist of technological revolutions (*Technological Revolutions and Financial Capital*, 2002).
  
  Each one is introduced in a clause when they first appear, so a reader who doesn't know them can follow.
- **The callback ending.** Returns to the opening image with new meaning. "So. Back to the corner. 2am." "I keep thinking about that gasket." The last line is short and lands like a verdict: "We just need to remember that the stars were never the same thing as the stranger."

## Rhythm

- Paragraphs of one to four sentences. One-line paragraphs used for emphasis, about one in five.
- Mixes long, rolling sentences with very short ones. Never three long sentences in a row.
- Lists of three appear naturally ("a reputation, a face, a voice") but are earned by content, not rhythm.
- Talks to the reader as "you"; uses "I" for experience and "we" for the industry or the species.

## Words

- Plain, physical, British: pit, pub, the bartender's daughter's name, a promise in a tin, a gasket.
- Likes: signal, machine, the room, the gap, the default, the animal, the system, quietly, genuinely.
- UK spelling. Numbers written out in rhetorical passages ("four point nine stars", "two hundred thousand years"), as digits in evidence.

## What he never does (and the Desk must not)

- No unexplained names, ideas or jargon. Every person, model or term is introduced the first time it appears, so the piece can be read alone by someone who has never heard of them.

- No em dashes.
- No contrast framing in any form: "It's not X, it's Y", "That is not X. That is Y", "X isn't A. It's B", "Not X, but Y". State the positive claim once.
- No signposting that announces a point instead of making it ("Here is the part nobody wants to hear", "Here's the thing", "The truth is", "Then the number that matters").
- No more than one list of three in a piece, and no image explained straight after it is given.
- No invented first-person experience. A confession or a memory appears only if Alex supplied it in his reaction.
- No research tags in the prose ([Sourced], [Model]). Sources go in notes or in Go deeper.
- No glossing of household names (ChatGPT, Google, Amazon), and no "on my site The Last Animal": the piece is published there, so earlier essays are named by title only.
- No reuse of a sentence, scene or image from the examples on this page.
- No consultant filler (leverage, unlock, navigate, landscape, ecosystem, game-changer, in today's fast-paced world).
- No rhetorical questions stacked in a row. One question, then an answer.
- No hype words (revolutionary, unprecedented, mind-blowing) and no exclamation marks.
- No invented statistics, studies or quotes.

## Known habits to ration

These are his, and they work, but they wear out when repeated:

- "Here is the part nobody wants to hear" / "Here's the thing that stops me cold": this is signposting, so the Desk never writes it. Alex can add one by hand, once per piece at most.
- "The question isn't X. The question is Y.": he uses it in endings, but it sits very close to the banned "Not X, but Y". The Desk avoids it; Alex can add it back by hand.
- Section breaks with `---` in long essays: fine in essays, never in short formats.

## The house lint

The banned list is checked in code, not left to the model. After the Desk's editor pass, a lint in Owl Farm's `generateDraft` function looks for contrast framing, signposting, glossed household names, "on my site", research tags, old `thelastanimal.base44.app` links, consultant words, exclamation marks, more than one list of three, lines lifted from the examples on this page, and an opening that repeats a recent draft. Quoted material is skipped, because it is someone else's sentence. Anything found goes back to the model for one repair pass; what is left shows as a warning on the draft. First-person claims are flagged for Alex to confirm and are never auto-fixed.

It was added on 18 November 2026 after a review of two published pieces, "The White-Collar Coalfield" and "Nobody Came to Shop". The full rule list is in [`craft-playbook.md`](craft-playbook.md).

## Go deeper

- **The essays themselves:** start with [The Stranger's Car](https://thelastanimal.base44.app/essays/the-strangers-car), the clearest example of the whole voice in one piece.
- **On finding a voice in plain words:** William Zinsser, *On Writing Well* (1976), chapter "Style".
- **On British plain English:** George Orwell, ["Politics and the English Language"](https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/politics-and-the-english-language/) (1946). Its six rules sit behind the banned list.
- **How the Desk uses this page:** [`craft-playbook.md`](craft-playbook.md), and every term in [`glossary.md`](glossary.md).
