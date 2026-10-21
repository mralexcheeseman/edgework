// Checks candidate feeds: does the feed load, and can its latest article be read in full
// without a login? Run: node scripts/check-feeds.mjs > /tmp/feeds.json
const CANDIDATES = {
  'Rory Sutherland': ['https://www.spectator.co.uk/writer/rory-sutherland/feed/', 'https://www.ogilvy.com/ideas/author/rory-sutherland/feed'],
  'Dan Ariely': ['https://danariely.substack.com/feed'],
  'Ana Andjelic': ['https://andjelicaaa.substack.com/feed'],
  'Shane Parrish': ['https://fs.blog/feed/'],
  'Morgan Housel': ['https://collabfund.com/blog/feed/', 'https://collabfund.com/blog/rss/', 'https://www.collaborativefund.com/blog/feed/'],
  'Marcus Collins': ['https://www.marctothec.com/fortheculture/feed', 'https://www.marctothec.com/feed'],
  'Ryan Holiday': ['https://ryanholiday.net/feed/', 'https://dailystoic.com/feed/'],
  'Scott Galloway': ['https://www.profgalloway.com/feed/', 'https://www.profgmedia.com/feed'],
  'Simon Sinek': ['https://simonsinek.com/feed/'],
  'Mark Ritson': ['https://www.marketingweek.com/author/mark-ritson/feed/'],
  'Byron Sharp': ['https://marketingscience.info/feed/', 'https://byronsharp.wordpress.com/feed/'],
  'Seth Godin': ['https://seths.blog/feed/'],
  'Tom Goodwin': ['https://tomgoodwin.substack.com/feed'],
  'Carlota Perez': ['https://carlotaperez.org/feed/'],
  'Ben Thompson': ['https://stratechery.com/feed/'],
  'Malcolm Gladwell': ['https://www.pushkin.fm/feed'],
  'Richard Shotton': ['https://www.richardshotton.com/feed', 'https://richardshotton.substack.com/feed'],
  'Faris Yakob': ['https://farisyakob.substack.com/feed'],
  'Zoe Scaman': ['https://zoescaman.substack.com/feed'],
  'Mark Pollard': ['https://www.markpollard.net/feed/', 'https://markpollard.substack.com/feed'],
  'Paul Graham': ['http://www.aaronsw.com/2002/feeds/pgessays.rss'],
  'April Dunford': ['https://www.aprildunford.com/feed', 'https://aprildunford.substack.com/feed'],
  'Rand Fishkin': ['https://sparktoro.com/blog/feed/'],
  'Jeremiah Owyang': ['https://web-strategist.com/blog/feed/', 'https://www.jeremiah.ai/feed'],
  'Brian Solis': ['https://www.briansolis.com/feed/'],
  'Nicholas Carr': ['https://www.newcartographies.com/feed', 'https://www.roughtype.com/?feed=rss2'],
  'Kevin Kelly': ['https://kk.org/thetechnium/feed/'],
  'Grant McCracken': ['https://cultureby.com/feed'],
  'Roger Martin': ['https://rogermartin.medium.com/feed', 'https://medium.com/feed/@rogermartin'],
  'Jonah Berger': ['https://jonahberger.com/feed/'],
  'Katelyn Bourgoin': ['https://learnwhywebuy.com/feed', 'https://www.customercamp.co/feed'],
  'Ann Handley': ['https://annhandley.com/feed/'],
  'Douglas Holt': ['https://culturalstrategy.com/feed/'],
  'Nancy Harhut': ['https://nancyharhut.com/feed/'],
  'Phil Barden': ['https://www.decode-marketing.com/feed/'],
  'Bozoma Saint John': ['https://bozoma.com/feed/'],
  'Cathy Hackl': ['https://www.cathyhackl.com/feed/'],
  'David Shing': ['https://shingy.com/feed/'],
};

const PAYWALL = /(this post is for paid subscribers|subscribe to (continue|read)|paid subscribers only|become a (paid )?member|members[- ]only|log in to read|sign in to read|to continue reading|premium content|you('|’)ve reached your limit|unlock this (article|story))/i;
const UA = { 'User-Agent': 'Mozilla/5.0 (OwlFarm private reader)' };

const decode = (s) => String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

async function get(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 15000);
  try {
    const res = await fetch(url, { headers: UA, redirect: 'follow', signal: ctl.signal });
    return { ok: res.ok, status: res.status, text: res.ok ? await res.text() : '' };
  } catch (e) {
    return { ok: false, status: String(e.name || e.message), text: '' };
  } finally {
    clearTimeout(t);
  }
}

function firstItem(xml) {
  const block = (xml.match(/<item[\s>][\s\S]*?<\/item>/i) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/i) || [''])[0];
  let link = decode((block.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1]);
  if (!link) link = (block.match(/<link[^>]*href="([^"]+)"/i) || [])[1] || '';
  const date = decode((block.match(/<(pubDate|published|updated)[^>]*>([\s\S]*?)<\/\1>/i) || [])[2]);
  const count = (xml.match(/<item[\s>]/gi) || xml.match(/<entry[\s>]/gi) || []).length;
  return { link, date, count, title: decode((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]) };
}

function articleText(html) {
  html = html.replace(/<(script|style|noscript|nav|header|footer|aside|form)[\s\S]*?<\/\1>/gi, ' ');
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0] || html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  return (article.match(/<(p|h2|h3|li|blockquote)[^>]*>[\s\S]*?<\/\1>/gi) || []).map(decode).filter((t) => t.length > 40).join('\n');
}

const out = [];
for (const [name, urls] of Object.entries(CANDIDATES)) {
  let result = { name, verdict: 'no feed found', tried: urls };
  for (const url of urls) {
    const feed = await get(url);
    if (!feed.ok || !/<(rss|feed|channel)[\s>]/i.test(feed.text)) continue;
    const item = firstItem(feed.text);
    if (!item.link) {
      result = { name, feed: url, verdict: 'feed has no items' };
      continue;
    }
    const page = await get(item.link);
    const text = page.ok ? articleText(page.text) : '';
    const walled = PAYWALL.test(page.text) && text.length < 4000;
    const verdict = !page.ok ? `article blocked (${page.status})` : walled ? 'paywalled' : text.length >= 1500 ? 'free, full text' : text.length >= 600 ? 'free, short' : 'unreadable';
    result = { name, feed: url, items: item.count, latest: item.title, date: item.date, article: item.link, chars: text.length, verdict };
    if (verdict.startsWith('free')) break;
  }
  out.push(result);
  console.error(`${name}: ${result.verdict}`);
}
console.log(JSON.stringify(out, null, 1));
