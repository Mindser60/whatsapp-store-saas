'use client'

import { useMemo, useState } from 'react'

type ThemeSection = {
  id: string
  label: string
  enabled: boolean
}

type StoreType = {
  id: string
  name: string
  slug: string
  description: string | null
  whatsapp_number: string
  logo_url: string | null
  banner_url: string | null
  primary_color: string | null
  hero_badge: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_cta_text: string | null
  promo_enabled: boolean | null
  promo_text: string | null
  promo_end_at: string | null
  theme_sections: ThemeSection[] | null
}

type Product = {
  id: string
  title: string
  description: string | null
  price: number
  compare_at_price?: number | null
  image_url: string | null
  is_active: boolean
  is_featured?: boolean | null
  badge_text?: string | null
  stock_quantity?: number | null
  allow_backorder?: boolean | null
}

type CartItem = {
  id: string
  title: string
  price: number
  quantity: number
}

export default function StoreFront({
  store,
  products,
}: {
  store: StoreType
  products: Product[]
}) {
  const primaryColor = store.primary_color || '#0f172a'
  const heroTitle = store.hero_title || store.name || 'Une boutique premium'
  const heroSubtitle =
    store.hero_subtitle ||
    store.description ||
    'Une boutique moderne pensée pour mieux vendre.'
  const heroBadge = store.hero_badge || 'Boutique tendance'
  const heroCta = store.hero_cta_text || 'Commander maintenant'

  const themeSections = store.theme_sections || []

  const isSectionEnabled = (sectionId: string) => {
    if (!themeSections.length) return true
    const section = themeSections.find((s) => s.id === sectionId)
    return section ? section.enabled : true
  }

  const featuredProducts =
    products?.filter((product) => product.is_featured) || []

  const firstFeatured = featuredProducts[0]

  const normalProducts =
    products?.filter((product) => !product.is_featured) || []

  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: Number(product.price),
          quantity: 1,
        },
      ]
    })
  }

  const decreaseQty = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const increaseQty = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  )

  const whatsappCartLink = useMemo(() => {
    if (!cart.length) {
      return `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(
        `Bonjour, je veux des informations sur votre boutique ${store.name}`
      )}`
    }

    const lines = cart.map(
      (item) =>
        `- ${item.title} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)} $`
    )

    const message = `Bonjour, je veux commander :\n\n${lines.join(
      '\n'
    )}\n\nTotal : ${cartTotal.toFixed(2)} $`

    return `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(
      message
    )}`
  }, [cart, cartTotal, store.name, store.whatsapp_number])

  return (
    <main
      style={{
        fontFamily: 'Arial, sans-serif',
        background: '#f5f7fb',
        color: '#0f172a',
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }

        .wrapper { width: 100%; overflow-x: hidden; }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
        }

        .topbar-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .brand {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          text-decoration: none;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav a {
          text-decoration: none;
          color: #0f172a;
          font-weight: 700;
          font-size: 15px;
        }

        .nav-cta {
          background: ${primaryColor};
          color: white !important;
          padding: 12px 22px;
          border-radius: 999px;
        }

        .hero {
          max-width: 1240px;
          margin: 0 auto;
          padding: 56px 20px 34px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 40px;
          align-items: center;
        }

        .badge {
          display: inline-block;
          background: #e9effc;
          color: ${primaryColor};
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 700;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .hero h1 {
          font-size: 64px;
          line-height: 1.02;
          margin: 0 0 22px;
          letter-spacing: -2px;
        }

        .hero p {
          font-size: 18px;
          line-height: 1.7;
          color: #475569;
          margin: 0 0 22px;
          max-width: 700px;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
          text-decoration: none;
          padding: 15px 22px;
          border-radius: 999px;
          font-weight: 800;
          display: inline-block;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: ${primaryColor};
          color: white;
        }

        .btn-secondary {
          border: 2px solid ${primaryColor};
          color: ${primaryColor};
          background: transparent;
        }

        .hero-card {
          background: white;
          border-radius: 36px;
          padding: 22px;
          box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08);
        }

        .hero-product {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 26px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .hero-product img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero-price-box {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-price {
          font-size: 28px;
          font-weight: 900;
        }

        .hero-compare-price {
          font-size: 18px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 700;
        }

        .hero-stock {
          margin-top: 10px;
          font-size: 14px;
          font-weight: 700;
        }

        .in-stock { color: #15803d; }
        .out-of-stock { color: #dc2626; }

        .section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 34px 20px 64px;
        }

        .section-tag {
          display: inline-block;
          background: #e9effc;
          color: ${primaryColor};
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 52px;
          line-height: 1.05;
          letter-spacing: -1.4px;
          margin: 0 0 14px;
          text-align: center;
        }

        .section-subtitle {
          max-width: 820px;
          margin: 0 auto 34px;
          text-align: center;
          color: #64748b;
          font-size: 18px;
          line-height: 1.6;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .product-card {
          background: white;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 14px 40px rgba(15,23,42,0.06);
          position: relative;
        }

        .product-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          background: ${primaryColor};
          color: white;
          font-size: 13px;
          font-weight: 800;
          padding: 8px 12px;
          border-radius: 999px;
        }

        .product-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
          background: #e5e7eb;
        }

        .product-body {
          padding: 22px;
        }

        .product-title {
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 10px;
        }

        .product-desc {
          margin: 0 0 14px;
          color: #64748b;
          line-height: 1.6;
          min-height: 50px;
        }

        .product-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        .price-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .product-price {
          font-size: 28px;
          font-weight: 900;
        }

        .compare-price {
          font-size: 18px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 700;
        }

        .stock-text {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 700;
        }

        .product-btn {
          display: inline-block;
          text-decoration: none;
          background: ${primaryColor};
          color: white;
          padding: 13px 18px;
          border-radius: 14px;
          font-weight: 800;
          border: none;
          cursor: pointer;
        }

        .product-btn.disabled {
          background: #9ca3af;
          pointer-events: none;
        }

        .cart-section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px 64px;
        }

        .cart-box {
          background: white;
          border-radius: 26px;
          box-shadow: 0 14px 40px rgba(15,23,42,0.06);
          padding: 24px;
        }

        .cart-title {
          font-size: 30px;
          font-weight: 900;
          margin: 0 0 16px;
        }

        .cart-empty {
          color: #64748b;
        }

        .cart-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item-title {
          font-weight: 800;
          margin-bottom: 4px;
        }

        .cart-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .qty-btn {
          border: 1px solid #d1d5db;
          background: white;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 800;
        }

        .remove-btn {
          border: none;
          background: transparent;
          color: #dc2626;
          font-weight: 700;
          cursor: pointer;
        }

        .cart-total {
          margin-top: 18px;
          font-size: 26px;
          font-weight: 900;
        }

        .cart-send-btn {
          margin-top: 18px;
          display: inline-block;
          text-decoration: none;
          background: ${primaryColor};
          color: white;
          padding: 14px 20px;
          border-radius: 14px;
          font-weight: 900;
        }

        .mobile-sticky-bar {
          display: none;
        }

        @media (max-width: 1100px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .section-title {
            font-size: 42px;
          }

          .hero h1 {
            font-size: 52px;
          }
        }

        @media (max-width: 768px) {
          .nav { display: none; }

          .hero {
            padding: 30px 16px 18px;
            gap: 24px;
          }

          .hero h1 {
            font-size: 38px;
            letter-spacing: -1px;
          }

          .hero p {
            font-size: 16px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            text-align: center;
          }

          .section {
            padding: 24px 16px 44px;
          }

          .cart-section {
            padding: 0 16px 44px;
          }

          .section-title {
            font-size: 32px;
          }

          .section-subtitle {
            font-size: 16px;
            margin-bottom: 24px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .product-card {
            border-radius: 20px;
          }

          .product-body {
            padding: 18px;
          }

          .product-row {
            flex-direction: column;
            align-items: stretch;
          }

          .product-btn {
            text-align: center;
          }

          .cart-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .mobile-sticky-bar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            display: block;
            background: rgba(255,255,255,0.94);
            backdrop-filter: blur(10px);
            border-top: 1px solid #e5e7eb;
            padding: 12px 16px;
            z-index: 50;
          }

          .mobile-sticky-btn {
            display: block;
            text-decoration: none;
            background: ${primaryColor};
            color: white;
            padding: 14px 18px;
            border-radius: 14px;
            text-align: center;
            font-weight: 900;
          }
        }
      `}</style>

      <div className="wrapper">
        <header className="topbar">
          <div className="topbar-inner">
            <a href="#" className="brand">
              {store.name}
            </a>

            <nav className="nav">
              <a href="#produits">Produits</a>
              <a href="#panier">Panier ({cartCount})</a>
              <a href="#commande" className="nav-cta">
                Commander
              </a>
            </nav>
          </div>
        </header>

        {isSectionEnabled('hero') && (
          <section className="hero">
            <div>
              <div className="badge">{heroBadge}</div>
              <h1>{heroTitle}</h1>
              <p>{heroSubtitle}</p>

              <div className="hero-actions">
                <a href={whatsappCartLink} target="_blank" rel="noreferrer" className="btn-primary">
                  {heroCta}
                </a>

                <a href="#produits" className="btn-secondary">
                  Voir les produits
                </a>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-product">
                <img
                  src={
                    firstFeatured?.image_url ||
                    products?.[0]?.image_url ||
                    'https://placehold.co/1000x1000?text=Produit'
                  }
                  alt={firstFeatured?.title || 'Produit'}
                />
              </div>

              {firstFeatured && (
                <>
                  <div className="hero-price-box">
                    <div className="hero-price">
                      {Number(firstFeatured.price).toFixed(2)} $
                    </div>

                    {firstFeatured.compare_at_price !== null &&
                      firstFeatured.compare_at_price !== undefined &&
                      Number(firstFeatured.compare_at_price) > Number(firstFeatured.price) && (
                        <div className="hero-compare-price">
                          {Number(firstFeatured.compare_at_price).toFixed(2)} $
                        </div>
                      )}
                  </div>

                  <div
                    className={`hero-stock ${
                      Number(firstFeatured.stock_quantity || 0) > 0 || firstFeatured.allow_backorder
                        ? 'in-stock'
                        : 'out-of-stock'
                    }`}
                  >
                    {Number(firstFeatured.stock_quantity || 0) > 0
                      ? `En stock : ${firstFeatured.stock_quantity}`
                      : firstFeatured.allow_backorder
                      ? 'Disponible sur commande'
                      : 'Rupture de stock'}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {featuredProducts.length > 0 && (
          <section className="section">
            <div className="section-tag">Produits vedettes</div>
            <h2 className="section-title">Les meilleurs produits de la boutique</h2>
            <p className="section-subtitle">
              Mets en avant les produits les plus importants pour augmenter les ventes.
            </p>

            <div className="products-grid">
              {featuredProducts.map((product) => {
                const inStock =
                  Number(product.stock_quantity || 0) > 0 || product.allow_backorder

                return (
                  <div className="product-card" key={product.id}>
                    {product.badge_text && (
                      <div className="product-badge">{product.badge_text}</div>
                    )}

                    <img
                      className="product-img"
                      src={product.image_url || 'https://placehold.co/800x800?text=Produit'}
                      alt={product.title}
                    />

                    <div className="product-body">
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-desc">
                        {product.description || 'Produit disponible maintenant.'}
                      </p>

                      <div className="product-row">
                        <div className="price-wrap">
                          <div className="product-price">
                            {Number(product.price).toFixed(2)} $
                          </div>

                          {product.compare_at_price !== null &&
                            product.compare_at_price !== undefined &&
                            Number(product.compare_at_price) > Number(product.price) && (
                              <div className="compare-price">
                                {Number(product.compare_at_price).toFixed(2)} $
                              </div>
                            )}
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          className={`product-btn ${!inStock ? 'disabled' : ''}`}
                        >
                          {inStock ? 'Ajouter au panier' : 'Indisponible'}
                        </button>
                      </div>

                      <div
                        className={`stock-text ${
                          inStock ? 'in-stock' : 'out-of-stock'
                        }`}
                      >
                        {Number(product.stock_quantity || 0) > 0
                          ? `En stock : ${product.stock_quantity}`
                          : product.allow_backorder
                          ? 'Disponible sur commande'
                          : 'Rupture de stock'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {isSectionEnabled('products') && (
          <section id="produits" className="section">
            <div className="section-tag">Tous les produits</div>
            <h2 className="section-title">Des produits présentés pour mieux vendre</h2>
            <p className="section-subtitle">
              Des fiches plus modernes avec promo, badge, stock et panier.
            </p>

            <div className="products-grid">
              {normalProducts.map((product) => {
                const inStock =
                  Number(product.stock_quantity || 0) > 0 || product.allow_backorder

                return (
                  <div className="product-card" key={product.id}>
                    {product.badge_text && (
                      <div className="product-badge">{product.badge_text}</div>
                    )}

                    <img
                      className="product-img"
                      src={product.image_url || 'https://placehold.co/800x800?text=Produit'}
                      alt={product.title}
                    />

                    <div className="product-body">
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-desc">
                        {product.description || 'Produit disponible maintenant.'}
                      </p>

                      <div className="product-row">
                        <div className="price-wrap">
                          <div className="product-price">
                            {Number(product.price).toFixed(2)} $
                          </div>

                          {product.compare_at_price !== null &&
                            product.compare_at_price !== undefined &&
                            Number(product.compare_at_price) > Number(product.price) && (
                              <div className="compare-price">
                                {Number(product.compare_at_price).toFixed(2)} $
                              </div>
                            )}
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          className={`product-btn ${!inStock ? 'disabled' : ''}`}
                        >
                          {inStock ? 'Ajouter au panier' : 'Indisponible'}
                        </button>
                      </div>

                      <div
                        className={`stock-text ${
                          inStock ? 'in-stock' : 'out-of-stock'
                        }`}
                      >
                        {Number(product.stock_quantity || 0) > 0
                          ? `En stock : ${product.stock_quantity}`
                          : product.allow_backorder
                          ? 'Disponible sur commande'
                          : 'Rupture de stock'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <section id="panier" className="cart-section">
          <div className="cart-box">
            <h2 className="cart-title">Panier</h2>

            {cart.length === 0 ? (
              <p className="cart-empty">Aucun produit dans le panier.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div>
                      <div className="cart-item-title">{item.title}</div>
                      <div>{item.price.toFixed(2)} $</div>
                    </div>

                    <div className="cart-controls">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => decreaseQty(item.id)}
                      >
                        -
                      </button>
                      <strong>{item.quantity}</strong>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}

                <div className="cart-total">
                  Total : {cartTotal.toFixed(2)} $
                </div>

                <a
                  href={whatsappCartLink}
                  target="_blank"
                  rel="noreferrer"
                  className="cart-send-btn"
                >
                  Envoyer la commande sur WhatsApp
                </a>
              </>
            )}
          </div>
        </section>

        <section id="commande" className="section">
          <div
            style={{
              background: 'linear-gradient(90deg, #0f172a, #111827)',
              borderRadius: '30px',
              color: 'white',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '36px', margin: '0 0 12px' }}>
              Prêt à commander ?
            </h2>
            <p style={{ fontSize: '18px', margin: '0 0 20px', color: 'rgba(255,255,255,0.85)' }}>
              Envoie tous les produits du panier directement sur WhatsApp.
            </p>
            <a
              href={whatsappCartLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                background: 'white',
                color: '#0f172a',
                padding: '14px 22px',
                borderRadius: '999px',
                fontWeight: 900,
              }}
            >
              Commander maintenant
            </a>
          </div>
        </section>

        <div className="mobile-sticky-bar">
          <a href={whatsappCartLink} target="_blank" rel="noreferrer" className="mobile-sticky-btn">
            Panier ({cartCount}) • {cartTotal.toFixed(2)} $
          </a>
        </div>
      </div>
    </main>
  )
}