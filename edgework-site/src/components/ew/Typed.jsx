import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { typedWords, plain } from '@/lib/marks';

// Word-jittered typewriter text. One *phrase* may carry the highlighter.
export function TypedText({ text, salt = 1, className = '' }) {
  const words = typedWords(text, salt);
  const out = [];
  let run = null;
  words.forEach((w, i) => {
    const node = (
      <span key={i} style={w.style}>
        {w.word}
      </span>
    );
    if (w.hot) {
      if (!run) {
        run = [];
        out.push(run);
      }
      run.push(node);
    } else {
      run = null;
      out.push(node);
    }
  });
  return (
    <span className={`ew-type ${className}`}>
      {out.map((part, i) =>
        Array.isArray(part) ? [
          <span key={`h${i}`} className="ew-hl">
            {part.map((n, j) => [n, j < part.length - 1 ? ' ' : null])}
          </span>,
          ' ',
        ] : (
          [part, ' ']
        ),
      )}
    </span>
  );
}

// A headline that types itself on the first time it scrolls into view.
export function TypeOn({ text, as: Tag = 'span', className = '', speed = 38, start = true }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const full = plain(text);
  const [n, setN] = useState(reduce ? full.length : 0);
  const [seen, setSeen] = useState(false);
  const [cursor, setCursor] = useState(!reduce);

  useEffect(() => {
    if (reduce || !ref.current) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (reduce || !seen || !start) return undefined;
    if (n >= full.length) {
      const t = setTimeout(() => setCursor(false), 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((v) => v + 1), full[n] === ' ' ? speed * 0.5 : speed);
    return () => clearTimeout(t);
  }, [n, seen, start, reduce, full, speed]);

  return (
    <Tag ref={ref} className={className} aria-label={full}>
      <span aria-hidden="true">
        {full.slice(0, n)}
        {cursor && seen && <span className="ew-cursor" />}
        <span style={{ visibility: 'hidden' }}>{full.slice(n)}</span>
      </span>
    </Tag>
  );
}
