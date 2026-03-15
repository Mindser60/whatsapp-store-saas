"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Store = {
  id: string;
  name: string;
  slug: string;
  is_premium: boolean | null;
};

export default function BillingPage() {
  const supabase = createClient();

  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  const adminWhatsapp = "224611760125";

  useEffect(() => {
    async function loadStore() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data } = await supabase
        .from("stores")
        .select("id, name, slug, is_premium")
        .eq("user_id", user.id)
        .single();

      setStore(data || null);
      setLoading(false);
    }

    loadStore();
  }, [supabase]);

  if (loading) return <div>Chargement...</div>;

  const whatsappLink = `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(
    `Bonjour, je veux payer le plan Premium pour ma boutique ${store?.name || ""}. Mon slug est ${store?.slug || ""}.`
  )}`;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <h1>Abonnement</h1>
        <p style={{ color: "#666" }}>
          Paiement simple par WhatsApp pour activer le plan Premium.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: "white",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          }}
        >
          <p>Plan actuel</p>
          <h2>{store?.is_premium ? "Premium" : "Standard"}</h2>
          <p>Boutique : {store?.name}</p>
          <p>Slug : {store?.slug}</p>
        </div>

        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: "#111827",
            color: "white",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          }}
        >
          <p>Plan Premium</p>
          <h2>49 $</h2>
          <p>Paiement unique</p>

          <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
            <div>✔ Boutique personnalisée</div>
            <div>✔ Produits illimités</div>
            <div>✔ Lien boutique public</div>
            <div>✔ Commandes WhatsApp</div>
          </div>

          {!store?.is_premium ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 20,
                padding: 12,
                background: "#25D366",
                color: "white",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Payer par WhatsApp
            </a>
          ) : (
            <button
              disabled
              style={{
                marginTop: 20,
                padding: 12,
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Premium actif
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
