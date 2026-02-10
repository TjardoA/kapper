import { Link } from 'react-router-dom'
import { useState } from 'react'
import '../index.css'

export default function Planner() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="bg-brand-beige min-h-screen text-brand-dark overflow-hidden">
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
            <Link to="/tarieven" className="hover:text-brand-accent transition">Tarieven</Link>
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
            <Link to="/tarieven" className="hover:text-brand-accent transition">Tarieven</Link>
            <Link to="/afspraak" className="hover:text-brand-accent transition">Afspraak</Link>
            <a href="tel:0790000000" className="hover:text-brand-accent transition">Bel</a>
            <a href="https://wa.me/310790000000" className="hover:text-brand-accent transition">WhatsApp</a>
          </div>
        </div>
      </header>

      <main className="px-0">
        <iframe
          title="Online afspraak maken"
          src="https://widget2.meetaimy.com/widgetWeb?salonId=NDk4ODY4&salonEmail=YWZzcHJha2VuQGJpam1pam5rYXBwZXIubmw%3D"
          className="w-full border-0"
          style={{ minHeight: 'calc(100vh - 72px)' }}
          loading="lazy"
          allowFullScreen
        />
      </main>
    </div>
  )
}
