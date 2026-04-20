import Link from "next/link";

type HomeProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const showNotAdminError = params.error === "not_admin";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: "48px",
          letterSpacing: "4px",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        FOCUSTRT
      </div>
      <div
        className="eyebrow"
        style={{ marginTop: "8px", letterSpacing: "2.5px" }}
      >
        Men&apos;s Optimisation
      </div>

      <div
        style={{
          marginTop: "48px",
          maxWidth: "420px",
          color: "var(--muted)",
          lineHeight: 1.6,
          fontSize: "14px",
        }}
      >
        Private platform. Admin and member access only.
      </div>

      {showNotAdminError && (
        <div
          style={{
            marginTop: "24px",
            padding: "14px 20px",
            background: "rgba(200, 90, 74, 0.1)",
            border: "1px solid rgba(200, 90, 74, 0.3)",
            borderRadius: "6px",
            color: "var(--danger)",
            fontSize: "12px",
            maxWidth: "420px",
          }}
        >
          Your account is not authorised for admin access.
        </div>
      )}

      <div style={{ marginTop: "40px", display: "flex", gap: "12px" }}>
        <Link href="/login">
          <button className="btn-copper">Admin sign in</button>
        </Link>
      </div>
    </main>
  );
}
