'use client';
import { useMemo, useState } from 'react';
import { Plus, X, ListTodo, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { PRIORITIES, PRIORITY_KEYS, isOverdue } from '@/lib/taskUtils';
import TopBar from './TopBar';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const initialTasks = [
  { id: 't1', title: 'Update proposal desain', notes: 'Revisi bagian harga dulu', priority: 'high', dueDate: '2026-06-20', tags: ['desain'], done: false, createdAt: 1718000004000 },
  { id: 't2', title: 'Meeting koordinasi tim', priority: 'medium', dueDate: '2026-06-25', tags: ['internal'], done: false, createdAt: 1718000003000 },
  { id: 't3', title: 'Olahraga 30 menit', priority: 'low', dueDate: '', tags: ['kesehatan'], done: false, createdAt: 1718000002000 },
  { id: 't4', title: 'Review dokumentasi API', priority: 'low', dueDate: '', tags: ['dev'], done: true, createdAt: 1718000001000 },
];

const STATUS = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'done', label: 'Selesai' },
];
const SORTS = [
  { key: 'created', label: 'Terbaru' },
  { key: 'due', label: 'Jatuh tempo' },
  { key: 'priority', label: 'Prioritas' },
];

function StatCard({ icon: Icon, label, value, accent, blob, highlight }) {
  return (
    <div className={`relative h-28 overflow-hidden rounded-xl border p-4 ${highlight ? 'border-error/20 bg-error-container' : 'border-outline-variant bg-surface-container-lowest'}`}>
      <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-bl-full ${blob}`} />
      <div className={`relative flex items-center gap-2 ${accent}`}>
        <Icon size={18} />
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      <div className={`relative mt-3 text-2xl font-bold ${highlight ? 'text-on-error-container' : 'text-on-surface'}`}>{value}</div>
    </div>
  );
}

export default function TaskManager() {
  const [tasks, setTasks, loaded] = useLocalStorage('tasks.manager.v2', initialTasks);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [tagFilter, setTagFilter] = useState(null);
  const [sort, setSort] = useState('created');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter((t) => !t.done).length,
    done: tasks.filter((t) => t.done).length,
    overdue: tasks.filter((t) => isOverdue(t)).length,
  }), [tasks]);

  const visible = useMemo(() => {
    let list = [...tasks];
    if (status === 'active') list = list.filter((t) => !t.done);
    if (status === 'done') list = list.filter((t) => t.done);
    if (priority !== 'all') list = list.filter((t) => t.priority === priority);
    if (tagFilter) list = list.filter((t) => t.tags?.includes(tagFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.title.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q) || t.tags?.some((tag) => tag.includes(q)));
    }
    list.sort((a, b) => {
      if (sort === 'priority') return PRIORITIES[b.priority].order - PRIORITIES[a.priority].order;
      if (sort === 'due') { if (!a.dueDate) return 1; if (!b.dueDate) return -1; return new Date(a.dueDate) - new Date(b.dueDate); }
      return b.createdAt - a.createdAt;
    });
    return list;
  }, [tasks, status, priority, tagFilter, search, sort]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (task) => { setEditing(task); setModalOpen(true); };
  const save = (data) => {
    if (editing) setTasks((p) => p.map((t) => (t.id === editing.id ? { ...t, ...data } : t)));
    else setTasks((p) => [{ id: `t-${Date.now()}`, done: false, createdAt: Date.now(), ...data }, ...p]);
    setModalOpen(false);
  };
  const toggle = (id) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTasks((p) => p.filter((t) => t.id !== id));

  const select = 'rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface-variant outline-none focus:border-primary';
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <TopBar query={search} onQuery={setSearch} />

      <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6">
        {/* Greeting */}
        <section className="mb-6">
          <p className="text-sm text-on-surface-variant">{today}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-on-surface">Halo, Pengguna!</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Anda memiliki {stats.active} tugas aktif{stats.overdue > 0 ? `, ${stats.overdue} terlambat` : ''}. Mari selesaikan.
          </p>
        </section>

        {/* Bento stats */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={ListTodo} label="Total" value={stats.total} accent="text-on-surface-variant" blob="bg-surface-container-low" />
          <StatCard icon={Activity} label="Aktif" value={stats.active} accent="text-primary" blob="bg-primary-container/10" />
          <StatCard icon={CheckCircle2} label="Selesai" value={stats.done} accent="text-secondary" blob="bg-surface-container-high" />
          <StatCard icon={AlertTriangle} label="Terlambat" value={stats.overdue} accent="text-on-error-container" blob="bg-error/10" highlight />
        </section>

        {/* Toolbar */}
        <section className="sticky top-[64px] z-30 -mx-4 mb-4 bg-background/90 px-4 py-2 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-1">
              {STATUS.map((s) => (
                <button key={s.key} onClick={() => setStatus(s.key)} className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${status === s.key ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  {s.label}
                </button>
              ))}
            </div>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className={select} aria-label="Filter prioritas">
              <option value="all">Semua prioritas</option>
              {PRIORITY_KEYS.map((k) => <option key={k} value={k}>{PRIORITIES[k].label}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${select} ml-auto`} aria-label="Urutkan">
              {SORTS.map((s) => <option key={s.key} value={s.key}>Urut: {s.label}</option>)}
            </select>
          </div>
          {tagFilter && (
            <button onClick={() => setTagFilter(null)} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-container/15 px-3 py-1 text-sm font-medium text-primary">
              Label: #{tagFilter} <X size={13} />
            </button>
          )}
        </section>

        {/* List */}
        {!loaded ? (
          <p className="py-12 text-center text-sm text-outline">Memuat…</p>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant py-16 text-center text-on-surface-variant">
            Tidak ada tugas yang cocok.
          </div>
        ) : (
          <ul className="space-y-2.5">
            {visible.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={toggle} onEdit={openEdit} onRemove={remove} onTagClick={setTagFilter} />
            ))}
          </ul>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={openAdd}
        aria-label="Tambah Tugas"
        className="group fixed bottom-8 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/30 transition hover:bg-primary-container active:scale-90"
      >
        <Plus size={28} className="transition-transform duration-300 group-hover:rotate-90" />
      </button>

      <TaskModal open={modalOpen} task={editing} onClose={() => setModalOpen(false)} onSave={save} />
    </div>
  );
}
