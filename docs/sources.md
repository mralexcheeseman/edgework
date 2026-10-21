# Sources the Wire reads

**What this is.** Which writers Owl Farm's **Wire** can read every morning, and why the rest can't be read. Owl Farm is Alex Cheeseman's private app for his publication Edgework, and the Wire is its daily reading machine. It reads new articles from the writers Alex follows, and files any that meet one of his beliefs (his Positions) as a "collision" to write about. It can only use writers who publish a free **feed**: an RSS feed, the machine-readable list of new posts most blogs and newsletters provide. Who each writer is: see the people table in the [glossary](glossary.md#people-alex-reads-and-where-to-start-with-each), or the Thinkers page in Owl Farm.

Rule: the Wire only reads pieces it can read in full. A piece is "full" when the article page gives at least 800 characters of body text and doesn't hit the paywall pattern. Anything else is stored as a stub (`read_full: false`) and skipped. Checked 21 Oct 2026 with `owl-farm/scripts/check-feeds.mjs`.

## Free and active

| Thinker | Feed |
| --- | --- |
| Seth Godin | seths.blog feed (short daily posts) |
| Ryan Holiday | ryanholiday.net/feed/ |
| Tom Goodwin | Substack |
| Zoe Scaman | Substack |
| April Dunford | aprildunford.substack.com/feed |
| Rand Fishkin | sparktoro.com/blog/feed/ |
| Brian Solis | briansolis.com/feed/ |
| Kevin Kelly | kk.org/thetechnium/feed/ |
| Ann Handley | annhandley.com/feed/ |
| Jeremiah Owyang | web-strategist.com/blog/feed/ |
| Nicholas Carr | newcartographies.com/feed |
| Dan Ariely | Substack (mostly free) |
| Morgan Housel | collabfund.com/feed.xml, filtered by `feed_author: Housel` |

## Partly free (only the free pieces get through)

Ben Thompson (weekly articles free, daily updates paid), Scott Galloway (profgmedia.com/feed), Ana Andjelic, Shane Parrish.

## Lens only (no free feed, or blocked)

Rory Sutherland, Mark Ritson, Faris Yakob, Malcolm Gladwell, Simon Sinek, Jim Collins, Richard Shotton, Paul Graham, Roger Martin (Medium blocks fetches), and others. They can still be chosen as lenses on the Desk.

## Stale (not added)

Byron Sharp (last post 2020), Carlota Perez (2016), Jonah Berger (2015), Grant McCracken (Feb 2025).
