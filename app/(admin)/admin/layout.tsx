import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import styles from "./admin.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get admin display name
  const { data: admin } = await supabase
    .from("admins")
    .select("full_name, email")
    .eq("user_id", user!.id)
    .maybeSingle();

  const displayName = admin?.full_name ?? admin?.email ?? "Admin";
  const initials = displayName
    .split(/\s+/)
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}>FOCUSTRT</div>
          <div className={styles.brandTag}>ADMIN</div>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>
            DASHBOARD
          </Link>
          <Link href="/admin/studies" className={styles.navItem}>
            STUDIES
          </Link>
          <div className={styles.navItemDisabled}>
            PODCASTS <span className={styles.soon}>STAGE 1B</span>
          </div>
          <div className={styles.navItemDisabled}>
            SCRIPT REVIEW <span className={styles.soon}>STAGE 1C</span>
          </div>
          <div className={styles.navItemDisabled}>
            PUBLISHING <span className={styles.soon}>STAGE 1E</span>
          </div>
          <Link href="/admin/forum" className={styles.navItem}>
            MEMBERS FORUM
          </Link>
        </nav>

        <div className={styles.user}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userMeta}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userTier}>Admin</div>
          </div>
        </div>

        <form action={signOut}>
          <button type="submit" className={styles.signOut}>
            Sign out
          </button>
        </form>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
