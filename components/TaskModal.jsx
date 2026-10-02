'use client';
import { useEffect, useRef, useState } from 'react';
import { X, Plus, Flag, Tag, Save } from 'lucide-react';
import { PRIORITY_KEYS, PRIORITIES } from '@/lib/taskUtils';
import { tambahHari } from '@/lib/waktu';

const empty = { title: '', notes: '', priority: 'medium', dueDate: '', tags: [] };

const PILL_ACTIVE = {
  high: 'bg-error-container text-on-error-container border-error-container',
  medium: 'bg-tertiary-container/20 text-tertiary border-tertiary/40',
  low: 'bg-primary-container/10 text-primary border-primary/40',
};

// Modal tambah/edit task. `task` null = mode tambah.
export default function TaskModal({ open, task, hari, onClose, onSave }) {
  const [form, setForm] = useState(empty);
  const [tagInput, setTagInput] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm(task ? { notes: '', tags: [], ...task } : empty);
      setTagInput('');
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open, task]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput('');
  };
  const removeTag = (t) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, title: form.title.trim() });
  };

  const field =
    'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/30 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-modal"
      >
        {/* drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-outline-variant/50" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-4">
          <h2 id="judul-modal" className="text-lg font-semibold text-on-surface">{task ? 'Ubah tugas' : 'Tugas baru'}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-low">
            <X size={18} />
          </button>
        </div>

        <form id="form-tugas" onSubmit={submit} className="flex-1 space-y-5 overflow-y-auto p-6">
          <label className="block text-xs font-semibold text-on-surface-variant">Judul
            <input ref={titleRef} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Apa yang perlu dituntaskan?" className={`${field} mt-1.5 text-base`} required />
          </label>

          <label className="block text-xs font-semibold text-on-surface-variant">Catatan (opsional)
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={`${field} mt-1.5 resize-none`} />
          </label>

          {/* Prioritas — radio pills */}
          <div>
            <span className="mb-2 block text-xs font-semibold text-on-surface-variant" id="l-prioritas">Prioritas</span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="l-prioritas">
              {PRIORITY_KEYS.map((k) => {
                const active = form.priority === k;
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setForm({ ...form, priority: k })}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active ? PILL_ACTIVE[k] : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <Flag size={15} aria-hidden="true" /> {PRIORITIES[k].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jatuh tempo */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant">Jatuh tempo
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className={`${field} mt-1.5 cursor-pointer`} />
            </label>
            {hari && (
              <div className="mt-2 flex flex-wrap gap-2">
                {[['Hari ini', 0], ['Besok', 1], ['Pekan depan', 7]].map(([l, n]) => (
                  <button key={l} type="button" onClick={() => setForm({ ...form, dueDate: tambahHari(hari, n) })} aria-pressed={form.dueDate === tambahHari(hari, n)}
                    className="rounded-full border border-outline-variant px-3 py-1 text-xs font-semibold text-on-surface-variant hover:border-primary hover:text-primary">{l}</button>
                ))}
                {form.dueDate && <button type="button" onClick={() => setForm({ ...form, dueDate: '' })} className="rounded-full px-3 py-1 text-xs font-semibold text-on-surface-variant hover:text-error">Tanpa tenggat</button>}
              </div>
            )}
          </div>

          {/* Tag */}
          <div>
            <span className="mb-2 block text-xs font-semibold text-on-surface-variant" id="l-label">Label</span>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest p-2 transition focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              {form.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-md bg-surface-container-high px-2.5 py-1 text-xs font-medium text-on-surface">
                  <Tag size={12} className="text-on-surface-variant" aria-hidden="true" /> {t}
                  <button type="button" onClick={() => removeTag(t)} aria-label={`Hapus label ${t}`} className="ml-0.5 text-on-surface-variant hover:text-error">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Ketik label lalu Enter…"
                aria-labelledby="l-label"
                className="min-w-[100px] flex-1 border-none bg-transparent px-2 py-1 text-sm text-on-surface outline-none placeholder:text-outline"
              />
            </div>
          </div>
        </form>

        <footer className="flex justify-end gap-3 border-t border-outline-variant/30 bg-surface p-4">
          <button type="button" onClick={onClose} className="rounded-lg px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface-container-low">Batal</button>
          <button type="submit" form="form-tugas" className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:brightness-110">
            <Save size={16} aria-hidden="true" /> Simpan
          </button>
        </footer>
      </div>
    </div>
  );
}
