'use client';
import { Check, Pencil, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { PRIORITIES, isOverdue, isDueToday, formatDate } from '@/lib/taskUtils';

// Kartu satu tugas: checkbox, judul, catatan, prioritas, tenggat, label.
export default function TaskCard({ task, onToggle, onEdit, onRemove, onTagClick }) {
  const pr = PRIORITIES[task.priority] || PRIORITIES.medium;
  const overdue = isOverdue(task);
  const today = isDueToday(task) && !task.done;

  const dueChip = overdue
    ? 'bg-error-container text-on-error-container'
    : today
    ? 'bg-tertiary-container/15 text-tertiary'
    : 'bg-surface-container text-on-surface-variant';

  return (
    <li
      className={`card-shadow group rounded-xl border bg-surface-container-lowest p-4 transition hover:bg-surface-container-low ${
        overdue ? 'border-error/30' : 'border-outline-variant'
      } ${task.done ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3.5">
        <button
          onClick={() => onToggle(task.id)}
          role="checkbox"
          aria-checked={task.done}
          aria-label={task.done ? 'Tandai belum selesai' : 'Tandai selesai'}
          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition ${
            task.done ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-transparent hover:border-primary'
          }`}
        >
          <Check size={12} strokeWidth={3} />
        </button>

        <div className="min-w-0 flex-1">
          <p className={`break-words font-medium text-on-surface ${task.done ? 'text-on-surface-variant line-through' : ''}`}>
            {task.title}
          </p>
          {task.notes && !task.done && <p className="mt-0.5 break-words text-sm text-on-surface-variant">{task.notes}</p>}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold ${pr.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${pr.dot}`} /> {pr.label}
            </span>

            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold ${dueChip}`}>
                {overdue ? <AlertCircle size={12} /> : today ? <Clock size={12} /> : <Calendar size={12} />}
                {overdue ? 'Terlambat · ' : today ? 'Hari ini · ' : ''}{formatDate(task.dueDate)}
              </span>
            )}

            {task.tags?.map((t) => (
              <button
                key={t}
                onClick={() => onTagClick?.(t)}
                className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant transition hover:text-primary"
              >
                #{t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button onClick={() => onEdit(task)} aria-label="Edit" className="rounded-md p-1.5 text-outline opacity-0 transition hover:bg-surface-container-high/60 hover:text-primary focus:opacity-100 group-hover:opacity-100">
            <Pencil size={15} />
          </button>
          <button onClick={() => onRemove(task.id)} aria-label="Hapus" className="rounded-md p-1.5 text-outline opacity-0 transition hover:text-error focus:opacity-100 group-hover:opacity-100">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </li>
  );
}
