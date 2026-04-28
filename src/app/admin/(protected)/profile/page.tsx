"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Save, Loader2, AlertCircle, CheckCircle2, User } from "lucide-react";

type Profile = {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  available: boolean;
};

type FormData = Omit<Profile, "id">;

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Try to load profile by user_id first, fallback to any single profile
      const { data } = user
        ? await supabase.from("profiles").select("*").eq("user_id", user.id).limit(1).single()
        : await supabase.from("profiles").select("*").limit(1).single();

      if (data) {
        setProfile(data);
        const { id, ...rest } = data;
        void id;
        setForm(rest as FormData);
      } else {
        setForm({
          full_name: "",
          title: "",
          bio: "",
          location: "",
          avatar_url: "",
          github_url: "",
          linkedin_url: "",
          email: "",
          available: true,
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const payload = { ...form };

    let error;
    if (profile) {
      ({ error } = await supabase.from("profiles").update(payload).eq("id", profile.id));
    } else {
      // First time — include user_id so RLS policy with owner check also passes
      ({ error } = await supabase.from("profiles").insert([{ ...payload, user_id: user?.id }]));
    }

    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({ text: "Profile saved successfully!", type: "success" });
    }
    setSaving(false);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#667eea]" />
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl gradient-text">Profile</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Edit your portfolio bio and personal information
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center overflow-hidden">
            {form.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-[#667eea]" />
            )}
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              {form.full_name || "Your Name"}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              {form.title || "Your Role"}
            </p>
          </div>
        </div>

        <form id="profile-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name + Title */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                required
                value={form.full_name}
                onChange={(e) => setForm((f) => f ? { ...f, full_name: e.target.value } : f)}
                placeholder="Crispian"
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Title / Role
              </label>
              <input
                value={form.title ?? ""}
                onChange={(e) => setForm((f) => f ? { ...f, title: e.target.value } : f)}
                placeholder="Full-Stack Engineer"
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Bio
            </label>
            <textarea
              rows={5}
              value={form.bio ?? ""}
              onChange={(e) => setForm((f) => f ? { ...f, bio: e.target.value } : f)}
              placeholder="Tell visitors about yourself..."
              className="form-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
            />
          </div>

          {/* Location + Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                value={form.location ?? ""}
                onChange={(e) => setForm((f) => f ? { ...f, location: e.target.value } : f)}
                placeholder="Indonesia"
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => setForm((f) => f ? { ...f, email: e.target.value } : f)}
                placeholder="you@example.com"
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* GitHub + LinkedIn */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={form.github_url ?? ""}
                onChange={(e) => setForm((f) => f ? { ...f, github_url: e.target.value } : f)}
                placeholder="https://github.com/..."
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={form.linkedin_url ?? ""}
                onChange={(e) => setForm((f) => f ? { ...f, linkedin_url: e.target.value } : f)}
                placeholder="https://linkedin.com/in/..."
                className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Avatar URL
            </label>
            <input
              type="url"
              value={form.avatar_url ?? ""}
              onChange={(e) => setForm((f) => f ? { ...f, avatar_url: e.target.value } : f)}
              placeholder="https://... or Supabase Storage URL"
              className="form-input w-full px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Available toggle */}
          <div className="flex items-center gap-3 p-4 rounded-xl glass border border-white/10">
            <input
              id="available-toggle"
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((f) => f ? { ...f, available: e.target.checked } : f)}
              className="w-4 h-4 rounded accent-[#667eea]"
            />
            <label htmlFor="available-toggle" className="flex-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Available for Remote Work
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Shows the availability badge on your portfolio hero section
              </p>
            </label>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 text-sm p-3 rounded-xl ${
                message.type === "success"
                  ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
                  : "text-red-400 bg-red-400/10 border border-red-400/20"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {message.text}
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            id="profile-save-btn"
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
            className="btn-primary w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin relative z-10" />
            ) : (
              <Save className="w-4 h-4 relative z-10" />
            )}
            <span>{saving ? "Saving..." : "Save Profile"}</span>
          </motion.button>
        </form>
      </div>
    </div>
  );
}
