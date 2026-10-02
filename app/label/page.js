import TopBar from '@/components/TopBar';
import KelolaLabel from '@/components/KelolaLabel';

export const metadata = {
  title: 'Label',
  description: 'Kelola label tugas di Tuntas: lihat jumlah tugas per label, ganti nama, atau lepas label dari semua tugas sekaligus.',
  alternates: { canonical: '/label' },
};

export default function LabelPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Label</h1>
        <p className="mt-1 text-on-surface-variant">Ganti nama satu label dan semua tugasnya ikut berubah.</p>
        <div className="mt-6"><KelolaLabel /></div>
      </main>
    </div>
  );
}
