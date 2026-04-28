"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Code2, ChevronDown, Briefcase, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SimpleLink = { type: "link"; href: string; label: string };
type DropdownLink = {
  type: "dropdown";
  label: string;
  icon?: React.ElementType;
  items: { href: string; label: string; icon: React.ElementType; description: string }[];
};
type NavItem = SimpleLink | DropdownLink;

const navItems: NavItem[] = [
  {
    type: "dropdown",
    label: "Career",
    items: [
      { href: "#experience", label: "Work Experience", icon: Briefcase, description: "Professional work history" },
      { href: "#internship", label: "Internship", icon: GraduationCap, description: "Magang & training programs" },
    ],
  },
  { type: "link", href: "#skills", label: "Skills" },
  { type: "link", href: "#projects", label: "Projects" },
  { type: "link", href: "#contact", label: "Contact" },
];

// All mobile nav links (flattened)
const mobileLinks = [
  { href: "#experience", label: "Work Experience" },
  { href: "#internship", label: "Internship" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function CareerDropdown({ item }: { item: DropdownLink }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id="nav-career-dropdown"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 dark:hover:bg-white/5"
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-64 glass-nav rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 p-1"
          >
            {item.items.map((subItem) => (
              <a
                key={subItem.href}
                href={subItem.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/8 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:from-[#667eea]/30 group-hover:to-[#764ba2]/30 transition-all">
                  <subItem.icon className="w-4 h-4 text-[#667eea]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{subItem.label}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{subItem.description}</p>
                </div>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">Crispian</span>
            </motion.a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item, i) =>
                item.type === "dropdown" ? (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.3 }}
                  >
                    <CareerDropdown item={item} />
                  </motion.div>
                ) : (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.3 }}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 dark:hover:bg-white/5"
                  >
                    {item.label}
                  </motion.a>
                )
              )}
            </nav>

            {/* Right: theme + hire me + mobile */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              {mounted && (
                <motion.button
                  id="theme-toggle"
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={resolvedTheme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              )}

              {/* Hire Me Button */}
              <motion.a
                href="#contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="hidden md:flex btn-primary px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
              >
                <span>Hire Me</span>
              </motion.a>

              {/* Mobile Hamburger */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--text-secondary)]"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 glass-nav px-4 py-4 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {/* Career section label */}
              <p className="px-4 pt-1 pb-0.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Career</p>
              {mobileLinks.slice(0, 2).map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors">
                  {link.href === "#experience" ? <Briefcase className="w-4 h-4 text-[#667eea]" /> : <GraduationCap className="w-4 h-4 text-[#f093fb]" />}
                  {link.label}
                </a>
              ))}
              <div className="my-1 border-t border-white/10" />
              {mobileLinks.slice(2).map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors">
                  {link.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setMobileOpen(false)}
                className="btn-primary mt-2 px-4 py-3 rounded-lg text-sm font-semibold text-center">
                <span>Hire Me</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
