import { Suspense } from 'react';
import TaskManager from '@/components/TaskManager';

export default function Home() {
  return (
    <Suspense fallback={<p className="py-32 text-center text-on-surface-variant">Memuat…</p>}>
      <TaskManager />
    </Suspense>
  );
}
