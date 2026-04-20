import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch counts for dashboard tiles
  const [{ count: totalStudies }, { count: uploadedCount }, { count: draftCount }, recentStudies] =
    await Promise.all([
      supabase.from("studies").select("*", { count: "exact", head: true }),
      supabase
        .from("studies")
        .select("*", { count: "exact", head: true })
        .eq("status", "uploaded"),
      supabase
        .from("studies")
        .select("*", { count: "exact", head: true })
        .in("status", ["script_generated"]),
      supabase
        .from("studies")
        .select("id, title, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return (
    <div>
      <header style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: "32px",
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: "4px",
          }}
        >
          Dashboard
        </h1>
        <div className="eyebrow">Stage 1A · Upload &amp; storage only</div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "32px",
        }}
      >
        <StatCard label="Total studies" value={totalStudies ?? 0} />
        <StatCard label="Awaiting script" value={uploadedCount ?? 0} />
        <StatCard label="Scripts in draft" value={draftCount ?? 0} hint="Stage 1B" />
        <StatCard label="Published" value={0} hint="Stage 1E" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
        className="dash-grid"
      >
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div className="card-title" style={{ margin: 0 }}>
              Recent studies
            </div>
            <Link
              href="/admin/studies"
              style={{
                fontSize: "10px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--copper)",
              }}
            >
              View all →
            </Link>
          </div>

          {!recentStudies.data || recentStudies.data.length === 0 ? (
            <div
              style={{
                padding: "28px 0",
                textAlign: "center",
                color: "var(--dim)",
                fontSize: "13px",
              }}
            >
              No studies yet. Upload your first one to start.
            </div>
          ) : (
            <div>
              {recentStudies.data.map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/studies/${s.id}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--cream)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom: "3px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                      {new Date(s.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <StatusPill status={s.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Next steps</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link href="/admin/studies/new" style={{ display: "block" }}>
              <button
                className="btn-copper"
                style={{ width: "100%", padding: "14px" }}
              >
                Upload new study
              </button>
            </Link>
            <Link href="/admin/studies" style={{ display: "block" }}>
              <button
                className="btn-outline"
                style={{ width: "100%", padding: "14px" }}
              >
                Browse all studies
              </button>
            </Link>
          </div>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border)",
              fontSize: "12px",
              lineHeight: 1.6,
              color: "var(--muted)",
            }}
          >
            <strong style={{ color: "var(--cream)" }}>
              What&apos;s working now:
            </strong>
            <br />
            Upload studies as text, PDF, or URL. Data and files stored in
            Supabase with row-level security.
            <br />
            <br />
            <strong style={{ color: "var(--cream)" }}>Coming next:</strong>
            <br />
            Stage 1B adds Claude AI script generation.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="card" style={{ padding: "18px 20px", textAlign: "center" }}>
      <div
        style={{
          fontSize: "9px",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: "28px",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {hint && (
        <div style={{ fontSize: "10px", color: "var(--tan)", marginTop: "6px" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  const cls = `pill pill-${status.replace(/_/g, "-")}`;
  return <span className={cls}>{label}</span>;
}
