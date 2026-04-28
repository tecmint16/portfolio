"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, AlertCircle, CheckCircle2, GraduationCap, MapPin, Calendar } from "lucide-react";

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
  order_index: number;
};

type FormData = Omit<Internship, "id"> & { tech_stack_str: string };

const emptyForm: FormData = {
  company: "", role: "", location: "",
  start_date: "", end_date: "", current: false,
  description: "", tech_stack: [], tech_stack_str: "", order_index: 0,
};

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg glass-card ${
        type === "success" ? "text-emerald-400 border-emerald-400/20" : "text-red-400 border-red-400/20"
      }`}>
      {type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </motion.div>
  );
}

function InternshipModal({ entry, onClose, onSaved }: { entry: Internship | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!entry;
  const [form, setForm] = useState<FormData>(
    entry
      ? { ...entry, tech_stack_str: (entry.tech_stack ?? []).join(", "), location: entry.location ?? "", end_date: entry.end_date ?? "", description: entry.description ?? "" }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const payload = {
      company: form.company, role: form.role, location: form.location || null,
      start_date: form.start_date,
      end_date: form.current ? null : (form.end_date || null),
      current: form.current,
      description: form.description || null,
      tech_stack: form.tech_stack_str.split(",").map(s => s.trim()).filter(Boolean),
      order_index: form.order_index,
    };
    const { error } = isEdit
      ? await supabase.from("internships").update(payload).eq("id", entry!.id)
      : await supabase.from("internships").insert([payload]);
    if (error) { setError(error.message); setSaving(false); return; }
    onSaved(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative glass-card rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl gradient-text">{isEdit ? "Edit Internship" : "Add Internship"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Company / Instansi *</label>
              <input required value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                placeholder="PT. Example, Startup ABC..." className="form-input w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Role / Posisi *</label>
              <input required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                placeholder="Frontend Intern, UI/UX Intern..." className="form-input w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Lokasi</label>
            <input value={form.location ?? ""} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="Remote / Jakarta, Indonesia" className="form-input w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Tanggal Mulai *</label>
              <input required type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Tanggal Selesai</label>
              <input type="date" value={form.end_date ?? ""} disabled={form.current}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm disabled:opacity-40" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input id="current-intern" type="checkbox" checked={form.current}
              onChange={e => setForm(f => ({ ...f, current: e.target.checked, end_date: e.target.checked ? "" : f.end_date }))}
              className="w-4 h-4 rounded accent-[#f093fb]" />
            <label htmlFor="current-intern" className="text-sm font-medium text-[var(--text-secondary)]">Sedang berjalan (ongoing)</label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Deskripsi / Pencapaian</label>
            <textarea rows={4} value={form.description ?? ""}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder={"Apa yang kamu pelajari dan capai?\nGunakan baris baru untuk tiap poin."}
              className="form-input w-full px-4 py-2.5 rounded-xl text-sm resize-none" />
            <p className="text-xs text-[var(--text-muted)] mt-1">Tip: Setiap baris baru akan ditampilkan sebagai poin terpisah.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Tech Stack (pisahkan dengan koma)</label>
            <input value={form.tech_stack_str} onChange={e => setForm(f => ({ ...f, tech_stack_str: e.target.value }))}
              placeholder="React, Figma, Tailwind CSS" className="form-input w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Urutan Tampil</label>
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
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5 rounded-xl text-sm font-semibold">Batal</button>
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }}
              className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin relative z-10" /> : <Save className="w-4 h-4 relative z-10" />}
              <span>{saving ? "Menyimpan..." : isEdit ? "Update" : "Tambah"}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function AdminInternshipPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEntry, setModalEntry] = useState<Internship | null | "new">(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("internships").select("*").order("order_index").order("start_date", { ascending: false });
    if (data) setInternships(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchInternships(); }, [fetchInternships]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data magang ini?")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("internships").delete().eq("id", id);
    if (error) { showToast(error.message, "error"); }
    else { showToast("Data magang dihapus.", "success"); fetchInternships(); }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl gradient-text">Internship / Magang</h1>
          <p className="text-sm text-[var(--text-muted)]">{internships.length} data magang</p>
        </div>
        <motion.button id="new-internship-btn" onClick={() => setModalEntry("new")}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4 relative z-10" />
          <span>Tambah Magang</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#667eea]" /></div>
        ) : internships.length === 0 ? (
          <div className="glass-card rounded-2xl py-16 text-center">
            <p className="text-[var(--text-muted)] text-sm">Belum ada data magang.</p>
            <button onClick={() => setModalEntry("new")} className="mt-3 text-[#667eea] text-sm hover:underline">Tambah pengalaman magang pertama →</button>
          </div>
        ) : (
          internships.map(entry => (
            <div key={entry.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f093fb]/20 to-[#764ba2]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-5 h-5 text-[#f093fb]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[var(--text-primary)]">{entry.role}</p>
                      {entry.current && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-[#f093fb]/10 text-[#f093fb] border border-[#f093fb]/20 font-medium">Ongoing</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#f093fb]">{entry.company}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Calendar className="w-3 h-3" />
                        {formatDate(entry.start_date)} — {entry.current ? "Present" : entry.end_date ? formatDate(entry.end_date) : "—"}
                      </span>
                      {entry.location && (
                        <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <MapPin className="w-3 h-3" />{entry.location}
                        </span>
                      )}
                    </div>
                    {entry.description && (
                      <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-2">{entry.description}</p>
                    )}
                    {(entry.tech_stack ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(entry.tech_stack ?? []).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-md text-xs contact-tag text-[var(--text-secondary)]">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => setModalEntry(entry)}
                    className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-[#667eea] transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(entry.id)} disabled={deletingId === entry.id}
                    className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 transition-colors disabled:opacity-50">
                    {deletingId === entry.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {modalEntry !== null && (
          <InternshipModal
            entry={modalEntry === "new" ? null : modalEntry}
            onClose={() => setModalEntry(null)}
            onSaved={() => { showToast(modalEntry === "new" ? "Magang ditambahkan!" : "Data diperbarui!", "success"); fetchInternships(); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast {...toast} />}
      </AnimatePresence>
    </div>
  );
}
