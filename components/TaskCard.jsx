'use client';
import { Check, Pencil, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { PRIORITIES, isOverdue, isDueToday, labelTenggat } from '@/lib/taskUtils';

// Kartu satu tugas: kotak centang, judul, catatan, prioritas, tenggat, label.
export default function TaskCard({ task, hari, onToggle, onEdit, onRemove, onTagClick }) {
  const pr = PRIORITIES[task.priority] || PRIORITIES.medium;
  const overdue = isOverdue(task, hari);
  const today = isDueToday(task, hari) && !task.done;
  const dueChip = overdue ? 'bg-error-container text-on-error-container' : today ? 'bg-tertiary-container/20 text-tertiary' : 'bg-surface-container text-on-surface-variant';

  return (
    <li className={`card-shadow group rounded-xl border bg-surface-container-lowest p-4 transition hover:bg-surface-container-low ${overdue ? 'border-error/40' : 'border-outline-variant'}`}>
      <div className="flex items-start gap-3.5">
        <button type="button" onClick={() => onToggle(task.id)} role="checkbox" aria-checked={task.done} aria-label={`${task.done ? 'Batalkan selesai' : 'Tandai selesai'}: ${task.title}`}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition ${task.done ? 'border-primary bg-primary text-on-primary' : 'border-outline text-transparent hover:border-primary'}`}>
          <Check size={13} strokeWidth={3} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <p className={`break-words font-semibold ${task.done ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{task.title}</p>
          {task.notes && !task.done && <p className="mt-0.5 break-words text-sm text-on-surface-variant">{task.notes}</p>}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold ${pr.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${pr.dot}`} aria-hidden="true" /> {pr.label}
            </span>
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold ${dueChip}`}>
                {overdue ? <AlertCircle size={12} aria-hidden="true" /> : today ? <Clock size={12} aria-hidden="true" /> : <Calendar size={12} aria-hidden="true" />}
                {labelTenggat(task, hari)}
              </span>
            )}
            {task.tags?.map((t) => (
              <button key={t} type="button" onClick={() => onTagClick?.(t)} aria-label={`Saring label ${t}`}
                className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant transition hover:text-primary">#{t}</button>
            ))}
          </div>
        </div>

        {/* Selalu tampak di layar sentuh; muncul saat hover di layar lebar. */}
        <div className="flex shrink-0 items-center gap-1 transition md:opacity-0 md:focus-within:opacity-100 md:group-hover:opacity-100">
          <button type="button" onClick={() => onEdit(task)} aria-label={`Ubah: ${task.title}`} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"><Pencil size={15} /></button>
          <button type="button" onClick={() => onRemove(task.id)} aria-label={`Hapus: ${task.title}`} className="rounded-md p-1.5 text-on-surface-variant hover:text-error"><Trash2 size={15} /></button>
        </div>
      </div>
    </li>
  );
}
