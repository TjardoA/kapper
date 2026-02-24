import { useEffect, useRef, useState } from "react";

/**
 * Smooth horizontal slider (auto, no arrows).
 * Props: reviews [{ name, text, rating, subtitle? }]
 */
export function ReviewSlider({ reviews = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!reviews.length) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!paused) {
      timerRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % reviews.length);
      }, 6000);
    }
    return () => clearTimeout(timerRef.current);
  }, [index, paused, reviews.length]);

  if (!reviews.length) return null;
  const stars = (rating) => "★".repeat(Math.max(1, Math.round(rating || 0)));

  return (
    <div
      className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-[1800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {reviews.map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              className="w-full flex-shrink-0 px-6 py-10 bg-white text-brand-dark border border-brand-dark/10 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
            >
              <div className="max-w-xl mx-auto text-center space-y-5">
                <div className="flex justify-center gap-1 text-brand-pink text-base">
                  {stars(review.rating)}
                </div>
                <p className="text-xl md:text-2xl leading-relaxed text-brand-dark/90">“{review.text}”</p>
                <div className="space-y-1">
                  <p className="font-semibold text-brand-dark text-lg">— {review.name}</p>
                  {review.subtitle && (
                    <p className="text-sm text-brand-dark/60">{review.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-1">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all ${
              i === index
                ? "w-8 h-2.5 bg-white rounded-full"
                : "w-2 h-2 bg-white/40 rounded-full hover:bg-white/60"
            }`}
            aria-label={`Ga naar review ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
