import { pickMarks } from '@/lib/marks';

// Scatters real stain and tape scans by seed. Purely decorative.
export default function Scatter({ seed, slots }) {
  return pickMarks(seed, slots).map((m) => (
    <img
      key={m.key}
      src={m.src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable="false"
      className={m.tape ? 'ew-tape' : 'ew-mark'}
      style={m.style}
    />
  ));
}
