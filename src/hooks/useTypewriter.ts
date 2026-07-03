import { useEffect, useState } from 'react';

/**
 * Rotating typewriter — types a phrase, holds, deletes, moves to the next.
 * Hand-rolled (~40 lines) instead of typed.js: no dep, no DOM hijacking.
 */
export function useTypewriter(
  phrases: string[],
  { typeMs = 55, deleteMs = 28, holdMs = 2200 } = {}
): string {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const current = phrases[index % phrases.length];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), typeMs);
      } else {
        timer = setTimeout(() => setPhase('deleting'), holdMs);
      }
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), deleteMs);
      } else {
        setIndex(i => i + 1);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timer);
  }, [text, phase, index, phrases, typeMs, deleteMs, holdMs]);

  return text;
}
