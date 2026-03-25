import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const COLORS = {
  hero: '#FF3B5C',
  electric: '#00B4FF',
  gold: '#FFB800',
  purple: '#7C4DFF',
  orange: '#FF6D00',
  energy: '#00E676',
};
const POP_COLORS = Object.values(COLORS);

const CHAPTERS = [
  { id: 'home', label: 'HOME', title: 'Title Page', color: COLORS.hero, num: '00' },
  { id: 'about', label: 'ABOUT', title: 'Origin Story', color: COLORS.electric, num: '01' },
  { id: 'projects', label: 'ARCS', title: 'Story Arcs', color: COLORS.gold, num: '02' },
  { id: 'blog', label: 'BLOG', title: 'Chapters', color: COLORS.purple, num: '03' },
  { id: 'contact', label: 'MSG', title: 'Transmission', color: COLORS.orange, num: '04' },
];

const STATS = [
  { label: 'Creativity', value: 90, emoji: '🎨' },
  { label: 'Coding', value: 75, emoji: '💻' },
  { label: 'Art', value: 85, emoji: '✏️' },
  { label: 'Gaming', value: 95, emoji: '🎮' },
  { label: 'Sport', value: 60, emoji: '⚽' },
  { label: 'Music', value: 70, emoji: '🎵' },
];

const PROJECTS = [
  { num: '01', title: 'The Great App', synopsis: 'An ambitious quest to build the ultimate mobile app. Features include AI-powered homework help and a secret game mode only accessible by solving riddles.', status: 'ONGOING', tags: ['React Native', 'AI'] },
  { num: '02', title: 'The Secret Comic', synopsis: 'A manga series drawn entirely during recess breaks. 47 pages and counting. The villain is suspiciously based on math homework.', status: 'ONGOING', tags: ['Art', 'Storytelling'] },
  { num: '03', title: 'Operation Study Hack', synopsis: 'A flashcard system that turns revision into a boss battle. Each correct answer deals damage. Wrong answers power up the boss.', status: 'COMPLETE', tags: ['Python', 'Education'] },
  { num: '04', title: 'Pixel Quest', synopsis: 'A retro platformer built from scratch. 8-bit soundtrack composed during music class. Currently stuck on Level 7 boss design.', status: 'HIATUS', tags: ['Game Dev', 'Pixel Art'] },
];

const BLOGS = [
  { num: '01', title: 'The Day I Broke The Code', date: 'Day 42 of the Journey', preview: 'It was 11pm. The bug had been there for three hours. Then I saw it — a missing semicolon. The relief was UNREAL.' },
  { num: '02', title: 'Drawing My First Villain', date: 'Day 67 of the Journey', preview: 'Every hero needs a villain. Mine has laser eyes and a hatred for properly formatted code. His name? SYNTAX ERROR.' },
  { num: '03', title: 'The Wi-Fi Incident', date: 'Day 89 of the Journey', preview: 'Legend says the Wi-Fi went down for exactly 47 minutes. In that time, I discovered I could actually draw on real paper.' },
];

const SFX_WORDS = ['WHOOSH!', 'POW!', 'ZAP!', 'BOOM!', 'CRASH!', 'WHAM!', 'SNAP!', 'DASH!'];

/* ─── HOOKS ─── */
const useScrollReveal = (opts = {}) => {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px' } = opts;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setIsVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.unobserve(el); } }, { threshold, rootMargin });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, isVisible };
};

const useKonamiCode = (cb) => {
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  const prog = useRef(0);
  useEffect(() => {
    const h = (e) => {
      if (e.key === seq[prog.current] || e.key.toLowerCase() === seq[prog.current]) {
        prog.current++;
        if (prog.current === seq.length) { cb(); prog.current = 0; }
      } else { prog.current = 0; }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [cb]);
};

/* ─── SMALL COMPONENTS ─── */
const ScrollReveal = ({ children, direction = 'up', delay = 0, duration = 500, style = {} }) => {
  const { ref, isVisible } = useScrollReveal();
  const off = { up: 'translateY(40px)', down: 'translateY(-40px)', left: 'translateX(-50px)', right: 'translateX(50px)', scale: 'scale(0.9)', none: 'none' };
  return <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : off[direction], transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`, ...style }}>{children}</div>;
};

const SFX = ({ text, rotation = -8, size = 48, color = COLORS.hero, top, left, right, bottom }) => (
  <div aria-hidden="true" style={{ position: 'absolute', fontFamily: "'Bungee Shade', cursive", fontSize: `${size}px`, color, textShadow: '3px 3px 0 #111, -1px -1px 0 #111, 1px -1px 0 #111, -1px 1px 0 #111', transform: `rotate(${rotation}deg)`, letterSpacing: '4px', textTransform: 'uppercase', pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap', ...(top !== undefined ? { top } : {}), ...(left !== undefined ? { left } : {}), ...(right !== undefined ? { right } : {}), ...(bottom !== undefined ? { bottom } : {}) }}>{text}</div>
);

const SpeedLinesRadial = ({ opacity = 0.08 }) => (
  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'repeating-conic-gradient(#888 0deg 0.5deg, transparent 0.5deg 5deg)', opacity, pointerEvents: 'none' }} />
);

const NarrationBox = ({ children, pos = 'top-left', style = {} }) => {
  const p = { 'top-left': { top: 12, left: 12 }, 'top-right': { top: 12, right: 12 }, 'bottom-left': { bottom: 12, left: 12 }, 'bottom-right': { bottom: 12, right: 12 }, 'static': { position: 'relative' } };
  return <div style={{ background: '#FFFDE7', border: '2px solid #111', padding: '10px 14px', fontFamily: "'Courier Prime', monospace", fontSize: '13px', lineHeight: 1.6, maxWidth: 260, position: pos === 'static' ? 'relative' : 'absolute', boxShadow: '3px 3px 0 rgba(0,0,0,0.15)', zIndex: 5, ...p[pos], ...style }}>{children}</div>;
};

const SpeechBubble = ({ children, tail = 'bottom-left', maxWidth = 300, style = {} }) => (
  <div style={{ position: 'relative', background: 'white', border: '2.5px solid #111', borderRadius: 20, padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 15, lineHeight: 1.5, maxWidth, margin: '8px 0', ...style }}>
    {children}
    <div style={{ position: 'absolute', ...(tail === 'bottom-left' ? { bottom: -12, left: 24 } : tail === 'bottom-right' ? { bottom: -12, right: 24 } : { top: -12, left: 24, transform: 'rotate(180deg)' }), width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '12px solid #111' }} />
    <div style={{ position: 'absolute', ...(tail === 'bottom-left' ? { bottom: -9, left: 26 } : tail === 'bottom-right' ? { bottom: -9, right: 26 } : { top: -9, left: 26, transform: 'rotate(180deg)' }), width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '10px solid white' }} />
  </div>
);

const ShoutBubble = ({ children, color = COLORS.hero }) => (
  <div style={{ background: color, color: 'white', fontFamily: "'Bangers', cursive", fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', padding: '22px 30px', textAlign: 'center', clipPath: 'polygon(0% 15%, 5% 0%, 15% 12%, 25% 2%, 35% 15%, 45% 0%, 55% 12%, 65% 2%, 75% 15%, 85% 0%, 95% 12%, 100% 15%, 98% 50%, 100% 85%, 92% 100%, 80% 88%, 70% 100%, 60% 88%, 50% 100%, 40% 88%, 30% 100%, 20% 90%, 10% 100%, 0% 85%, 2% 50%)' }}>{children}</div>
);

const Stamp = ({ text, color = COLORS.hero, rotation = 5 }) => (
  <div style={{ display: 'inline-block', fontFamily: "'Bangers', cursive", fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color, border: `3px solid ${color}`, padding: '3px 10px', transform: `rotate(${rotation}deg)`, opacity: 0.9 }}>{text}</div>
);

const StatBar = ({ label, value, emoji, color = COLORS.electric, delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14 }}>{emoji} {label}</span>
        <span style={{ fontFamily: "'Bangers', cursive", fontSize: 18, color }}>{value}</span>
      </div>
      <div style={{ height: 12, background: '#eee', border: '2px solid #111', position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
        <div style={{ height: '100%', width: isVisible ? `${value}%` : '0%', background: color, transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }} />
      </div>
    </div>
  );
};

const TypewriterText = ({ text, speed = 30 }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const { ref, isVisible } = useScrollReveal();
  const [started, setStarted] = useState(false);
  useEffect(() => { if (isVisible && !started) setStarted(true); }, [isVisible]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => { if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; } else { setDone(true); clearInterval(iv); } }, speed);
    return () => clearInterval(iv);
  }, [started, text]);
  return <span ref={ref}>{started ? displayed : ''}{started && !done && <span className="blink-cursor">|</span>}</span>;
};

const ClickBurst = ({ bursts, onClean }) => {
  useEffect(() => { if (bursts.length > 0) { const t = setTimeout(() => onClean(), 700); return () => clearTimeout(t); } }, [bursts]);
  return <>
    {bursts.map(b => (
      <div key={b.id} style={{ position: 'fixed', left: b.x - 50, top: b.y - 30, zIndex: 9999, pointerEvents: 'none' }}>
        <div style={{ fontFamily: "'Bungee Shade', cursive", fontSize: 42, color: b.color, textShadow: '2px 2px 0 #111', transform: `rotate(${b.rot}deg)`, animation: 'sfx-pop 0.6s ease-out forwards', letterSpacing: 3 }}>{b.word}</div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: '50%', border: `3px solid ${b.color}`, animation: 'burst-expand 0.5s ease-out forwards', opacity: 0.5 }} />
      </div>
    ))}
  </>;
};


/* ═══════════════════════════════════════
   REALISTIC PAGE CURL SYSTEM
   ═══════════════════════════════════════
   Uses multiple vertical strips that each rotate
   with staggered timing to simulate paper curving.
   Edge strips curl tightly while spine strips
   barely move — like real paper physics.
   ═══════════════════════════════════════ */

const NUM_CURL_STRIPS = 8;

const PageCurlOverlay = ({ active, direction, isDark, pendingChapter, progress }) => {
  if (!active) return null;

  const isNext = direction === 'next';

  /*
    Each strip is a vertical slice of the page.
    Strip 0 = the leading edge (curls the most, moves first)
    Strip N = closest to spine (curls least, moves last)
    For 'next': strips go right-to-left (right edge curls first)
    For 'prev': strips go left-to-right (left edge curls first)
  */
  const strips = useMemo(() => {
    return Array.from({ length: NUM_CURL_STRIPS }, (_, i) => {
      const stripWidth = 100 / NUM_CURL_STRIPS;
      // Strip 0 is the leading edge, strip N-1 is near spine
      const edgeFactor = 1 - (i / (NUM_CURL_STRIPS - 1)); // 1.0 at edge, 0.0 at spine

      // Max rotation: edge strips rotate ~165deg, spine strips ~15deg
      const maxRotation = 15 + edgeFactor * 150;

      // Stagger: edge strips start first (0ms), spine strips start last
      const delayMs = (1 - edgeFactor) * 280;

      // Duration: edge strips are slightly faster
      const durationMs = 700 + (1 - edgeFactor) * 200;

      // Position: left offset for each strip
      const leftPct = isNext
        ? (NUM_CURL_STRIPS - 1 - i) * stripWidth  // right-to-left for next
        : i * stripWidth;                           // left-to-right for prev

      return { i, stripWidth, edgeFactor, maxRotation, delayMs, durationMs, leftPct };
    });
  }, [isNext]);

  // Paper colors
  const pageFront = isDark ? '#1a1a1a' : '#faf8f5';
  const pageBack = isDark ? '#222' : '#eee8e0';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none', overflow: 'hidden' }}
         aria-hidden="true">
      {/* Darkening shadow on the page underneath */}
      <div className="curl-under-shadow" style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.15)',
        animation: `curlUnderShadow 900ms ease-in-out forwards`,
      }} />

      {/* The curling strips */}
      {strips.map(({ i, stripWidth, edgeFactor, maxRotation, delayMs, durationMs, leftPct }) => {
        const animName = isNext ? `curlStripNext_${i}` : `curlStripPrev_${i}`;
        return (
          <div key={i} style={{
            position: 'absolute',
            top: 0,
            left: `${leftPct}%`,
            width: `${stripWidth + 0.5}%`, // slight overlap to prevent gaps
            height: '100%',
            transformOrigin: isNext ? 'left center' : 'right center',
            transformStyle: 'preserve-3d',
            perspective: 1200,
            animation: `${animName} ${durationMs}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delayMs}ms both`,
            zIndex: NUM_CURL_STRIPS - i, // edge strips render on top
          }}>
            {/* Front face of the strip (paper surface) */}
            <div style={{
              position: 'absolute', inset: 0,
              background: pageFront,
              backfaceVisibility: 'hidden',
            }}>
              {/* Paper fiber texture */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.03,
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)',
              }} />
              {/* Cylindrical highlight — light hitting the curved paper */}
              <div style={{
                position: 'absolute', inset: 0,
                background: edgeFactor > 0.5
                  ? `linear-gradient(to ${isNext ? 'left' : 'right'}, rgba(255,255,255,0) 0%, rgba(255,255,255,${0.06 * edgeFactor}) 40%, rgba(255,255,255,${0.12 * edgeFactor}) 60%, rgba(255,255,255,0) 100%)`
                  : 'none',
              }} />
            </div>

            {/* Back face of the strip (verso side) */}
            <div style={{
              position: 'absolute', inset: 0,
              background: pageBack,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}>
              {/* Subtle cross-hatch texture on back */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.04,
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 5px),
                  repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 5px)`,
              }} />
              {/* Chapter preview text on the back of the page (only on wider middle strips) */}
              {i >= 2 && i <= 5 && pendingChapter && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%) scaleX(-1)', // mirror because backface
                  textAlign: 'center', whiteSpace: 'nowrap',
                }}>
                  {i === 3 && (
                    <div style={{
                      fontFamily: "'Bangers', cursive",
                      fontSize: 'clamp(14px, 3vw, 24px)',
                      letterSpacing: 4,
                      color: pendingChapter.color,
                      textTransform: 'uppercase',
                      opacity: 0.5,
                    }}>
                      CH.{pendingChapter.num}
                    </div>
                  )}
                  {i === 4 && (
                    <div style={{
                      fontFamily: "'Courier Prime', monospace",
                      fontSize: 11,
                      color: isDark ? '#555' : '#aaa',
                      letterSpacing: 2,
                    }}>
                      {pendingChapter.title.toUpperCase()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shadow on the fold edge (the dark line where paper bends) */}
            <div style={{
              position: 'absolute',
              top: 0, bottom: 0,
              [isNext ? 'left' : 'right']: -1,
              width: 3,
              background: `rgba(0,0,0,${0.1 + edgeFactor * 0.2})`,
              filter: 'blur(1px)',
              zIndex: 2,
            }} />
          </div>
        );
      })}

      {/* Spine shadow — the dark crease at the book binding */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        [isNext ? 'left' : 'right']: '-2px',
        width: 12,
        background: `linear-gradient(to ${isNext ? 'right' : 'left'}, rgba(0,0,0,0.25), transparent)`,
        animation: 'spineReveal 900ms ease-in-out forwards',
      }} />

      {/* Moving cylindrical shadow cast onto the under-page */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: `curlShadowSweep_${direction} 900ms ease-in-out forwards`,
      }} />
    </div>
  );
};


const PageTurnSFX = ({ direction, color }) => {
  const sfx = direction === 'next' ? 'FLIP!' : 'TURN!';
  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: "'Bungee Shade', cursive",
      fontSize: 'clamp(28px, 7vw, 56px)',
      color: color,
      textShadow: '3px 3px 0 #111, -1px -1px 0 #111',
      zIndex: 10002, pointerEvents: 'none',
      animation: 'page-sfx-burst 0.7s ease-out forwards',
      letterSpacing: 4,
    }}>
      {sfx}
    </div>
  );
};

const PageCorner = ({ side, onClick, color, isDark, label }) => {
  const [hover, setHover] = useState(false);
  const isLeft = side === 'left';
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      aria-label={isLeft ? 'Previous page' : 'Next page'} className="page-corner-btn"
      style={{
        position: 'fixed', [isLeft ? 'left' : 'right']: 0, bottom: 0,
        width: hover ? 100 : 70, height: hover ? 100 : 70,
        zIndex: 200, background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), height 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'visible',
      }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={`fold-${side}`} x1={isLeft ? "100%" : "0%"} y1="0%" x2={isLeft ? "0%" : "100%"} y2="100%">
            <stop offset="0%" stopColor={isDark ? '#333' : '#f5f5f5'} />
            <stop offset="60%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
          <filter id={`shadow-${side}`}><feDropShadow dx={isLeft ? 3 : -3} dy="-3" stdDeviation="4" floodOpacity="0.3" /></filter>
        </defs>
        <path d={isLeft ? "M 100 100 L 0 100 L 100 0 Z" : "M 0 100 L 100 100 L 0 0 Z"} fill={`url(#fold-${side})`} filter={`url(#shadow-${side})`} style={{ transition: 'all 0.3s ease' }} />
        <path d={isLeft ? "M 100 0 L 0 100" : "M 0 0 L 100 100"} stroke={isDark ? '#555' : '#ccc'} strokeWidth="1" fill="none" strokeDasharray="4 3" />
        <text x={isLeft ? "68" : "32"} y={hover ? "60" : "64"} textAnchor="middle" fill="white" fontSize={hover ? "28" : "22"} fontFamily="Bangers, cursive" style={{ transition: 'all 0.3s ease', filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' }}>{isLeft ? '\u2190' : '\u2192'}</text>
        <text x={isLeft ? "68" : "32"} y={hover ? "78" : "80"} textAnchor="middle" fill="white" fontSize={hover ? "9" : "7"} fontFamily="Bangers, cursive" letterSpacing="2" style={{ transition: 'all 0.3s ease', filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.4))', textTransform: 'uppercase' }}>TURN PAGE</text>
      </svg>
      {hover && (
        <div style={{
          position: 'absolute', [isLeft ? 'left' : 'right']: 8, bottom: 105,
          fontFamily: "'Bangers', cursive", fontSize: 12, letterSpacing: 2, color: color,
          textTransform: 'uppercase', whiteSpace: 'nowrap', animation: 'fade-in 0.2s ease-out',
          background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
          padding: '2px 8px', border: `2px solid ${color}`,
        }}>{label}</div>
      )}
    </button>
  );
};

const PageSpine = ({ currentIdx, onNav, isDark }) => (
  <div className="page-spine" style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 150,
    display: 'flex', height: 44,
    background: isDark ? 'rgba(17,17,17,0.95)' : 'rgba(250,250,250,0.95)',
    backdropFilter: 'blur(8px)',
    borderBottom: `3px solid ${isDark ? '#333' : '#111'}`,
  }}>
    {CHAPTERS.map((ch, i) => {
      const isCurrent = i === currentIdx;
      return (
        <button key={ch.id} onClick={() => onNav(i)} className="spine-tab" style={{
          flex: 1, border: 'none',
          borderRight: i < CHAPTERS.length - 1 ? `1px solid ${isDark ? '#333' : '#ddd'}` : 'none',
          background: isCurrent ? ch.color : 'transparent',
          color: isCurrent ? 'white' : (isDark ? '#888' : '#999'),
          fontFamily: "'Bangers', cursive", fontSize: isCurrent ? 13 : 11,
          letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer',
          transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 0, position: 'relative', padding: 0,
        }}>
          <span style={{ fontSize: 8, opacity: 0.7, letterSpacing: 1 }}>CH.{ch.num}</span>
          <span>{ch.label}</span>
          {isCurrent && <div style={{ position: 'absolute', bottom: -3, left: '20%', right: '20%', height: 3, background: 'white', borderRadius: '3px 3px 0 0' }} />}
        </button>
      );
    })}
  </div>
);

const PageNumber = ({ currentIdx, total, isDark }) => (
  <div className="page-number" style={{
    position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)',
    zIndex: 150, display: 'flex', alignItems: 'center', gap: 12,
    background: isDark ? 'rgba(17,17,17,0.9)' : 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)',
    border: `2px solid ${isDark ? '#444' : '#111'}`, borderRadius: 24, padding: '6px 20px',
  }}>
    {CHAPTERS.map((ch, i) => (
      <div key={ch.id} style={{
        width: i === currentIdx ? 20 : 8, height: 8, borderRadius: 4,
        background: i === currentIdx ? ch.color : (isDark ? '#444' : '#ccc'),
        transition: 'all 0.3s ease',
        border: i === currentIdx ? 'none' : `1px solid ${isDark ? '#555' : '#bbb'}`,
      }} />
    ))}
    <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: isDark ? '#888' : '#666', marginLeft: 4 }}>
      {currentIdx + 1} / {total}
    </div>
  </div>
);


/* ═══════════════════════════════════════
   PAGE CONTENT SECTIONS (same as before)
   ═══════════════════════════════════════ */

const HomePage = ({ onNav }) => (
  <div>
    <div style={{ minHeight: '85vh', border: '3px solid var(--ink)', background: 'var(--panel)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 20 }}>
      <SpeedLinesRadial opacity={0.1} />
      <SFX text={`"Set your heart ablaze" —Rengoku`} rotation={-15} size={20} color={COLORS.hero} top="8%" right="5%" />
      <SFX text={`"Nah, I'd win" —Gojo`} rotation={12} size={22} color={COLORS.electric} bottom="15%" left="3%" />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--grey)', marginBottom: 8 }}>VOL. 01 — FIRST EDITION</div>
        <h1 style={{ fontFamily: "'Bangers', cursive", fontSize: 'clamp(52px, 14vw, 100px)', letterSpacing: 6, textTransform: 'uppercase', color: 'var(--ink)', textShadow: `4px 4px 0 ${COLORS.hero}, 8px 8px 0 rgba(0,0,0,0.1)`, lineHeight: 1, margin: 0, transform: 'rotate(-2deg)' }}>MAX</h1>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontStyle: 'italic', fontSize: 16, color: 'var(--grey)', marginTop: 14 }}>"A Story About Code, Art & Adventure"</div>
      </div>
      <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', animation: 'bounce 1.5s ease infinite' }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#999', marginBottom: 6 }}>TURN THE PAGE</div>
        <div style={{ fontSize: 24, color: '#999' }}>&#x21E8;</div>
      </div>
    </div>
    <div style={{ minHeight: '50vh', background: 'var(--dark)', color: 'var(--panel)', border: '3px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 600, fontFamily: "'Courier Prime', monospace", fontSize: 'clamp(16px, 3vw, 22px)', lineHeight: 1.8, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <TypewriterText text='In a world where homework never ends and Wi-Fi is never fast enough... one kid dared to build something extraordinary.' speed={30} />
      </div>
    </div>
    <div style={{ padding: '40px 12px', background: 'var(--gutter)', maxWidth: 900, margin: '0 auto' }}>
      <ScrollReveal><div style={{ fontFamily: "'Bangers', cursive", fontSize: 28, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', color: 'var(--ink)', marginBottom: 24 }}>SELECT YOUR CHAPTER</div></ScrollReveal>
      {CHAPTERS.filter(c => c.id !== 'home').map((ch, i) => (
        <ScrollReveal key={ch.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
          <div onClick={() => onNav(ch.id)} style={{ display: 'flex', alignItems: 'stretch', border: '3px solid var(--ink)', background: 'var(--panel)', marginBottom: 12, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', overflow: 'hidden', borderRadius: 2 }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(8px)'; e.currentTarget.style.boxShadow = '-8px 8px 0 rgba(0,0,0,0.08)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: 6, background: ch.color, flexShrink: 0 }} />
            <div style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid var(--ink)', fontFamily: "'Bangers', cursive", fontSize: 14, letterSpacing: 2, color: '#999', flexShrink: 0 }}>CH.{String(i + 1).padStart(2, '0')}</div>
            <div style={{ padding: '16px 20px', flex: 1 }}>
              <div style={{ fontFamily: "'Bangers', cursive", fontSize: 22, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink)' }}>{ch.title}</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: 'var(--grey)', lineHeight: 1.5, marginTop: 2 }}>{ch.id === 'about' ? 'The hero reveals his true power...' : ch.id === 'projects' ? 'Epic quests and legendary builds...' : ch.id === 'blog' ? 'Tales from the battlefield...' : 'Send a message to HQ!'}</div>
            </div>
            <div style={{ width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bangers', cursive", fontSize: 24, color: '#ccc', flexShrink: 0 }}>&#8594;</div>
          </div>
        </ScrollReveal>
      ))}
    </div>
    <ScrollReveal direction="scale">
      <div onClick={() => onNav('about')} style={{ background: 'var(--dark)', border: '3px solid var(--ink)', padding: '60px 20px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
        <SpeedLinesRadial opacity={0.12} />
        <div style={{ fontFamily: "'Bangers', cursive", fontSize: 'clamp(28px, 6vw, 48px)', color: 'var(--panel)', letterSpacing: 3, textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>TURN THE PAGE &#8594; ORIGIN STORY <span style={{ color: COLORS.hero }}>&#8594;</span></div>
      </div>
    </ScrollReveal>
  </div>
);

const AboutPage = ({ onNav }) => (
  <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px', background: 'var(--gutter)' }}>
    <ScrollReveal><div style={{ fontFamily: "'Bangers', cursive", fontSize: 14, letterSpacing: 3, color: '#999', textAlign: 'center', marginBottom: 4 }}>CHAPTER 01</div></ScrollReveal>
    <ScrollReveal><h2 style={{ fontFamily: "'Bangers', cursive", fontSize: 'clamp(32px, 8vw, 56px)', letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center', color: 'var(--ink)', textShadow: `3px 3px 0 ${COLORS.electric}`, margin: '0 0 24px' }}>THE ORIGIN STORY</h2></ScrollReveal>
    <ScrollReveal>
      <div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', position: 'relative', padding: '60px 24px 24px', minHeight: 200, overflow: 'hidden', marginBottom: 12, backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 5px)' }}>
        <SpeedLinesRadial opacity={0.05} />
        <NarrationBox>It all started in Singapore, on an island where the humidity is 100% and the ambition is higher...</NarrationBox>
        <div style={{ marginTop: 40 }}><SpeechBubble>My name is Max. I'm 11 years old, and I'm building my own universe — one line of code, one manga panel at a time.</SpeechBubble></div>
        <SFX text="START!" rotation={8} size={32} color={COLORS.electric} bottom="10px" right="10px" />
      </div>
    </ScrollReveal>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 12 }}>
      <ScrollReveal direction="left"><div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', padding: 24, minHeight: 180, backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '6px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><div style={{ fontFamily: "'Bangers', cursive", fontSize: 18, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.electric, marginBottom: 8 }}>BY DAY</div><SpeechBubble maxWidth={260}>Student at a Singapore school. Favourite subject: anything with a computer. Least favourite: waiting for the bell.</SpeechBubble></div></ScrollReveal>
      <ScrollReveal direction="right" delay={200}><div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', padding: 24, minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><div style={{ fontFamily: "'Bangers', cursive", fontSize: 18, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.hero, marginBottom: 8 }}>BY NIGHT</div><SpeechBubble maxWidth={260}>Coder. Artist. Gamer. Manga reader. Builder of worlds that don't exist yet — but will.</SpeechBubble></div></ScrollReveal>
    </div>
    <ScrollReveal direction="scale">
      <div style={{ border: '3px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ background: COLORS.electric, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontFamily: "'Bangers', cursive", fontSize: 28, color: 'white', letterSpacing: 2, textTransform: 'uppercase' }}>OUR HERO'S STATS</div><div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>QUIRK: Infinite Curiosity</div></div><div style={{ fontFamily: "'Bangers', cursive", fontSize: 48, color: 'rgba(255,255,255,0.3)' }}>MAX</div></div>
        <div style={{ background: 'var(--panel)', padding: 24 }}>
          {STATS.map((s, i) => <StatBar key={s.label} {...s} delay={i * 120} />)}
          <div style={{ marginTop: 16, borderTop: '2px dashed #ddd', paddingTop: 12 }}><NarrationBox pos="static" style={{ maxWidth: '100%' }}>"When you can't decide between coding and drawing, do both at the same time." — Max, age 11</NarrationBox></div>
        </div>
      </div>
    </ScrollReveal>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
      {[{ emoji: '🎮', label: 'Gaming' }, { emoji: '🎨', label: 'Drawing' }, { emoji: '💻', label: 'Coding' }].map((h, i) => (
        <ScrollReveal key={h.label} delay={i * 120}><div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '8px 8px', padding: 24, textAlign: 'center', minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: 48, marginBottom: 8 }}>{h.emoji}</div><div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }}>{h.label}</div></div></ScrollReveal>
      ))}
    </div>
    <ScrollReveal direction="scale"><div style={{ border: '3px solid var(--panel)', background: 'var(--dark)', padding: '60px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: 12 }}><SpeedLinesRadial opacity={0.1} /><div style={{ fontFamily: "'Bangers', cursive", fontSize: 'clamp(24px, 5vw, 42px)', color: 'var(--panel)', letterSpacing: 3, textTransform: 'uppercase', lineHeight: 1.3, position: 'relative', zIndex: 1 }}>EVERY GREAT STORY STARTS WITH SOMEONE WHO <span style={{ color: COLORS.electric }}>REFUSES</span> TO GIVE UP</div></div></ScrollReveal>
    <ScrollReveal><div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', padding: '40px 24px', textAlign: 'center' }}><div style={{ fontFamily: "'Courier Prime', monospace", fontStyle: 'italic', fontSize: 14, color: 'var(--grey)', marginBottom: 12 }}>THIS STORY IS STILL BEING WRITTEN...</div><div onClick={() => onNav('projects')} style={{ fontFamily: "'Bangers', cursive", fontSize: 24, letterSpacing: 2, color: COLORS.gold, cursor: 'pointer', textTransform: 'uppercase' }}>TO BE CONTINUED &#8594; THE STORY ARCS</div></div></ScrollReveal>
  </div>
);

const ProjectsPage = ({ onNav }) => (
  <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px', background: 'var(--gutter)' }}>
    <ScrollReveal><div style={{ fontFamily: "'Bangers', cursive", fontSize: 14, letterSpacing: 3, color: '#999', textAlign: 'center', marginBottom: 4 }}>CHAPTER 02</div></ScrollReveal>
    <ScrollReveal><h2 style={{ fontFamily: "'Bangers', cursive", fontSize: 'clamp(32px, 8vw, 56px)', letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center', color: 'var(--ink)', textShadow: `3px 3px 0 ${COLORS.gold}`, margin: '0 0 24px' }}>THE STORY ARCS</h2></ScrollReveal>
    {PROJECTS.map((p, i) => (
      <ScrollReveal key={p.num} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
        <div style={{ display: 'flex', alignItems: 'stretch', border: '3px solid var(--ink)', background: 'var(--panel)', marginBottom: 16, overflow: 'hidden', position: 'relative' }}>
          <div style={{ width: 6, background: COLORS.gold, flexShrink: 0 }} />
          <div style={{ padding: '20px 24px', flex: 1, position: 'relative' }}>
            <div style={{ fontFamily: "'Bangers', cursive", fontSize: 12, letterSpacing: 3, color: '#999', textTransform: 'uppercase', marginBottom: 4 }}>ARC {p.num}</div>
            <div style={{ fontFamily: "'Bangers', cursive", fontSize: 24, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 8 }}>{p.title}</div>
            <NarrationBox pos="static" style={{ maxWidth: '100%', position: 'relative' }}>{p.synopsis}</NarrationBox>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>{p.tags.map(t => <span key={t} style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, background: '#f0f0f0', border: '1.5px solid #ddd', borderRadius: 20, padding: '2px 10px', color: '#666' }}>{t}</span>)}</div>
            <div style={{ position: 'absolute', top: 12, right: 16 }}><Stamp text={p.status} color={p.status === 'COMPLETE' ? COLORS.energy : p.status === 'ONGOING' ? COLORS.electric : '#999'} rotation={p.status === 'COMPLETE' ? -5 : 4} /></div>
            {p.status === 'COMPLETE' && <div style={{ position: 'absolute', bottom: 12, right: 20, fontFamily: "'Bangers', cursive", fontSize: 36, color: COLORS.hero, opacity: 0.15, transform: 'rotate(15deg)', letterSpacing: 3 }}>FIN</div>}
          </div>
        </div>
      </ScrollReveal>
    ))}
    <ScrollReveal><div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', padding: '30px 24px', textAlign: 'center', marginTop: 12 }}><div style={{ fontFamily: "'Courier Prime', monospace", fontStyle: 'italic', fontSize: 14, color: 'var(--grey)', marginBottom: 8 }}>MORE ARCS ARE IN DEVELOPMENT...</div><div onClick={() => onNav('blog')} style={{ fontFamily: "'Bangers', cursive", fontSize: 20, letterSpacing: 2, color: COLORS.purple, cursor: 'pointer', textTransform: 'uppercase' }}>NEXT: READ THE CHAPTERS &#8594;</div></div></ScrollReveal>
  </div>
);

const BlogPage = ({ onNav }) => (
  <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px', background: 'var(--gutter)' }}>
    <ScrollReveal><div style={{ fontFamily: "'Bangers', cursive", fontSize: 14, letterSpacing: 3, color: '#999', textAlign: 'center', marginBottom: 4 }}>CHAPTER 03</div></ScrollReveal>
    <ScrollReveal><h2 style={{ fontFamily: "'Bangers', cursive", fontSize: 'clamp(32px, 8vw, 56px)', letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center', color: 'var(--ink)', textShadow: `3px 3px 0 ${COLORS.purple}`, margin: '0 0 24px' }}>THE MANGA CHAPTERS</h2></ScrollReveal>
    {BLOGS.map((b, i) => (
      <ScrollReveal key={b.num} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
        <div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', marginBottom: 16, overflow: 'hidden', padding: '24px 24px 24px 90px', position: 'relative', minHeight: 140 }}>
          <div style={{ position: 'absolute', left: -5, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Bangers', cursive", fontSize: 80, WebkitTextStroke: '2px var(--ink)', color: 'transparent', opacity: 0.15, letterSpacing: -4, lineHeight: 1 }}>{b.num}</div>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: '#999', marginBottom: 4 }}>{b.date}</div>
          <div style={{ fontFamily: "'Bangers', cursive", fontSize: 22, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 10 }}>{b.title}</div>
          <SpeechBubble maxWidth={500} style={{ margin: 0 }}>{b.preview}</SpeechBubble>
          <div style={{ marginTop: 14 }}><span style={{ fontFamily: "'Bangers', cursive", fontSize: 16, letterSpacing: 2, color: COLORS.purple, cursor: 'pointer', textTransform: 'uppercase' }}>READ CHAPTER &#8594;</span></div>
        </div>
      </ScrollReveal>
    ))}
    <ScrollReveal><div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', padding: '30px 24px', textAlign: 'center' }}><div style={{ fontFamily: "'Courier Prime', monospace", fontStyle: 'italic', fontSize: 14, color: 'var(--grey)', marginBottom: 8 }}>NEW CHAPTERS PUBLISHED WEEKLY...</div><div onClick={() => onNav('contact')} style={{ fontFamily: "'Bangers', cursive", fontSize: 20, letterSpacing: 2, color: COLORS.orange, cursor: 'pointer', textTransform: 'uppercase' }}>NEXT: SEND A TRANSMISSION &#8594;</div></div></ScrollReveal>
  </div>
);

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px', background: 'var(--gutter)' }}>
      <ScrollReveal><div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', position: 'relative', overflow: 'hidden', padding: '40px 24px', textAlign: 'center', marginBottom: 12 }}><SpeedLinesRadial opacity={0.06} /><SFX text="BZZT!" rotation={-12} size={28} color={COLORS.orange} top="10px" left="5%" /><SFX text="PING!" rotation={10} size={24} color={COLORS.electric} top="15px" right="8%" /><SFX text="CRACKLE" rotation={-5} size={20} color={COLORS.purple} bottom="15px" left="12%" /><div style={{ fontFamily: "'Bungee Shade', cursive", fontSize: 'clamp(24px, 6vw, 42px)', color: COLORS.orange, transform: 'rotate(-3deg)', position: 'relative', zIndex: 1, textShadow: '3px 3px 0 #111' }}>INCOMING TRANSMISSION!</div><div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: 'var(--grey)', marginTop: 8, position: 'relative', zIndex: 1 }}>SIGNAL STRENGTH: <span style={{ color: COLORS.energy, letterSpacing: 2 }}>&#9608;&#9608;&#9608;&#9608;</span> STRONG</div></div></ScrollReveal>
      {!sent ? (
        <ScrollReveal><div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', padding: 24 }}>
          <div style={{ marginBottom: 16 }}><label style={{ fontFamily: "'Bangers', cursive", fontSize: 14, letterSpacing: 2, color: 'var(--grey)', display: 'block', marginBottom: 6 }}>FROM:</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name, hero" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', border: '2.5px solid #111', borderRadius: 20, fontFamily: "'Nunito', sans-serif", fontSize: 15, background: 'white', color: '#111', outline: 'none' }} /></div>
          <div style={{ marginBottom: 16 }}><label style={{ fontFamily: "'Bangers', cursive", fontSize: 14, letterSpacing: 2, color: 'var(--grey)', display: 'block', marginBottom: 6 }}>SUBJECT:</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What's the mission?" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '2px solid #111', fontFamily: "'Courier Prime', monospace", fontSize: 14, background: '#FFFDE7', color: '#111', outline: 'none' }} /></div>
          <div style={{ marginBottom: 20 }}><label style={{ fontFamily: "'Bangers', cursive", fontSize: 14, letterSpacing: 2, color: 'var(--grey)', display: 'block', marginBottom: 6 }}>MESSAGE:</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your message here..." rows={6} style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', border: '2px solid #111', fontFamily: "'Nunito', sans-serif", fontSize: 15, background: 'white', backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e8e8e8 27px, #e8e8e8 28px)', lineHeight: '28px', color: '#111', outline: 'none', resize: 'vertical' }} /></div>
          <button onClick={() => setSent(true)} style={{ width: '100%', padding: '16px', background: COLORS.orange, color: 'white', fontFamily: "'Bangers', cursive", fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', border: '3px solid #111', cursor: 'pointer', boxShadow: '4px 4px 0 #111', transition: 'transform 0.15s, box-shadow 0.15s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #111'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 #111'; }}>TRANSMIT &#8594;</button>
        </div></ScrollReveal>
      ) : (
        <ScrollReveal direction="scale"><div style={{ border: '3px solid var(--ink)', background: 'var(--panel)', padding: '50px 24px', textAlign: 'center' }}><ShoutBubble color={COLORS.energy}>TRANSMISSION RECEIVED!</ShoutBubble><div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 14, color: 'var(--grey)', marginTop: 16 }}>Message logged. Our hero will respond soon...</div></div></ScrollReveal>
      )}
    </div>
  );
};

const SecretPanel = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });
  return (
    <div style={{ marginTop: 80, padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', fontFamily: "'Courier Prime', monospace", fontSize: 14, color: '#ccc', marginBottom: 50 }}>--- END ---</div>
      <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', border: '3px dashed #ccc', borderRadius: 8, padding: 30, textAlign: 'center', maxWidth: 600, margin: '0 auto', background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px)' }}>
        <div style={{ fontFamily: "'Bangers', cursive", fontSize: 20, color: COLORS.hero, letterSpacing: 2, marginBottom: 8 }}>SECRET PANEL UNLOCKED!</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: '#666', lineHeight: 1.6 }}>You found it. Thanks for scrolling this far — you're a true manga reader. Max appreciates you more than you know. Stay curious, keep building, and never stop dreaming.</div>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: '#999', marginTop: 12, fontStyle: 'italic' }}>BONUS: Try the Konami Code for ULTRA MODE!</div>
      </div>
    </div>
  );
};

const UltraOverlay = ({ onDismiss }) => (
  <div onClick={onDismiss} style={{ position: 'fixed', inset: 0, zIndex: 9997, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', cursor: 'pointer', animation: 'fade-in 0.3s ease-out' }}>
    <div style={{ animation: 'ultra-shake 0.3s ease-in-out 3' }}><ShoutBubble color={COLORS.hero}>ULTRA MODE ACTIVATED!</ShoutBubble></div>
  </div>
);


/* ═══════════════════════════════════════
   MAIN APP — REALISTIC MANGA PAGE CURL
   ═══════════════════════════════════════ */
export default function MangaPanelApp() {
  const [pageIdx, setPageIdx] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [ultraMode, setUltraMode] = useState(false);
  const [showUltraOverlay, setShowUltraOverlay] = useState(false);
  const [bursts, setBursts] = useState([]);
  const burstIdRef = useRef(0);

  const [turning, setTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState('next');
  const [turnPhase, setTurnPhase] = useState('idle');
  const [showTurnSFX, setShowTurnSFX] = useState(false);
  const [pendingIdx, setPendingIdx] = useState(null);

  // Longer animation for realistic curl (900ms total)
  const navigate = useCallback((target) => {
    let idx;
    if (typeof target === 'number') idx = target;
    else { idx = CHAPTERS.findIndex(c => c.id === target); if (idx === -1) return; }
    if (idx === pageIdx || turning) return;

    const dir = idx > pageIdx ? 'next' : 'prev';
    setTurnDirection(dir);
    setTurning(true);
    setTurnPhase('fold');
    setPendingIdx(idx);
    setShowTurnSFX(true);

    // Swap page content midway through the curl
    setTimeout(() => {
      setPageIdx(idx);
      setTurnPhase('reveal');
      setShowTurnSFX(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 500);

    // Animation complete
    setTimeout(() => {
      setTurning(false);
      setTurnPhase('idle');
      setPendingIdx(null);
    }, 1000);
  }, [pageIdx, turning]);

  useEffect(() => {
    const handler = (e) => {
      if (turning) return;
      if (e.key === 'ArrowRight' && pageIdx < CHAPTERS.length - 1) navigate(pageIdx + 1);
      if (e.key === 'ArrowLeft' && pageIdx > 0) navigate(pageIdx - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pageIdx, navigate, turning]);

  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current || turning) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx < 0 && pageIdx < CHAPTERS.length - 1) navigate(pageIdx + 1);
      if (dx > 0 && pageIdx > 0) navigate(pageIdx - 1);
    }
    touchStart.current = null;
  };

  useKonamiCode(useCallback(() => { setUltraMode(true); setShowUltraOverlay(true); setTimeout(() => setShowUltraOverlay(false), 2500); }, []));

  const handleClickBurst = (e) => {
    if (CHAPTERS[pageIdx].id !== 'home') return;
    if (e.target.closest('.page-corner-btn') || e.target.closest('.spine-tab') || e.target.closest('.page-number')) return;
    burstIdRef.current++;
    setBursts(prev => [...prev, { id: burstIdRef.current, x: e.clientX, y: e.clientY, word: SFX_WORDS[Math.floor(Math.random() * SFX_WORDS.length)], color: POP_COLORS[Math.floor(Math.random() * POP_COLORS.length)], rot: Math.random() * 30 - 15 }]);
  };

  const cssVars = isDark
    ? { '--page': '#111', '--panel': '#1A1A1A', '--dark': '#FAFAFA', '--gutter': '#0A0A0A', '--ink': '#E8E8E8', '--grey': '#999', '--light': '#444' }
    : { '--page': '#FAFAFA', '--panel': '#FFFFFF', '--dark': '#1A1A1A', '--gutter': '#F0F0F0', '--ink': '#111111', '--grey': '#555', '--light': '#AAA' };

  const currentChapter = CHAPTERS[pageIdx];

  // Content page fades/slides during turn
  let pageStyle = {};
  if (turnPhase === 'fold') {
    pageStyle = { opacity: 0, transition: 'opacity 0.35s ease-out' };
  } else if (turnPhase === 'reveal') {
    pageStyle = { opacity: 1, transition: 'opacity 0.4s ease-in 0.1s' };
  }

  const renderPage = () => {
    const id = CHAPTERS[pageIdx].id;
    switch (id) {
      case 'home': return <HomePage onNav={navigate} />;
      case 'about': return <AboutPage onNav={navigate} />;
      case 'projects': return <ProjectsPage onNav={navigate} />;
      case 'blog': return <BlogPage onNav={navigate} />;
      case 'contact': return <ContactPage />;
      default: return null;
    }
  };

  // Generate per-strip keyframes dynamically
  const stripKeyframes = useMemo(() => {
    let css = '';
    for (let i = 0; i < NUM_CURL_STRIPS; i++) {
      const edgeFactor = 1 - (i / (NUM_CURL_STRIPS - 1));
      const maxRot = 15 + edgeFactor * 150;

      // "Next" direction: page folds to the left (rotateY negative)
      css += `
        @keyframes curlStripNext_${i} {
          0%   { transform: perspective(1200px) rotateY(0deg); }
          15%  { transform: perspective(1200px) rotateY(${-maxRot * 0.05}deg); }
          35%  { transform: perspective(1200px) rotateY(${-maxRot * 0.3}deg); }
          55%  { transform: perspective(1200px) rotateY(${-maxRot * 0.65}deg); }
          75%  { transform: perspective(1200px) rotateY(${-maxRot * 0.9}deg); }
          90%  { transform: perspective(1200px) rotateY(${-maxRot * 0.98}deg); }
          100% { transform: perspective(1200px) rotateY(${-maxRot}deg); }
        }
      `;
      // "Prev" direction: page folds to the right (rotateY positive)
      css += `
        @keyframes curlStripPrev_${i} {
          0%   { transform: perspective(1200px) rotateY(0deg); }
          15%  { transform: perspective(1200px) rotateY(${maxRot * 0.05}deg); }
          35%  { transform: perspective(1200px) rotateY(${maxRot * 0.3}deg); }
          55%  { transform: perspective(1200px) rotateY(${maxRot * 0.65}deg); }
          75%  { transform: perspective(1200px) rotateY(${maxRot * 0.9}deg); }
          90%  { transform: perspective(1200px) rotateY(${maxRot * 0.98}deg); }
          100% { transform: perspective(1200px) rotateY(${maxRot}deg); }
        }
      `;
    }
    return css;
  }, []);

  return (
    <div
      style={{ ...cssVars, background: 'var(--page)', color: 'var(--ink)', minHeight: '100vh', fontFamily: "'Nunito', sans-serif", ...(ultraMode ? { animation: 'rainbow-bg 4s linear infinite' } : {}) }}
      onClick={handleClickBurst}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Bungee+Shade&family=Nunito:wght@400;600;700;800&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Noto+Sans+JP:wght@700;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${isDark ? '#111' : '#FAFAFA'}; overflow-x: hidden; }
        .blink-cursor { animation: blink 0.6s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(8px);} }
        @keyframes sfx-pop { 0%{opacity:1;transform:scale(0.5) rotate(var(--r,-8deg));} 50%{opacity:1;transform:scale(1.2) rotate(var(--r,-8deg));} 100%{opacity:0;transform:scale(1.5) rotate(var(--r,-8deg)) translateY(-40px);} }
        @keyframes burst-expand { 0%{transform:scale(0);opacity:0.6;} 100%{transform:scale(2);opacity:0;} }
        @keyframes fade-in { from{opacity:0;} to{opacity:1;} }
        @keyframes ultra-shake { 0%,100%{transform:translate(0,0) rotate(0);} 20%{transform:translate(-3px,1px) rotate(-1deg);} 40%{transform:translate(2px,-2px) rotate(1deg);} 60%{transform:translate(-1px,2px) rotate(-0.5deg);} 80%{transform:translate(2px,-1px) rotate(0.5deg);} }
        @keyframes rainbow-bg { 0%{filter:hue-rotate(0deg);} 100%{filter:hue-rotate(360deg);} }
        @keyframes page-sfx-burst {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0.6) rotate(-5deg); }
          40% { opacity: 1; transform: translate(-50%, -50%) scale(1.3) rotate(3deg); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.8) rotate(8deg) translateY(-30px); }
        }
        @keyframes curlUnderShadow {
          0% { opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes spineReveal {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes curlShadowSweep_next {
          0%   { background: linear-gradient(to left, rgba(0,0,0,0.25) 0%, transparent 5%); }
          25%  { background: linear-gradient(to left, transparent 20%, rgba(0,0,0,0.18) 30%, transparent 45%); }
          50%  { background: linear-gradient(to left, transparent 40%, rgba(0,0,0,0.15) 50%, transparent 65%); }
          75%  { background: linear-gradient(to left, transparent 60%, rgba(0,0,0,0.12) 70%, transparent 85%); }
          100% { background: linear-gradient(to left, transparent 80%, rgba(0,0,0,0) 100%); }
        }
        @keyframes curlShadowSweep_prev {
          0%   { background: linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 5%); }
          25%  { background: linear-gradient(to right, transparent 20%, rgba(0,0,0,0.18) 30%, transparent 45%); }
          50%  { background: linear-gradient(to right, transparent 40%, rgba(0,0,0,0.15) 50%, transparent 65%); }
          75%  { background: linear-gradient(to right, transparent 60%, rgba(0,0,0,0.12) 70%, transparent 85%); }
          100% { background: linear-gradient(to right, transparent 80%, rgba(0,0,0,0) 100%); }
        }
        ${stripKeyframes}
        .page-corner-btn:hover svg path:first-child { filter: brightness(1.2); }
        .spine-tab:hover { filter: brightness(1.15); }
        @media (max-width: 640px) {
          .page-spine { height: 38px !important; }
          .spine-tab { font-size: 9px !important; }
          .spine-tab span:first-child { display: none; }
          .page-number { bottom: 6px !important; padding: 4px 14px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
        input:focus, textarea:focus { border-color: ${COLORS.orange} !important; }
      `}</style>

      {/* Realistic multi-strip page curl overlay */}
      <PageCurlOverlay
        active={turning}
        direction={turnDirection}
        isDark={isDark}
        pendingChapter={pendingIdx !== null ? CHAPTERS[pendingIdx] : null}
        progress={0}
      />

      {showTurnSFX && <PageTurnSFX direction={turnDirection} color={currentChapter.color} />}

      <ClickBurst bursts={bursts} onClean={() => setBursts([])} />
      {showUltraOverlay && <UltraOverlay onDismiss={() => setShowUltraOverlay(false)} />}

      <PageSpine currentIdx={pageIdx} onNav={navigate} isDark={isDark} />

      <button onClick={(e) => { e.stopPropagation(); setIsDark(!isDark); }} style={{
        position: 'fixed', top: 50, right: 12, zIndex: 201,
        fontFamily: "'Courier Prime', monospace", fontSize: 11,
        padding: '5px 10px', border: '2px solid',
        borderColor: isDark ? '#E8E8E8' : '#111', background: isDark ? '#222' : '#FFF',
        color: isDark ? '#E8E8E8' : '#111', cursor: 'pointer', letterSpacing: 1, whiteSpace: 'nowrap',
      }}>{isDark ? '\u2600 DAY' : '\u263E NIGHT'}</button>

      {/* Page content — fades during curl */}
      <div style={{ paddingTop: 44, paddingBottom: 50, ...pageStyle }}>
        {renderPage()}
        <SecretPanel />
      </div>

      {pageIdx > 0 && (
        <PageCorner side="left" onClick={(e) => { e.stopPropagation(); navigate(pageIdx - 1); }}
          color={CHAPTERS[pageIdx - 1].color} isDark={isDark} label={`\u2190 ${CHAPTERS[pageIdx - 1].title}`} />
      )}
      {pageIdx < CHAPTERS.length - 1 && (
        <PageCorner side="right" onClick={(e) => { e.stopPropagation(); navigate(pageIdx + 1); }}
          color={CHAPTERS[pageIdx + 1].color} isDark={isDark} label={`${CHAPTERS[pageIdx + 1].title} \u2192`} />
      )}

      <PageNumber currentIdx={pageIdx} total={CHAPTERS.length} isDark={isDark} />
      <div style={{ height: 60 }} />
    </div>
  );
}
