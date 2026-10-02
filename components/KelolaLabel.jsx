'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { KUNCI, contoh } from '@/lib/taskUtils';

// Daftar label beserta jumlah tugas; ganti nama atau hapus label di semua tugas sekaligus.
export default function KelolaLabel() {
  const [tasks, setTasks, loaded] = useLocalStorage(KUNCI, null);
  const [ubah, setUbah] = useState(null);
  const [nama, setNama] = useState('');
  useEffect(() => { if (loaded && tasks === null) setTasks(contoh()); }, [loaded, tasks, setTasks]);
  if (!loaded || tasks === null) return <p className="py-16 text-center text-sm text-on-surface-variant">Memuat…</p>;

  const label = Object.values(tasks.reduce((a, t) => {
    (t.tags || []).forEach((g) => { a[g] ||= { nama: g, aktif: 0, selesai: 0 }; a[g][t.done ? 'selesai' : 'aktif']++; });
    return a;
  }, {})).sort((a, b) => b.aktif + b.selesai - (a.aktif + a.selesai));

  const simpan = (lama) => {
    const baru = nama.trim().toLowerCase();
    if (baru && baru !== lama) setTasks((p) => p.map((t) => ({ ...t, tags: Array.from(new Set((t.tags || []).map((g) => (g === lama ? baru : g)))) })));
    setUbah(null);
  };
  const hapus = (g) => { if (window.confirm(`Lepas label #${g} dari semua tugas? Tugasnya tidak ikut terhapus.`)) setTasks((p) => p.map((t) => ({ ...t, tags: (t.tags || []).filter((x) => x !== g) }))); };

  if (!label.length) return <p className="rounded-2xl border border-dashed border-outline-variant p-10 text-center text-on-surface-variant">Belum ada label. Tambahkan label saat membuat atau mengubah tugas.</p>;

  return (
    <ul className="divide-y divide-outline-variant/60 rounded-2xl border border-outline-variant bg-surface-container-lowest">
      {label.map((g) => (
        <li key={g.nama} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          {ubah === g.nama ? (
            <form className="flex flex-1 items-center gap-2" onSubmit={(e) => { e.preventDefault(); simpan(g.nama); }}>
              <label className="flex-1"><span className="sr-only">Nama baru untuk #{g.nama}</span>
                <input autoFocus value={nama} onChange={(e) => setNama(e.target.value)} className="w-full rounded-lg border border-primary bg-surface px-3 py-1.5 text-sm text-on-surface outline-none" />
              </label>
              <button type="submit" aria-label="Simpan nama label" className="rounded-lg p-1.5 text-primary hover:bg-surface-container-high"><Check size={16} /></button>
              <button type="button" onClick={() => setUbah(null)} aria-label="Batal" className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high"><X size={16} /></button>
            </form>
          ) : (
            <>
              <Link href={`/?label=${encodeURIComponent(g.nama)}`} className="font-semibold text-on-surface underline-offset-4 hover:text-primary hover:underline">#{g.nama}</Link>
              <span className="ml-auto text-sm text-on-surface-variant">{g.aktif} aktif · {g.selesai} selesai</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => { setUbah(g.nama); setNama(g.nama); }} aria-label={`Ganti nama #${g.nama}`} className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"><Pencil size={15} /></button>
                <button type="button" onClick={() => hapus(g.nama)} aria-label={`Lepas label #${g.nama}`} className="rounded-lg p-1.5 text-on-surface-variant hover:text-error"><Trash2 size={15} /></button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
