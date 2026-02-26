import { useEffect, useRef, useState } from "react";

/**
 * Review slider zonder autoplay, met knoppen onderaan.
 * Desktop: 3 kaarten, tablet: 2, mobiel: 1.
 * Snap-scroll; loop door terug naar start/eind bij klikken.
 */
export function ReviewSlider({ reviews = [] }) {
  const [slidesPerView, setSlidesPerView] = useState(() =>
    typeof window === "undefined"
      ? 1
      : Math.min(
          3,
          window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1,
        ),
  );
  const viewportRef = useRef(null);

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      const next = Math.min(3, w >= 1280 ? 3 : w >= 768 ? 2 : 1);
      setSlidesPerView(next);
    };
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (!reviews.length) return null;
  const stars = (rating) => "★".repeat(Math.max(1, Math.round(rating || 0)));

  const scrollBy = (dir) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const step = vp.clientWidth;
    const atStart = vp.scrollLeft < 4;
    const atEnd =
      Math.abs(vp.scrollLeft + vp.clientWidth - vp.scrollWidth) < 4;
    if (dir === "next") {
      if (atEnd) vp.scrollTo({ left: 0, behavior: "smooth" });
      else vp.scrollBy({ left: step, behavior: "smooth" });
    } else {
      if (atStart) vp.scrollTo({ left: vp.scrollWidth, behavior: "smooth" });
      else vp.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-5 px-4 md:px-10">
      <div className="w-full">
        <div ref={viewportRef} className="overflow-hidden scroll-smooth">
          <div className="flex snap-x snap-mandatory gap-6 px-4 sm:px-6 md:px-8">
            {reviews.map((review, i) => (
              <div
                key={`${review.name}-${i}`}
                className="snap-start flex-none w-full md:w-1/2 lg:w-1/3 px-2"
              >
                <div className="h-full w-full rounded-3xl bg-white text-brand-dark border border-brand-dark/10 shadow-[0_18px_45px_rgba(0,0,0,0.12)] px-8 py-10 flex flex-col justify-center space-y-5 text-center">
                  <div className="flex justify-center gap-1 text-brand-pink text-base">
                    {stars(review.rating)}
                  </div>
                  <p className="text-xl md:text-2xl leading-relaxed text-brand-dark/90">
                    “{review.text}”
                  </p>
                  <div className="space-y-1">
                    <p className="font-semibold text-brand-dark text-lg">
                      — {review.name}
                    </p>
                    {review.subtitle && (
                      <p className="text-sm text-brand-dark/60">
                        {review.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Vorige review"
          onClick={() => scrollBy("prev")}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-brand-dark shadow hover:bg-white"
        >
          ‹
        </button>
        <button
          aria-label="Volgende review"
          onClick={() => scrollBy("next")}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-brand-dark shadow hover:bg-white"
        >
          ›
        </button>
      </div>
    </div>
  );
}
