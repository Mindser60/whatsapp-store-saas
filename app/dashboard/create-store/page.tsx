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

    const { data: existingStore } = await supabase
      .from("stores")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingStore) {
      setMessage("Vous avez déjà une boutique.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("stores").insert({
      user_id: user.id,
      name,
      slug,
      whatsapp,
      is_premium: true,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard/premium";
  }

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>
      <h1>Créer ma boutique</h1>

      <form onSubmit={handleCreateStore} style={{ display: "grid", gap: 16 }}>
        <input
          type="text"
          placeholder="Nom de la boutique"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: 12 }}
        />

        <input
          type="text"
          placeholder="Slug (ex: ma-boutique)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          style={{ padding: 12 }}
        />

        <input
          type="text"
          placeholder="Numéro WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          style={{ padding: 12 }}
        />

        <button type="submit" disabled={loading} style={{ padding: 14 }}>
          {loading ? "Création..." : "Créer ma boutique"}
        </button>
      </form>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </div>
  );
}