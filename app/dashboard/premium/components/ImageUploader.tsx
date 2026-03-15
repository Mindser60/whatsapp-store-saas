"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function ImageUploader({
  label,
  folder,
  value,
  onUpload,
}: {
  label: string;
  folder: string;
  value: string;
  onUpload: (url: string) => void;
}) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const ext = file.name.split(".").pop();
    const filePath = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("store-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("store-assets")
      .getPublicUrl(filePath);

    onUpload(data.publicUrl);
    setUploading(false);
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploading ? <p>Upload...</p> : null}
      {value ? (
        <img
          src={value}
          alt={label}
          style={{
            width: "100%",
            maxWidth: 260,
            height: 160,
            objectFit: "cover",
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        />
      ) : null}
    </div>
  );
}