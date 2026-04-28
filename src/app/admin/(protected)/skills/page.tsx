"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  color: string;
  order_index: number;
};

type FormData = Omit<Skill, "id">;

const CATEGORIES = ["Frontend", "Backend", "DevOps", "Tools", "Other"];
const COLOR_PRESETS = [
  { label: "Indigo", value: "#667eea" },
  { label: "Purple", value: "#764ba2" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Pink", value: "#f093fb" },
  { label: "Orange", value: "#ff8c00" },
  { label: "Emerald", value: "#10b981" },
];

const emptyForm: FormData = {
  name: "",
  category: "Frontend",
  level: 80,
  color: "#667eea",
  order_index: 0,
};

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg glass-card ${
        type === "success" ? "text-emerald-400 border-emerald-400/20" : "text-red-400 border-red-400/20"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </motion.div>
  );
}

function SkillModal({
  skill,
  onClose,
  onSaved,
}: {
  skill: Skill | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!skill;
  const [form, setForm] = useState<FormData>(skill ? { name: skill.name, category: skill.category, level: skill.level, color: skill.color, order_index: skill.order_index } : emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error } = isEdit
      ? await supabase.from("skills").update(form).eq("id", skill!.id)
      : await supabase.from("skills").insert([form]);
    if (error) { setError(error.message); setSaving(false); return; }
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative glass-card rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl gradient-text">{isEdit ? "Edit Skill" : "New Skill"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Skill Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. React, TypeScript, Docker"
              className="form-input w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="form-input w-full px-4 py-2.5 rounded-xl text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Proficiency Level: <span className="text-[#667eea]">{form.level}%</span>
            </label>
            <input type="range" min={0} max={100} step={5} value={form.level}
              onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
              className="w-full accent-[#667eea]" />
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Bar Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map(preset => (
                <button key={preset.value} type="button"
                  onClick={() => setForm(f => ({ ...f, color: preset.value }))}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${form.color === preset.value ? "border-white scale-110" : "border-transparent"}`}
                  style={{ background: preset.value }} title={preset.label} />
              ))}
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" title="Custom color" />
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Display Order</label>
            <input type="number" min={0} value={form.order_index}
              onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))}
              className="form-input w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl bg-red-400/10 border border-red-400/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }}
              className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin relative z-10" /> : <Save className="w-4 h-4 relative z-10" />}
              <span>{saving ? "Saving..." : isEdit ? "Update" : "Add Skill"}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Group skills by category for display
function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalSkill, setModalSkill] = useState<Skill | null | "new">(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("skills").select("*").order("category").order("order_index");
    if (data) setSkills(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) { showToast(error.message, "error"); }
    else { showToast("Skill deleted.", "success"); fetchSkills(); }
    setDeletingId(null);
  };

  const grouped = groupByCategory(skills);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl gradient-text">Skills</h1>
          <p className="text-sm text-[var(--text-muted)]">{skills.length} skill{skills.length !== 1 ? "s" : ""} across {Object.keys(grouped).length} categories</p>
        </div>
        <motion.button id="new-skill-btn" onClick={() => setModalSkill("new")}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4 relative z-10" />
          <span>Add Skill</span>
        </motion.button>
      </div>

      {/* Skills grouped by category */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#667eea]" /></div>
      ) : skills.length === 0 ? (
        <div className="glass-card rounded-2xl py-16 text-center">
          <p className="text-[var(--text-muted)] text-sm">No skills yet.</p>
          <button onClick={() => setModalSkill("new")} className="mt-3 text-[#667eea] text-sm hover:underline">Add your first skill →</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <div key={category} className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] uppercase tracking-wider">{category}</h3>
              <div className="space-y-3">
                {categorySkills.map(skill => (
                  <div key={skill.id} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">{skill.name}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModalSkill(skill)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[#667eea] transition-colors">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDelete(skill.id)} disabled={deletingId === skill.id}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 transition-colors disabled:opacity-50">
                          {deletingId === skill.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        </button>
                        <span className="text-xs text-[var(--text-muted)] ml-1">{skill.level}%</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] group-hover:hidden">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%`, background: skill.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalSkill !== null && (
          <SkillModal
            skill={modalSkill === "new" ? null : modalSkill}
            onClose={() => setModalSkill(null)}
            onSaved={() => { showToast(modalSkill === "new" ? "Skill added!" : "Skill updated!", "success"); fetchSkills(); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast {...toast} />}
      </AnimatePresence>
    </div>
  );
}
