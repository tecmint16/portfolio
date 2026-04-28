import { createClient } from "@/utils/supabase/server";
import { LayoutDashboard, FolderOpen, User, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getDashboardStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [projectsRes, messagesRes] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact" }),
    supabase.from("contact_messages").select("id", { count: "exact" }),
  ]);

  return {
    projects: projectsRes.count ?? 0,
    messages: messagesRes.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const stats = await getDashboardStats(supabase);

  const quickLinks = [
    {
      href: "/admin/projects",
      icon: FolderOpen,
      label: "Manage Projects",
      desc: `${stats.projects} projects`,
      gradient: "from-[#667eea] to-[#764ba2]",
    },
    {
      href: "/admin/profile",
      icon: User,
      label: "Edit Profile",
      desc: "Bio & personal info",
      gradient: "from-[#06b6d4] to-[#6366f1]",
    },
    {
      href: "/admin/messages",
      icon: MessageSquare,
      label: "View Messages",
      desc: `${stats.messages} contact messages`,
      gradient: "from-[#f093fb] to-[#f5576c]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            Welcome back! 👋
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            {user?.email} · Last sign in: {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 contact-tag px-4 py-2 rounded-full text-xs font-semibold text-[#667eea]">
          <TrendingUp className="w-3.5 h-3.5" />
          Admin Mode
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Projects", value: stats.projects, icon: FolderOpen, color: "#667eea" },
          { label: "Contact Messages", value: stats.messages, icon: MessageSquare, color: "#f093fb" },
          { label: "Profile Status", value: "Active", icon: User, color: "#06b6d4" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${stat.color}20` }}
            >
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <p className="font-display font-bold text-3xl gradient-text">{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass-card rounded-2xl p-5 flex items-start gap-4 group"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.gradient} bg-opacity-20 flex items-center justify-center flex-shrink-0 shadow`}
                style={{ background: `linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))` }}
              >
                <link.icon className="w-5 h-5 text-[#667eea]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)] group-hover:gradient-text transition-all text-sm">
                  {link.label}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="glass-card rounded-2xl p-5 border border-[#667eea]/20">
        <div className="flex items-start gap-3">
          <LayoutDashboard className="w-5 h-5 text-[#667eea] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[var(--text-primary)] text-sm">Dashboard Overview</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Use the sidebar to navigate between sections. You can manage your projects (CRUD),
              edit your profile bio, and read contact messages sent from the portfolio form.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
