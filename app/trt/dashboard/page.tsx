export default function TrtDashboardPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "#0a1930", textAlign: "center" }}>
      <div>
        <div style={{ fontFamily: "var(--cinzel)", fontSize: "32px", fontWeight: 500, letterSpacing: "4px", color: "#f5eadd", marginBottom: "8px" }}>ELEVATE TRT</div>
        <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#c9a961", marginBottom: "32px" }}>Dashboard</div>
        <p style={{ fontSize: "14px", color: "rgba(245,234,221,0.5)", maxWidth: "400px", lineHeight: 1.6 }}>
          TRT Dashboard — coming soon. Your clinician-led protocol, labs, and progress will appear here.
        </p>
      </div>
    </main>
  );
}
