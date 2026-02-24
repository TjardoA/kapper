import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../index.css";
import { fetchTariffTree } from "../api/tariffsApi";

const formatPrice = (item) => {
  if (item.price_text) return item.price_text;
  if (item.price_numeric !== null && item.price_numeric !== undefined) {
    const price = Number(item.price_numeric);
    if (!Number.isNaN(price)) return `€${price.toFixed(2).replace(".", ",")}`;
  }
  return "-";
};

export default function Tarieven() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await fetchTariffTree();
      if (!error && data) {
        setCategories(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="bg-brand-beige min-h-screen text-brand-dark">
      <header className="bg-white/90 border-b border-brand-dark/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo_kapper.png" alt="Bij Mijn Kapper" className="h-10 w-auto" />
            <span className="text-sm text-brand-dark/70 hidden sm:block leading-tight">
              <span className="block">Zoetermeer</span>
              <span className="block">• Salon</span>
            </span>
            <img src="/logo_phone.png" alt="Bij Mijn Kapper" className="sm:hidden h-10 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-brand-accent transition">
              Home
            </Link>
            <Link to="/keune" className="hover:text-brand-accent transition">
              Keune
            </Link>
            <Link to="/tarieven" className="hover:text-brand-accent transition font-semibold">
              Tarieven
            </Link>
            <Link to="/afspraak" className="hover:text-brand-accent transition">
              Afspraak
            </Link>
            <a href="tel:0790000000" className="hover:text-brand-accent transition">
              Bel
            </a>
            <a href="https://wa.me/310790000000" className="hover:text-brand-accent transition">
              WhatsApp
            </a>
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
          className={`lg:hidden px-6 pb-4 transition-all ${
            menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col gap-3 text-sm bg-white/90 border border-brand-dark/10 rounded-2xl p-4 shadow-sm">
            <Link to="/" className="hover:text-brand-accent transition">
              Home
            </Link>
            <Link to="/keune" className="hover:text-brand-accent transition">
              Keune
            </Link>
            <Link to="/tarieven" className="hover:text-brand-accent transition font-semibold">
              Tarieven
            </Link>
            <Link to="/afspraak" className="hover:text-brand-accent transition">
              Afspraak
            </Link>
            <a href="tel:0790000000" className="hover:text-brand-accent transition">
              Bel
            </a>
            <a href="https://wa.me/310790000000" className="hover:text-brand-accent transition">
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
        <section className="space-y-3">
          <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-brand-dark/60">Tarieven</p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight">Tarieven</h1>
        </section>

        {loading && <p className="text-sm text-brand-dark/70">Tarieven laden...</p>}

        {!loading && categories.length === 0 && (
          <p className="text-sm text-brand-dark/70">Nog geen tarieven ingevuld in de CMS.</p>
        )}

        {!loading && categories.length > 0 && (
          <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white/95 rounded-2xl shadow-sm border border-brand-dark/10 grain p-5 sm:p-6 flex flex-col"
              >
                <h3 className="font-semibold text-xl text-brand-dark mb-4">{cat.title}</h3>
                <div className="space-y-4">
                  {(cat.items || []).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-base text-brand-dark/80">
                      <span>{item.name}</span>
                      <span className="font-semibold text-brand-dark text-lg">{formatPrice(item)}</span>
                    </div>
                  ))}
                  {(cat.items || []).length === 0 && (
                    <p className="text-sm text-brand-dark/60">Nog geen items in deze categorie.</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}


