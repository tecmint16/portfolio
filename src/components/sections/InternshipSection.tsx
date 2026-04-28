"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, MapPin, Calendar, Lightbulb } from "lucide-react";

type Internship = {
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

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function InternshipItem({ entry, index }: { entry: Internship; index: number }) {
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
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 group-hover:scale-110 ${entry.current
          ? "bg-gradient-to-br from-[#f093fb] to-[#764ba2] shadow-lg shadow-[#f093fb]/30"
          : "bg-gradient-to-br from-[#f093fb]/20 to-[#764ba2]/20"
          }`}>
          <GraduationCap className={`w-4 h-4 ${entry.current ? "text-white" : "text-[#f093fb]"}`} />
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-[#f093fb]/40 to-transparent mt-2 min-h-[20px]" />
      </div>

      {/* Card */}
      <div className="glass-card rounded-2xl p-6 flex-1 mb-6 group-hover:border-[#f093fb]/20 transition-colors">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{entry.role}</h3>
              {entry.current && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f093fb]/10 text-[#f093fb] border border-[#f093fb]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f093fb] animate-pulse" />
                  Ongoing
                </span>
              )}
            </div>
            <p className="font-semibold text-[#f093fb]">{entry.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(entry.start_date)} — {entry.current ? "Present" : entry.end_date ? formatDate(entry.end_date) : "—"}
          </span>
          {entry.location && (
            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
              <MapPin className="w-3.5 h-3.5" />
              {entry.location}
            </span>
          )}
        </div>

        {entry.description && (
          <div className="mt-4 space-y-2">
            {entry.description.split("\n").filter(Boolean).map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#f093fb] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        )}

        {(entry.tech_stack ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {(entry.tech_stack ?? []).map((tech) => (
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

const defaultInternships: Internship[] = [
  {
    id: "default-intern-1",
    company: "Your Company",
    role: "Frontend Intern",
    location: "Remote",
    start_date: "2023-01-01",
    end_date: "2023-06-30",
    current: false,
    description: "Add your internship experience through the admin dashboard.",
    tech_stack: ["React", "TypeScript"],
  },
];

export default function InternshipSection({ internships }: { internships: Internship[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const display = internships.length > 0 ? internships : defaultInternships;

  return (
    // <section id="internship" ref={ref} className="relative py-24 section-bg-alt overflow-hidden">
    <section id="internship" ref={ref} className="relative section-bg-alt overflow-hidden">
      <div className="section-divider mb-0" />

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#f093fb]/10 to-[#764ba2]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-[#667eea]/8 to-[#f093fb]/8 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase contact-tag text-[#f093fb] mb-4">
            Internship
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl gradient-text">
            Magang &amp; Internship
          </h2>
          <p className="mt-4 text-[var(--text-muted)] max-w-xl mx-auto">
            Perjalanan belajar dan pengalaman magang saya di industri nyata.
          </p>
        </motion.div>

        {/* Timeline */}
        <div>
          {display.map((entry, i) => (
            <InternshipItem key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
