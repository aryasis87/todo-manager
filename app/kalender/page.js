import TopBar from '@/components/TopBar';
import Kalender from '@/components/Kalender';

export const metadata = {
  title: 'Kalender',
  description: 'Lihat tugas Tuntas di kalender bulanan menurut tanggal jatuh temponya, dan centang langsung dari daftar per hari.',
  alternates: { canonical: '/kalender' },
};

export default function KalenderPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Kalender</h1>
        <p className="mt-1 text-on-surface-variant">Tugas ditempatkan pada tanggal jatuh temponya. Titik merah berarti terlambat.</p>
        <div className="mt-6"><Kalender /></div>
      </main>
    </div>
  );
}
