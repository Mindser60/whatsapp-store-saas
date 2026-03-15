'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EditProductPage() {
  const supabase = createClient()
  const params = useParams()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    compare_at_price: '',
    badge_text: '',
    is_featured: false,
    is_active: true,
    image_url: '',
    stock_quantity: '0',
    allow_backorder: false,
  })

  useEffect(() => {
    const loadProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        setMessage(error.message)
      } else {
        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          compare_at_price: data.compare_at_price?.toString() || '',
          badge_text: data.badge_text || '',
          is_featured: data.is_featured || false,
          is_active: data.is_active || false,
          image_url: data.image_url || '',
          stock_quantity: data.stock_quantity?.toString() || '0',
          allow_backorder: data.allow_backorder || false,
        })
      }

      setLoading(false)
    }

    loadProduct()
  }, [params.id, supabase])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const uploadImage = async (file: File) => {
    setUploading(true)
    setMessage('')

    const extension = file.name.split('.').pop() || 'jpg'
    const fileName = `product-${Date.now()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('store-assets')
      .upload(fileName, file, {
        upsert: true,
      })

    if (uploadError) {
      setMessage(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from('store-assets')
      .getPublicUrl(fileName)

    setForm((prev) => ({
      ...prev,
      image_url: data.publicUrl,
    }))

    setMessage('Image uploadée avec succès.')
    setUploading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('products')
      .update({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        compare_at_price: form.compare_at_price
          ? Number(form.compare_at_price)
          : null,
        badge_text: form.badge_text || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
        image_url: form.image_url,
        stock_quantity: Number(form.stock_quantity || 0),
        allow_backorder: form.allow_backorder,
      })
      .eq('id', params.id)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Produit modifié avec succès.')
    }

    setSaving(false)
  }

  if (loading) {
    return <main className="p-6">Chargement...</main>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 space-y-4">
        <h1 className="text-2xl font-bold">Modifier le produit</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Titre</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Prix actuel</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Ancien prix barré</label>
            <input
              type="number"
              step="0.01"
              name="compare_at_price"
              value={form.compare_at_price}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Badge promo</label>
            <input
              type="text"
              name="badge_text"
              value={form.badge_text}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Ex: Promo / Nouveau / Best Seller"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Stock disponible</label>
            <input
              type="number"
              name="stock_quantity"
              value={form.stock_quantity}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Ex: 12"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="allow_backorder"
              checked={form.allow_backorder}
              onChange={handleChange}
            />
            <label>Autoriser la commande même si le stock est à 0</label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Image produit</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  uploadImage(e.target.files[0])
                }
              }}
              className="w-full rounded-xl border px-4 py-3"
            />

            {uploading && (
              <p className="mt-2 text-sm text-gray-500">Upload de l’image...</p>
            )}

            {form.image_url && (
              <img
                src={form.image_url}
                alt="Produit"
                className="mt-3 h-40 w-full rounded-xl object-cover border"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
            />
            <label>Produit vedette</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            <label>Produit actif</label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>

          {message && <p className="text-sm text-gray-600">{message}</p>}
        </form>
      </div>
    </main>
  )
}