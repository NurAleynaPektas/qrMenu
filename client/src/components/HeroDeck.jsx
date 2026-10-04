import { useEffect, useRef, useState } from "react";
import s from "./HeroDeck.module.css";

function useInterval(callback, delay, running = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!running || delay == null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay, running]);
}

export default function HeroDeck({
  slides = [],
  title,
  subtitle,
  ctaText = "Explore Menu",
  ctaHref = "/menu",
  autoplayMs = 5000,
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const slideCount = slides.length;

  const goTo = (index) => {
    if (!slideCount) return;

    setIdx((index + slideCount) % slideCount);
  };

  const next = () => {
    goTo(idx + 1);
  };

  const prev = () => {
    goTo(idx - 1);
  };

  useInterval(next, autoplayMs, !paused && slideCount > 1);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        next();
      }

      if (event.key === "ArrowLeft") {
        prev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [idx]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const difference = event.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(difference) > 50) {
      difference < 0 ? next() : prev();
    }

    touchStartX.current = null;
  };

  const formatNumber = (number) => {
    return String(number).padStart(2, "0");
  };

  if (!slideCount) return null;

  return (
    <section
      className={s.hero}
      aria-label="Featured restaurant experience"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* IMAGES */}
      <div className={s.slides}>
        {slides.map((slide, index) => (
          <div
            key={`${slide.src}-${index}`}
            className={`${s.slide} ${index === idx ? s.slideActive : ""}`}
            aria-hidden={index !== idx}
          >
            <img
              className={s.image}
              src={slide.src}
              alt={slide.alt || "Restaurant"}
            />
          </div>
        ))}
      </div>

      {/* DARK OVERLAY */}
      <div className={s.overlay} />

      {/* CONTENT */}
      <div className={s.content}>
        <div className={s.eyebrow}>
          <span className={s.eyebrowLine} />
          <span>Modern Dining Experience</span>
        </div>

        {title && <h1 className={s.title}>{title}</h1>}

        {subtitle && <p className={s.subtitle}>{subtitle}</p>}

        {ctaText && (
          <a className={s.cta} href={ctaHref}>
            <span>{ctaText}</span>
            <span className={s.ctaArrow}>→</span>
          </a>
        )}
      </div>

      {/* BOTTOM CONTROLS */}
      <div className={s.bottomBar}>
        <div className={s.navigation}>
          <button
            type="button"
            className={s.navButton}
            onClick={prev}
            aria-label="Previous slide"
          >
            ←
          </button>

          <button
            type="button"
            className={s.navButton}
            onClick={next}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        <div className={s.progress}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${s.progressItem} ${
                index === idx ? s.progressActive : ""
              }`}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === idx ? "true" : undefined}
            />
          ))}
        </div>

        <div className={s.counter}>
          <span className={s.current}>{formatNumber(idx + 1)}</span>

          <span className={s.counterDivider}>/</span>

          <span>{formatNumber(slideCount)}</span>
        </div>
      </div>
    </section>
  );
}
