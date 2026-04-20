import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteStudy, getSignedFileUrl } from "../../actions";

type StudyDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function StudyDetailPage({ params }: StudyDetailProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: study } = await supabase
    .from("studies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!study) notFound();

  // Resolve signed URL for file download if applicable
  let signedFileUrl: string | null = null;
  if (study.source_type === "pdf" && study.source_file_path) {
    signedFileUrl = await getSignedFileUrl(study.source_file_path);
  }

  const deleteWithId = deleteStudy.bind(null, study.id);

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

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "280px" }}>
            <h1
              style={{
                fontFamily: "var(--serif)",
                fontSize: "32px",
                fontWeight: 600,
                lineHeight: 1.25,
                marginBottom: "8px",
              }}
            >
              {study.title}
            </h1>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span className={`pill pill-${study.status.replace(/_/g, "-")}`}>
                {study.status.replace(/_/g, " ")}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                Uploaded{" "}
                {new Date(study.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-title">Source</div>

        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "4px",
            }}
          >
            Type
          </div>
          <div style={{ color: "var(--cream)", fontSize: "14px" }}>
            {study.source_type.toUpperCase()}
          </div>
        </div>

        {study.source_type === "text" && study.source_text && (
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "8px",
              }}
            >
              Text content ({study.source_text.length.toLocaleString()}{" "}
              characters)
            </div>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.25)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "16px",
                maxHeight: "400px",
                overflowY: "auto",
                fontSize: "13px",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                color: "var(--cream)",
              }}
            >
              {study.source_text}
            </div>
          </div>
        )}

        {study.source_type === "url" && study.source_url && (
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "4px",
              }}
            >
              URL
            </div>
            <a
              href={study.source_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--copper)",
                fontSize: "14px",
                wordBreak: "break-all",
              }}
            >
              {study.source_url} ↗
            </a>
          </div>
        )}

        {study.source_type === "pdf" && signedFileUrl && (
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "8px",
              }}
            >
              Uploaded file
            </div>
            <a
              href={signedFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "rgba(184, 115, 51, 0.08)",
                border: "1px solid var(--copper)",
                borderRadius: "6px",
                color: "var(--copper)",
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Download file ↗
            </a>
            <div
              style={{
                fontSize: "11px",
                color: "var(--dim)",
                marginTop: "8px",
              }}
            >
              Signed link valid for 5 minutes. Refresh the page for a new link.
            </div>
          </div>
        )}
      </div>

      {(study.doi || study.citation) && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="card-title">Metadata</div>

          {study.doi && (
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "4px",
                }}
              >
                DOI
              </div>
              <a
                href={`https://doi.org/${study.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--copper)", fontSize: "13px" }}
              >
                {study.doi} ↗
              </a>
            </div>
          )}

          {study.citation && (
            <div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "4px",
                }}
              >
                Citation
              </div>
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "var(--cream)",
                  fontStyle: "italic",
                }}
              >
                {study.citation}
              </div>
            </div>
          )}
        </div>
      )}

      {study.notes && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="card-title">Admin notes</div>
          <div
            style={{
              fontSize: "13px",
              lineHeight: 1.7,
              color: "var(--cream)",
              whiteSpace: "pre-wrap",
            }}
          >
            {study.notes}
          </div>
        </div>
      )}

      <div
        className="card"
        style={{
          marginBottom: "20px",
          borderColor: "rgba(189, 148, 104, 0.3)",
          background: "rgba(189, 148, 104, 0.04)",
        }}
      >
        <div className="card-title">Pipeline status</div>
        <div
          style={{
            fontSize: "13px",
            lineHeight: 1.7,
            color: "var(--muted)",
          }}
        >
          <strong style={{ color: "var(--cream)" }}>Stage 1A complete.</strong>{" "}
          Study is saved and available for the next stage.
          <br />
          <br />
          <strong style={{ color: "var(--cream)" }}>Next: Stage 1B.</strong>{" "}
          AI-generated script drafting with Claude. The &ldquo;Generate
          script&rdquo; button will appear here.
        </div>
      </div>

      <div
        className="card"
        style={{
          borderColor: "rgba(200, 90, 74, 0.3)",
          background: "rgba(200, 90, 74, 0.04)",
        }}
      >
        <div className="card-title" style={{ color: "var(--danger)" }}>
          Danger zone
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>
            Permanently delete this study and any uploaded file. Cannot be
            undone.
          </div>
          <form action={deleteWithId}>
            <button
              type="submit"
              className="btn-outline"
              style={{
                borderColor: "var(--danger)",
                color: "var(--danger)",
              }}
            >
              Delete study
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
