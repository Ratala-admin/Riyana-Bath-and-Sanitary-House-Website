"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  currentImage?: string;
  onUpload: (url: string) => void;
}

export default function ImageUploader({ currentImage, onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (!["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"].includes(file.type)) {
      setError("Only images (jpg, png, gif, webp, svg) are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large (max 5MB).");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      onUpload(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed. Try again.");
      setPreview(currentImage || "");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleFile}
        style={{
          background: "var(--background)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          padding: "0.6rem",
          color: "var(--foreground)",
          fontFamily: "inherit",
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      />

      {uploading && <span style={{ color: "var(--accent-gold)", fontSize: "0.85rem" }}>Uploading...</span>}
      {error && <span style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</span>}

      {preview && (
        <div style={{ position: "relative", width: "100%", maxWidth: "300px", height: "150px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Image src={preview} alt="Preview" fill style={{ objectFit: "cover" }} />
        </div>
      )}
    </div>
  );
}
