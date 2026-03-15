"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreateStorePage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCreateStore(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Utilisateur non connecté.");
      setLoading(false);
      return;
    }

    const { data: existingStores, error: existingStoresError } = await supabase
      .from("stores")
      .select("id")
      .eq("user_id", user.id);

    if (existingStoresError) {
      setMessage(existingStoresError.message);
      setLoading(false);
      return;
    }

    if (existingStores && existingStores.length > 0) {
      setMessage("Vous avez déjà une boutique.");
      setLoading(false);
      return;
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    if (!name.trim() || !cleanSlug || !whatsapp.trim()) {
      setMessage("Remplissez tous les champs.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("stores").insert({
      user_id: user.id,
      name: name.trim(),
      slug: cleanSlug,
      whatsapp: whatsapp.trim(),
      is_premium: false,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Boutique créée avec succès.");
    setName("");
    setSlug("");
    setWhatsapp("");
    setLoading(false);

    window.location.href = "/dashboard/premium";
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Créer votre boutique</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Créez votre boutique WhatsApp en quelques secondes.
      </p>

      <form
        onSubmit={handleCreateStore}
        style={{
          display: "grid",
          gap: 16,
          background: "white",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div>
          <label>Nom de la boutique</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Ma Boutique"
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div>
          <label>Slug de la boutique</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Ex: ma-boutique"
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div>
          <label>WhatsApp</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Ex: 224611760125"
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 14,
            border: "none",
            borderRadius: 12,
            background: "#111827",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Création..." : "Créer ma boutique"}
        </button>

        {message ? (
          <p style={{ color: message.includes("succès") ? "green" : "red" }}>
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}