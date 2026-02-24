import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../index.css'

const ranges = [
  'Satin Oil',
  'Color Brillianz',
  'Sun Shield',
  'Keratin Smooth',
  'Curl Control',
  'Absolut Volume',
  'Derma Activate',
  'Vital Nutrition',
  'Silver Savior',
  'Derma Sensitive',
]

export default function Keune() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
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
            <img
              src="/logo_phone.png"
              alt="Bij Mijn Kapper"
              className="sm:hidden h-10 w-auto"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-brand-accent transition">Home</Link>
            <Link to="/keune" className="hover:text-brand-accent transition font-semibold">Keune</Link>
            <Link to="/tarieven" className="hover:text-brand-accent transition">Tarieven</Link>
            <Link to="/afspraak" className="hover:text-brand-accent transition">Afspraak</Link>
          </nav>
          <button
            className="lg:hidden text-brand-dark border border-brand-dark/20 rounded-lg px-3 py-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
        <div className={`lg:hidden px-6 pb-4 transition-all ${menuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col gap-3 text-sm bg-white/90 border border-brand-dark/10 rounded-2xl p-4 shadow-sm">
            <Link to="/" className="hover:text-brand-accent transition">Home</Link>
            <Link to="/keune" className="hover:text-brand-accent transition font-semibold">Keune</Link>
            <Link to="/tarieven" className="hover:text-brand-accent transition">Tarieven</Link>
            <Link to="/afspraak" className="hover:text-brand-accent transition">Afspraak</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
        <section className="space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-brand-dark/60">Keune care</p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight">Gezond haar begint bij de basis</h1>
          <p className="text-brand-dark/75 leading-relaxed max-w-4xl">
            Keune Care is opgebouwd uit actieve, wetenschappelijk onderbouwde ingrediënten zoals essentiële mineralen en tarweproteïnen.
            Wij kiezen per hoofdhuid- en haarbehoefte een routine die glans en veerkracht terugbrengt.
          </p>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-brand-dark">Assortiment</p>
              <h2 className="font-display text-2xl sm:text-3xl">Voor elke haar- en hoofdhuidbehoefte</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {ranges.map((name, idx) => (
              <div
                key={name + idx}
                className="bg-white/90 rounded-2xl border border-brand-dark/10 shadow-sm grain p-4 sm:p-5 flex flex-col items-center gap-4 h-full"
              >
                <img
                  src="/keune_products.webp"
                  alt={name}
                  className="w-full h-40 sm:h-48 object-contain"
                />
                <div className="text-center">
                  <p className="text-base sm:text-lg font-semibold text-brand-dark uppercase tracking-[0.03em]">{name}</p>
                  <p className="text-xs text-brand-dark/60 uppercase tracking-[0.18em] mt-1">Keune Care</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-white/90 rounded-3xl border border-brand-dark/10 p-6 sm:p-7 grain shadow-sm h-full">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-dark/60">Stap-voor-stap</p>
            <h3 className="font-display text-xl sm:text-2xl mt-2 mb-3">Je routine in de salon & thuis</h3>
            <ul className="space-y-3 text-brand-dark/80">
              <li>1. Intake: haar- en hoofdhuid check, doel bepalen.</li>
              <li>2. Cleansing: juiste shampoo (bijv. Derma Sensitive / Silver Savior).</li>
              <li>3. Treat: masker of bond-repair afhankelijk van behoefte.</li>
              <li>4. Leave-in & bescherming: hittebeschermer en serums.</li>
              <li>5. Finish: styling op maat met flexibele hold.</li>
            </ul>
          </div>
          <div className="bg-brand-dark text-brand-beige rounded-3xl p-6 sm:p-7 shadow-glow h-full">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-beige/70">Scalp first</p>
            <h3 className="font-display text-xl sm:text-2xl mt-2 mb-3">Hoofdhuid in balans</h3>
            <p className="text-brand-beige/80 leading-relaxed">
              Gevoelige of droge hoofdhuid? Met Derma Sensitive en targeted serums kalmeren we eerst de huid. Daarna bouwen we glans en volume op zonder te verzwaren.
            </p>
            <button
              onClick={() => navigate('/afspraak')}
              className="mt-4 px-4 py-2 rounded-full bg-brand-beige text-brand-dark font-semibold hover:bg-brand-pink hover:text-white transition"
            >
              Boek een hoofdhuid-check
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
