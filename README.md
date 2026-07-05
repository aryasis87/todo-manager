# Task Manager (Rich)

Task manager kaya fitur (localStorage). Varian "kedalaman teknis" dari portfolio.

## Fitur
- **CRUD via modal**: judul, catatan, **prioritas** (Tinggi/Sedang/Rendah), **tenggat (due date)**, **label/tag**
- **Pencarian** (judul/catatan/label), **filter** status & prioritas, **filter per label** (klik chip)
- **Sortir**: Terbaru / Jatuh tempo / Prioritas
- **Statistik**: Total, Aktif, Selesai, Terlambat (overdue otomatis dari due date)
- Penanda **terlambat** (merah) & **hari ini** (kuning)
- **Persist ke localStorage**, responsif, aksesibel (dialog, label, fokus)

## Stack
Next.js 15 · React 19 · Tailwind v4 · lucide-react

## Struktur
- `components/TaskManager.jsx` — state, statistik, toolbar (search/filter/sort), daftar
- `components/TaskModal.jsx` — form tambah/edit (prioritas, due date, tag chips)
- `components/TaskCard.jsx` — kartu task (badge prioritas, due date, label)
- `lib/taskUtils.js` — konfigurasi prioritas + helper tanggal (overdue/today/format)
- `lib/useLocalStorage.js` — hook persist

## Menjalankan
```bash
npm install
npm run dev
```
