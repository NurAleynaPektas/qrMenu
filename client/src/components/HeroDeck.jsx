import { useEffect, useMemo, useRef, useState } from "react";
import s from "./HeroDeck.module.css";

function useInterval(cb, delay, running = true) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  }, [cb]);
  useEffect(() => {
    if (!running || delay == null) return;
    const id = setInterval(() => ref.current(), delay);
    return () => clearInterval(id);
  }, [delay, running]);
}

export default function HeroDeck({
  slides = [],
  title,
  subtitle,
  ctaText = "See Menu",
  ctaHref = "/menu",
  autoplayMs = 4000,
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (i) => setIdx((i + slides.length) % slides.length);
  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  useInterval(next, autoplayMs, !paused);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx]);


  const startX = useRef(null);
  const onTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    startX.current = null;
  };

  const posClass = (i) => {
    const n = slides.length || 1;
    const diff = (i - idx + n) % n;
    const map = (d) => (d > n / 2 ? d - n : d);
    const d = map(diff);
    if (d === 0) return s.isActive;
    if (d === -1) return s.isPrev;
    if (d === 1) return s.isNext;
    if (d === -2) return s.isPrev2;
    if (d === 2) return s.isNext2;
    return s.isFar;
  };

  const enableHover = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? true
    );
  }, []);

  return (
    <section
      className={s.hero}
      aria-label="Hero"
      onMouseEnter={() => enableHover && setPaused(true)}
      onMouseLeave={() => enableHover && setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={s.inner}>
        <div className={s.deck} role="list">
          {slides.map((sl, i) => (
            <figure
              key={(sl.src || "") + i}
              role="listitem"
              className={`${s.card} ${posClass(i)}`}
              aria-hidden={i !== idx}
            >
              <img className={s.img} src={sl.src} alt={sl.alt || "slide"} />
            </figure>
          ))}
        </div>
        <div className={s.copy}>
          {title && <h1 className={s.title}>{title}</h1>}
          {subtitle && <p className={s.subtitle}>{subtitle}</p>}
          {ctaText && (
            <a className={s.btn} href={ctaHref}>
              {ctaText}
            </a>
          )}
        </div>
        <button
          type="button"
          className={`${s.nav} ${s.left}`}
          aria-label="Previous"
          onClick={prev}
        >
          ‹
        </button>
        <button
          type="button"
          className={`${s.nav} ${s.right}`}
          aria-label="Next"
          onClick={next}
        >
          ›
        </button>
        <div className={s.dots} aria-label="Slide controls">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${s.dot} ${i === idx ? s.dotActive : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === idx ? "true" : "false"}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
