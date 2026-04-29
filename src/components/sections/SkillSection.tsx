"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  color: string;
};

// Category display metadata
const CATEGORY_META: Record<string, { emoji: string }> = {
  Frontend: { emoji: "🎨" },
  Backend: { emoji: "⚙️" },
  DevOps: { emoji: "🚀" },
  Mobile_Development: { emoji: "📱" },
  Tools: { emoji: "🛠️" },
  Other: { emoji: "💡" },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function SkillBar({ skill, delay }: { skill: Skill; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-[var(--text-secondary)]">{skill.name}</span>
        <span className="text-[var(--text-muted)]">{skill.level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 dark:bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: skill.color }}
        />
      </div>
    </div>
  );
}

// Static fallback if no DB data
const fallbackSkills: Skill[] = [
  { id: "f1", name: "Next.js", category: "Frontend", level: 90, color: "#667eea" },
  { id: "f2", name: "React", category: "Frontend", level: 92, color: "#667eea" },
  { id: "f3", name: "TypeScript", category: "Frontend", level: 88, color: "#764ba2" },
  { id: "f4", name: "Tailwind CSS", category: "Frontend", level: 95, color: "#f093fb" },
  { id: "f5", name: "Supabase", category: "Backend", level: 85, color: "#06b6d4" },
  { id: "f6", name: "PostgreSQL", category: "Backend", level: 80, color: "#6366f1" },
  { id: "f7", name: "Node.js", category: "Backend", level: 82, color: "#06b6d4" },
  { id: "f8", name: "Vercel", category: "DevOps", level: 90, color: "#f093fb" },
  { id: "f9", name: "Docker", category: "DevOps", level: 72, color: "#f5576c" },
  { id: "f10", name: "Git", category: "DevOps", level: 92, color: "#f5576c" },
  { id: "f11", name: "VS Code", category: "Tools", level: 95, color: "#ffd700" },
  { id: "f12", name: "Figma", category: "Tools", level: 75, color: "#ff8c00" },
];

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
}

export default function SkillSection({ skills }: { skills: Skill[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const displaySkills = skills.length > 0 ? skills : fallbackSkills;
  const grouped = groupByCategory(displaySkills);

  return (
    // <section id="skills" ref={ref} className="relative py-24 overflow-hidden">
    <section id="skills" ref={ref} className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#667eea]/8 via-[#764ba2]/6 to-[#f093fb]/8 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={cardVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase contact-tag text-[#667eea] mb-4">
              Expertise
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl gradient-text">
              Skills &amp; Technologies
            </h2>
            <p className="mt-4 text-[var(--text-muted)] max-w-xl mx-auto">
              A curated stack I use to build modern, performant, and scalable
              web applications.
            </p>
          </motion.div>

          {/* Skill Categories Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(grouped).map(([category, categorySkills], ci) => {
              const meta = CATEGORY_META[category] ?? { emoji: "💡" };
              return (
                <motion.div
                  key={category}
                  variants={cardVariants}
                  custom={ci}
                  className="skill-badge rounded-2xl p-6 space-y-5 group cursor-default"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg"
                      style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))" }}
                    >
                      <span>{meta.emoji}</span>
                    </div>
                    <h3 className="font-display font-semibold text-[var(--text-primary)]">{category}</h3>
                  </div>

                  {/* Skill Bars */}
                  <div className="space-y-3">
                    {categorySkills.map((skill, si) => (
                      <SkillBar key={skill.id} skill={skill} delay={si * 0.1 + ci * 0.05} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
