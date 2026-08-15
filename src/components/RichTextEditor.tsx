"use client";

import { useRef, useCallback, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtml = useRef(value);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const updateContent = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (html !== lastHtml.current) {
        lastHtml.current = html;
        onChange(html);
      }
    }
  }, [onChange]);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
    editorRef.current?.focus();
  }, [updateContent]);

  const handleInput = useCallback(() => {
    updateContent();
  }, [updateContent]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      alert("Only jpg, png, gif, webp allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large (max 5MB).");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      exec("insertHTML", `<img src="${data.url}" alt="" style="max-width:100%;border-radius:8px;margin:1rem 0;" />`);
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [exec]);

  return (
    <div style={{
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "10px",
      overflow: "hidden",
      background: "var(--background)",
    }}>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2px",
        padding: "0.5rem",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(0, 0, 0, 0.15)",
        alignItems: "center",
      }}>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} title="Bold"
          style={toolbarBtnStyle}>
          <strong>B</strong>
        </button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} title="Italic"
          style={toolbarBtnStyle}>
          <em>I</em>
        </button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("underline"); }} title="Underline"
          style={toolbarBtnStyle}>
          <span style={{ textDecoration: "underline" }}>U</span>
        </button>

        <div style={{ width: "1px", background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "<h2>"); }} title="Heading"
          style={toolbarBtnStyle}>
          H
        </button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "<h3>"); }} title="Subheading"
          style={{ ...toolbarBtnStyle, fontSize: "0.8rem" }}>
          H<sub>2</sub>
        </button>

        <div style={{ width: "1px", background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }} title="Bullet List"
          style={toolbarBtnStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
        </button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }} title="Numbered List"
          style={toolbarBtnStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
        </button>

        <div style={{ width: "1px", background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "<blockquote>"); }} title="Quote"
          style={toolbarBtnStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
        </button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec("insertHorizontalRule"); }} title="Divider"
          style={toolbarBtnStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /></svg>
        </button>

        <div style={{ width: "1px", background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} title="Insert Image"
          style={{ ...toolbarBtnStyle, opacity: uploading ? 0.5 : 1 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: "none" }} onChange={handleImageUpload} />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        data-placeholder={placeholder}
        style={{
          minHeight: "300px",
          padding: "1.25rem",
          outline: "none",
          color: "var(--foreground)",
          fontSize: "1rem",
          lineHeight: "1.7",
          fontFamily: "inherit",
        }}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #475569;
        }
      `}</style>
    </div>
  );
}

const toolbarBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "34px",
  height: "34px",
  border: "none",
  background: "transparent",
  color: "var(--text-muted)",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  transition: "all 0.15s ease",
};
