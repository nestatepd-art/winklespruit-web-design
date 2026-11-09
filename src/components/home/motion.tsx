import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Adds `is-in` to every `.reveal` element as it scrolls into view. */
export const useRevealAll = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'));
    if (reduced()) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      }),
      { rootMargin: '0px 0px -10% 0px' },
    );
    els.forEach((e) => io.observe(e));
    // re-scan for lazily mounted sections
    const mo = new MutationObserver(() =>
      document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)').forEach((e) => io.observe(e)),
    );
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
};

/** Splits a line into words that rise in one by one. */
export const Words = ({ text, start = 0, className = '' }: { text: string; start?: number; className?: string }) => (
  <>
    {text.split(' ').map((w, i) => (
      <span key={i} className={`word ${className}`} style={{ animationDelay: `${start + i * 0.08}s` }}>
        {w}&nbsp;
      </span>
    ))}
  </>
);

/** Gently pulls its child toward the cursor. */
export const Magnetic = ({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: MouseEvent) => {
    if (reduced() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <span ref={ref} onMouseMove={move} onMouseLeave={leave} className="inline-block transition-transform duration-300 ease-out">
      {children}
    </span>
  );
};

/** Counts up to the number in `value` (keeps prefix/suffix like "+", "%", ","). */
export const Counter = ({ value }: { value: string }) => {
  const m = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const target = m ? parseInt(m[2].replace(/,/g, ''), 10) : 0;
  const [n, setN] = useState(reduced() || !m ? target : 0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!m || reduced() || !ref.current) return;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return <span>{value}</span>;
  return <span ref={ref}>{m[1]}{n.toLocaleString('en-ZA').replace(/\u00a0/g, ',')}{m[3]}</span>;
};

/** Small parallax offset driven by scroll position. */
export const useParallax = (factor = 0.08) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const off = (r.top + r.height / 2 - window.innerHeight / 2) * factor;
        ref.current.style.transform = `translate3d(0, ${-off}px, 0)`;
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [factor]);
  return ref;
};

export const WHATSAPP_URL =
  'https://wa.me/27731653988?text=' + encodeURIComponent("Hi Native Digital, I'd like to chat about a website / SEO.");
