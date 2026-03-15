"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  store_id: string;
};

type Store = {
  id: string;
  name: string;
  slug: string;
};

export default function ProductsPage() {
  const supabase = createClient();

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: storeData } = await supabase
      .from("stores")
      .select("id, name, slug")
      .eq("user_id", user.id)
      .single();

    if (!storeData) {
      setMessage("Crée d'abord ta boutique.");
      setLoading(false);
      return;
    }

    setStore(storeData);

    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", storeData.id)
      .order("created_at", { ascending: false });

    setProducts(productsData || []);
    setLoading(false);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!store) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("products").insert({
      store_id: store.id,
      name,
      description,
      price: Number(price) || 0,
      image_url: imageUrl,
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setSaving(false);
    loadData();
  }

  async function handleDelete(id: string) {
    await supabase.from("products").delete().eq("id", id);
    loadData();
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Produits</h1>
      <p style={{ color: "#666" }}>Ajoute les produits de ta boutique.</p>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <form
          onSubmit={handleAddProduct}
          style={{
            display: "grid",
            gap: 12,
            padding: 20,
            borderRadius: 16,
            background: "#f8f8f8",
          }}
        >
          <input
            type="text"
            placeholder="Nom du produit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: 12 }}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: 12, minHeight: 100 }}
          />

          <input
            type="number"
            placeholder="Prix"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ padding: 12 }}
          />

          <input
            type="text"
            placeholder="URL image produit"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ padding: 12 }}
          />

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: 12,
              background: "black",
              color: "white",
              border: "none",
              borderRadius: 10,
            }}
          >
            {saving ? "Ajout..." : "Ajouter le produit"}
          </button>
        </form>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {products.length === 0 ? (
            <div>Aucun produit.</div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "white",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 180,
                      background: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Pas d'image
                  </div>
                )}

                <div style={{ padding: 16 }}>
                  <h3>{product.name}</h3>
                  <p style={{ color: "#666" }}>
                    {product.description || "Pas de description"}
                  </p>
                  <p style={{ fontWeight: "bold" }}>{product.price ?? 0} $</p>

                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      width: "100%",
                      padding: 10,
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}