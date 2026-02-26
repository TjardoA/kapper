import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { fetchServices } from "../api/servicesApi";
import { fetchTeam } from "../api/teamApi";
import { fetchOpening } from "../api/openingHoursApi";
import {
  fetchUsps,
  fetchReviews,
  fetchGallery,
  fetchSiteInfo,
} from "../api/contentApi";
import { ReviewSlider } from "../components/ReviewSlider";

const fallbackServices = [
  {
    title: "Knippen & Stylen",
    description:
      "Persoonlijk advies, frisse coupe en föhnfinish die past bij jouw haar en lifestyle.",
    price: "Vanaf €32",
  },
  {
    title: "Kleuren & Highlights",
    description:
      "Zachte balayage, glansvolle tint of volledige kleurbehandeling met premium producten.",
    price: "Vanaf €55",
  },
  {
    title: "Treatment Rituals",
    description:
      "Intens herstellende treatments die glans, hydratatie en veerkracht terugbrengen.",
    price: "Vanaf €29",
  },
];

const fallbackTeam = [
  {
    name: "Sanne",
    role: "Color specialist",
    bio: "Bekend om natuurlijke blends en glansvolle finishes.",
    image_url:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    focal_y: 50,
  },
  {
    name: "Milan",
    role: "Stylist",
    bio: "Strakke fades, zachte layers en advies op maat.",
    image_url:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    focal_y: 50,
  },
  {
    name: "Lotte",
    role: "Bruid & Styling",
    bio: "Updo's en glossy styling voor je mooiste momenten.",
    image_url:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    focal_y: 50,
  },
];

const reviewsFallback = [
  {
    name: "Noor",
    text: "Eindelijk een kapper die echt luistert. Mijn balayage blijft wekenlang mooi.",
    rating: 5,
  },
  {
    name: "Daan",
    text: "Super service, fijne sfeer en goede styling tips voor thuis.",
    rating: 5,
  },
  {
    name: "Lisa",
    text: "Online afspraak maken gaat soepel en ik ben altijd op tijd aan de beurt.",
    rating: 5,
  },
];

const galleryFallback = [
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500856056008-859079534e9e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
];

const uspFallback = [
  "KEUNE stylingspartner & premium care",
  "Online boeken in 30 seconden",
  "Gratis intake en kleuradvies",
  "Persoonlijke nazorg tips",
];

export default function Home() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptSeen, setPromptSeen] = useState(false);
  const bookingRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [opening, setOpening] = useState([]);
  const [usps, setUsps] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
     const [
        { data: s },
        { data: t },
        { data: o },
        { data: u },
        { data: r },
        { data: g },
        { data: info },
      ] = await Promise.all([
        fetchServices(),
        fetchTeam(),
        fetchOpening(),
        fetchUsps(),
        fetchReviews(),
        fetchGallery(),
        fetchSiteInfo(),
      ]);
      setServices(
        (s || []).map((item) => ({
          title: item.name,
          description: item.description,
          price: `€${item.price}`,
        })) || fallbackServices,
      );
      setTeam(t && t.length ? t : fallbackTeam);
      setOpening(o || []);
      setUsps(u && u.length ? u.map((row) => row.text) : uspFallback);
      setReviews(r && r.length ? r : reviewsFallback);
      setGallery(
        g && g.length
          ? g.map((row) => ({
              url: row.url,
              focal_y: row.focal_y ?? 50,
            }))
          : galleryFallback.map((url) => ({ url, focal_y: 50 }))
      );
      setSiteInfo(info || null);
    })();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest("[data-scroll]");
      if (!target) return;
      e.preventDefault();
      document
        .getElementById(target.getAttribute("data-scroll"))
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (!bookingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !promptSeen) {
            setShowPrompt(true);
            setPromptSeen(true);
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(bookingRef.current);
    return () => observer.disconnect();
  }, [promptSeen]);

  const dayOrder = [
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrijdag",
    "Zaterdag",
    "Zondag",
  ];
  const openingList =
    opening && opening.length
      ? opening
          .slice()
          .sort(
            (a, b) =>
              dayOrder.indexOf(a.day || "") - dayOrder.indexOf(b.day || ""),
          )
          .map(
            (o) =>
              `${o.day} ${o.open_time?.slice(0, 5)} – ${o.close_time?.slice(0, 5)}`,
          )
      : [
          "Maandag 09:00 – 17:30",
          "Dinsdag 09:00 – 17:30",
          "Woensdag 09:00 – 17:30",
          "Donderdag 09:00 – 17:30",
          "Vrijdag 09:00 – 18:00",
          "Zaterdag 09:00 – 17:00",
        ];

  const heroTag = siteInfo?.hero_tagline || "#alsjehaarmaargoedzit";
  const heroTitle =
    siteInfo?.hero_title ||
    "Modern haircraft voor wie verzorgd én relaxed de salon uit wil.";
  const heroSubtitle =
    siteInfo?.hero_subtitle ||
    "Wij werken met tijd voor jou: persoonlijk advies, zachte kleuringen en styling die dagen meegaat. Boek direct online of loop binnen voor een korte consult.";
  const heroImage =
    siteInfo?.hero_image_url ||
    "/keune_products.webp";
  const heroFocalY = siteInfo?.hero_focal_y ?? 50;
  const servicesList = services.length ? services : fallbackServices;
  const marqueeStyles = `
    @keyframes services-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;
  const aboutTitle =
    siteInfo?.about_title || "Een salon die voelt als thuiskomen";
  const aboutBody =
    siteInfo?.about_body ||
    "We plannen ruim de tijd, zodat we echt luisteren en adviseren. Met premium producten en technieken die het haar gezond houden.";

  const phone = siteInfo?.phone || "0793168787";
  const whatsapp = siteInfo?.whatsapp || "31793168787";
  const address =
    siteInfo?.address || "Van Stolberglaan 33, 2713 ES Zoetermeer";
  const mapsUrl =
    siteInfo?.maps_url ||
    "https://www.google.com/maps?q=Bij+Mijn+Kapper+Zoetermeer&output=embed";

  return (
    <div className="bg-brand-beige min-h-screen text-brand-dark relative">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,124,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(29,26,22,0.06),transparent_35%)] pointer-events-none"
        aria-hidden
      />

      <header className="relative">
        <style>{marqueeStyles}</style>
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo_kapper.png"
              alt="Bij Mijn Kapper logo"
              className="h-12 w-auto hidden sm:block"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <img
              src="/logo_phone.png"
              alt="Bij Mijn Kapper"
              className="sm:hidden h-10 w-auto"
            />
            <div className="text-sm text-brand-dark/70 hidden sm:block leading-tight">
              <span className="block">Salon</span>
              <span className="block">Zoetermeer</span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-brand-accent transition">
              Home
            </Link>
            <Link to="/keune" className="hover:text-brand-accent transition">
              Keune
            </Link>
            <Link to="/tarieven" className="hover:text-brand-accent transition">
              Tarieven
            </Link>
            <Link to="/afspraak" className="hover:text-brand-accent transition">
              Afspraak
            </Link>
            <button
              onClick={() => navigate("/afspraak")}
              className="bg-brand-dark text-brand-beige px-4 py-2 rounded-full transition hover:bg-brand-dark/85 hover:text-brand-beige hover:shadow-glow"
            >
              Maak een afspraak
            </button>
          </nav>
          <button
            className="lg:hidden text-brand-dark border border-brand-dark/20 rounded-lg px-3 py-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        <div
          className={`lg:hidden px-6 pb-3 transition-all ${
            menuOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col gap-3 text-sm bg-white/90 border border-brand-dark/10 rounded-2xl p-4 shadow-sm">
            <Link to="/" className="hover:text-brand-accent transition">
              Home
            </Link>
            <Link to="/keune" className="hover:text-brand-accent transition">
              Keune
            </Link>
            <Link to="/tarieven" className="hover:text-brand-accent transition">
              Tarieven
            </Link>
            <Link to="/afspraak" className="hover:text-brand-accent transition">
              Afspraak
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-12 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div
              className="absolute -left-10 -top-10 w-24 h-24 bg-brand-accent/30 blur-3xl rounded-full"
              aria-hidden
            />
            <p className="uppercase text-xs tracking-[0.3em] text-brand-dark/60 mb-4">
              {heroTag}
            </p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight mb-6">
              {heroTitle}
            </h1>
            <p className="text-brand-dark/80 text-lg leading-relaxed mb-8">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/afspraak")}
                className="bg-brand-dark text-brand-beige px-5 py-3 rounded-full shadow-glow transition hover:bg-brand-dark/85 hover:text-brand-beige hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
              >
                Maak een afspraak
              </button>
              <a
                href="#services"
                data-scroll="services"
                className="px-5 py-3 rounded-full border border-brand-dark/15 text-brand-dark hover:border-brand-accent hover:text-brand-accent transition"
              >
                Bekijk behandelingen
              </a>
            </div>
            <div className="mt-8">
              <div className="bg-white/90 border border-brand-dark/10 shadow-sm rounded-2xl p-5 sm:p-6 inline-block min-w-[260px]">
                <p className="text-sm text-brand-dark/60 uppercase tracking-wide mb-1">
                  Openingstijden
                </p>
                <div className="flex flex-col gap-1 text-brand-dark tabular-nums">
                  {openingList.map((line) => (
                    <div key={line} className="flex gap-3">
                      <span className="min-w-[110px]">
                        {line.split(" ")[0]}
                      </span>
                      <span>{line.split(" ").slice(1).join(" ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-glow bg-white/70 backdrop-blur-sm grain">
              <img
                src={heroImage}
                alt="Keune product display"
                className="w-full h-[420px] object-cover"
                style={{ objectPosition: `50% ${heroFocalY}%` }}
              />
            </div>
            <div className="absolute -bottom-10 -left-6 bg-white/90 shadow-lg rounded-2xl px-5 py-4 border border-brand-dark/5">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-dark/60">
                Partners
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-semibold text-brand-dark">KEUNE</span>
                <span className="text-brand-dark/50 text-sm">
                  Care • Color • Style
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <section id="services" className="w-full px-0 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-dark/60">
                Behandelingen
              </p>
              <h2 className="font-display text-3xl mt-3">
                Alles voor gezonde, glanzende lokken
              </h2>
            </div>
          </div>

          <div className="relative overflow-hidden w-full px-0 py-6 group">
            <div
              className="flex gap-6 items-center"
              style={{
                width: "200%",
                animation: `services-marquee ${Math.max(
                  18,
                  servicesList.length * 6,
                )}s linear infinite`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
            >
              {[...servicesList, ...servicesList].map((service, idx) => (
                <div
                  key={`${service.title}-${idx}`}
                  className="bg-white/80 rounded-2xl p-6 shadow-sm border border-brand-dark/5 hover:-translate-y-1 hover:shadow-glow transition grain overflow-hidden min-w-[260px] sm:min-w-[320px] min-h-[200px] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-brand-dark">
                      {service.title}
                    </h3>
                    <span className="text-brand-pink font-medium">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-brand-dark/70 leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <button
                    onClick={() => navigate("/afspraak")}
                    className="mt-4 text-sm font-semibold text-brand-dark hover:text-brand-accent transition"
                  >
                    Boek deze
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white/80 border-t border-b border-brand-dark/5">
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-dark/60">
                Waarom wij
              </p>
              <h2 className="font-display text-3xl mt-3 mb-5">{aboutTitle}</h2>
              <p className="text-brand-dark/75 leading-relaxed mb-6">
                {aboutBody}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {(usps.length ? usps : uspFallback).map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 bg-brand-beige/70 rounded-xl px-4 py-3 border border-brand-dark/5"
                  >
                    <span
                      className="h-2 w-2 mt-2 rounded-full bg-brand-pink"
                      aria-hidden
                    />
                    <p className="text-brand-dark/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {gallery.slice(0, 2).map((img, idx) => {
                const url = img.url || img;
                const fy = img.focal_y ?? 50;
                return (
                  <div
                    key={`${url}-${idx}`}
                    className="rounded-2xl overflow-hidden shadow-md grain border border-brand-dark/5"
                  >
                    <img
                      src={url}
                      alt="Salon voorbeeld"
                      className="w-full h-56 object-cover"
                      style={{ objectPosition: `50% ${fy}%` }}
                    />
                  </div>
                );
              })}
              <div className="rounded-2xl overflow-hidden shadow-md grain border border-brand-dark/5 sm:col-span-2">
                {gallery[2] && (
                <img
                  src={gallery[2].url || gallery[2]}
                  alt="Hair detail"
                  className="w-full h-64 object-cover"
                  style={{
                    objectPosition: `50% ${gallery[2].focal_y ?? 50}%`,
                  }}
                />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-dark/60">
                Het team
              </p>
              <h2 className="font-display text-3xl mt-3">
                Mensen die van haar houden
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(team.length ? team : fallbackTeam).map((member, idx) => (
              <div
                key={member.id ?? idx}
                className="bg-white/90 rounded-2xl overflow-hidden shadow-sm border border-brand-dark/5 grain"
              >
                <img
                  src={member.image_url || member.image}
                  alt={member.name}
                  className="w-full aspect-[16/9] object-cover"
                  style={{ objectPosition: `50% ${member.focal_y ?? 50}%` }}
                />
                <div className="p-5">
                  <p className="text-sm uppercase tracking-[0.15em] text-brand-dark/60">
                    {member.role}
                  </p>
                  <h3 className="text-xl font-semibold mt-1">{member.name}</h3>
                  <p className="text-brand-dark/70 mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-brand-dark text-brand-beige py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6 mb-6 text-left">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-beige/70">
              Reviews
            </p>
            <h2 className="font-display text-3xl mt-2">Wat klanten zeggen</h2>
          </div>
          <div className="px-4 sm:px-6">
            <ReviewSlider reviews={reviews.length ? reviews : reviewsFallback} />
          </div>
        </section>

        <section
          id="booking"
          ref={bookingRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16"
        >
          <div className="bg-white/95 border border-brand-dark/10 rounded-3xl shadow-glow overflow-hidden grain">
            <div className="p-5 sm:p-7 md:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-brand-dark/60">
                  Online boeken
                </p>
                <h2 className="font-display text-2xl sm:text-3xl leading-tight">
                  Plan je afspraak
                </h2>
                <p className="text-brand-dark/70 text-sm sm:text-base leading-relaxed">
                  Open de planner in een aparte pagina of gebruik de knop
                  hieronder.
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 flex-nowrap overflow-x-auto pb-1 whitespace-nowrap">
                <button
                  onClick={() => navigate("/afspraak")}
                  className="px-4 py-2 rounded-full bg-brand-dark text-brand-beige text-sm sm:text-base hover:bg-brand-dark/85 transition"
                >
                  <span className="sm:hidden">Planner</span>
                  <span className="hidden sm:inline">Open planner</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white/90 rounded-3xl shadow-sm border border-brand-dark/10 p-8 md:p-10 grid md:grid-cols-2 gap-8 grain">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-dark/60">
                Contact & route
              </p>
              <h2 className="font-display text-3xl mt-3 mb-4">
                Kom langs in Zoetermeer
              </h2>
              <div className="space-y-3 text-brand-dark/80">
                <p className="font-semibold text-brand-dark">{address}</p>
                <p>Mail: info@bijmijnkapper.nl</p>
                <p>Openingstijden:</p>
                <div className="space-y-1 tabular-nums">
                  {openingList.map((line) => {
                    const [day, ...rest] = line.split(" ");
                    return (
                      <div key={line} className="flex gap-3">
                        <span className="min-w-[110px]">{day}</span>
                        <span>{rest.join(" ")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden bg-brand-beige/80 border border-brand-dark/5 shadow-inner grain">
              <iframe
                title="Route naar Bij Mijn Kapper"
                src={mapsUrl}
                className="w-full h-64 md:h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-dark text-brand-beige py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
          <p>Bij Mijn Kapper • Zoetermeer • {new Date().getFullYear()}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-accent transition">
              Privacy
            </a>
            <a href="#" className="hover:text-brand-accent transition">
              Algemene voorwaarden
            </a>
          </div>
        </div>
      </footer>

      <button
        onClick={() => navigate("/afspraak")}
        className="fixed bottom-6 right-6 bg-brand-dark text-brand-beige px-4 py-3 rounded-full shadow-glow hover:bg-brand-dark/85 transition text-sm md:text-base"
      >
        Maak een afspraak
      </button>

      {showPrompt && (
        <div className="fixed bottom-20 right-6 bg-white text-brand-dark px-4 py-3 rounded-2xl shadow-lg border border-brand-dark/10 max-w-xs text-sm flex items-start gap-3">
          <span
            className="mt-0.5 h-2 w-2 rounded-full bg-brand-pink"
            aria-hidden
          />
          <div>
            <p className="font-semibold text-brand-dark">Direct boeken?</p>
            <p className="text-brand-dark/70">
              Ga naar de planner via “Open planner”.
            </p>
          </div>
          <button
            className="text-brand-dark/50 hover:text-brand-dark ml-1"
            aria-label="Sluit melding"
            onClick={() => setShowPrompt(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
