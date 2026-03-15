"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Store = {
  id: string;
  name: string;
  slug: string;
  whatsapp: string | null;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string | null;
  description: string | null;
};

export default function ThemePage() {
  const supabase = createClient();

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#25D366");

  useEffect(() => {
    loadStore();
  }, []);

  async function loadStore() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      setMessage("Boutique introuvable.");
      setLoading(false);
      return;
    }

    setStore(data);
    setName(data.name || "");
    setDescription(data.description || "");
    setWhatsapp(data.whatsapp || "");
    setLogoUrl(data.logo_url || "");
    setBannerUrl(data.banner_url || "");
    setPrimaryColor(data.primary_color || "#25D366");

    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!store) return;

    setSaving(true);

    const { error } = await supabase
      .from("stores")
      .update({
        name,
        description,
        whatsapp,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        primary_color: primaryColor,
      })
      .eq("id", store.id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setMessage("Modifications enregistrées.");
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Personnalisation boutique</h1>

      <form
        onSubmit={handleSave}
        style={{
          display: "grid",
          gap: 15,
          maxWidth: 500,
        }}
      >
        <input
          placeholder="Nom de la boutique"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Numéro WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <input
          placeholder="URL logo"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />

        <input
          placeholder="URL bannière"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
        />

        <div>
          Couleur principale
          <br />
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: 12,
            background: "black",
            color: "white",
            border: "none",
          }}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}