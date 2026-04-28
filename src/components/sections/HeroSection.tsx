"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, GitFork, Link, Mail, Sparkles } from "lucide-react";

type Profile = {
  full_name: string;
  title: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  available: boolean;
} | null;

export default function HeroSection({ profile }: { profile: Profile }) {
  const name = profile?.full_name || "Crispian";
  const title = profile?.title || "Full-Stack Engineer";
  const bio = profile?.bio || "I craft high-performance, visually stunning web applications for global remote teams.";
  const isAvailable = profile?.available ?? true;

  const socialLinks = [
    {
      icon: GitFork,
      href: profile?.github_url || "https://github.com/crispian",
      label: "GitHub",
      id: "social-github",
    },
    {
      icon: Link,
      href: profile?.linkedin_url || "https://linkedin.com/in/crispian",
      label: "LinkedIn",
      id: "social-linkedin",
    },
    {
      icon: Mail,
      href: profile?.email ? `mailto:${profile.email}` : "mailto:crispian@example.com",
      label: "Email",
      id: "social-email",
    },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* ── Decorative Background Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="blob blob-1 absolute"
          style={{ top: "10%", left: "5%", opacity: 0.6 }}
        />
        <div
          className="blob blob-2 absolute"
          style={{ top: "30%", right: "10%", opacity: 0.5 }}
        />
        <div
          className="blob blob-3 absolute"
          style={{ bottom: "15%", left: "40%", opacity: 0.4 }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* ── Left: Text Content ── */}
          <div className="flex flex-col justify-center order-2 lg:order-1 py-12 lg:py-0">
            {/* Badge */}
            {isAvailable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 contact-tag px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] mb-6 w-fit"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#667eea]" />
                <span>Available for Remote Work</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </motion.div>
            )}

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight text-balance"
            >
              Hi, I&apos;m{" "}
              <span className="gradient-text">{name}</span>
            </motion.h1>

            {/* Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-3"
            >
              <p className="text-2xl sm:text-3xl font-semibold gradient-text-accent">
                {title}
              </p>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg"
            >
              {bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                id="hero-cta-contact"
                href="#contact"
                className="btn-primary px-7 py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-[#667eea]/25 flex items-center gap-2"
              >
                <span>Get In Touch</span>
                <Mail className="w-4 h-4 relative z-10" />
              </a>
              <a
                id="hero-cta-projects"
                href="#projects"
                className="btn-secondary px-7 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2"
              >
                View Projects
                <ArrowDown className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 flex items-center gap-4"
            >
              <span className="text-sm text-[var(--text-muted)]">Find me on:</span>
              {socialLinks.map(({ icon: Icon, href, label, id }) => (
                <motion.a
                  key={id}
                  id={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Hero Image ── */}
          <div className="relative flex items-end justify-center order-1 lg:order-2 lg:h-full">
            {/* Glow ring behind character */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-[#667eea]/30 to-[#f093fb]/20 blur-3xl" />

            {/* Additional blob behind image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full bg-gradient-to-br from-[#667eea]/20 via-[#764ba2]/15 to-[#f093fb]/20 blur-2xl" />
            </div>

            {/* Floating Character */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              className="relative z-10"
            >
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{
                  duration: 4.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <div className="relative hero-image-container" style={{ top: "20px" }}>
                  <Image
                    src="/hero.png"
                    alt={`${name} — ${title}`}
                    width={520}
                    height={620}
                    priority
                    className="hero-character object-contain w-auto"
                    style={{
                      maxHeight: "150vh",
                      width: "auto",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[var(--text-muted)] tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-[var(--text-muted)]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
