"use client";

import { useEffect, useMemo, useState } from "react";
import PremiumGuard from "./components/PremiumGuard";
import { createClient } from "@/lib/supabase/client";

type Store = {
  id: string;
  name: string;
  slug: string;
  whatsapp: string | null;
};

type Product = {
  id: string;
  name: string;
  price: number | null;
};

export default function PremiumPage() {
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState("");
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserEmail(user.email || "");

      const { data: existingStore } = await supabase
        .from("stores")
        .select("id, name, slug, whatsapp")
        .eq("user_id", user.id)
        .single();

      if (existingStore) {
        setStore(existingStore);

        const { data: productList } = await supabase
          .from("products")
          .select("id, name, price")
          .eq("store_id", existingStore.id);

        setProducts(productList || []);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const totalProducts = products.length;

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + Number(p.price || 0), 0);
  }, [products]);

  async function copyStoreLink() {
    if (!store) return;
    const url = `${window.location.origin}/store/${store.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return <div>Chargement...</div>;

  return (
    <PremiumGuard>
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <h1>Vue d’ensemble</h1>
          <p style={{ color: "#666" }}>Tableau de bord principal.</p>
        </div>

        {!store ? (
          <div>
            <p>Aucune boutique trouvée.</p>
            <a href="/dashboard/create-store">Créer ma boutique</a>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
              }}
            >
              <div style={box}>
                <p style={small}>Boutique</p>
                <h3>{store.name}</h3>
              </div>

              <div style={box}>
                <p style={small}>Produits</p>
                <h3>{totalProducts}</h3>
              </div>

              <div style={box}>
                <p style={small}>Valeur</p>
                <h3>{totalValue} $</h3>
              </div>

              <div style={box}>
                <p style={small}>Plan</p>
                <h3>Premium</h3>
              </div>
            </div>

            <div style={box}>
              <p style={small}>Connecté avec</p>
              <p>{userEmail}</p>

              <p style={small}>Lien boutique</p>
              <p>{`${typeof window !== "undefined" ? window.location.origin : ""}/store/${store.slug}`}</p>

              <button
                onClick={copyStoreLink}
                style={{
                  padding: 12,
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                }}
              >
                {copied ? "Lien copié" : "Copier le lien"}
              </button>
            </div>
          </>
        )}
      </div>
    </PremiumGuard>
  );
}

const box: React.CSSProperties = {
  background: "white",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
};

const small: React.CSSProperties = {
  color: "#666",
  fontSize: 13,
};