import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { isAdminUser } from "@/lib/admin-auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;
  if (!token) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user || !isAdminUser(user)) return null;
  return user;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if we're on the login page to avoid redirect loop
  // (x-pathname is set by src/proxy.ts)
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname.includes("/admin/login");

  const user = await getUser();

  if (!user && !isLoginPage) {
    redirect("/admin/login");
  }

  // Login page renders without the AdminShell wrapper
  if (!user && isLoginPage) {
    return <>{children}</>;
  }

  return <AdminShell userEmail={user?.email || "admin"}>{children}</AdminShell>;
}
