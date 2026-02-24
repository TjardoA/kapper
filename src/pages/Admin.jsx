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
  updateUsp,
  fetchReviews,
  addReview,
  deleteReview,
  fetchGallery,
  addGalleryImage,
  deleteGalleryImage,
  fetchSiteInfo,
  updateSiteInfo,
} from "../api/contentApi";
import {
  fetchTariffCategories,
  fetchTariffItems,
  createTariffCategory,
  updateTariffCategory,
  deleteTariffCategory,
  createTariffItem,
  updateTariffItem,
  deleteTariffItem,
} from "../api/tariffsApi";

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
  about_title: "",
  about_body: "",
};
const emptyTariffCategory = { id: null, title: "", position: 0 };
const emptyTariffItem = {
  id: null,
  category_id: "",
  name: "",
  price_numeric: "",
  price_text: "",
  position: 0,
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
  const [tariffCategories, setTariffCategories] = useState([]);
  const [tariffItems, setTariffItems] = useState([]);
  const [tariffCatForm, setTariffCatForm] = useState(emptyTariffCategory);
  const [tariffItemForm, setTariffItemForm] = useState(emptyTariffItem);

  const [serviceForm, setServiceForm] = useState(emptyService);
  const [teamForm, setTeamForm] = useState(emptyTeam);
  const [teamFile, setTeamFile] = useState(null);
  const [openingForm, setOpeningForm] = useState(emptyOpening);
  const [uspInput, setUspInput] = useState("");
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [galleryInput, setGalleryInput] = useState("");
  const [galleryFile, setGalleryFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [siteInfoSaving, setSiteInfoSaving] = useState(false);
  const [siteInfoMessage, setSiteInfoMessage] = useState("");
  const [editingUspId, setEditingUspId] = useState(null);

  const isEditingService = useMemo(() => Boolean(serviceForm.id), [serviceForm.id]);
  const isEditingTeam = useMemo(() => Boolean(teamForm.id), [teamForm.id]);
  const isEditingOpening = useMemo(() => Boolean(openingForm.id), [openingForm.id]);
  const isEditingTariffCategory = useMemo(() => Boolean(tariffCatForm.id), [tariffCatForm.id]);
  const isEditingTariffItem = useMemo(() => Boolean(tariffItemForm.id), [tariffItemForm.id]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [{ data: s }, { data: t }, { data: o }, { data: tc }, { data: ti }] = await Promise.all([
      fetchServices(),
      fetchTeam(),
      fetchOpening(),
      fetchTariffCategories(),
      fetchTariffItems(),
    ]);
    setServices(s || []);
    setTeam(t || []);
    setOpening(sortOpeningList(o || []));
    setTariffCategories(tc || []);
    setTariffItems((ti || []).sort((a, b) => (a.position || 0) - (b.position || 0)));

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

  // Tariff categories & items
  const submitTariffCategory = async (e) => {
    e.preventDefault();
    setError(null);
    if (!tariffCatForm.title.trim()) return setError("Titel is verplicht");
    const positionValue =
      tariffCatForm.position === "" || tariffCatForm.position === null
        ? 0
        : Number(tariffCatForm.position);
    if (Number.isNaN(positionValue)) return setError("Positie moet een getal zijn");
    setSaving(true);
    const payload = {
      title: tariffCatForm.title.trim(),
      position: positionValue,
    };
    const { error: err } = tariffCatForm.id
      ? await updateTariffCategory(tariffCatForm.id, payload)
      : await createTariffCategory(payload);
    setSaving(false);
    if (err) return setError(err.message);
    setTariffCatForm(emptyTariffCategory);
    loadAll();
  };

  const handleTariffCategoryDelete = async (id) => {
    if (!confirm("Categorie verwijderen? Bijbehorende items worden ook verwijderd.")) return;
    const { error: err } = await deleteTariffCategory(id);
    if (err) return setError(err.message);
    if (tariffItemForm.category_id === id) setTariffItemForm(emptyTariffItem);
    loadAll();
  };

  const submitTariffItem = async (e) => {
    e.preventDefault();
    setError(null);
    if (!tariffItemForm.category_id) return setError("Kies een categorie");
    if (!tariffItemForm.name.trim()) return setError("Naam is verplicht");

    const priceNumericValue =
      tariffItemForm.price_numeric === "" || tariffItemForm.price_numeric === null
        ? null
        : Number(tariffItemForm.price_numeric);
    const priceTextValue = (tariffItemForm.price_text || "").trim();

    if (priceNumericValue === null && !priceTextValue) return setError("Voer een prijs in of tekst zoals 'Op aanvraag'");
    if (priceNumericValue !== null && Number.isNaN(priceNumericValue)) return setError("Prijs moet een getal zijn");

    const payload = {
      category_id: tariffItemForm.category_id,
      name: tariffItemForm.name.trim(),
      price_numeric: priceNumericValue,
      price_text: priceTextValue || null,
      position:
        tariffItemForm.position === "" || tariffItemForm.position === null
          ? 0
          : Number(tariffItemForm.position),
    };

    setSaving(true);
    const { error: err } = tariffItemForm.id
      ? await updateTariffItem(tariffItemForm.id, payload)
      : await createTariffItem(payload);
    setSaving(false);
    if (err) return setError(err.message);
    setTariffItemForm(emptyTariffItem);
    loadAll();
  };

  const handleTariffItemDelete = async (id) => {
    if (!confirm("Verwijderen?")) return;
    const { error: err } = await deleteTariffItem(id);
    if (err) return setError(err.message);
    if (tariffItemForm.id === id) setTariffItemForm(emptyTariffItem);
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

  const handleUspEditSave = async (id, text, position) => {
    const { error: err } = await updateUsp(id, { text, position });
    if (err) return setError(err.message);
    setEditingUspId(null);
    loadAll();
  };

  // Reviews
  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return setError("Naam en tekst verplicht");
    const ratingValue = Number(reviewForm.rating) || 0;
    if (ratingValue < 1 || ratingValue > 5) return setError("Rating moet tussen 1 en 5 zijn");
    const { error: err } = await addReview({
      name: reviewForm.name.trim(),
      text: reviewForm.text.trim(),
      rating: ratingValue,
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
    setError(null);
    setSiteInfoMessage("");
    setSiteInfoSaving(true);
    let heroImageUrl = siteInfo.hero_image_url || "";

    if (heroFile) {
      const filePath = `hero/${Date.now()}_${heroFile.name.replace(/\s+/g, "_")}`;
      const { error: uploadErr } = await supabase.storage.from("gallery").upload(filePath, heroFile, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadErr) {
        setSiteInfoSaving(false);
        setError(uploadErr.message);
        return;
      }
      const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
      heroImageUrl = data.publicUrl;
    }

    const { error: err } = await updateSiteInfo({ ...siteInfo, hero_image_url: heroImageUrl });
    setSiteInfoSaving(false);
    if (err) return setError(err.message);
    setSiteInfoMessage("Opgeslagen");
    setHeroFile(null);
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
              <Card title="Home - Intro">
                <form className="grid gap-3" onSubmit={submitSiteInfo}>
                  <input className="input" placeholder="Hero tagline" value={siteInfo.hero_tagline || ""} onChange={(e) => setSiteInfo({ ...siteInfo, hero_tagline: e.target.value })} />
                  <input className="input" placeholder="Hero title" value={siteInfo.hero_title || ""} onChange={(e) => setSiteInfo({ ...siteInfo, hero_title: e.target.value })} />
                  <textarea className="input" rows={2} placeholder="Hero subtitel" value={siteInfo.hero_subtitle || ""} onChange={(e) => setSiteInfo({ ...siteInfo, hero_subtitle: e.target.value })} />
                  <input className="input" placeholder="Hero afbeelding URL (Keune visual)" value={siteInfo.hero_image_url || ""} onChange={(e) => setSiteInfo({ ...siteInfo, hero_image_url: e.target.value })} />
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <label className="font-medium text-gray-700">Upload hero afbeelding</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                      className="text-sm"
                    />
                    {heroFile && (
                      <span className="text-gray-600">
                        Gekozen: {heroFile.name} ({Math.round(heroFile.size / 1024)} KB)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="submit" className="btn-primary w-fit" disabled={siteInfoSaving}>
                      {siteInfoSaving ? "Opslaan..." : "Opslaan"}
                    </button>
                    {siteInfoMessage && <span className="text-sm text-green-600">{siteInfoMessage}</span>}
                  </div>
                </form>
              </Card>

              <Card title="Home - Waarom wij">
                <form className="grid gap-3" onSubmit={submitSiteInfo}>
                  <input
                    className="input"
                    placeholder="Waarom-wij titel"
                    value={siteInfo.about_title || ""}
                    onChange={(e) => setSiteInfo({ ...siteInfo, about_title: e.target.value })}
                  />
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Waarom-wij tekst"
                    value={siteInfo.about_body || ""}
                    onChange={(e) => setSiteInfo({ ...siteInfo, about_body: e.target.value })}
                  />
                  <button type="submit" className="btn-primary w-fit">Opslaan</button>
                </form>
              </Card>

              <Card title="Waarom wij - USP's (bullets)">
                <form className="flex gap-3 mb-4" onSubmit={submitUsp}>
                  <input className="input flex-1" placeholder="Nieuwe bullet" value={uspInput} onChange={(e) => setUspInput(e.target.value)} />
                  <button type="submit" className="btn-primary">Voeg toe</button>
                </form>
                <ul className="space-y-2">
                  {usps.map((u, idx) => {
                    const isEditing = editingUspId === u.id;
                    return (
                      <li key={u.id} className="border rounded-lg px-3 py-2 flex items-center justify-between text-sm gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          {isEditing ? (
                            <>
                              <input
                                className="input flex-1"
                                value={u._draftText ?? u.text}
                                onChange={(e) => {
                                  const updated = usps.map((item) =>
                                    item.id === u.id ? { ...item, _draftText: e.target.value } : item,
                                  );
                                  setUsps(updated);
                                }}
                              />
                              <input
                                className="input w-20"
                                type="number"
                                value={u._draftPos ?? u.position ?? 0}
                                onChange={(e) => {
                                  const updated = usps.map((item) =>
                                    item.id === u.id ? { ...item, _draftPos: e.target.value } : item,
                                  );
                                  setUsps(updated);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <span>{u.text}</span>
                              <span className="text-xs text-gray-500">({u.position ?? 0})</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                className="text-brand-pink"
                                onClick={() =>
                                  handleUspEditSave(
                                    u.id,
                                    u._draftText ?? u.text,
                                    Number(u._draftPos ?? u.position ?? 0),
                                  )
                                }
                              >
                                Opslaan
                              </button>
                              <button
                                className="text-gray-500"
                                onClick={() => {
                                  const reset = usps.map((item) =>
                                    item.id === u.id ? { ...item, _draftText: undefined, _draftPos: undefined } : item,
                                  );
                                  setUsps(reset);
                                  setEditingUspId(null);
                                }}
                              >
                                Annuleer
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="text-brand-pink" onClick={() => setEditingUspId(u.id)}>
                                Bewerken
                              </button>
                              <button className="text-red-600" onClick={() => handleUspDelete(u.id)}>
                                Verwijder
                              </button>
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                  {usps.length === 0 && <p className="text-sm text-gray-500">Nog geen bullets.</p>}
                </ul>
              </Card>

              <Card title="Homepage - Reviews">
                <form className="grid gap-3 md:grid-cols-2" onSubmit={submitReview}>
                  <input className="input" placeholder="Naam" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} />
                  <input
                    className="input"
                    type="number"
                    min="1"
                    max="5"
                    step="1"
                    placeholder="Rating (1-5)"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  />
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

            </div>
          )}

          {tab === "tarievenPage" && (
            <div className="space-y-6">
              <TwoColForm
                title={isEditingTariffCategory ? "Categorie bewerken" : "Categorie toevoegen"}
                error={error}
                onSubmit={submitTariffCategory}
                saving={saving}
                form={
                  <>
                    <input
                      className="input"
                      placeholder="Titel (bijv. Dames)"
                      value={tariffCatForm.title}
                      onChange={(e) => setTariffCatForm({ ...tariffCatForm, title: e.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Positie (0 = bovenaan)"
                      value={tariffCatForm.position}
                      onChange={(e) => setTariffCatForm({ ...tariffCatForm, position: e.target.value })}
                    />
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? "Opslaan..." : isEditingTariffCategory ? "Bijwerken" : "Opslaan"}
                      </button>
                      {isEditingTariffCategory && (
                        <button type="button" className="btn-secondary" onClick={() => setTariffCatForm(emptyTariffCategory)}>
                          Annuleer
                        </button>
                      )}
                    </div>
                  </>
                }
                list={
                  <div className="space-y-2">
                    {tariffCategories.map((cat) => {
                      const count = tariffItems.filter((i) => i.category_id === cat.id).length;
                      return (
                        <div key={cat.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
                          <div>
                            <p className="font-semibold">{cat.title}</p>
                            <p className="text-xs text-gray-500">
                              Positie {cat.position ?? 0} • {count} items
                            </p>
                          </div>
                          <div className="flex gap-3 text-sm">
                            <button
                              className="text-brand-pink"
                              onClick={() => setTariffCatForm({ ...cat, position: cat.position ?? 0 })}
                            >
                              Bewerken
                            </button>
                            <button className="text-red-600" onClick={() => handleTariffCategoryDelete(cat.id)}>
                              Verwijderen
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {tariffCategories.length === 0 && <p className="text-sm text-gray-500">Nog geen categorieën.</p>}
                  </div>
                }
              />

              <TwoColForm
                title={isEditingTariffItem ? "Tariefregel bewerken" : "Tariefregel toevoegen"}
                error={error}
                onSubmit={submitTariffItem}
                saving={saving}
                form={
                  <>
                    <select
                      className="input"
                      value={tariffItemForm.category_id}
                      onChange={(e) => setTariffItemForm({ ...tariffItemForm, category_id: e.target.value })}
                    >
                      <option value="">Kies categorie</option>
                      {tariffCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                    <input
                      className="input"
                      placeholder="Naam (bijv. Wassen knippen)"
                      value={tariffItemForm.name}
                      onChange={(e) => setTariffItemForm({ ...tariffItemForm, name: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="input"
                        placeholder="Prijs in € (bijv. 27.50)"
                        value={tariffItemForm.price_numeric}
                        onChange={(e) => setTariffItemForm({ ...tariffItemForm, price_numeric: e.target.value })}
                      />
                      <input
                        className="input"
                        placeholder="Prijs tekst (bijv. Op aanvraag)"
                        value={tariffItemForm.price_text}
                        onChange={(e) => setTariffItemForm({ ...tariffItemForm, price_text: e.target.value })}
                      />
                    </div>
                    <input
                      className="input"
                      placeholder="Positie binnen categorie"
                      value={tariffItemForm.position}
                      onChange={(e) => setTariffItemForm({ ...tariffItemForm, position: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      Vul of een numerieke prijs of een tekst zoals "Op aanvraag" in.
                    </p>
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? "Opslaan..." : isEditingTariffItem ? "Bijwerken" : "Opslaan"}
                      </button>
                      {isEditingTariffItem && (
                        <button type="button" className="btn-secondary" onClick={() => setTariffItemForm(emptyTariffItem)}>
                          Annuleer
                        </button>
                      )}
                    </div>
                  </>
                }
                list={
                  <div className="space-y-3">
                    {tariffCategories.map((cat) => {
                      const items = tariffItems
                        .filter((i) => i.category_id === cat.id)
                        .sort((a, b) => (a.position || 0) - (b.position || 0));
                      return (
                        <div key={cat.id} className="border rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{cat.title}</p>
                            <span className="text-xs text-gray-500">Positie {cat.position ?? 0}</span>
                          </div>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-gray-500">Positie {item.position ?? 0}</p>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="font-semibold text-brand-dark">
                                    {item.price_text
                                      ? item.price_text
                                      : item.price_numeric !== null && item.price_numeric !== undefined
                                        ? `€${Number(item.price_numeric).toFixed(2).replace(".", ",")}`
                                        : "-"}
                                  </span>
                                  <button
                                    className="text-brand-pink"
                                    onClick={() =>
                                      setTariffItemForm({
                                        id: item.id,
                                        category_id: item.category_id,
                                        name: item.name,
                                        price_numeric: item.price_numeric ?? "",
                                        price_text: item.price_text ?? "",
                                        position: item.position ?? 0,
                                      })
                                    }
                                  >
                                    Bewerken
                                  </button>
                                  <button className="text-red-600" onClick={() => handleTariffItemDelete(item.id)}>
                                    Verwijderen
                                  </button>
                                </div>
                              </div>
                            ))}
                            {items.length === 0 && <p className="text-sm text-gray-500">Nog geen items in deze categorie.</p>}
                          </div>
                        </div>
                      );
                    })}
                    {tariffCategories.length === 0 && <p className="text-sm text-gray-500">Voeg eerst categorieën toe.</p>}
                  </div>
                }
              />
            </div>
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
                <div className="flex items-center gap-3 md:col-span-2">
                  <button type="submit" className="btn-primary w-fit" disabled={siteInfoSaving}>
                    {siteInfoSaving ? "Opslaan..." : "Opslaan"}
                  </button>
                  {siteInfoMessage && <span className="text-sm text-green-200 md:text-green-600">{siteInfoMessage}</span>}
                </div>
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
                <div className="flex items-center gap-3 md:col-span-2">
                  <button type="submit" className="btn-primary w-fit" disabled={siteInfoSaving}>
                    {siteInfoSaving ? "Opslaan..." : "Opslaan"}
                  </button>
                  {siteInfoMessage && <span className="text-sm text-green-600">{siteInfoMessage}</span>}
                </div>
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




