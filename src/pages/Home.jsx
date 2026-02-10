import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

const services = [
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

const team = [
  {
    name: "Sanne",
    role: "Color specialist",
    bio: "Bekend om natuurlijke blends en glansvolle finishes.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Milan",
    role: "Stylist",
    bio: "Strakke fades, zachte layers en advies op maat.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Lotte",
    role: "Bruid & Styling",
    bio: "Updo’s en glossy styling voor je mooiste momenten.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
  },
];

const reviews = [
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

const gallery = [
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500856056008-859079534e9e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
];

const uspList = [
  "KEUNE stylingspartner & premium care",
  "Online boeken in 30 seconden",
  "Gratis intake en kleuradvies",
  "Persoonlijke nazorg tips",
];

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptSeen, setPromptSeen] = useState(false);
  const bookingRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest("[data-scroll]");
      if (!target) return;
      e.preventDefault();
      const id = target.getAttribute("data-scroll");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Popup verschijnt wanneer boekingssectie in beeld komt
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

  return (
    <div className="bg-brand-beige min-h-screen text-brand-dark relative">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,124,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(29,26,22,0.06),transparent_35%)] pointer-events-none"
        aria-hidden
      />
      <header className="relative">
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
            <a
              href="tel:0793168787"
              className="hover:text-brand-accent transition"
            >
              Bel
            </a>
            <a
              href="https://wa.me/31793168787"
              className="hover:text-brand-accent transition"
            >
              WhatsApp
            </a>
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
        {/* Mobile dropdown menu */}
        <div
          className={`lg:hidden px-6 pb-3 transition-all ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
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
            <a
              href="tel:0793168787"
              className="hover:text-brand-accent transition"
            >
              Bel
            </a>
            <a
              href="https://wa.me/31793168787"
              className="hover:text-brand-accent transition"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-12 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div
              className="absolute -left-10 -top-10 w-24 h-24 bg-brand-accent/30 blur-3xl rounded-full"
              aria-hidden
            />
            <p className="uppercase text-xs tracking-[0.3em] text-brand-dark/60 mb-4">
              #alsjehaarmaargoedzit
            </p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight mb-6">
              Modern haircraft voor wie verzorgd én relaxed de salon uit wil.
            </h1>
            <p className="text-brand-dark/80 text-lg leading-relaxed mb-8">
              Wij werken met tijd voor jou: persoonlijk advies, zachte
              kleuringen en styling die dagen meegaat. Boek direct online of
              loop binnen voor een korte consult.
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
            <div className="flex flex-wrap gap-3 mt-8 text-sm text-brand-dark/80">
              <div className="px-4 py-2 rounded-full bg-white/80 border border-brand-dark/10 shadow-sm">
                Van Stolberglaan 33, 2713 ES Zoetermeer
              </div>
              <div className="px-4 py-2 rounded-full bg-white/80 border border-brand-dark/10 shadow-sm">
                Ma–Do 09:00–17:30 • Vr 09:00–18:00 • Za 09:00–17:00
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-glow bg-white/70 backdrop-blur-sm grain">
              <img
                src="/keune_products.webp"
                alt="Keune product display"
                className="w-full h-[420px] object-cover"
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
        <section
          id="services"
          className="max-w-6xl mx-auto px-6 py-12 md:py-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-dark/60">
                Behandelingen
              </p>
              <h2 className="font-display text-3xl mt-3">
                Alles voor gezonde, glanzende lokken
              </h2>
            </div>
            <span className="hidden md:block text-brand-dark/60">
              Indicatieve prijzen • pas ze aan naar wens
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white/80 rounded-2xl p-6 shadow-sm border border-brand-dark/5 hover:-translate-y-1 hover:shadow-glow transition grain overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-brand-dark">
                    {service.title}
                  </h3>
                  <span className="text-brand-pink font-medium">
                    {service.price}
                  </span>
                </div>
                <p className="text-brand-dark/70 leading-relaxed">
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
        </section>

        <section className="bg-white/80 border-t border-b border-brand-dark/5">
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-dark/60">
                Waarom wij
              </p>
              <h2 className="font-display text-3xl mt-3 mb-5">
                Een salon die voelt als thuiskomen
              </h2>
              <p className="text-brand-dark/75 leading-relaxed mb-6">
                We plannen ruim de tijd, zodat we écht luisteren en adviseren.
                Met premium producten en technieken die het haar gezond houden.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {uspList.map((item) => (
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
              {gallery.slice(0, 2).map((src) => (
                <div
                  key={src}
                  className="rounded-2xl overflow-hidden shadow-md grain border border-brand-dark/5"
                >
                  <img
                    src={src}
                    alt="Salon voorbeeld"
                    className="w-full h-56 object-cover"
                  />
                </div>
              ))}
              <div className="rounded-2xl overflow-hidden shadow-md grain border border-brand-dark/5 sm:col-span-2">
                <img
                  src={gallery[2]}
                  alt="Hair detail"
                  className="w-full h-64 object-cover"
                />
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
            <span className="hidden md:block text-brand-dark/60">
              Pas namen/foto’s aan naar je eigen team
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white/90 rounded-2xl overflow-hidden shadow-sm border border-brand-dark/5 grain"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-56 object-cover"
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

        <section className="bg-brand-dark text-brand-beige">
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-beige/70">
                Reviews
              </p>
              <h2 className="font-display text-3xl mt-3 mb-4">
                Wat klanten zeggen
              </h2>
              <p className="text-brand-beige/80 leading-relaxed mb-6">
                Vul aan met echte reviews of koppel een widget. Tot die tijd
                staan hier voorbeeldquotes.
              </p>
              <button
                onClick={() => navigate("/afspraak")}
                className="bg-brand-beige text-brand-dark px-5 py-3 rounded-full font-semibold hover:bg-brand-pink transition"
              >
                Boek nu
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="bg-brand-beige text-brand-dark rounded-2xl p-4 shadow-md grain"
                >
                  <div className="flex items-center gap-2 text-brand-pink mb-2">
                    {"★★★★★".slice(0, review.rating)}
                  </div>
                  <p className="text-brand-dark/80 leading-relaxed mb-3">
                    “{review.text}”
                  </p>
                  <p className="font-semibold text-brand-dark">{review.name}</p>
                </div>
              ))}
            </div>
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
                <a
                  href="tel:0793168787"
                  className="px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-brand-dark/15 text-brand-dark text-sm sm:text-base hover:border-brand-pink transition"
                >
                  <span className="sm:hidden">Bel</span>
                  <span className="hidden sm:inline">Bel salon</span>
                </a>
                <a
                  href="https://wa.me/31793168787"
                  className="px-4 py-2 rounded-full bg-brand-pink text-white text-sm sm:text-base hover:bg-brand-dark transition"
                >
                  WhatsApp
                </a>
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
                <p className="font-semibold text-brand-dark">
                  Van Stolberglaan 33, 2713 ES Zoetermeer
                </p>
                <p>Tel / WhatsApp: 079 316 87 87</p>
                <p>Mail: info@bijmijnkapper.nl</p>
                <p>Openingstijden:</p>
                <p>Ma–Do 09:00–17:30 • Vr 09:00–18:00 • Za 09:00–17:00</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden bg-brand-beige/80 border border-brand-dark/5 shadow-inner grain">
              <iframe
                title="Route naar Bij Mijn Kapper"
                src="https://www.google.com/maps?q=Bij+Mijn+Kapper+Zoetermeer&output=embed"
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

      {/* Floating booking launcher */}
      <button
        onClick={() => navigate("/afspraak")}
        className="fixed bottom-6 right-6 bg-brand-dark text-brand-beige px-4 py-3 rounded-full shadow-glow hover:bg-brand-dark/85 transition text-sm md:text-base"
      >
        Maak een afspraak
      </button>

      {/* Popup prompt appears when booking section in view */}
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

