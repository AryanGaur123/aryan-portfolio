import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { scrollToTarget } from '../../lib/lenis';
import './CommandPalette.css';

interface Command {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => void | Promise<void>;
}

const EMAIL = 'gauraryan1027@gmail.com';

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const commands = useMemo<Command[]>(() => [
    { id: 'home',       label: 'Go home',            hint: 'Section', keywords: 'home top hero start',
      run: () => scrollToTarget('#hero') },
    { id: 'experience', label: 'View experience',    hint: 'Section', keywords: 'experience work sandisk sjsu jobs cards',
      run: () => scrollToTarget('#experience') },
    { id: 'contact',    label: 'Get in touch',       hint: 'Section', keywords: 'contact reach email connect',
      run: () => scrollToTarget('#contact') },
    { id: 'email',      label: 'Copy email address', hint: 'Copy',    keywords: 'email copy mail gmail address',
      run: async () => {
        await navigator.clipboard.writeText(EMAIL);
        showToast('Email copied ✦');
      } },
    { id: 'linkedin',   label: 'Open LinkedIn',      hint: 'Link',    keywords: 'linkedin social profile connect',
      run: () => { window.open('https://www.linkedin.com/in/gauraryan', '_blank', 'noreferrer'); } },
    { id: 'github',     label: 'Open GitHub',        hint: 'Link',    keywords: 'github code repos projects',
      run: () => { window.open('https://github.com/AryanGaur123', '_blank', 'noreferrer'); } },
  ], [showToast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(c =>
      c.label.toLowerCase().includes(q) || c.keywords.includes(q)
    );
  }, [commands, query]);

  /* Global shortcuts */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setActive(0);
      } else if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault();
      filtered[active].run();
      close();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="cmdk__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
          >
            <motion.div
              className="cmdk__panel"
              role="dialog"
              aria-label="Command palette"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              onKeyDown={onListKey}
            >
              <div className="cmdk__input-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                <input
                  ref={inputRef}
                  className="cmdk__input"
                  placeholder="Type a command…"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setActive(0); }}
                  spellCheck={false}
                />
                <kbd className="cmdk__kbd">esc</kbd>
              </div>

              <ul className="cmdk__list">
                {filtered.length === 0 && (
                  <li className="cmdk__empty">Nothing found.</li>
                )}
                {filtered.map((c, i) => (
                  <li key={c.id}>
                    <button
                      className={`cmdk__item${i === active ? ' cmdk__item--active' : ''}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => { c.run(); close(); }}
                    >
                      <span>{c.label}</span>
                      <span className="cmdk__hint">{c.hint}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="cmdk__toast"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discoverability hint */}
      <button className="cmdk__fab" data-hover onClick={() => setOpen(true)} aria-label="Open command palette">
        <kbd>⌘</kbd><kbd>K</kbd>
      </button>
    </>
  );
};

export default CommandPalette;
