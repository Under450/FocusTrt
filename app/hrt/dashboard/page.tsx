export default function HrtDashboardPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "#f5eadd", textAlign: "center" }}>
      <div>
        <div style={{ fontFamily: "var(--cinzel)", fontSize: "32px", fontWeight: 500, letterSpacing: "4px", color: "#1a1410", marginBottom: "8px" }}>ELEVATE HRT</div>
        <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#8a6b2e", marginBottom: "32px" }}>Dashboard</div>
        <p style={{ fontSize: "14px", color: "rgba(26,20,16,0.5)", maxWidth: "400px", lineHeight: 1.6 }}>
          HRT Dashboard — coming soon. Your clinician-led protocol, labs, and progress will appear here.
        </p>
      </div>
    </main>
  );
}
