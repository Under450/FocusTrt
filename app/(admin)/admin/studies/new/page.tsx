"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createStudy } from "../../actions";

type SourceType = "text" | "pdf" | "url";

export default function NewStudyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill from search import
  const prefillTitle = searchParams.get("title") || "";
  const prefillText = searchParams.get("source_text") || "";
  const prefillDoi = searchParams.get("doi") || "";
  const prefillCitation = searchParams.get("citation") || "";
  const prefillUrl = searchParams.get("source_url") || "";

  const [sourceType, setSourceType] = useState<SourceType>(
    prefillText ? "text" : "text"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createStudy(formData);

    if (result.ok) {
      router.push(`/admin/studies/${result.studyId}`);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: "780px" }}>
      <header style={{ marginBottom: "32px" }}>
        <div style={{ marginBottom: "12px" }}>
          <Link
            href="/admin/studies"
            style={{
              fontSize: "11px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "var(--tan)",
            }}
          >
            ← Back to studies
          </Link>
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: "32px",
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: "4px",
          }}
        >
          Upload study
        </h1>
        <div className="eyebrow">Stage 1A · Store raw source material</div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="field">
            <label className="field-label" htmlFor="title">
              Study title *
            </label>
            <input
              id="title"
              name="title"
              className="field-input"
              type="text"
              required
              maxLength={280}
              placeholder="Effects of testosterone therapy on cardiovascular outcomes…"
              defaultValue={prefillTitle}
            />
            <div className="field-hint">
              Short, clear. This shows in the admin list and becomes the
              starting title for the generated podcast.
            </div>
          </div>

          <div className="field">
            <label className="field-label">Source type *</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
              }}
            >
              <SourceTypeOption
                value="text"
                current={sourceType}
                onChange={setSourceType}
                label="Paste text"
                hint="Copy from PDF or webpage"
              />
              <SourceTypeOption
                value="pdf"
                current={sourceType}
                onChange={setSourceType}
                label="Upload file"
                hint="PDF or TXT, 25 MB max"
              />
              <SourceTypeOption
                value="url"
                current={sourceType}
                onChange={setSourceType}
                label="Enter URL"
                hint="PubMed, journal link"
              />
            </div>
            <input type="hidden" name="source_type" value={sourceType} />
          </div>

          {sourceType === "text" && (
            <div className="field">
              <label className="field-label" htmlFor="source_text">
                Study text *
              </label>
              <textarea
                id="source_text"
                name="source_text"
                className="field-textarea"
                required={sourceType === "text"}
                placeholder="Paste the abstract, full text, or key findings here…"
                minLength={100}
                defaultValue={prefillText}
              />
              <div className="field-hint">
                Minimum 100 characters. Include enough context for AI
                summarisation in Stage 1B.
              </div>
            </div>
          )}

          {sourceType === "pdf" && (
            <div className="field">
              <label className="field-label" htmlFor="source_file">
                Upload PDF or TXT *
              </label>
              <input
                id="source_file"
                name="source_file"
                className="field-input"
                type="file"
                accept="application/pdf,text/plain"
                required={sourceType === "pdf"}
                style={{ padding: "10px" }}
              />
              <div className="field-hint">
                File stored privately in Supabase. Only admins can access.
              </div>
            </div>
          )}

          {sourceType === "url" && (
            <div className="field">
              <label className="field-label" htmlFor="source_url">
                Study URL *
              </label>
              <input
                id="source_url"
                name="source_url"
                className="field-input"
                type="url"
                required={sourceType === "url"}
                placeholder="https://pubmed.ncbi.nlm.nih.gov/…"
              />
              <div className="field-hint">
                Link to the published paper. AI fetching will be added in
                Stage 1B.
              </div>
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="card-title">Metadata (optional)</div>

          <div className="field">
            <label className="field-label" htmlFor="doi">
              DOI
            </label>
            <input
              id="doi"
              name="doi"
              className="field-input"
              type="text"
              placeholder="10.1234/jama.2023.5678"
              defaultValue={prefillDoi}
            />
            <div className="field-hint">
              Digital Object Identifier. Used in citation for branded PDF.
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="citation">
              Formatted citation
            </label>
            <textarea
              id="citation"
              name="citation"
              className="field-textarea"
              style={{ minHeight: "80px" }}
              placeholder="Smith J, et al. Testosterone therapy in men with hypogonadism. JAMA. 2023;329(14):1234-1245."
              defaultValue={prefillCitation}
            />
            <div className="field-hint">
              Optional. Appears in branded PDF footer if provided.
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="notes">
              Admin notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="field-textarea"
              style={{ minHeight: "80px" }}
              placeholder="Internal notes, context, angle for the script…"
            />
            <div className="field-hint">
              Only visible to admins. Not used in published content.
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "14px 20px",
              background: "rgba(200, 90, 74, 0.1)",
              border: "1px solid rgba(200, 90, 74, 0.3)",
              borderRadius: "6px",
              color: "var(--danger)",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Link href="/admin/studies">
            <button type="button" className="btn-outline" disabled={submitting}>
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="btn-copper"
            disabled={submitting}
            style={{ padding: "12px 32px" }}
          >
            {submitting ? "Saving…" : "Save study"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SourceTypeOption({
  value,
  current,
  onChange,
  label,
  hint,
}: {
  value: SourceType;
  current: SourceType;
  onChange: (v: SourceType) => void;
  label: string;
  hint: string;
}) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      style={{
        padding: "14px",
        borderRadius: "6px",
        border: `1px solid ${active ? "var(--copper)" : "var(--border)"}`,
        background: active ? "rgba(184, 115, 51, 0.08)" : "transparent",
        color: active ? "var(--cream)" : "var(--muted)",
        textAlign: "left",
        transition: "all 0.15s ease",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginBottom: "4px",
          color: active ? "var(--copper)" : "var(--muted)",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "11px", color: "var(--dim)" }}>{hint}</div>
    </button>
  );
}
