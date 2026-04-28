"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, ExternalLink, GitFork, Star, X, Save, Loader2, AlertCircle, CheckCircle2
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string | null;
  situation: string | null;
  result: string | null;
  tech_stack: string[] | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  order_index: number;
  created_at: string;
};

type FormData = Omit<Project, "id" | "created_at"> & { tech_stack_str: string };

const emptyForm: FormData = {
  title: "",
  description: "",
  situation: "",
  result: "",
  tech_stack: [],
  tech_stack_str: "",
  live_url: "",
  github_url: "",
  featured: false,
  order_index: 0,
};

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg glass-card ${
        type === "success"
          ? "text-emerald-400 border-emerald-400/20"
          : "text-red-400 border-red-400/20"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {message}
    </motion.div>
  );
}

function ProjectFormModal({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!project;
  const [form, setForm] = useState<FormData>(
    project
      ? {
          ...project,
          tech_stack_str: (project.tech_stack ?? []).join(", "),
          description: project.description ?? "",
          situation: project.situation ?? "",
          result: project.result ?? "",
          live_url: project.live_url ?? "",
          github_url: project.github_url ?? "",
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();

    // Get current user to populate owner_id
    const { data: { user } } = await supabase.auth.getUser();

    const payload = {
      title: form.title,
      description: form.description,
      situation: form.situation,
      result: form.result,
      tech_stack: form.tech_stack_str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      featured: form.featured,
      order_index: form.order_index,
    };

    const insertPayload = { ...payload, owner_id: user?.id };

    const { error } = isEdit
      ? await supabase.from("projects").update(payload).eq("id", project!.id)
      : await supabase.from("projects").insert([insertPayload]);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    onSaved();
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl gradient-text">
            {isEdit ? "Edit Project" : "New Project"}
          </h3>
          <button
            onClick={onClose}
            id="modal-close-btn"
            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Project title"
              className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief project description..."
              className="form-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
            />
          </div>

          {/* Situation + Result side by side */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Situation (STAR)
              </label>
              <textarea
                rows={3}
                value={form.situation ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, situation: e.target.value }))}
                placeholder="What was the problem?"
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Result (STAR)
              </label>
              <textarea
                rows={3}
                value={form.result ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
                placeholder="What was the outcome?"
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Tech Stack (comma separated)
            </label>
            <input
              value={form.tech_stack_str}
              onChange={(e) => setForm((f) => ({ ...f, tech_stack_str: e.target.value }))}
              placeholder="Next.js, TypeScript, Supabase, Vercel"
              className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* URLs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Live URL
              </label>
              <input
                type="url"
                value={form.live_url ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, live_url: e.target.value }))}
                placeholder="https://example.com"
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={form.github_url ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))}
                placeholder="https://github.com/..."
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Featured + Order */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                id="featured-checkbox"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 rounded accent-[#667eea]"
              />
              <label htmlFor="featured-checkbox" className="text-sm font-medium text-[var(--text-secondary)]">
                Featured Project
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={form.order_index}
                onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl bg-red-400/10 border border-red-400/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-2.5 rounded-xl text-sm font-semibold"
            >
              Cancel
            </button>
            <motion.button
              id="project-save-btn"
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin relative z-10" />
              ) : (
                <Save className="w-4 h-4 relative z-10" />
              )}
              <span>{saving ? "Saving..." : isEdit ? "Update" : "Create"}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalProject, setModalProject] = useState<Project | null | "new">(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && data) setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Project deleted.", "success");
      fetchProjects();
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl gradient-text">Projects</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <motion.button
          id="new-project-btn"
          onClick={() => setModalProject("new")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4 relative z-10" />
          <span>New Project</span>
        </motion.button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#667eea]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)] text-sm">No projects yet.</p>
            <button
              onClick={() => setModalProject("new")}
              className="mt-3 text-[#667eea] text-sm hover:underline"
            >
              Create your first project →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Project</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Stack</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Featured</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden lg:table-cell">Links</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-[var(--text-primary)]">{project.title}</p>
                      {project.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1 max-w-xs">
                          {project.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(project.tech_stack ?? []).slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md text-xs contact-tag text-[var(--text-secondary)]">
                            {t}
                          </span>
                        ))}
                        {(project.tech_stack ?? []).length > 3 && (
                          <span className="text-xs text-[var(--text-muted)]">+{(project.tech_stack ?? []).length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                            className="text-[var(--text-muted)] hover:text-[#667eea] transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                            className="text-[var(--text-muted)] hover:text-[#667eea] transition-colors">
                            <GitFork className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`edit-project-${project.id}`}
                          onClick={() => setModalProject(project)}
                          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-[#667eea] transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-project-${project.id}`}
                          onClick={() => handleDelete(project.id)}
                          disabled={deletingId === project.id}
                          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 transition-colors disabled:opacity-50"
                          aria-label="Delete"
                        >
                          {deletingId === project.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalProject !== null && (
          <ProjectFormModal
            project={modalProject === "new" ? null : modalProject}
            onClose={() => setModalProject(null)}
            onSaved={() => {
              showToast(
                modalProject === "new" ? "Project created!" : "Project updated!",
                "success"
              );
              fetchProjects();
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast {...toast} />}
      </AnimatePresence>
    </div>
  );
}
