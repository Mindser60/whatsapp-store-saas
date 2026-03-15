"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard/premium`,
      },
    });

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #f5f7fb, #e5e7eb)",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "white",
          borderRadius: 24,
          padding: 30,
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            marginTop: 0,
            color: "#6b7280",
            fontWeight: 600,
          }}
        >
          WhatsApp Store SaaS
        </p>

        <h1 style={{ marginTop: 10, fontSize: 34 }}>
          Connectez-vous
        </h1>

        <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
          Créez et gérez votre boutique WhatsApp avec une interface moderne
          inspirée de Shopify.
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "15px 18px",
            border: "none",
            borderRadius: 14,
            background: "#111827",
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          {loading ? "Connexion..." : "Continuer avec Google"}
        </button>

        <div
          style={{
            marginTop: 24,
            padding: 18,
            background: "#f9fafb",
            borderRadius: 16,
            color: "#6b7280",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Vendez vos produits, personnalisez votre boutique, partagez votre lien
          et recevez les commandes directement sur WhatsApp.
        </div>
      </div>
    </div>
  );
}