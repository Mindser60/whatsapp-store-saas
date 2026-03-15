"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Store = {
  id: string;
  name: string;
  slug: string;
  whatsapp: string | null;
  is_premium: boolean | null;
  created_at?: string;
};

export default function AdminPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (user.email !== adminEmail) {
      window.location.href = "/dashboard/premium";
      return;
    }

    setAuthorized(true);

    const res = await fetch("/api/admin/stores");

    if (!res.ok) {
      setMessage("Impossible de charger les boutiques.");
      setLoading(false);
      return;
    }

    const result = await res.json();
    setStores(result.stores || []);
    setLoading(false);
  }

  async function togglePremium(storeId: string, currentValue: boolean | null) {
    setMessage("");

    const res = await fetch("/api/admin/toggle-premium", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storeId,
        isPremium: !currentValue,
      }),
    });

    if (!res.ok) {
      const result = await res.json();
      setMessage(result.error || "Erreur.");
      return;
    }

    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId
          ? { ...store, is_premium: !currentValue }
          : store
      )
    );
  }

  async function copyStoreLink(slug: string) {
    const url = `${window.location.origin}/store/${slug}`;
    await navigator.clipboard.writeText(url);
    setMessage(`Lien copié : ${url}`);
    setTimeout(() => setMessage(""), 2500);
  }

  const filteredStores = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stores;

    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(q) ||
        store.slug.toLowerCase().includes(q) ||
        (store.whatsapp || "").toLowerCase().includes(q)
    );
  }, [stores, search]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <h1>Admin</h1>
        <p style={{ color: "#666" }}>
          Gestion privée des boutiques et du statut Premium.
        </p>
      </div>

      <input
        type="text"
        placeholder="Rechercher par nom, slug ou WhatsApp"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 12,
          borderRadius: 12,
          border: "1px solid #ddd",
          maxWidth: 420,
        }}
      />

      {message ? <p style={{ color: "green" }}>{message}</p> : null}

      <div style={{ display: "grid", gap: 14 }}>
        {filteredStores.length === 0 ? (
          <div>Aucune boutique trouvée.</div>
        ) : (
          filteredStores.map((store) => (
            <div
              key={store.id}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 18,
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                display: "grid",
                gap: 8,
              }}
            >
              <div>
                <strong>{store.name}</strong>
              </div>

              <div>Slug : {store.slug}</div>
              <div>WhatsApp : {store.whatsapp || "Non défini"}</div>
              <div>
                Statut :{" "}
                <strong>
                  {store.is_premium ? "Premium actif" : "Standard"}
                </strong>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a
                  href={`/store/${store.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: 10,
                    background: "#111827",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: 10,
                    fontWeight: "bold",
                  }}
                >
                  Voir la boutique
                </a>

                <button
                  onClick={() => copyStoreLink(store.slug)}
                  style={{
                    padding: 10,
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Copier le lien
                </button>

                <button
                  onClick={() => togglePremium(store.id, store.is_premium)}
                  style={{
                    padding: 10,
                    background: store.is_premium ? "#ef4444" : "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {store.is_premium
                    ? "Désactiver Premium"
                    : "Activer Premium"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}