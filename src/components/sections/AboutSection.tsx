"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Wifi, Calendar, Award } from "lucide-react";

type Profile = {
  full_name: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  available: boolean;
} | null;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function AboutSection({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const name = profile?.full_name || "Crispian";
  const location = profile?.location || "Indonesia";
  const isAvailable = profile?.available ?? true;

  // Bio: split on newlines or use as single paragraph if short
  const bioText = profile?.bio || null;

  const stats = [
    { icon: Calendar, label: "Years of Experience", value: "3+" },
    { icon: Award, label: "Projects Completed", value: "20+" },
    { icon: Wifi, label: "Remote Ready", value: "100%" },
    { icon: MapPin, label: "Based In", value: location },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 section-bg-alt overflow-hidden"
    >
      {/* Section divider */}
      <div className="section-divider mb-0" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#667eea]/10 to-[#f093fb]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-[#06b6d4]/10 to-[#667eea]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase contact-tag text-[#667eea] mb-4">
              About Me
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl gradient-text">
              Who I Am
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Bio */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="glass-card rounded-2xl p-8">
                {bioText ? (
                  /* Render bio from database — split by newlines into paragraphs */
                  bioText.split("\n").filter(Boolean).map((paragraph, i) => (
                    <p
                      key={i}
                      className={`text-lg leading-relaxed text-[var(--text-secondary)] ${i > 0 ? "mt-4" : ""}`}
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  /* Default fallback bio */
                  <>
                    <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                      I&apos;m{" "}
                      <span className="font-semibold text-[var(--text-primary)]">
                        {name}
                      </span>
                      , a passionate Full-Stack Software Engineer with a deep love
                      for building elegant, scalable, and high-performance web
                      applications.
                    </p>
                    <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">
                      My expertise spans the entire stack — from crafting pixel-perfect
                      UIs with{" "}
                      <span className="font-semibold text-[var(--text-primary)]">
                        Next.js &amp; TypeScript
                      </span>{" "}
                      to architecting robust backends with{" "}
                      <span className="font-semibold text-[var(--text-primary)]">
                        Supabase &amp; PostgreSQL
                      </span>
                      .
                    </p>
                    <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">
                      Currently targeting{" "}
                      <span className="font-semibold gradient-text">
                        global remote opportunities
                      </span>{" "}
                      where I can make a meaningful impact with modern technology.
                    </p>
                  </>
                )}
              </div>

              {/* Availability Badge */}
              {isAvailable && (
                <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[var(--bg-secondary)] animate-pulse" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">
                      Open to Remote Roles
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Full-time &amp; Contract · Worldwide
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right: Stats Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  custom={i}
                  className="glass-card rounded-2xl p-6 flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-[#667eea]" />
                  </div>
                  <p className="font-display font-bold text-3xl gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
