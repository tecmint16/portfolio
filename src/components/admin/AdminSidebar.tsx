"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  User,
  MessageSquare,
  ChevronLeft,
  Code2,
  ExternalLink,
  Menu,
  X,
  Zap,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { href: "/admin/experience", icon: Briefcase, label: "Experience" },
  { href: "/admin/internship", icon: GraduationCap, label: "Internship" },
  { href: "/admin/skills", icon: Zap, label: "Skills" },
  { href: "/admin/profile", icon: User, label: "Profile" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  // Desktop: collapsed state; Mobile: open/closed overlay
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 h-16 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center flex-shrink-0">
          <Code2 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-sm gradient-text truncate">Admin Panel</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{userEmail}</p>
          </div>
        )}
        {/* Desktop collapse button */}
        <button
          id="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex ml-auto w-6 h-6 rounded-md items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn("w-3.5 h-3.5 transition-transform duration-300", collapsed && "rotate-180")}
          />
        </button>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden ml-auto w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              id={`sidebar-${item.label.toLowerCase().replace(" ", "-")}`}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/10 text-[var(--text-primary)] border border-[#667eea]/20"
                  : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn("w-4 h-4 flex-shrink-0", isActive && "text-[#667eea]")}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#667eea] flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer: Back to Portfolio */}
      <div className="p-2 border-t border-white/10 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-colors"
          title={collapsed ? "View Portfolio" : undefined}
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>View Portfolio</span>}
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 bottom-0 z-40 flex-col transition-all duration-300 glass-nav border-r border-white/10",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <NavContent />
      </aside>

      {/* ── Mobile: Hamburger trigger (inside header area) ── */}
      <button
        id="sidebar-mobile-btn"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shadow-lg"
        aria-label="Open sidebar"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* ── Mobile: Overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: Sidebar panel ── */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col w-72 glass-nav border-r border-white/10 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>
    </>
  );
}
