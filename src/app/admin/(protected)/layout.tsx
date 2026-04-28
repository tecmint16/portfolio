import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      <AdminSidebar userEmail={user.email ?? ""} />
      {/* Desktop: ml-64 (sidebar width). Mobile: ml-0 (sidebar is overlay) */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <AdminHeader userEmail={user.email ?? ""} />
        {/* pt-0 on desktop, pt-14 on mobile to avoid hamburger button overlap */}
        <main className="flex-1 p-4 pt-16 lg:pt-0 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

