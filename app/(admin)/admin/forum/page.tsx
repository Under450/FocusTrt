export default function ForumPage() {
  return (
    <div style={{ maxWidth: "680px" }}>
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
          Members Forum
        </h1>
        <div className="eyebrow">Admin · Forum management</div>
      </header>

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
            marginBottom: "12px",
          }}
        >
          Coming soon
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--muted)",
            maxWidth: "400px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          The Members Forum will let members listen to published podcasts and
          discuss studies. Admin controls for moderation and publishing will
          appear here.
        </div>
      </div>
    </div>
  );
}
