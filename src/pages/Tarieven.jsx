import { Link } from 'react-router-dom'
import { useState } from 'react'
import '../index.css'

const categories = [
  {
    title: 'Dames',
    items: [
      { name: 'Wassen drogen', price: '€17,50' },
      { name: 'Wassen föhnen', price: '€29,75' },
      { name: 'Wassen knippen', price: '€27,00' },
      { name: 'Wassen knippen drogen', price: '€33,25' },
      { name: 'Wassen knippen föhnen model', price: '€45,25' },
      { name: 'Pony knippen', price: '€10,75' },
      { name: 'Lang haar knippen toeslag', price: '€12,25' },
    ],
  },
  {
    title: 'Heren',
    items: [
      { name: 'Wassen knippen', price: '€25,00' },
      { name: 'Tondeuse', price: '€18,75' },
      { name: 'Contouren', price: '€11,50' },
      { name: 'Baard knippen', price: '€11,50' },
      { name: "Men's color incl. knippen", price: '€47,50' },
    ],
  },
  {
    title: 'Kids',
    items: [
      { name: 'Tot 10 jaar', price: '€16,75' },
      { name: '10 tot 15 jaar', price: '€18,75' },
    ],
  },
  {
    title: 'Kleuring',
    items: [
      { name: 'Advies gesprek', price: '€0,00' },
      { name: 'Kleurspoeling (vanaf)', price: '€35,00' },
      { name: 'Kleuring uitgroei 30cc', price: '€37,50' },
      { name: 'Kleurtoeslag per 10cc', price: '€7,50' },
      { name: 'Kamstrepen', price: '€30,00' },
      { name: 'Folies per stuk', price: '€4,00' },
      { name: 'Folies 10-15 stuks (vanaf)', price: '€40,00' },
      { name: 'Folies 16-30 stuks (vanaf)', price: '€55,00' },
      { name: 'Folies 31-50 stuks (hele haar, vanaf)', price: '€75,00' },
      { name: 'Toner na kleuring/highlights', price: '€27,50' },
      { name: 'Balayage', price: '€135,00' },
    ],
  },
  {
    title: 'Permanent',
    items: [
      { name: 'Permanent all-in', price: '€89,50' },
      { name: 'Deel permanent all-in', price: '€79,50' },
      { name: 'Lang haar toeslag', price: '€20,00' },
    ],
  },
  {
    title: 'Diversen',
    items: [
      { name: 'Proef en bruidskapsel (samen)', price: 'Op aanvraag' },
      { name: 'Extensions', price: 'Op aanvraag' },
    ],
  },
]

export default function Tarieven() {
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
            <Link to="/keune" className="hover:text-brand-accent transition">Keune</Link>
            <Link to="/tarieven" className="hover:text-brand-accent transition font-semibold">Tarieven</Link>
            <Link to="/afspraak" className="hover:text-brand-accent transition">Afspraak</Link>
            <a href="tel:0790000000" className="hover:text-brand-accent transition">Bel</a>
            <a href="https://wa.me/310790000000" className="hover:text-brand-accent transition">WhatsApp</a>
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
            <Link to="/keune" className="hover:text-brand-accent transition">Keune</Link>
            <Link to="/tarieven" className="hover:text-brand-accent transition font-semibold">Tarieven</Link>
            <Link to="/afspraak" className="hover:text-brand-accent transition">Afspraak</Link>
            <a href="tel:0790000000" className="hover:text-brand-accent transition">Bel</a>
            <a href="https://wa.me/310790000000" className="hover:text-brand-accent transition">WhatsApp</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
        <section className="space-y-3">
          <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-brand-dark/60">Tarieven</p>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight">Indicatieve prijzen</h1>
          <p className="text-brand-dark/75 leading-relaxed max-w-3xl">
            Pas deze prijzen gerust aan naar je actuele lijst. We adviseren altijd op maat—bij uitgebreide kleurbehandelingen bespreken we samen wat het beste past.
          </p>
        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.title} className="bg-white/95 rounded-2xl shadow-sm border border-brand-dark/10 grain p-5 sm:p-6 flex flex-col">
              <h3 className="font-semibold text-xl text-brand-dark mb-4">{cat.title}</h3>
              <div className="space-y-4">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-base text-brand-dark/80">
                    <span>{item.name}</span>
                    <span className="font-semibold text-brand-dark text-lg">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
