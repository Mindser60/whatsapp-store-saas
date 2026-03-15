"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/dashboard/premium", label: "Vue d’ensemble" },
    { href: "/dashboard/products", label: "Produits" },
    { href: "/dashboard/theme", label: "Personnalisation" },
    { href: "/dashboard/billing", label: "Abonnement" },
    {
      href: storeSlug ? `/store/${storeSlug}` : "/dashboard/premium",
      label: "Voir la boutique",
    },
  ];

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) setEmail(user.email);

      if (user?.id) {
        const { data } = await supabase
          .from("stores")
          .select("slug")
          .eq("user_id", user.id)
          .single();

        if (data?.slug) setStoreSlug(data.slug);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20 }}>WhatsApp Store</h2>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          Menu
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
        }}
      >
        <aside
          style={{
            background: "#111827",
            color: "white",
            minHeight: "calc(100vh - 60px)",
            padding: 24,
            display: mobileOpen ? "block" : "block",
          }}
        >
          <div style={{ marginBottom: 30 }}>
            <p style={{ margin: 0, color: "#9ca3af", fontSize: 13 }}>
              Shopify style dashboard
            </p>
          </div>

          <nav style={{ display: "grid", gap: 10 }}>
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    textDecoration: "none",
                    color: active ? "#111827" : "white",
                    background: active ? "white" : "transparent",
                    padding: "12px 14px",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div
            style={{
              marginTop: 30,
              padding: 16,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 14,
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
              Connecté avec
            </p>
            <p style={{ marginTop: 8, fontSize: 14, wordBreak: "break-word" }}>
              {email || "Chargement..."}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "none",
              background: "#ef4444",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Déconnexion
          </button>
        </aside>

        <main style={{ padding: 20 }}>
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              minHeight: "calc(100vh - 100px)",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}