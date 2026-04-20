import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function StudiesListPage() {
  const supabase = await createClient();

  const { data: studies, error } = await supabase
    .from("studies")
    .select("id, title, source_type, status, doi, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="card" style={{ borderColor: "var(--danger)" }}>
        <div style={{ color: "var(--danger)" }}>
          Failed to load studies: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "32px",
              fontWeight: 600,
              lineHeight: 1.2,
              marginBottom: "4px",
            }}
          >
            Studies
          </h1>
          <div className="eyebrow">
            {studies.length} {studies.length === 1 ? "study" : "studies"}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/admin/studies/search">
            <button className="btn-outline">Search databases</button>
          </Link>
          <Link href="/admin/studies/new">
            <button className="btn-copper">Upload study</button>
          </Link>
        </div>
      </header>

      {studies.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "24px",
              color: "var(--cream)",
              marginBottom: "8px",
            }}
          >
            No studies yet
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--muted)",
              marginBottom: "24px",
              maxWidth: "380px",
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}
          >
            Upload a research paper as text, PDF, or URL to begin the content
            pipeline.
          </div>
          <Link href="/admin/studies/new">
            <button className="btn-copper">Upload your first study</button>
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Uploaded</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {studies.map((s) => (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    transition: "background 0.15s",
                  }}
                >
                  <td style={tdStyle}>
                    <Link
                      href={`/admin/studies/${s.id}`}
                      style={{
                        color: "var(--cream)",
                        fontWeight: 600,
                      }}
                    >
                      {s.title}
                    </Link>
                    {s.doi && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--dim)",
                          marginTop: "2px",
                        }}
                      >
                        DOI: {s.doi}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: "11px",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        color: "var(--tan)",
                      }}
                    >
                      {s.source_type}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span className={`pill pill-${s.status.replace(/_/g, "-")}`}>
                      {s.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: "var(--muted)" }}>
                      {new Date(s.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <Link
                      href={`/admin/studies/${s.id}`}
                      style={{
                        fontSize: "10px",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "var(--copper)",
                      }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "14px 20px",
  textAlign: "left",
  fontSize: "10px",
  letterSpacing: "1.8px",
  textTransform: "uppercase",
  color: "var(--muted)",
  fontWeight: 700,
};

const tdStyle: React.CSSProperties = {
  padding: "16px 20px",
  verticalAlign: "middle",
};
