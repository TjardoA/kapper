import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  fetchServices,
  createService,
  updateService,
  removeService,
} from "../api/servicesApi";
import { fetchTeam, saveTeam, deleteTeam } from "../api/teamApi";
import { fetchOpening, saveOpening, deleteOpening } from "../api/openingHoursApi";
import {
  fetchUsps,
  addUsp,
  deleteUsp,
  fetchReviews,
  addReview,
  deleteReview,
  fetchGallery,
  addGalleryImage,
  deleteGalleryImage,
  fetchSiteInfo,
  updateSiteInfo,
} from "../api/contentApi";

const emptyService = { id: null, name: "", price: "", duration: "", description: "" };
const emptyTeam = { id: null, name: "", bio: "", image_url: "" };
const emptyOpening = { id: null, day: "", open_time: "", close_time: "" };
const emptyReview = { name: "", text: "", rating: 5 };
const emptySiteInfo = {
  address: "",
  phone: "",
  whatsapp: "",
  maps_url: "",
  hero_tagline: "",
  hero_title: "",
  hero_subtitle: "",
  booking_url: "",
};

const dayOrder = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
const sortOpeningList = (list) =>
  list.slice().sort((a, b) => dayOrder.indexOf(a.day || "") - dayOrder.indexOf(b.day || ""));

const tabs = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "services", label: "Diensten", icon: "💇" },
  { key: "team", label: "Medewerkers", icon: "👥" },
  { key: "opening", label: "Openingstijden", icon: "⏰" },
  { key: "home", label: "Home", icon: "🏠" },
  { key: "tarievenPage", label: "Tarieven", icon: "💶" },
  { key: "afspraakPage", label: "Afspraak", icon: "🗓️" },
  { key: "contactPage", label: "Contact", icon: "📍" },
];

export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [opening, setOpening] = useState([]);
  const [usps, setUsps] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [siteInfo, setSiteInfo] = useState(emptySiteInfo);

  const [serviceForm, setServiceForm] = useState(emptyService);
  const [teamForm, setTeamForm] = useState(emptyTeam);
  const [teamFile, setTeamFile] = useState(null);
  const [openingForm, setOpeningForm] = useState(emptyOpening);
  const [uspInput, setUspInput] = useState("");
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [galleryInput, setGalleryInput] = useState("");
  const [galleryFile, setGalleryFile] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const isEditingService = useMemo(() => Boolean(serviceForm.id), [serviceForm.id]);
  const isEditingTeam = useMemo(() => Boolean(teamForm.id), [teamForm.id]);
  const isEditingOpening = useMemo(() => Boolean(openingForm.id), [openingForm.id]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [{ data: s }, { data: t }, { data: o }] = await Promise.all([
      fetchServices(),
      fetchTeam(),
      fetchOpening(),
    ]);
    setServices(s || []);
    setTeam(t || []);
    setOpening(sortOpeningList(o || []));

    const [{ data: u }, { data: r }, { data: g }, { data: info }] = await Promise.all([
      fetchUsps(),
      fetchReviews(),
      fetchGallery(),
      fetchSiteInfo(),
    ]);
    setUsps(u || []);
    setReviews(r || []);
    setGallery(g || []);
    setSiteInfo(info || emptySiteInfo);
  };

  const signOut = async () => supabase.auth.signOut();

  // Services
  const submitService = async (e) => {
    e.preventDefault();
    setError(null);
    if (!serviceForm.name.trim()) return setError("Naam is verplicht");
    if (Number.isNaN(Number(serviceForm.price))) return setError("Prijs moet een getal zijn");
    if (Number.isNaN(Number(serviceForm.duration))) return setError("Duur moet een getal zijn");
    setSaving(true);
    const payload = {
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      price: Number(serviceForm.price),
      duration: Number(serviceForm.duration),
    };
    const { error: err } = serviceForm.id
      ? await updateService(serviceForm.id, payload)
      : await createService(payload);
    setSaving(false);
    if (err) return setError(err.message);
    setServiceForm(emptyService);
    loadAll();
  };

  const handleServiceDelete = async (id) => {
    if (!confirm("Verwijderen?")) return;
    const { error: err } = await removeService(id);
    if (err) return setError(err.message);
    loadAll();
  };

  // Team
  const submitTeam = async (e) => {
    e.preventDefault();
    setError(null);
    if (!teamForm.name.trim()) return setError("Naam is verplicht");
    setSaving(true);
    let imageUrl = teamForm.image_url.trim();
    if (teamFile) {
      imageUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(teamFile);
      });
    }
    const payload = {
      id: teamForm.id || undefined,
      name: teamForm.name.trim(),
      bio: teamForm.bio.trim(),
      image_url: imageUrl,
    };
    const { error: err } = await saveTeam(payload);
    setSaving(false);
    if (err) return setError(err.message);
    setTeamForm(emptyTeam);
    setTeamFile(null);
    loadAll();
  };

  const handleTeamDelete = async (id) => {
    if (!confirm("Verwijderen?")) return;
    const { error: err } = await deleteTeam(id);
    if (err) return setError(err.message);
    loadAll();
  };

  // Opening hours
  const submitOpening = async (e) => {
    e.preventDefault();
    setError(null);
    if (!openingForm.day.trim()) return setError("Dag is verplicht");
    setSaving(true);
    const payload = {
      id: openingForm.id || undefined,
      day: openingForm.day.trim(),
      open_time: openingForm.open_time,
      close_time: openingForm.close_time,
    };
    const { error: err } = await saveOpening(payload);
    setSaving(false);
    if (err) return setError(err.message);
    setOpeningForm(emptyOpening);
    loadAll();
  };

  const handleOpeningDelete = async (id) => {
    if (!confirm("Verwijderen?")) return;
    const { error: err } = await deleteOpening(id);
    if (err) return setError(err.message);
    loadAll();
  };

  // USP
  const submitUsp = async (e) => {
    e.preventDefault();
    if (!uspInput.trim()) return;
    const { error: err } = await addUsp(uspInput.trim(), usps.length);
    if (err) return setError(err.message);
    setUspInput("");
    loadAll();
  };

  const handleUspDelete = async (id) => {
    const { error: err } = await deleteUsp(id);
    if (err) return setError(err.message);
    loadAll();
  };

  // Reviews
  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return setError("Naam en tekst verplicht");
    const { error: err } = await addReview({
      name: reviewForm.name.trim(),
      text: reviewForm.text.trim(),
      rating: Number(reviewForm.rating) || 5,
    });
    if (err) return setError(err.message);
    setReviewForm(emptyReview);
    loadAll();
  };

  const handleReviewDelete = async (id) => {
    const { error: err } = await deleteReview(id);
    if (err) return setError(err.message);
    loadAll();
  };

  // Gallery
  const submitGallery = async (e) => {
    e.preventDefault();
    setError(null);
    if (!galleryInput.trim() && !galleryFile) return setError("Kies een afbeelding of vul een URL in");

    let urlToSave = galleryInput.trim();
    if (galleryFile) {
      const filePath = `gallery/${Date.now()}_${galleryFile.name.replace(/\s+/g, "_")}`;
      const { error: uploadErr } = await supabase.storage.from("gallery").upload(filePath, galleryFile, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadErr) {
        setError(uploadErr.message);
        return;
      }
      const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
      urlToSave = data.publicUrl;
    }

    const { error: err } = await addGalleryImage(urlToSave, gallery.length);
    if (err) return setError(err.message);
    setGalleryInput("");
    setGalleryFile(null);
    loadAll();
  };

  const handleGalleryDelete = async (id) => {
    const { error: err } = await deleteGalleryImage(id);
    if (err) return setError(err.message);
    loadAll();
  };

  // Site info
  const submitSiteInfo = async (e) => {
    e.preventDefault();
    const { error: err } = await updateSiteInfo(siteInfo);
    if (err) return setError(err.message);
    loadAll();
  };

  const statTotalTarief = services.reduce((sum, s) => sum + Number(s.price || 0), 0);
  const avgDuration =
    services.length === 0
      ? 0
      : Math.round(services.reduce((sum, s) => sum + Number(s.duration || 0), 0) / services.length);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0f172a] text-white min-h-screen sticky top-0">
          <div className="px-6 py-6 text-2xl font-semibold">Kapper CMS</div>
          <nav className="flex flex-col gap-1 px-3">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition duration-150 ${
                  tab === t.key
                    ? "bg-white text-[#0f172a] font-semibold shadow-sm"
                    : "hover:bg-white/10 hover:text-white/90"
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
            <button
              onClick={signOut}
              className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-white/10 text-sm"
            >
              ↩ Uitloggen
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 sm:px-10 py-10 max-w-6xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-brand-pink/10 via-white to-brand-soft border border-brand-pink/20 px-6 py-5 shadow-sm mb-8">
            <h1 className="text-3xl font-semibold text-[#0f172a]">Dashboard</h1>
            <p className="text-gray-600">Overzicht van jouw kapsalon</p>
          </div>

          {tab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-4 gap-4">
                <StatCard title="Totaal Diensten" value={services.length} icon="✂️" />
                <StatCard title="Medewerkers" value={team.length} icon="👥" color="text-green-600" />
                <StatCard title="Totaal Tarieven" value={`€${statTotalTarief}`} icon="💶" color="text-purple-600" />
                <StatCard title="Gem. Duur" value={`${avgDuration || 0} min`} icon="⏱️" color="text-orange-500" />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card title="Populaire Diensten">
                  <div className="space-y-3">
                    {(services.length ? services : []).slice(0, 5).map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-gray-500">{s.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">€{s.price}</p>
                          <p className="text-gray-500">{s.duration} min</p>
                        </div>
                      </div>
                    ))}
                    {services.length === 0 && <p className="text-sm text-gray-500">Geen diensten geladen.</p>}
                  </div>
                </Card>

                <Card title="Team Overzicht">
                  <div className="space-y-4">
                    {(team.length ? team : []).map((m) => (
                      <div key={m.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                          {m.name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-gray-500 text-sm">{m.bio}</p>
                        </div>
                      </div>
                    ))}
                    {team.length === 0 && <p className="text-sm text-gray-500">Geen teamleden.</p>}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === "services" && (
            <TwoColForm
              title={isEditingService ? "Service bewerken" : "Nieuwe service"}
              error={error}
              onSubmit={submitService}
              saving={saving}
              form={
                <>
                  <input
                    className="input"
                    placeholder="Naam"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="input"
                      placeholder="Prijs (bijv. 45)"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Duur (minuten)"
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    />
                  </div>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Beschrijving"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  />
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? "Opslaan..." : isEditingService ? "Bijwerken" : "Opslaan"}
                    </button>
                    {isEditingService && (
                      <button type="button" className="btn-secondary" onClick={() => setServiceForm(emptyService)}>
                        Annuleer
                      </button>
                    )}
                  </div>
                </>
              }
              list={
                <>
                  {services.map((s) => (
                    <div key={s.id} className="py-4 border-b flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-sm text-gray-500">
                          €{s.price} • {s.duration} min
                        </p>
                        {s.description && <p className="text-sm text-gray-500 mt-1">{s.description}</p>}
                      </div>
                      <div className="flex gap-3 text-sm">
                        <button className="text-brand-pink" onClick={() => setServiceForm({ ...s })}>
                          Bewerken
                        </button>
                        <button className="text-red-600" onClick={() => handleServiceDelete(s.id)}>
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  ))}
                  {services.length === 0 && <p className="text-sm text-gray-500">Nog geen services.</p>}
                </>
              }
            />
          )}

          {tab === "team" && (
            <TwoColForm
              title={isEditingTeam ? "Teamlid bewerken" : "Nieuw teamlid"}
              error={error}
              onSubmit={submitTeam}
              saving={saving}
              form={
                <>
                  <input
                    className="input"
                    placeholder="Naam"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  />
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Bio"
                    value={teamForm.bio}
                    onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  />
                  <input
                    className="input"
                    placeholder="Afbeelding URL"
                    value={teamForm.image_url}
                    onChange={(e) => setTeamForm({ ...teamForm, image_url: e.target.value })}
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTeamFile(e.target.files?.[0] || null)}
                      className="text-sm"
                    />
                    {teamFile && (
                      <span className="text-sm text-gray-600">
                        Gekozen: {teamFile.name} ({Math.round(teamFile.size / 1024)} KB)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? "Opslaan..." : isEditingTeam ? "Bijwerken" : "Opslaan"}
                    </button>
                    {isEditingTeam && (
                      <button type="button" className="btn-secondary" onClick={() => setTeamForm(emptyTeam)}>
                        Annuleer
                      </button>
                    )}
                  </div>
                </>
              }
              list={
                <div className="grid md:grid-cols-2 gap-4">
                  {team.map((m) => (
                    <div key={m.id} className="border rounded-xl p-4 space-y-2">
                      {m.image_url && <img src={m.image_url} alt={m.name} className="h-24 w-full object-cover rounded-lg" />}
                      <p className="font-semibold">{m.name}</p>
                      <p className="text-sm text-gray-600">{m.bio}</p>
                      <div className="flex gap-3 text-sm">
                        <button className="text-brand-pink" onClick={() => setTeamForm({ ...m })}>
                          Bewerken
                        </button>
                        <button className="text-red-600" onClick={() => handleTeamDelete(m.id)}>
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  ))}
                  {team.length === 0 && <p className="text-sm text-gray-500">Nog geen teamleden.</p>}
                </div>
              }
            />
          )}

        {tab === "opening" && (
            <TwoColForm
              title={isEditingOpening ? "Openingstijd bewerken" : "Openingstijd toevoegen"}
              error={error}
              onSubmit={submitOpening}
              saving={saving}
              form={
                <>
                  <input
                    className="input"
                    placeholder="Dag (bijv. Maandag)"
                    value={openingForm.day}
                    onChange={(e) => setOpeningForm({ ...openingForm, day: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="time"
                      className="input"
                      value={openingForm.open_time}
                      onChange={(e) => setOpeningForm({ ...openingForm, open_time: e.target.value })}
                    />
                    <input
                      type="time"
                      className="input"
                      value={openingForm.close_time}
                      onChange={(e) => setOpeningForm({ ...openingForm, close_time: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? "Opslaan..." : isEditingOpening ? "Bijwerken" : "Opslaan"}
                    </button>
                    {isEditingOpening && (
                      <button type="button" className="btn-secondary" onClick={() => setOpeningForm(emptyOpening)}>
                        Annuleer
                      </button>
                    )}
                  </div>
                </>
              }
              list={
                <div className="space-y-2">
                  {opening.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between bg-white border rounded-lg px-4 py-3 shadow-sm"
                    >
                      <div className="text-base font-semibold">{row.day}</div>
                      <div className="text-base font-medium">
                        {row.open_time?.slice(0, 5)} - {row.close_time?.slice(0, 5)}
                      </div>
                      <div className="flex gap-3 text-sm">
                        <button className="text-brand-pink" onClick={() => setOpeningForm({ ...row })}>
                          Bewerken
                        </button>
                        <button className="text-red-600" onClick={() => handleOpeningDelete(row.id)}>
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  ))}
                  {opening.length === 0 && <p className="text-sm text-gray-500">Nog geen tijden.</p>}
                </div>
              }
            />
          )}

          {tab === "home" && (
            <div className="space-y-6">
              <Card title="Homepage - USP's">
                <form className="flex gap-3 mb-4" onSubmit={submitUsp}>
                  <input className="input flex-1" placeholder="Nieuwe USP" value={uspInput} onChange={(e) => setUspInput(e.target.value)} />
                  <button type="submit" className="btn-primary">Voeg toe</button>
                </form>
                <ul className="space-y-2">
                  {usps.map((u) => (
                    <li key={u.id} className="border rounded-lg px-3 py-2 flex items-center justify-between text-sm">
                      <span>{u.text}</span>
                      <button className="text-red-600" onClick={() => handleUspDelete(u.id)}>Verwijder</button>
                    </li>
                  ))}
                  {usps.length === 0 && <p className="text-sm text-gray-500">Nog geen USP's.</p>}
                </ul>
              </Card>

              <Card title="Homepage - Reviews">
                <form className="grid gap-3 md:grid-cols-2" onSubmit={submitReview}>
                  <input className="input" placeholder="Naam" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} />
                  <input className="input" placeholder="Rating (1-5)" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} />
                  <textarea className="input md:col-span-2" rows={2} placeholder="Review tekst" value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} />
                  <div className="md:col-span-2">
                    <button type="submit" className="btn-primary">Voeg review toe</button>
                  </div>
                </form>
                <div className="divide-y mt-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="py-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-gray-500 text-sm">{"★".repeat(r.rating || 5)}</p>
                        <p className="text-gray-700">{r.text}</p>
                      </div>
                      <button className="text-red-600 text-sm" onClick={() => handleReviewDelete(r.id)}>Verwijder</button>
                    </div>
                  ))}
                  {reviews.length === 0 && <p className="text-sm text-gray-500">Nog geen reviews.</p>}
                </div>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card title="Homepage - Gallery">
                  <form className="grid gap-3 mb-4" onSubmit={submitGallery}>
                    <div className="flex gap-3">
                      <input className="input flex-1" placeholder="Afbeelding URL" value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} />
                      <button type="submit" className="btn-primary">Voeg toe</button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} className="text-sm" />
                      {galleryFile && <span className="text-sm text-gray-600">Gekozen: {galleryFile.name} ({Math.round(galleryFile.size / 1024)} KB)</span>}
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                  </form>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {gallery.map((g) => (
                      <div key={g.id} className="relative border rounded-xl overflow-hidden">
                        <img src={g.url} alt="Gallery" className="w-full h-28 object-cover" />
                        <button className="absolute top-1 right-1 bg-white/80 text-red-600 text-xs px-2 py-1 rounded" onClick={() => handleGalleryDelete(g.id)}>
                          Verwijder
                        </button>
                      </div>
                    ))}
                    {gallery.length === 0 && <p className="text-sm text-gray-500">Nog geen afbeeldingen.</p>}
                  </div>
                </Card>

                <Card title="Home - Hero">
                  <form className="grid gap-3" onSubmit={submitSiteInfo}>
                    <input className="input" placeholder="Hero tagline" value={siteInfo.hero_tagline || ""} onChange={(e) => setSiteInfo({ ...siteInfo, hero_tagline: e.target.value })} />
                    <input className="input" placeholder="Hero title" value={siteInfo.hero_title || ""} onChange={(e) => setSiteInfo({ ...siteInfo, hero_title: e.target.value })} />
                    <textarea className="input" rows={2} placeholder="Hero subtitel" value={siteInfo.hero_subtitle || ""} onChange={(e) => setSiteInfo({ ...siteInfo, hero_subtitle: e.target.value })} />
                    <button type="submit" className="btn-primary w-fit">Opslaan</button>
                  </form>
                </Card>
              </div>
            </div>
          )}

          {tab === "tarievenPage" && (
            <Card title="Tarieven pagina">
              <p className="text-sm text-gray-600">
                Tarieven beheer je via de tab "Diensten". Deze pagina toont de services automatisch.
              </p>
            </Card>
          )}

          {tab === "afspraakPage" && (
            <Card title="Afspraak / Planner">
              <form className="grid gap-3 md:grid-cols-2" onSubmit={submitSiteInfo}>
                <input
                  className="input md:col-span-2"
                  placeholder="Booking widget URL (planner iframe)"
                  value={siteInfo.booking_url || ""}
                  onChange={(e) => setSiteInfo({ ...siteInfo, booking_url: e.target.value })}
                />
                <button type="submit" className="btn-primary w-fit">
                  Opslaan
                </button>
              </form>
            </Card>
          )}

          {tab === "contactPage" && (
            <Card title="Contact & Map">
              <form className="grid gap-3 md:grid-cols-2" onSubmit={submitSiteInfo}>
                <input
                  className="input md:col-span-2"
                  placeholder="Adres"
                  value={siteInfo.address || ""}
                  onChange={(e) => setSiteInfo({ ...siteInfo, address: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="Telefoon"
                  value={siteInfo.phone || ""}
                  onChange={(e) => setSiteInfo({ ...siteInfo, phone: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="WhatsApp"
                  value={siteInfo.whatsapp || ""}
                  onChange={(e) => setSiteInfo({ ...siteInfo, whatsapp: e.target.value })}
                />
                <input
                  className="input md:col-span-2"
                  placeholder="Google Maps embed URL"
                  value={siteInfo.maps_url || ""}
                  onChange={(e) => setSiteInfo({ ...siteInfo, maps_url: e.target.value })}
                />
                <button type="submit" className="btn-primary w-fit md:col-span-2">
                  Opslaan
                </button>
              </form>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-blue-600" }) {
  return (
    <div className="card-soft p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{title}</span>
        <span className={color}>{icon}</span>
      </div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="card-soft p-5">
      {title && <h3 className="text-lg font-semibold mb-4 text-[#0f172a]">{title}</h3>}
      {children}
    </div>
  );
}

function TwoColForm({ title, form, list, error, onSubmit, saving }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card title={title}>
        <form className="space-y-3" onSubmit={onSubmit}>
          {form}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </Card>
      <Card title="">
        {list}
        {saving && <p className="text-sm text-gray-500 mt-2">Bezig...</p>}
      </Card>
    </div>
  );
}




