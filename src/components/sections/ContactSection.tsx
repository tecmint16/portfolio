"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Send,
  Mail,
  MapPin,
  Link,
  GitFork,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";

type Profile = {
  full_name: string;
  email: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
} | null;

type FormState = "idle" | "loading" | "success" | "error";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function ContactSection({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert([{
        name: form.name,
        email: form.email,
        message: form.message,
      }]);
      if (error) throw error;
      setFormState("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setFormState("error");
    }
  };

  const contactEmail = profile?.email || "crispian@example.com";
  const contactLocation = profile?.location ? `${profile.location} (Remote Worldwide)` : "Indonesia (Remote Worldwide)";
  const githubUrl = profile?.github_url || "https://github.com/crispian";
  const linkedinUrl = profile?.linkedin_url || "https://linkedin.com/in/crispian";
  const githubLabel = profile?.github_url ? profile.github_url.replace("https://", "") : "github.com/crispian";
  const linkedinLabel = profile?.linkedin_url ? profile.linkedin_url.replace("https://", "") : "linkedin.com/in/crispian";

  return (
    // <section id="contact" ref={ref} className="relative py-24 overflow-hidden">
    <section id="contact" ref={ref} className="relative overflow-hidden">
      <div className="section-divider mb-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#f093fb]/10 to-[#667eea]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-[#06b6d4]/10 to-[#764ba2]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase contact-tag text-[#667eea] mb-4">
              Contact
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl gradient-text">
              Let&apos;s Work Together
            </h2>
            <p className="mt-4 text-[var(--text-muted)] max-w-xl mx-auto">
              Have a project in mind or a remote opportunity? I&apos;d love to
              hear from you. Let&apos;s create something amazing together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Left: Info */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              {/* Info Cards */}
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: contactEmail,
                  href: `mailto:${contactEmail}`,
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: contactLocation,
                  href: undefined,
                },
                {
                  icon: Link,
                  label: "LinkedIn",
                  value: linkedinLabel,
                  href: linkedinUrl,
                },
                {
                  icon: GitFork,
                  label: "GitHub",
                  value: githubLabel,
                  href: githubUrl,
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#667eea]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[var(--text-primary)] hover:text-[#667eea] transition-colors truncate block"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Response time */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Quick Responder
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  Typically responds within{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    24 hours
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-3"
            >
              <div className="glass-card rounded-2xl p-8">
                {formState === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                    <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-[var(--text-muted)]">
                      Thank you for reaching out. I&apos;ll get back to you
                      within 24 hours.
                    </p>
                    <button
                      onClick={() => setFormState("idle")}
                      className="mt-6 btn-secondary px-6 py-2.5 rounded-xl text-sm font-semibold"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2"
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="form-input w-full px-4 py-3 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="form-input w-full px-4 py-3 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project or opportunity..."
                        className="form-input w-full px-4 py-3 rounded-xl text-sm resize-none"
                      />
                    </div>

                    {formState === "error" && (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Something went wrong. Please try again.
                      </div>
                    )}

                    <motion.button
                      id="contact-submit"
                      type="submit"
                      disabled={formState === "loading"}
                      whileHover={{ scale: formState === "loading" ? 1 : 1.02 }}
                      whileTap={{ scale: formState === "loading" ? 1 : 0.98 }}
                      className="btn-primary w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {formState === "loading" ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full relative z-10"
                          />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4 relative z-10" />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
