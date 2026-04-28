"use client";

import { motion } from "framer-motion";
import { Code2, Heart } from "lucide-react";

export default function Footer() {
  return (
    // <footer className="relative py-10 section-bg-alt">
    <footer className="relative section-bg-alt">
      <div className="section-divider mb-0" />
      <div className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10"
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold gradient-text">
              Crispian
            </span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[var(--text-muted)] flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400 inline" />{" "}
            using Next.js, Tailwind &amp; Supabase
          </p>

          {/* Nav */}
          <nav className="flex gap-5">
            {["#about", "#skills", "#projects", "#contact"].map((href) => (
              <a
                key={href}
                href={href}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors capitalize"
              >
                {href.replace("#", "")}
              </a>
            ))}
          </nav>
        </motion.div>
      </div>
    </footer>
  );
}
