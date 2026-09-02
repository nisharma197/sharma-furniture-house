"use client";

import { useState } from "react";
import { authStorage } from "@/lib/auth";

interface Props {
  onUploaded: (url: string) => void;
  label?: string;
}

// Uploads a file directly to Cloudinary via the backend's authenticated
// POST /api/admin/image endpoint, then hands the resulting secure URL back
// to the parent form (e.g. to set as a cover image, or push into a list).
export default function ImageUploader({ onUploaded, label = "Upload image" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const token = authStorage.get();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${apiUrl}/admin/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Upload failed");
      onUploaded(json.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-walnut-200 bg-white px-3.5 py-2 text-sm font-medium text-walnut-800 hover:bg-walnut-50 focus-ring">
        {uploading ? "Uploading..." : label}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
