'use client';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { isoTanggal, fmtTanggal } from '@/lib/waktu';
import { KUNCI, PRIORITIES, contoh, isOverdue } from '@/lib/taskUtils';

const NAMA_HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

// Kalender bulanan: tugas ditempatkan pada tanggal jatuh temponya.
export default function Kalender() {
  const [tasks, setTasks, loaded] = useLocalStorage(KUNCI, null);
  const { hari } = useHariIni();
  const [bulan, setBulan] = useState(null); // { y, m }
  const [pilih, setPilih] = useState(null);

  useEffect(() => { if (loaded && tasks === null) setTasks(contoh()); }, [loaded, tasks, setTasks]);
  useEffect(() => { if (hari && !bulan) { const [y, m] = hari.split('-').map(Number); setBulan({ y, m: m - 1 }); setPilih(hari); } }, [hari, bulan]);

  const sel = useMemo(() => {
    if (!bulan) return [];
    const awal = new Date(bulan.y, bulan.m, 1);
    const geser = (awal.getDay() + 6) % 7; // Senin = 0
    return Array.from({ length: 42 }, (_, i) => isoTanggal(new Date(bulan.y, bulan.m, 1 - geser + i)));
  }, [bulan]);

  if (!loaded || !hari || !bulan || tasks === null) return <p className="py-16 text-center text-sm text-on-surface-variant">Memuat…</p>;

  const pada = (d) => tasks.filter((t) => t.dueDate === d);
  const tanpa = tasks.filter((t) => !t.dueDate && !t.done).length;
  const ganti = (n) => setBulan(({ y, m }) => { const d = new Date(y, m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const daftar = pilih ? pada(pilih) : [];
  const toggle = (id) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done, doneAt: t.done ? null : new Date().toISOString() } : t)));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <section aria-labelledby="h-bulan" className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="h-bulan" className="text-lg font-bold capitalize text-on-surface">{new Date(bulan.y, bulan.m, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h2>
          <div className="flex gap-1">
            <button type="button" onClick={() => ganti(-1)} aria-label="Bulan sebelumnya" className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => { const [y, m] = hari.split('-').map(Number); setBulan({ y, m: m - 1 }); setPilih(hari); }} className="rounded-lg px-3 text-sm font-semibold text-primary hover:bg-surface-container-high">Hari ini</button>
            <button type="button" onClick={() => ganti(1)} aria-label="Bulan berikutnya" className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-on-surface-variant" aria-hidden="true">
          {NAMA_HARI.map((h) => <span key={h} className="py-1">{h}</span>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {sel.map((d) => {
            const ts = pada(d);
            const luar = Number(d.slice(5, 7)) - 1 !== bulan.m;
            const terlambat = ts.some((t) => isOverdue(t, hari));
            return (
              <button key={d} type="button" onClick={() => setPilih(d)} aria-pressed={pilih === d}
                aria-label={`${fmtTanggal(d)}${ts.length ? `, ${ts.length} tugas` : ''}`}
                className={`flex aspect-square flex-col items-center justify-start gap-1 rounded-lg p-1 text-sm transition sm:aspect-[4/3] ${pilih === d ? 'bg-primary text-on-primary' : d === hari ? 'bg-primary-container/15 font-bold text-primary' : luar ? 'text-on-surface-variant' : 'text-on-surface hover:bg-surface-container-high'}`}>
                <span>{Number(d.slice(8))}</span>
                {ts.length > 0 && (
                  <span className="flex flex-wrap justify-center gap-0.5" aria-hidden="true">
                    {ts.slice(0, 3).map((t) => <span key={t.id} className={`h-1.5 w-1.5 rounded-full ${t.done ? 'bg-outline' : terlambat && isOverdue(t, hari) ? 'bg-error' : PRIORITIES[t.priority]?.dot || 'bg-primary'} ${pilih === d ? 'ring-1 ring-on-primary' : ''}`} />)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-on-surface-variant">{tanpa} tugas aktif belum punya tenggat — tidak tampil di kalender.</p>
      </section>

      <section aria-labelledby="h-hari" aria-live="polite" className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4">
        <h2 id="h-hari" className="text-lg font-bold text-on-surface">{pilih === hari ? 'Hari ini' : fmtTanggal(pilih)}</h2>
        {daftar.length === 0 ? <p className="mt-3 text-sm text-on-surface-variant">Tidak ada tugas jatuh tempo.</p> : (
          <ul className="mt-3 space-y-2">
            {daftar.map((t) => (
              <li key={t.id} className="flex items-start gap-3 rounded-lg border border-outline-variant/60 p-3">
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} aria-label={`Selesai: ${t.title}`} className="mt-1 h-4 w-4 accent-primary" />
                <span className="min-w-0">
                  <span className={`block font-semibold ${t.done ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{t.title}</span>
                  <span className="text-xs text-on-surface-variant">{PRIORITIES[t.priority]?.label}{t.tags?.length ? ` · ${t.tags.map((x) => '#' + x).join(' ')}` : ''}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
