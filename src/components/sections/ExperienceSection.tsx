"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, MapPin, Calendar, CheckCircle2 } from "lucide-react";

type Experience = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  tech_stack: string[] | null;
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function TimelineItem({ exp, index }: { exp: Experience; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay: index * 0.1 }}
      className="relative flex gap-6 group"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 group-hover:scale-110 ${exp.current
          ? "bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-lg shadow-[#667eea]/30"
          : "bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20"
          }`}>
          <Briefcase className={`w-4 h-4 ${exp.current ? "text-white" : "text-[#667eea]"}`} />
        </div>
        {/* Vertical connector */}
        <div className="w-px flex-1 bg-gradient-to-b from-[#667eea]/40 to-transparent mt-2 min-h-[20px]" />
      </div>

      {/* Card */}
      <div className="glass-card rounded-2xl p-6 flex-1 mb-6 group-hover:border-[#667eea]/20 transition-colors">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{exp.role}</h3>
              {exp.current && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Current
                </span>
              )}
            </div>
            <p className="font-semibold text-[#667eea]">{exp.company}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(exp.start_date)} — {exp.current ? "Present" : exp.end_date ? formatDate(exp.end_date) : "—"}
          </span>
          {exp.location && (
            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
              <MapPin className="w-3.5 h-3.5" />
              {exp.location}
            </span>
          )}
        </div>

        {/* Description */}
        {exp.description && (
          <div className="mt-4 space-y-2">
            {exp.description.split("\n").filter(Boolean).map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#667eea] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        {(exp.tech_stack ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {(exp.tech_stack ?? []).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-medium contact-tag text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Default static experiences when no DB data
const defaultExperiences: Experience[] = [
  {
    id: "default-1",
    company: "Your Company",
    role: "Full-Stack Engineer",
    location: "Remote",
    start_date: "2022-01-01",
    end_date: null,
    current: true,
    description: "Add your work experience through the admin dashboard.",
    tech_stack: ["Next.js", "TypeScript", "Supabase"],
  },
];

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const displayExperiences = experiences.length > 0 ? experiences : defaultExperiences;

  return (
    // <section id="experience" ref={ref} className="relative py-24 overflow-hidden">
    <section id="experience" ref={ref} className="relative overflow-hidden">
      <div className="section-divider mb-0" />

      {/* Background */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#764ba2]/10 to-[#667eea]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-[#06b6d4]/8 to-[#667eea]/8 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase contact-tag text-[#667eea] mb-4">
              Career
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl gradient-text">
              Work Experience
            </h2>
            <p className="mt-4 text-[var(--text-muted)] max-w-xl mx-auto">
              My professional journey and the impact I&apos;ve made along the way.
            </p>
          </motion.div>

          {/* Timeline */}
          <div>
            {displayExperiences.map((exp, i) => (
              <TimelineItem key={exp.id} exp={exp} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
