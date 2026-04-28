"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, GitFork, Star, Zap } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  live_url: string | null;
  github_url: string | null;
  situation: string | null;
  result: string | null;
  featured: boolean;
  order_index: number;
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={cardVariants}
      className="glass-card rounded-2xl p-6 flex flex-col h-full group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#667eea]" />
          </div>
          {project.featured && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <GitFork className="w-4 h-4" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
        {project.title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 flex-1">
        {project.description}
      </p>

      {/* STAR Format */}
      {(project.situation || project.result) && (
        <div className="space-y-2 mb-5 p-4 rounded-xl bg-white/5 dark:bg-white/3 border border-white/10">
          {project.situation && (
            <div className="flex gap-2 text-xs">
              <span className="font-semibold text-[#667eea] w-16 flex-shrink-0">
                Situation:
              </span>
              <span className="text-[var(--text-muted)]">{project.situation}</span>
            </div>
          )}
          {project.result && (
            <div className="flex gap-2 text-xs">
              <span className="font-semibold text-emerald-400 w-16 flex-shrink-0">
                Result:
              </span>
              <span className="text-[var(--text-muted)]">{project.result}</span>
            </div>
          )}
        </div>
      )}

      {/* Tech Stack */}
      {(project.tech_stack ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {(project.tech_stack ?? []).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md text-xs font-medium contact-tag text-[var(--text-secondary)]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function ProjectSection({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    // <section
    //   id="projects"
    //   ref={ref}
    //   className="relative py-24 section-bg-alt overflow-hidden"
    // >
    <section
      id="projects"
      ref={ref}
      className="relative section-bg-alt overflow-hidden"
    >
      <div className="section-divider" />
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#667eea]/10 to-[#06b6d4]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={cardVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase contact-tag text-[#667eea] mb-4">
              Portfolio
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl gradient-text">
              Featured Projects
            </h2>
            <p className="mt-4 text-[var(--text-muted)] max-w-xl mx-auto">
              Real-world projects built with STAR methodology — Situation,
              Task, Action, Result.
            </p>
          </motion.div>

          {/* Projects Grid or Empty State */}
          {projects.length === 0 ? (
            <motion.div variants={cardVariants} className="text-center py-16">
              <p className="text-[var(--text-muted)]">
                Projects coming soon. Stay tuned!
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* GitHub CTA */}
          <motion.div variants={cardVariants} className="mt-12 text-center">
            <a
              id="view-github"
              href="https://github.com/crispian"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-secondary px-6 py-3 rounded-xl font-semibold"
            >
              <GitFork className="w-4 h-4" />
              View All on GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
