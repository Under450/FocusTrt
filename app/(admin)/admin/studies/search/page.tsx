"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SearchResult = {
  title: string;
  authors: string;
  abstract: string;
  doi: string | null;
  year: number | null;
  url: string | null;
  source: "semantic_scholar" | "pubmed";
};

export default function SearchStudiesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim().length < 3) return;

    setSearching(true);
    setSearched(false);

    try {
      const res = await fetch(
        `/api/studies/search?q=${encodeURIComponent(query.trim())}`
      );
      const json = await res.json();
      setResults(json.results || []);
    } catch {
      setResults([]);
    }

    setSearching(false);
    setSearched(true);
  }

  function handleImport(result: SearchResult) {
    const params = new URLSearchParams();
    params.set("title", result.title);
    if (result.abstract) params.set("source_text", result.abstract);
    if (result.doi) params.set("doi", result.doi);

    // Build citation: Authors. Title. Year.
    const parts: string[] = [];
    if (result.authors) parts.push(result.authors);
    parts.push(result.title);
    if (result.year) parts.push(`(${result.year})`);
    if (result.doi) parts.push(`DOI: ${result.doi}`);
    params.set("citation", parts.join(". ") + ".");

    if (result.url) params.set("source_url", result.url);

    router.push(`/admin/studies/new?${params.toString()}`);
  }

  return (
    <div style={{ maxWidth: "880px" }}>
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
          Search studies
        </h1>
        <div className="eyebrow">
          PubMed + Semantic Scholar · Find and import research
        </div>
      </header>

      <form onSubmit={handleSearch} style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            className="field-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. testosterone therapy cardiovascular outcomes"
            disabled={searching}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn-copper"
            disabled={searching || query.trim().length < 3}
            style={{ padding: "12px 24px", whiteSpace: "nowrap" }}
          >
            {searching ? "Searching…" : "Search"}
          </button>
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--dim)",
            marginTop: "8px",
          }}
        >
          Searches PubMed and Semantic Scholar simultaneously. Click
          &ldquo;Import&rdquo; to pre-fill the upload form.
        </div>
      </form>

      {searching && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--muted)",
            fontSize: "14px",
          }}
        >
          Searching databases…
        </div>
      )}

      {searched && !searching && results.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--muted)",
            fontSize: "14px",
          }}
        >
          No results found. Try different keywords.
        </div>
      )}

      {results.map((result, i) => (
        <div
          key={`${result.source}-${result.doi || i}`}
          className="card"
          style={{ marginBottom: "16px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: 1.35,
                flex: 1,
              }}
            >
              {result.title}
            </h2>
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--dim)",
                whiteSpace: "nowrap",
                padding: "4px 8px",
                border: "1px solid var(--border)",
                borderRadius: "4px",
              }}
            >
              {result.source === "pubmed" ? "PubMed" : "S2"}
            </span>
          </div>

          {result.authors && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--tan)",
                marginBottom: "6px",
                lineHeight: 1.4,
              }}
            >
              {result.authors.length > 200
                ? result.authors.slice(0, 200) + "…"
                : result.authors}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "10px",
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            {result.year && <span>{result.year}</span>}
            {result.doi && (
              <span>
                DOI:{" "}
                <a
                  href={`https://doi.org/${result.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--copper)" }}
                >
                  {result.doi}
                </a>
              </span>
            )}
          </div>

          {result.abstract && (
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.65,
                color: "var(--cream)",
                marginBottom: "14px",
                maxHeight: "120px",
                overflow: "hidden",
                maskImage:
                  "linear-gradient(to bottom, black 70%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 70%, transparent 100%)",
              }}
            >
              {result.abstract}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn-copper"
              onClick={() => handleImport(result)}
              style={{ padding: "8px 20px", fontSize: "12px" }}
            >
              Import to upload form
            </button>
            {result.url && (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{
                  padding: "8px 16px",
                  fontSize: "12px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                View original ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
