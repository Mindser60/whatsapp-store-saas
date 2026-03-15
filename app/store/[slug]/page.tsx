import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StorePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!store) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  const primaryColor = store.primary_color || "#25D366";
  const whatsappNumber = (store.whatsapp || "").replace(/\D/g, "");
  const floatingWhatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Bonjour, je veux des informations sur votre boutique ${store.name}.`
  )}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          height: 280,
          background: store.banner_url ? "#ddd" : primaryColor,
          overflow: "hidden",
        }}
      >
        {store.banner_url ? (
          <img
            src={store.banner_url}
            alt={store.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "-50px auto 0",
          padding: "0 20px 40px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {store.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.name}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: "bold",
                }}
              >
                {store.name?.charAt(0) || "S"}
              </div>
            )}

            <div>
              <h1 style={{ margin: 0 }}>{store.name}</h1>
              <p style={{ color: "#666" }}>
                {store.description || "Bienvenue dans notre boutique."}
              </p>
            </div>
          </div>
        </div>

        {!products || products.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
            }}
          >
            Aucun produit disponible.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 20,
            }}
          >
            {products.map((product) => {
              const link = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Bonjour, je veux commander : ${product.name} - ${product.price ?? 0}$`
              )}`;

              return (
                <div
                  key={product.id}
                  style={{
                    background: "white",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 220,
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
                    <p style={{ fontWeight: "bold", fontSize: 22 }}>
                      {product.price ?? 0} $
                    </p>

                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        textAlign: "center",
                        textDecoration: "none",
                        padding: "14px 16px",
                        borderRadius: 12,
                        background: primaryColor,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Commander sur WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <a
        href={floatingWhatsappLink}
        target="_blank"
        rel="noreferrer"
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          background: "#25D366",
          color: "white",
          textDecoration: "none",
          padding: "16px 20px",
          borderRadius: 999,
          fontWeight: "bold",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        WhatsApp
      </a>
    </div>
  );
}