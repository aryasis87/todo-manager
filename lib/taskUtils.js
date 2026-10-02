// Konfigurasi prioritas & helper tanggal untuk Tuntas.
// Tanggal jatuh tempo disimpan 'YYYY-MM-DD' dan dibandingkan dengan hari ini dalam WIB.
import { isoTanggal, sekarangWIB, tambahHari, selisihHari, fmtTanggal } from './waktu';

export const KUNCI = 'tuntas.tugas';
export const KUNCI_NAMA = 'tuntas.nama';

export const PRIORITIES = {
  high: { label: 'Tinggi', order: 3, dot: 'bg-error', chip: 'bg-error-container text-on-error-container' },
  medium: { label: 'Sedang', order: 2, dot: 'bg-tertiary', chip: 'bg-tertiary-container/15 text-tertiary' },
  low: { label: 'Rendah', order: 1, dot: 'bg-primary', chip: 'bg-primary-container/10 text-primary' },
};
export const PRIORITY_KEYS = ['high', 'medium', 'low'];

export const isOverdue = (task, hari) => !!(hari && task.dueDate && !task.done && task.dueDate < hari);
export const isDueToday = (task, hari) => !!(hari && task.dueDate === hari);

// Label tenggat yang mudah dibaca: "Hari ini", "Besok", "Terlambat 2 hari", atau tanggal.
export function labelTenggat(task, hari) {
  if (!task.dueDate) return '';
  if (!hari) return fmtTanggal(task.dueDate, { day: 'numeric', month: 'short' });
  const n = selisihHari(hari, task.dueDate);
  if (!task.done && n < 0) return `Terlambat ${-n} hari`;
  if (n === 0) return 'Hari ini';
  if (n === 1) return 'Besok';
  if (n > 1 && n < 7) return fmtTanggal(task.dueDate, { weekday: 'long' });
  return fmtTanggal(task.dueDate, { day: 'numeric', month: 'short', year: n > 300 || n < -60 ? 'numeric' : undefined });
}

// Sapaan menurut jam WIB.
export function sapaan(now) {
  const h = now.getHours();
  return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
}

// Tugas contoh untuk kunjungan pertama, tanggal relatif terhadap hari ini.
export function contoh() {
  const hari = isoTanggal(sekarangWIB());
  const now = Date.now();
  const t = (i, x) => ({ id: `t${i}`, notes: '', tags: [], done: false, createdAt: now - i * 3600_000, ...x });
  return [
    t(1, { title: 'Revisi proposal desain untuk klien', notes: 'Bagian harga dulu, lalu jadwal.', priority: 'high', dueDate: hari, tags: ['kerja', 'desain'] }),
    t(2, { title: 'Bayar iuran BPJS keluarga', priority: 'high', dueDate: tambahHari(hari, -1), tags: ['rumah'] }),
    t(3, { title: 'Rapat koordinasi tim', notes: 'Bawa angka penjualan bulan lalu.', priority: 'medium', dueDate: tambahHari(hari, 1), tags: ['kerja'] }),
    t(4, { title: 'Servis motor', priority: 'medium', dueDate: tambahHari(hari, 4), tags: ['rumah'] }),
    t(5, { title: 'Olahraga 30 menit', priority: 'low', tags: ['kesehatan'] }),
    t(6, { title: 'Daftar ulang kelas bahasa Inggris', priority: 'low', dueDate: tambahHari(hari, 12), tags: ['belajar'] }),
    t(7, { title: 'Review dokumentasi API', priority: 'low', tags: ['kerja'], done: true, doneAt: new Date(now - 7200_000).toISOString() }),
  ];
}
