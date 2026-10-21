// The Edgework mark library (public/marks) and the rules for scattering it.
// Same seed, same marks: a card always looks the way it looked yesterday.

export const MARKS = {
  coffee: ['coffee-1', 'coffee-2', 'coffee-3', 'coffee-4', 'coffee-5'],
  splat: ['splat-1', 'splat-2', 'splat-3', 'splat-4'],
  smudge: ['smudge-1', 'smudge-2', 'smudge-3'],
  burn: ['burn-1', 'burn-2'],
  tape: ['tape-1', 'tape-2', 'tape-3'],
  pen: ['pen-lines', 'pen-scribble', 'pen-loop'],
};

export const markUrl = (name) => `/marks/${name}.webp`;

export const hash = (n) => (Math.imul(n | 0, 2654435761) >>> 0) % 9973;

// A tilt between -max and +max degrees, stable for a seed.
export const tilt = (seed, max = 2.5) => ((hash(seed * 7 + 3) % 101) / 100 - 0.5) * 2 * max;

// Each slot: allowed kinds (t), CSS position (p), base rotation (r), jitter (j),
// opacity (o) and blend (b). Tape is never blended so it reads as a solid object.
export function pickMarks(seed, slots) {
  return slots.map((s, i) => {
    const r = hash(seed * 97 + i * 13 + 7);
    const kind = s.t[r % s.t.length];
    const list = MARKS[kind];
    const name = list[Math.floor(r / 7) % list.length];
    const rot = (s.r || 0) + ((r % 21) - 10) * (s.j ?? 1.5);
    return {
      key: `${i}-${name}`,
      tape: kind === 'tape',
      src: markUrl(name),
      style: {
        ...s.p,
        transform: `rotate(${rot}deg)`,
        ...(kind === 'tape' ? {} : { mixBlendMode: s.b || 'multiply' }),
        opacity: s.o ?? 1,
      },
    };
  });
}

// Typed words: each word sits a fraction off the line, like a real strike.
// *asterisks* in the text mark the one phrase to highlight.
export function typedWords(text, salt = 1) {
  const words = [];
  let hot = false;
  String(text || '')
    .split(/\s+/)
    .filter(Boolean)
    .forEach((raw, wi) => {
      let word = raw;
      if (word.startsWith('*')) {
        hot = true;
        word = word.slice(1);
      }
      const closes = /\*[.,;:!?'"’)]*$/.test(word);
      if (closes) word = word.replace(/\*([.,;:!?'"’)]*)$/, '$1');
      const r = hash(salt * 131 + wi * 31 + 1);
      words.push({
        word,
        hot,
        style: {
          display: 'inline-block',
          whiteSpace: 'nowrap',
          transform: `translateY(${((r % 5) - 2) * 0.6}px) rotate(${((r % 7) - 3) * 0.22}deg)`,
        },
      });
      if (closes) hot = false;
    });
  return words;
}

export const plain = (text) => String(text || '').replace(/\*/g, '');
