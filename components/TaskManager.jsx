'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, X, Activity, CheckCircle2, AlertTriangle, CalendarClock, Pencil } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { fmtTanggal } from '@/lib/waktu';
import { KUNCI, KUNCI_NAMA, PRIORITIES, PRIORITY_KEYS, isOverdue, isDueToday, contoh, sapaan } from '@/lib/taskUtils';
import TopBar from './TopBar';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const STATUS = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'done', label: 'Selesai' },
];
const SORTS = [
  { key: 'due', label: 'Jatuh tempo' },
  { key: 'priority', label: 'Prioritas' },
  { key: 'created', label: 'Terbaru' },
];

function StatCard({ icon: Icon, label, value, accent, highlight, onClick, aktif }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={aktif}
      className={`relative h-24 overflow-hidden rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${aktif ? 'ring-2 ring-primary' : ''} ${highlight ? 'border-error/30 bg-error-container' : 'border-outline-variant bg-surface-container-lowest'}`}>
      <span className={`relative flex items-center gap-2 ${accent}`}><Icon size={17} aria-hidden="true" /><span className="text-[13px] font-semibold">{label}</span></span>
      <span className={`relative mt-2 block text-2xl font-bold ${highlight ? 'text-on-error-container' : 'text-on-surface'}`}>{value}</span>
    </button>
  );
}

export default function TaskManager() {
  const sp = useSearchParams();
  const { hari, sekarang } = useHariIni(300);
  const [tasks, setTasks, loaded] = useLocalStorage(KUNCI, null);
  const [nama, setNama] = useLocalStorage(KUNCI_NAMA, '');
  const [ubahNama, setUbahNama] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [cepat, setCepat] = useState(null); // 'today' | 'overdue'
  const [priority, setPriority] = useState('all');
  const [tagFilter, setTagFilter] = useState(null);
  const [sort, setSort] = useState('due');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { if (loaded && tasks === null) setTasks(contoh()); }, [loaded, tasks, setTasks]);
  // ?label= dari halaman Label.
  useEffect(() => { const l = sp.get('label'); if (l) { setTagFilter(l); setStatus('all'); } }, [sp]);

  const semua = tasks || [];
  const stats = useMemo(() => ({
    active: semua.filter((t) => !t.done).length,
    done: semua.filter((t) => t.done).length,
    today: semua.filter((t) => !t.done && isDueToday(t, hari)).length,
    overdue: semua.filter((t) => isOverdue(t, hari)).length,
  }), [semua, hari]);

  const visible = useMemo(() => {
    let list = [...semua];
    if (status === 'active') list = list.filter((t) => !t.done);
    if (status === 'done') list = list.filter((t) => t.done);
    if (cepat === 'today') list = list.filter((t) => !t.done && isDueToday(t, hari));
    if (cepat === 'overdue') list = list.filter((t) => isOverdue(t, hari));
    if (priority !== 'all') list = list.filter((t) => t.priority === priority);
    if (tagFilter) list = list.filter((t) => t.tags?.includes(tagFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q) || t.tags?.some((tag) => tag.includes(q)));
    }
    list.sort((a, b) => {
      if (sort === 'priority') return PRIORITIES[b.priority].order - PRIORITIES[a.priority].order;
      if (sort === 'due') { if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt; if (!a.dueDate) return 1; if (!b.dueDate) return -1; return a.dueDate.localeCompare(b.dueDate); }
      return b.createdAt - a.createdAt;
    });
    return list;
  }, [semua, status, cepat, priority, tagFilter, search, sort, hari]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (task) => { setEditing(task); setModalOpen(true); };
  const save = (data) => {
    if (editing) setTasks((p) => p.map((t) => (t.id === editing.id ? { ...t, ...data } : t)));
    else setTasks((p) => [{ id: `t-${Date.now()}`, done: false, createdAt: Date.now(), ...data }, ...p]);
    setModalOpen(false);
  };
  const toggle = (id) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done, doneAt: t.done ? null : new Date().toISOString() } : t)));
  const remove = (id) => { const t = semua.find((x) => x.id === id); if (window.confirm(`Hapus "${t?.title}"?`)) setTasks((p) => p.filter((x) => x.id !== id)); };
  const pilihCepat = (k) => { setCepat((c) => (c === k ? null : k)); setStatus('active'); };

  const select = 'rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:border-primary';
  const ada = cepat || priority !== 'all' || tagFilter || search.trim();

  return (
    <div className="min-h-screen bg-background">
      <TopBar query={search} onQuery={setSearch} />

      <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6">
        <section className="mb-6">
          <p className="text-sm text-on-surface-variant">{hari ? fmtTanggal(hari, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ' '}</p>
          {ubahNama ? (
            <form className="mt-1 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); setUbahNama(false); }}>
              <label className="flex-1"><span className="sr-only">Nama panggilan</span>
                <input autoFocus value={nama} onChange={(e) => setNama(e.target.value.slice(0, 24))} placeholder="Nama panggilan" className="w-full max-w-xs rounded-lg border border-primary bg-surface-container-lowest px-3 py-2 text-xl font-bold text-on-surface outline-none" />
              </label>
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary">Simpan</button>
            </form>
          ) : (
            <h1 className="mt-1 flex flex-wrap items-center gap-2 text-3xl font-bold tracking-tight text-on-surface">
              {sekarang ? sapaan(sekarang) : 'Halo'}{nama ? `, ${nama}` : ''}.
              <button type="button" onClick={() => setUbahNama(true)} aria-label="Atur nama panggilan" className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"><Pencil size={16} /></button>
            </h1>
          )}
          <p className="mt-1 text-sm text-on-surface-variant">
            {stats.active} tugas aktif{stats.today ? `, ${stats.today} jatuh tempo hari ini` : ''}{stats.overdue ? `, ${stats.overdue} terlambat` : ''}.
          </p>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Ringkasan">
          <StatCard icon={Activity} label="Aktif" value={stats.active} accent="text-primary" onClick={() => { setCepat(null); setStatus('active'); }} aktif={status === 'active' && !cepat} />
          <StatCard icon={CalendarClock} label="Hari ini" value={stats.today} accent="text-tertiary" onClick={() => pilihCepat('today')} aktif={cepat === 'today'} />
          <StatCard icon={AlertTriangle} label="Terlambat" value={stats.overdue} accent="text-on-error-container" highlight onClick={() => pilihCepat('overdue')} aktif={cepat === 'overdue'} />
          <StatCard icon={CheckCircle2} label="Selesai" value={stats.done} accent="text-secondary" onClick={() => { setCepat(null); setStatus('done'); }} aktif={status === 'done' && !cepat} />
        </section>

        <section className="sticky top-[64px] z-30 -mx-4 mb-4 bg-background/90 px-4 py-2 backdrop-blur-md" aria-label="Saringan">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-1" role="group" aria-label="Status">
              {STATUS.map((s) => (
                <button key={s.key} type="button" onClick={() => { setStatus(s.key); setCepat(null); }} aria-pressed={status === s.key}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${status === s.key ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  {s.label}
                </button>
              ))}
            </div>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className={select} aria-label="Saring prioritas">
              <option value="all">Semua prioritas</option>
              {PRIORITY_KEYS.map((k) => <option key={k} value={k}>{PRIORITIES[k].label}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${select} ml-auto`} aria-label="Urutkan">
              {SORTS.map((s) => <option key={s.key} value={s.key}>Urut: {s.label}</option>)}
            </select>
          </div>
          {(tagFilter || cepat) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tagFilter && <button type="button" onClick={() => setTagFilter(null)} className="inline-flex items-center gap-1.5 rounded-full bg-primary-container/15 px-3 py-1 text-sm font-medium text-primary">Label: #{tagFilter} <X size={13} aria-hidden="true" /><span className="sr-only">hapus saringan</span></button>}
              {cepat && <button type="button" onClick={() => setCepat(null)} className="inline-flex items-center gap-1.5 rounded-full bg-primary-container/15 px-3 py-1 text-sm font-medium text-primary">{cepat === 'today' ? 'Jatuh tempo hari ini' : 'Terlambat'} <X size={13} aria-hidden="true" /><span className="sr-only">hapus saringan</span></button>}
            </div>
          )}
        </section>

        <h2 className="sr-only">Daftar tugas</h2>
        {!loaded || tasks === null ? (
          <p className="py-12 text-center text-sm text-on-surface-variant">Memuat…</p>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant py-16 text-center text-on-surface-variant">
            {ada ? 'Tidak ada tugas yang cocok dengan saringan.' : status === 'done' ? 'Belum ada tugas yang selesai.' : 'Semua tuntas. Tambah tugas baru dengan tombol +.'}
          </div>
        ) : (
          <ul className="space-y-2.5">
            {visible.map((task) => (
              <TaskCard key={task.id} task={task} hari={hari} onToggle={toggle} onEdit={openEdit} onRemove={remove} onTagClick={(t) => { setTagFilter(t); setStatus('all'); }} />
            ))}
          </ul>
        )}
      </main>

      <button type="button" onClick={openAdd} aria-label="Tambah tugas"
        className="group fixed bottom-8 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/30 transition hover:bg-primary-container active:scale-90">
        <Plus size={28} className="transition-transform duration-300 group-hover:rotate-90" />
      </button>

      <TaskModal open={modalOpen} task={editing} hari={hari} onClose={() => setModalOpen(false)} onSave={save} />
    </div>
  );
}
