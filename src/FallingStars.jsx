import { useMemo } from 'react';
import './FallingStars.css';

function random(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function FallingStars({ children }) {
  const dots = useMemo(() => {
    const rnd = random(42);
    return Array.from({ length: 140 }, (_, i) => ({
      id: i,
      left: `${rnd() * 100}%`,
      top: `${rnd() * 100}%`,
      size: 1 + (i % 3),
      delay: `${rnd() * 4}s`,
      duration: `${3.5 + rnd() * 4}s`,
    }));
  }, []);

  const meteors = useMemo(() => {
    const rnd = random(901);
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${rnd() * 100}%`,
      top: `${rnd() * 55}%`,
      width: `${70 + rnd() * 130}px`,
      delay: `${rnd() * 18}s`,
      duration: `${2.4 + rnd() * 5}s`,
    }));
  }, []);

  return (
    <div className="falling-stars-root">
      <div className="falling-stars-layer falling-stars-layer--back" aria-hidden>
        {dots.map((d) => (
          <span
            key={d.id}
            className="falling-star-dot"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              animationDelay: d.delay,
              animationDuration: d.duration,
            }}
          />
        ))}
      </div>
      <div className="falling-stars-layer falling-stars-layer--meteors" aria-hidden>
        {meteors.map((m) => (
          <div
            key={m.id}
            className="falling-meteor"
            style={{
              left: m.left,
              top: m.top,
              width: m.width,
              animationDelay: m.delay,
              animationDuration: m.duration,
            }}
          />
        ))}
      </div>
      {children != null ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}
