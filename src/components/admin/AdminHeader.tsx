"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const breadcrumbs: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/projects/new": "New Project",
  "/admin/experience": "Experience",
  "/admin/internship": "Internship",
  "/admin/skills": "Skills",
  "/admin/profile": "Profile",
  "/admin/messages": "Messages",
};

export default function AdminHeader({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSignOut = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const pageTitle = Object.entries(breadcrumbs)
    .filter(([path]) => pathname.startsWith(path))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? "Admin";

  return (
    <header className="h-16 glass-nav flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Page title */}
      <div>
        <h2 className="font-display font-semibold text-[var(--text-primary)]">
          {pageTitle}
        </h2>
        <p className="text-xs text-[var(--text-muted)]">{userEmail}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        {mounted && (
          <motion.button
            id="admin-theme-toggle"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={resolvedTheme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        )}

        {/* Sign out */}
        <motion.button
          id="admin-signout-btn"
          onClick={handleSignOut}
          disabled={loggingOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-sm font-medium text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-50"
        >
          {loggingOut ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
            />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Sign Out</span>
        </motion.button>
      </div>
    </header>
  );
}
