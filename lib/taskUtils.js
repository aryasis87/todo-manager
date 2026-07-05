// Konfigurasi prioritas & helper tanggal untuk Task Manager.
// Warna chip memakai token TaskFlow (otomatis menyesuaikan dark mode).

export const PRIORITIES = {
  high: { label: 'Tinggi', order: 3, dot: 'bg-error', chip: 'bg-error-container text-on-error-container' },
  medium: { label: 'Sedang', order: 2, dot: 'bg-tertiary', chip: 'bg-tertiary-container/15 text-tertiary' },
  low: { label: 'Rendah', order: 1, dot: 'bg-primary', chip: 'bg-primary-container/10 text-primary' },
};

export const PRIORITY_KEYS = ['high', 'medium', 'low'];

// Awal hari ini (lokal) untuk membandingkan due date.
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isOverdue(task) {
  if (!task.dueDate || task.done) return false;
  return new Date(task.dueDate) < startOfToday();
}

export function isDueToday(task) {
  if (!task.dueDate) return false;
  const d = new Date(task.dueDate);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === startOfToday().getTime();
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
