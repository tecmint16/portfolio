"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Mail, Trash2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markRead = async (id: string, read: boolean) => {
    const supabase = createClient();
    await supabase.from("contact_messages").update({ read }).eq("id", id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read } : m))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setDeletingId(null);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl gradient-text">Messages</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {unreadCount > 0 ? (
              <span className="text-[#667eea] font-semibold">{unreadCount} unread</span>
            ) : (
              "All messages read"
            )}{" "}
            · {messages.length} total
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#667eea]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-muted)] text-sm">No messages yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`transition-colors ${!msg.read ? "bg-[#667eea]/5" : ""}`}
              >
                <div className="flex items-start gap-4 px-5 py-4">
                  {/* Unread indicator */}
                  <div className="mt-1 flex-shrink-0">
                    {!msg.read ? (
                      <div className="w-2 h-2 rounded-full bg-[#667eea]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-transparent" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Sender info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-[var(--text-primary)]">
                        {msg.name}
                      </p>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-[#667eea] hover:underline"
                      >
                        {msg.email}
                      </a>
                      <span className="text-xs text-[var(--text-muted)] ml-auto">
                        {new Date(msg.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Message preview / expanded */}
                    <div className="mt-1">
                      {expandedId === msg.id ? (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap"
                        >
                          {msg.message}
                        </motion.p>
                      ) : (
                        <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                          {msg.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Expand/collapse */}
                    <button
                      id={`expand-msg-${msg.id}`}
                      onClick={() => {
                        setExpandedId(expandedId === msg.id ? null : msg.id);
                        if (!msg.read) markRead(msg.id, true);
                      }}
                      className="w-7 h-7 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      aria-label="Expand message"
                    >
                      {expandedId === msg.id ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Mark read/unread */}
                    <button
                      id={`toggle-read-${msg.id}`}
                      onClick={() => markRead(msg.id, !msg.read)}
                      className="w-7 h-7 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-emerald-400 transition-colors"
                      aria-label={msg.read ? "Mark unread" : "Mark read"}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${msg.read ? "text-emerald-400" : ""}`} />
                    </button>

                    {/* Delete */}
                    <button
                      id={`delete-msg-${msg.id}`}
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className="w-7 h-7 rounded-lg glass flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 transition-colors disabled:opacity-50"
                      aria-label="Delete message"
                    >
                      {deletingId === msg.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
